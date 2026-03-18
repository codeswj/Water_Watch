const NotificationModel = require('../models/notificationModel');

// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.findByUserId(req.user.id);
    res.status(200).json({ count: notifications.length, notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread notifications for logged in user
// @route   GET /api/notifications/unread
// @access  Private
const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.findUnreadByUserId(req.user.id);
    res.status(200).json({ count: notifications.length, notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await NotificationModel.markAsRead(req.params.id, req.user.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    res.status(200).json({ message: 'Notification marked as read.', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const notifications = await NotificationModel.markAllAsRead(req.user.id);
    res.status(200).json({ message: 'All notifications marked as read.', count: notifications.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const deleted = await NotificationModel.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    res.status(200).json({ message: 'Notification deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
