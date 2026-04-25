#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>
#include <ESP32Servo.h>

#include "config.h"
#include "globals.h"

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");
Adafruit_SSD1306 display(
  Config::SCREEN_WIDTH,
  Config::SCREEN_HEIGHT,
  &Wire,
  Config::OLED_RESET
);
DHT dht(Config::DHT_PIN, Config::DHT_TYPE);
Servo myServo;

DeviceState deviceState = {false, false, 0, 90, true, false};
unsigned long lastSensorRead = 0;
unsigned long lastButtonTime = 0;
