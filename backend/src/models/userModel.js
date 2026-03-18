const { query } = require('../config/db');

const UserModel = {
  // Create a new user
  async create({ name, email, password_hash, role = 'public' }) {
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, password_hash, role]
    );
    return result.rows[0];
  },

  // Find user by email
  async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  // Find user by ID
  async findById(id) {
    const result = await query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Get all users (admin)
  async findAll() {
    const result = await query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  },

  // Update user
  async update(id, { name, email, role }) {
    const result = await query(
      `UPDATE users SET name = $1, email = $2, role = $3
       WHERE id = $4
       RETURNING id, name, email, role, created_at`,
      [name, email, role, id]
    );
    return result.rows[0];
  },

  // Delete user
  async delete(id) {
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = UserModel;
