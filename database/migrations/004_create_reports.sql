-- Migration 004: Create reports table

CREATE TABLE IF NOT EXISTS reports (
  id                SERIAL PRIMARY KEY,
  water_source_id   INTEGER REFERENCES water_sources(id) ON DELETE SET NULL,
  submitted_by      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  description       TEXT NOT NULL,
  photo_url         TEXT,
  latitude          DECIMAL(10, 8),
  longitude         DECIMAL(11, 8),
  status            VARCHAR(20) NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'verified', 'dismissed')),
  created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_water_source_id ON reports(water_source_id);
CREATE INDEX IF NOT EXISTS idx_reports_submitted_by    ON reports(submitted_by);
CREATE INDEX IF NOT EXISTS idx_reports_status          ON reports(status);
