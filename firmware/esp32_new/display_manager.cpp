#include <Arduino.h>
#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include "config.h"
#include "display_manager.h"
#include "globals.h"

void initializeDisplay() {
  Wire.begin(Config::I2C_SDA, Config::I2C_SCL);

  if (!display.begin(SSD1306_SWITCHCAPVCC, Config::OLED_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    while (true) {
    }
  }

  display.clearDisplay();
  showStatus("Connecting...");
}

void showStatus(
  const char* line1,
  const char* line2,
  const char* line3,
  const char* line4
) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);

  if (line1) {
    display.print(line1);
  }
  if (line2) {
    display.setCursor(0, 10);
    display.print(line2);
  }
  if (line3) {
    display.setCursor(0, 20);
    display.print(line3);
  }
  if (line4) {
    display.setCursor(0, 30);
    display.print(line4);
  }

  display.display();
}

void renderTelemetryOnDisplay(const TelemetryReading& telemetry) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  display.setCursor(0, 0);
  display.print("IP: ");
  if (WiFi.status() == WL_CONNECTED) {
    display.print(WiFi.localIP().toString());
  } else {
    display.print("offline");
  }

  display.setCursor(0, 10);
  display.printf("T:%.1fC H:%.1f%%", telemetry.temperature, telemetry.humidity);

  display.setCursor(0, 20);
  display.printf("Lux: %.0f", telemetry.lux);

  display.setCursor(0, 30);
  display.printf("Noise: %.1f dB", telemetry.decibels);

  if (deviceState.clientConnected) {
    display.fillRect(0, 40, 128, 10, SSD1306_WHITE);
    display.setTextColor(SSD1306_BLACK);
    display.setCursor(0, 42);
    display.print("Status: CONNECTED");
    display.setTextColor(SSD1306_WHITE);
  } else {
    display.setCursor(0, 42);
    display.print("Status: DISCONNECTED");
  }

  display.setCursor(0, 56);
  display.print("Samuel Santos Portfolio");
  display.display();
}
