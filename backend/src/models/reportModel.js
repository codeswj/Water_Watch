const { query } = require('../config/db');

const ReportModel = {
  // Submit a new community report
  async create({ water_source_id, submitted_by, description, photo_url, latitude, longitude }) {
    const result = await query(
      `INSERT INTO reports (water_source_id, submitted_by, description, photo_url, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [water_source_id, submitted_by, description, photo_url, latitude, longitude]
    );
    return result.rows[0];
  },

  // Get all reports
  async findAll() {
    const result = await query(
      `SELECT r.*, u.name AS submitted_by_name, ws.name AS source_name
       FROM reports r
       LEFT JOIN users u ON r.submitted_by = u.id
       LEFT JOIN water_sources ws ON r.water_source_id = ws.id
       ORDER BY r.created_at DESC`
    );
    return result.rows;
  },

  // Get report by ID
  async findById(id) {
    const result = await query(
      `SELECT r.*, u.name AS submitted_by_name, ws.name AS source_name
       FROM reports r
       LEFT JOIN users u ON r.submitted_by = u.id
       LEFT JOIN water_sources ws ON r.water_source_id = ws.id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Get reports by water source
  async findBySourceId(water_source_id) {
    const result = await query(
      `SELECT r.*, u.name AS submitted_by_name
       FROM reports r
       LEFT JOIN users u ON r.submitted_by = u.id
       WHERE r.water_source_id = $1
       ORDER BY r.created_at DESC`,
      [water_source_id]
    );
    return result.rows;
  },

  // Get reports by user
  async findByUserId(submitted_by) {
    const result = await query(
      `SELECT r.*, ws.name AS source_name
       FROM reports r
       LEFT JOIN water_sources ws ON r.water_source_id = ws.id
       WHERE r.submitted_by = $1
       ORDER BY r.created_at DESC`,
      [submitted_by]
    );
    return result.rows;
  },

  // Get reports by status
  async findByStatus(status) {
    const result = await query(
      `SELECT r.*, u.name AS submitted_by_name, ws.name AS source_name
       FROM reports r
       LEFT JOIN users u ON r.submitted_by = u.id
       LEFT JOIN water_sources ws ON r.water_source_id = ws.id
       WHERE r.status = $1
       ORDER BY r.created_at DESC`,
      [status]
    );
    return result.rows;
  },

  // Update report status (field officer / admin)
  async updateStatus(id, status) {
    const result = await query(
      'UPDATE reports SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  // Delete report
  async delete(id) {
    const result = await query(
      'DELETE FROM reports WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = ReportModel;
