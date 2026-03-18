const AlertModel = require('../models/alertModel');
const WaterSourceModel = require('../models/waterSourceModel');
const notificationService = require('./notificationService');
const { query } = require('../config/db');

// Default safety thresholds for water quality parameters
const THRESHOLDS = {
  ph: { min: 6.5, max: 8.5 },           // WHO standard: 6.5 - 8.5
  turbidity: { max: 4 },                 // WHO standard: < 4 NTU
  temperature: { max: 30 },             // Above 30°C is a concern
  dissolved_oxygen: { min: 5 },         // Below 5 mg/L is unsafe
  conductivity: { max: 2500 },          // Above 2500 µS/cm is unsafe
  contaminant_level: { max: 0.5 },      // Above 0.5 mg/L triggers alert
};

// Determine severity based on how far the value is from threshold
const getSeverity = (parameter, value) => {
  const threshold = THRESHOLDS[parameter];
  if (!threshold) return null;

  let deviation = 0;

  if (threshold.max !== undefined && value > threshold.max) {
    deviation = ((value - threshold.max) / threshold.max) * 100;
  } else if (threshold.min !== undefined && value < threshold.min) {
    deviation = ((threshold.min - value) / threshold.min) * 100;
  } else {
    return null; // Within safe range
  }

  if (deviation >= 50) return 'high';
  if (deviation >= 20) return 'medium';
  return 'low';
};

// Check reading against all thresholds and trigger alerts if needed
const checkAndTrigger = async (reading, source) => {
  const parameters = ['ph', 'turbidity', 'temperature', 'dissolved_oxygen', 'conductivity', 'contaminant_level'];
  const triggeredAlerts = [];
  let sourceNeedsStatusUpdate = false;

  for (const param of parameters) {
    const value = reading[param];
    if (value === null || value === undefined) continue;

    const severity = getSeverity(param, value);
    if (!severity) continue;

    const threshold = THRESHOLDS[param];
    const thresholdValue = threshold.max !== undefined ? threshold.max : threshold.min;

    // Create alert record
    const alert = await AlertModel.create({
      water_source_id: reading.water_source_id,
      parameter: param,
      threshold_value: thresholdValue,
      actual_value: value,
      severity,
    });

    triggeredAlerts.push(alert);

    // Mark source as unsafe if high severity
    if (severity === 'high') {
      sourceNeedsStatusUpdate = true;
    }
  }

  // Update water source status if high severity alert was triggered
  if (sourceNeedsStatusUpdate) {
    await WaterSourceModel.updateStatus(reading.water_source_id, 'unsafe');
  }

  // Notify admins and field officers if alerts were triggered
  if (triggeredAlerts.length > 0) {
    await notificationService.notifyStaffAboutAlerts(triggeredAlerts, source);
  }

  return triggeredAlerts;
};

module.exports = { checkAndTrigger, THRESHOLDS, getSeverity };
