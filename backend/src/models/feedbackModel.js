const { query } = require('../config/db');

const FeedbackModel = {
  async create({ report_id, admin_id, message, visibility = 'public' }) {
    const result = await query(
      `INSERT INTO feedbacks (report_id, admin_id, message, visibility)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [report_id, admin_id, message, visibility]
    );
    return result.rows[0];
  },

  async findAll({ report_id, visibility } = {}) {
    const clauses = ['1=1'];
    const params = [];

    if (report_id) {
      params.push(report_id);
      clauses.push(`f.report_id = $${params.length}`);
    }
    if (visibility) {
      params.push(visibility);
      clauses.push(`f.visibility = $${params.length}`);
    }

    const result = await query(
      `SELECT
         f.*,
         r.description AS report_description,
         r.status AS report_status,
         ws.name AS source_name,
         u.name AS admin_name
       FROM feedbacks f
       LEFT JOIN reports r ON r.id = f.report_id
       LEFT JOIN water_sources ws ON ws.id = r.water_source_id
       LEFT JOIN users u ON u.id = f.admin_id
       WHERE ${clauses.join(' AND ')}
       ORDER BY f.created_at DESC`,
      params
    );
    return result.rows;
  },

  async findByReportId(report_id) {
    return this.findAll({ report_id });
  },
};

module.exports = FeedbackModel;
