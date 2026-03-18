-- Migration 003: Create sensor_readings table

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
