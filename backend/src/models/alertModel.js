const { query } = require('../config/db');

const AlertModel = {
  // Create an alert
  async create({ water_source_id, parameter, threshold_value, actual_value, severity }) {
    const result = await query(
      `INSERT INTO alerts (water_source_id, parameter, threshold_value, actual_value, severity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [water_source_id, parameter, threshold_value, actual_value, severity]
    );
    return result.rows[0];
  },

  // Get all alerts
  async findAll() {
    const result = await query(
      `SELECT a.*, ws.name AS source_name, ws.latitude, ws.longitude
       FROM alerts a
       LEFT JOIN water_sources ws ON a.water_source_id = ws.id
       ORDER BY a.triggered_at DESC`
    );
    return result.rows;
  },

  // Get alert by ID
  async findById(id) {
    const result = await query(
      `SELECT a.*, ws.name AS source_name
       FROM alerts a
       LEFT JOIN water_sources ws ON a.water_source_id = ws.id
       WHERE a.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Get alerts by water source
  async findBySourceId(water_source_id) {
    const result = await query(
      `SELECT * FROM alerts
       WHERE water_source_id = $1
       ORDER BY triggered_at DESC`,
      [water_source_id]
    );
    return result.rows;
  },

  // Get alerts by severity
  async findBySeverity(severity) {
    const result = await query(
      `SELECT a.*, ws.name AS source_name
       FROM alerts a
       LEFT JOIN water_sources ws ON a.water_source_id = ws.id
       WHERE a.severity = $1
       ORDER BY a.triggered_at DESC`,
      [severity]
    );
    return result.rows;
  },

  // Delete an alert
  async delete(id) {
    const result = await query(
      'DELETE FROM alerts WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = AlertModel;
