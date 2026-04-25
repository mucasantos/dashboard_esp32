#ifndef DISPLAY_MANAGER_H
#define DISPLAY_MANAGER_H

#include "models.h"

void initializeDisplay();
void showStatus(
  const char* line1,
  const char* line2 = nullptr,
  const char* line3 = nullptr,
  const char* line4 = nullptr
);
void renderTelemetryOnDisplay(const TelemetryReading& telemetry);

#endif
