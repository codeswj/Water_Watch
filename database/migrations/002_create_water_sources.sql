-- Migration 002: Create water_sources table

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
