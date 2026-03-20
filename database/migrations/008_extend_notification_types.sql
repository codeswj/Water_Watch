-- Migration 008: Allow feedback notifications

ALTER TABLE notifications
  DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('sms', 'email', 'push', 'feedback'));
