-- Migration 006: Create alerts table

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
