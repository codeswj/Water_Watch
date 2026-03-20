-- Migration 007: Create feedback table

CREATE TABLE IF NOT EXISTS feedbacks (
  id          SERIAL PRIMARY KEY,
  report_id   INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  admin_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  message     TEXT NOT NULL,
  visibility  VARCHAR(20) NOT NULL DEFAULT 'public'
                CHECK (visibility IN ('public', 'internal')),
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_report_id ON feedbacks(report_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_admin_id ON feedbacks(admin_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_visibility ON feedbacks(visibility);
