const { query } = require('../config/db');

const SensorReadingModel = {
  // Ingest a new sensor reading
  async create({ water_source_id, ph, turbidity, temperature, dissolved_oxygen, conductivity, contaminant_level }) {
    const result = await query(
      `INSERT INTO sensor_readings
         (water_source_id, ph, turbidity, temperature, dissolved_oxygen, conductivity, contaminant_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [water_source_id, ph, turbidity, temperature, dissolved_oxygen, conductivity, contaminant_level]
    );
    return result.rows[0];
  },

  // Get all readings for a specific water source
  async findBySourceId(water_source_id, limit = 50) {
    const result = await query(
      `SELECT * FROM sensor_readings
       WHERE water_source_id = $1
       ORDER BY recorded_at DESC
       LIMIT $2`,
      [water_source_id, limit]
    );
    return result.rows;
  },

  // Get latest reading for a water source
  async findLatestBySourceId(water_source_id) {
    const result = await query(
      `SELECT * FROM sensor_readings
       WHERE water_source_id = $1
       ORDER BY recorded_at DESC
       LIMIT 1`,
      [water_source_id]
    );
    return result.rows[0];
  },

  // Get all readings (admin - paginated)
  async findAll(limit = 100, offset = 0) {
    const result = await query(
      `SELECT sr.*, ws.name AS source_name
       FROM sensor_readings sr
       LEFT JOIN water_sources ws ON sr.water_source_id = ws.id
       ORDER BY sr.recorded_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  // Get reading by ID
  async findById(id) {
    const result = await query(
      'SELECT * FROM sensor_readings WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Delete a reading
  async delete(id) {
    const result = await query(
      'DELETE FROM sensor_readings WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = SensorReadingModel;
