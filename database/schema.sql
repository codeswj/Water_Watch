-- ============================================================
-- Water Source Mapping and Quality Reporting System
-- Full Database Schema
-- Run this file to create all tables at once
-- ============================================================

-- ─── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'public'
                  CHECK (role IN ('public', 'field_officer', 'admin')),
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);


-- ─── Water Sources ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS water_sources (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  type        VARCHAR(50) NOT NULL
                CHECK (type IN ('borehole', 'river', 'well', 'spring', 'reservoir', 'other')),
  latitude    DECIMAL(10, 8) NOT NULL,
  longitude   DECIMAL(11, 8) NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'unknown'
                CHECK (status IN ('safe', 'unsafe', 'unknown')),
  created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_water_sources_status     ON water_sources(status);
CREATE INDEX IF NOT EXISTS idx_water_sources_type       ON water_sources(type);
CREATE INDEX IF NOT EXISTS idx_water_sources_created_by ON water_sources(created_by);


-- ─── Sensor Readings ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sensor_readings (
  id                SERIAL PRIMARY KEY,
  water_source_id   INTEGER NOT NULL REFERENCES water_sources(id) ON DELETE CASCADE,
  ph                DECIMAL(5, 2),
  turbidity         DECIMAL(8, 3),
  temperature       DECIMAL(5, 2),
  dissolved_oxygen  DECIMAL(6, 3),
  conductivity      DECIMAL(8, 2),
  contaminant_level DECIMAL(8, 4),
  recorded_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_source_id   ON sensor_readings(water_source_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_recorded_at ON sensor_readings(recorded_at DESC);


-- ─── Reports ──────────────────────────────────────────────────
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


-- ─── Notifications ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  type        VARCHAR(20) NOT NULL DEFAULT 'push'
                CHECK (type IN ('sms', 'email', 'push')),
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);


-- ─── Alerts ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  id                SERIAL PRIMARY KEY,
  water_source_id   INTEGER NOT NULL REFERENCES water_sources(id) ON DELETE CASCADE,
  parameter         VARCHAR(50) NOT NULL,
  threshold_value   DECIMAL(10, 4) NOT NULL,
  actual_value      DECIMAL(10, 4) NOT NULL,
  severity          VARCHAR(10) NOT NULL
                      CHECK (severity IN ('low', 'medium', 'high')),
  triggered_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_water_source_id ON alerts(water_source_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity        ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_triggered_at    ON alerts(triggered_at DESC);
