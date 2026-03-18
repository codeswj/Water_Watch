const { query } = require('../config/db');

const NotificationModel = {
  // Create a notification
  async create({ user_id, message, type = 'push' }) {
    const result = await query(
      `INSERT INTO notifications (user_id, message, type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, message, type]
    );
    return result.rows[0];
  },

  // Bulk create notifications (broadcast to multiple users)
  async bulkCreate(notifications) {
    // notifications = [{ user_id, message, type }, ...]
    const values = notifications
      .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
      .join(', ');
    const params = notifications.flatMap(({ user_id, message, type }) => [
      user_id,
      message,
      type || 'push',
    ]);

    const result = await query(
      `INSERT INTO notifications (user_id, message, type) VALUES ${values} RETURNING *`,
      params
    );
    return result.rows;
  },

  // Get all notifications for a user
  async findByUserId(user_id) {
    const result = await query(
      `SELECT * FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [user_id]
    );
    return result.rows;
  },

  // Get unread notifications for a user
  async findUnreadByUserId(user_id) {
    const result = await query(
      `SELECT * FROM notifications
       WHERE user_id = $1 AND is_read = false
       ORDER BY created_at DESC`,
      [user_id]
    );
    return result.rows;
  },

  // Mark a notification as read
  async markAsRead(id, user_id) {
    const result = await query(
      `UPDATE notifications SET is_read = true
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, user_id]
    );
    return result.rows[0];
  },

  // Mark all notifications as read for a user
  async markAllAsRead(user_id) {
    const result = await query(
      `UPDATE notifications SET is_read = true
       WHERE user_id = $1
       RETURNING *`,
      [user_id]
    );
    return result.rows;
  },

  // Delete a notification
  async delete(id, user_id) {
    const result = await query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user_id]
    );
    return result.rows[0];
  },
};

module.exports = NotificationModel;
