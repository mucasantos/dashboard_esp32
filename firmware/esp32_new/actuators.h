#ifndef ACTUATORS_H
#define ACTUATORS_H

#include <ArduinoJson.h>
#include <stdint.h>

void initializeActuators();
void initializePins();
void applyMotorSpeed(uint8_t percentage);
void applyLedState(uint8_t pin, bool enabled);
void applyCommand(const JsonDocument& doc);

#endif
