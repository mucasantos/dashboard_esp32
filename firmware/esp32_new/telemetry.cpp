#include <Arduino.h>
#include <ArduinoJson.h>

#include "display_manager.h"
#include "config.h"
#include "globals.h"
#include "telemetry.h"

namespace {
float clampFloat(float value, float minValue, float maxValue) {
  if (value < minValue) {
    return minValue;
  }

  if (value > maxValue) {
    return maxValue;
  }

  return value;
}

float luxFromRaw(int rawValue) {
  return static_cast<float>(rawValue) * 10000.0f / 4095.0f;
}

float decibelsFromPeakToPeak(uint16_t peakToPeak) {
  const float normalized = (static_cast<float>(peakToPeak) - 50.0f) / 450.0f;
  const float mapped = 49.5f + normalized * (90.0f - 49.5f);
  return clampFloat(mapped, 40.0f, 100.0f);
}
}

TelemetryReading readTelemetry() {
  const float rawTemperature = dht.readTemperature();
  const float rawHumidity = dht.readHumidity();
  const int lightLevel = analogRead(Config::LDR_PIN);

  unsigned long startTime = millis();
  uint16_t maximumSignal = 0;
  uint16_t minimumSignal = 4095;

  while (millis() - startTime < Config::NOISE_SAMPLE_WINDOW_MS) {
    const int sample = analogRead(Config::NOISE_PIN);
    if (sample < 4095) {
      if (sample > maximumSignal) {
        maximumSignal = sample;
      }
      if (sample < minimumSignal) {
        minimumSignal = sample;
      }
    }
  }

  const uint16_t peakToPeak = maximumSignal - minimumSignal;

  TelemetryReading telemetry = {
    isnan(rawTemperature) ? 0.0f : rawTemperature,
    isnan(rawHumidity) ? 0.0f : rawHumidity,
    luxFromRaw(lightLevel),
    peakToPeak,
    decibelsFromPeakToPeak(peakToPeak),
    millis()
  };

  return telemetry;
}

void broadcastTelemetry(const TelemetryReading& telemetry) {
  DynamicJsonDocument doc(256);
  doc["type"] = "UPDATE";
  JsonObject payload = doc.createNestedObject("payload");
  payload["temperature"] = telemetry.temperature;
  payload["humidity"] = telemetry.humidity;
  payload["lux"] = telemetry.lux;
  payload["noiseLevel"] = telemetry.noiseLevel;
  payload["decibels"] = telemetry.decibels;
  payload["timestamp"] = telemetry.timestamp;
  payload["led1"] = deviceState.led1;
  payload["led2"] = deviceState.led2;
  payload["motorSpeed"] = deviceState.motorSpeed;
  payload["servoAngle"] = deviceState.servoAngle;

  String json;
  serializeJson(doc, json);
  ws.textAll(json);
}

void logTelemetry(const TelemetryReading& telemetry) {
  Serial.println("=== Sensor Readings ===");
  Serial.printf("Temperature: %.1f C\n", telemetry.temperature);
  Serial.printf("Humidity: %.1f %%\n", telemetry.humidity);
  Serial.printf("Lux: %.0f\n", telemetry.lux);
  Serial.printf("Noise (P2P): %u -> %.1f dB\n", telemetry.noiseLevel, telemetry.decibels);
  Serial.println("=======================");
}

void publishLatestTelemetry() {
  TelemetryReading telemetry = readTelemetry();
  logTelemetry(telemetry);
  broadcastTelemetry(telemetry);
  renderTelemetryOnDisplay(telemetry);
}
