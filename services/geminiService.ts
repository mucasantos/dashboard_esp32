import { GoogleGenAI, Type } from '@google/genai';

import { AiAnalysisResult, SensorReadings } from '../types';

const apiKey =
  import.meta.env.VITE_GEMINI_API_KEY ??
  import.meta.env.GEMINI_API_KEY ??
  '';

const createFallbackResult = (analysis: string, recommendations: string[]): AiAnalysisResult => ({
  analysis,
  riskLevel: 'LOW',
  recommendations,
});

export const analyzeSensorData = async (
  readings: SensorReadings,
): Promise<AiAnalysisResult> => {
  if (!apiKey) {
    return createFallbackResult('AI analysis is disabled because no Gemini API key was configured.', [
      'Set VITE_GEMINI_API_KEY in a local environment file.',
      'Proxy this request through a backend before using it in production.',
    ]);
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = `
Act as an industrial IoT engineer reviewing ESP32 telemetry from a lab environment.

Telemetry snapshot:
- Temperature: ${readings.temperature.toFixed(1)} °C
- Humidity: ${readings.humidity.toFixed(1)} %
- Ambient light: ${readings.lux.toFixed(0)} lux
- Raw noise amplitude: ${readings.noiseLevel.toFixed(0)}
- Noise level: ${readings.decibels.toFixed(1)} dB

Return:
1. A concise operational summary
2. A risk level of LOW, MEDIUM, or HIGH
3. A short list of practical recommendations
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['analysis', 'riskLevel', 'recommendations'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response from Gemini');
    }

    return JSON.parse(text) as AiAnalysisResult;
  } catch (error) {
    console.error('Gemini analysis error:', error);

    return createFallbackResult('AI analysis failed for the current telemetry snapshot.', [
      'Check the Gemini API key and network access.',
      'Retry with fresh telemetry after the device reconnects.',
    ]);
  }
};
