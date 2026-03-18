const NotificationModel = require('../models/notificationModel');
const { query } = require('../config/db');

// Get all admin and field_officer user IDs
const getStaffUserIds = async () => {
  const result = await query(
    `SELECT id FROM users WHERE role IN ('admin', 'field_officer')`
  );
  return result.rows.map((row) => row.id);
};

// Get all user IDs (for public broadcasts)
const getAllUserIds = async () => {
  const result = await query(`SELECT id FROM users`);
  return result.rows.map((row) => row.id);
};

// Notify staff (admins + field officers) about triggered alerts
const notifyStaffAboutAlerts = async (alerts, source) => {
  try {
    const staffIds = await getStaffUserIds();
    if (staffIds.length === 0) return;

    const notifications = [];

    for (const alert of alerts) {
      const message = `⚠️ Alert [${alert.severity.toUpperCase()}]: ${alert.parameter} at "${source.name}" is ${alert.actual_value} (threshold: ${alert.threshold_value}).`;

      for (const userId of staffIds) {
        notifications.push({ user_id: userId, message, type: 'push' });
      }
    }

    if (notifications.length > 0) {
      await NotificationModel.bulkCreate(notifications);
    }
  } catch (error) {
    console.error('Failed to send staff notifications:', error.message);
  }
};

// Notify a specific user
const notifyUser = async (userId, message, type = 'push') => {
  try {
    const notification = await NotificationModel.create({ user_id: userId, message, type });
    return notification;
  } catch (error) {
    console.error('Failed to notify user:', error.message);
  }
};

// Broadcast a message to all users
const broadcastToAll = async (message, type = 'push') => {
  try {
    const allIds = await getAllUserIds();
    if (allIds.length === 0) return;

    const notifications = allIds.map((id) => ({
      user_id: id,
      message,
      type,
    }));

    await NotificationModel.bulkCreate(notifications);
  } catch (error) {
    console.error('Failed to broadcast notification:', error.message);
  }
};

// Notify all users in a specific role
const notifyByRole = async (role, message, type = 'push') => {
  try {
    const result = await query(`SELECT id FROM users WHERE role = $1`, [role]);
    const userIds = result.rows.map((row) => row.id);

    if (userIds.length === 0) return;

    const notifications = userIds.map((id) => ({
      user_id: id,
      message,
      type,
    }));

    await NotificationModel.bulkCreate(notifications);
  } catch (error) {
    console.error(`Failed to notify users with role ${role}:`, error.message);
  }
};

module.exports = {
  notifyStaffAboutAlerts,
  notifyUser,
  broadcastToAll,
  notifyByRole,
};
