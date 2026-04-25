#include <Arduino.h>

#include "actuators.h"
#include "config.h"
#include "connectivity.h"
#include "display_manager.h"
#include "globals.h"
#include "telemetry.h"

void setup() {
  Serial.begin(115200);
  analogSetAttenuation(ADC_11db);

  initializePins();
  initializeActuators();
  initializeDisplay();

  dht.begin();
  initializeConnectivity();

  lastSensorRead = millis();
  publishLatestTelemetry();
}

void loop() {
  handleWifiToggleButton();
  ensureWifiConnection();

  const unsigned long now = millis();
  if (now - lastSensorRead >= Config::SENSOR_INTERVAL_MS) {
    lastSensorRead = now;
    publishLatestTelemetry();
  }
}
