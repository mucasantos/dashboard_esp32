// ESP32 Firmware for ESP32 IoT TecNaMão
// Async WebSocket server, LCD I2C display, hardware control, sensor reading, JSON formatting

#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <ESP32Servo.h>

// ----- Configuration -----
const char* ssid = "Nome_rede";          // TODO: replace with your Wi‑Fi SSID
const char* password = "Sua_Senha_2020"; // TODO: replace with your Wi‑Fi password

// Pin assignments (adjust to your wiring)
#define LED1_PIN      2
#define LED2_PIN      4
#define MOTOR_PWM_PIN 5
#define SERVO_PIN    18
#define DHT_PIN      15
#define DHT_TYPE     DHT11
#define LDR_PIN      34   // ADC1 channel 6 (GPIO34)

// I2C pins for LCD
#define I2C_SDA 21
#define I2C_SCL 22

// LCD I2C address (common 0x27 or 0x3F)
#define LCD_ADDRESS 0x27
#define LCD_COLUMNS 16
#define LCD_ROWS    2

// ----- Global objects -----
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");
LiquidCrystal_I2C lcd(LCD_ADDRESS, LCD_COLUMNS, LCD_ROWS);
DHT dht(DHT_PIN, DHT_TYPE);
Servo myServo;

// Timing
unsigned long lastSensorRead = 0;
const unsigned long sensorInterval = 2000; // 2 seconds

// Helper to display status on LCD
void showStatus(const char* line1, const char* line2) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(line1);
  lcd.setCursor(0, 1);
  lcd.print(line2);
}

// Broadcast JSON payload to all WS clients
void broadcastTelemetry() {
  // Read sensors
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int lightLevel = analogRead(LDR_PIN);

  // Build JSON
  DynamicJsonDocument doc(256);
  doc["type"] = "UPDATE";
  JsonObject payload = doc.createNestedObject("payload");
  payload["temperature"] = isnan(temperature) ? 0 : temperature;
  payload["humidity"] = isnan(humidity) ? 0 : humidity;
  payload["lightLevel"] = lightLevel;
  payload["timestamp"] = millis(); // simple timestamp

  String jsonStr;
  serializeJson(doc, jsonStr);
  ws.textAll(jsonStr);
}

// Handle incoming WS messages (commands)
void handleWsMessage(AsyncWebSocket * server, AsyncWebSocketClient * client, AwsEventType type,
                     void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_DATA) {
    AwsFrameInfo *info = (AwsFrameInfo*)arg;
    if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
      String msg = String((char*)data);
      DynamicJsonDocument doc(256);
      DeserializationError error = deserializeJson(doc, msg);
      if (error) {
        Serial.printf("[WS] Invalid JSON: %s\n", error.c_str());
        return;
      }
      const char* action = doc["action"];
      const char* componentId = doc["componentId"];
      JsonVariant value = doc["value"];

      if (strcmp(action, "SET_LED") == 0 && componentId) {
        int pin = (strcmp(componentId, "led1") == 0) ? LED1_PIN : LED2_PIN;
        digitalWrite(pin, value.as<bool>() ? HIGH : LOW);
      } else if (strcmp(action, "SET_MOTOR") == 0) {
        int speed = value.as<int>();
        analogWrite(MOTOR_PWM_PIN, speed);
      } else if (strcmp(action, "SET_SERVO") == 0) {
        int angle = value.as<int>();
        myServo.write(angle);
      }
    }
  } else if (type == WS_EVT_CONNECT) {
    Serial.printf("[WS] Client %u connected\n", client->id());
    showStatus("Client Connected", "");
  } else if (type == WS_EVT_DISCONNECT) {
    Serial.printf("[WS] Client %u disconnected\n", client->id());
    showStatus("Client Disconnected", "");
  }
}

void setup() {
  Serial.begin(115200);
  // Initialise pins
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(MOTOR_PWM_PIN, OUTPUT);
  myServo.attach(SERVO_PIN);

  // Initialise I2C
  Wire.begin(I2C_SDA, I2C_SCL);

  // Initialise LCD
  lcd.init();
  lcd.backlight();
  showStatus("Connecting...", "");

  // Initialise DHT
  dht.begin();

  // Connect to Wi‑Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
  }
  Serial.println();
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  // Show IP on LCD
  char ipStr[16];
  snprintf(ipStr, sizeof(ipStr), "%s", WiFi.localIP().toString().c_str());
  showStatus("Wi‑Fi Connected", ipStr);

  // Start WebSocket
  ws.onEvent(handleWsMessage);
  server.addHandler(&ws);
  server.begin();

  // Initial sensor broadcast after Wi‑Fi is ready
  lastSensorRead = millis();
  broadcastTelemetry();
}

void loop() {
  // Periodic sensor read & broadcast
  unsigned long now = millis();
  if (now - lastSensorRead >= sensorInterval) {
    lastSensorRead = now;
    broadcastTelemetry();
  }
  // Async WebSocket runs in background, nothing else needed here
}
