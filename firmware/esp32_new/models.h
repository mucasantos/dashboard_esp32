#ifndef MODELS_H
#define MODELS_H

#include <stdint.h>

struct TelemetryReading {
  float temperature;
  float humidity;
  float lux;
  uint16_t noiseLevel;
  float decibels;
  unsigned long timestamp;
};

struct DeviceState {
  bool led1;
  bool led2;
  uint8_t motorSpeed;
  uint8_t servoAngle;
  bool wifiEnabled;
  bool clientConnected;
};

#endif
