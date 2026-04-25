#ifndef TELEMETRY_H
#define TELEMETRY_H

#include "models.h"

TelemetryReading readTelemetry();
void broadcastTelemetry(const TelemetryReading& telemetry);
void logTelemetry(const TelemetryReading& telemetry);
void publishLatestTelemetry();

#endif
