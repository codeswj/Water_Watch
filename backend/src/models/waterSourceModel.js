const { query } = require('../config/db');

const WaterSourceModel = {
  // Create a new water source
  async create({ name, type, latitude, longitude, status = 'unknown', created_by }) {
    const result = await query(
      `INSERT INTO water_sources (name, type, latitude, longitude, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, type, latitude, longitude, status, created_by]
    );
    return result.rows[0];
  },

  // Get all water sources
  async findAll() {
    const result = await query(
      `SELECT ws.*, u.name AS created_by_name
       FROM water_sources ws
       LEFT JOIN users u ON ws.created_by = u.id
       ORDER BY ws.created_at DESC`
    );
    return result.rows;
  },

  // Get one water source by ID
  async findById(id) {
    const result = await query(
      `SELECT ws.*, u.name AS created_by_name
       FROM water_sources ws
       LEFT JOIN users u ON ws.created_by = u.id
       WHERE ws.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Get sources by status
  async findByStatus(status) {
    const result = await query(
      'SELECT * FROM water_sources WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
    return result.rows;
  },

  // Update water source
  async update(id, { name, type, latitude, longitude, status }) {
    const result = await query(
      `UPDATE water_sources
       SET name = $1, type = $2, latitude = $3, longitude = $4, status = $5
       WHERE id = $6
       RETURNING *`,
      [name, type, latitude, longitude, status, id]
    );
    return result.rows[0];
  },

  // Update status only
  async updateStatus(id, status) {
    const result = await query(
      'UPDATE water_sources SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  // Delete water source
  async delete(id) {
    const result = await query(
      'DELETE FROM water_sources WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = WaterSourceModel;
