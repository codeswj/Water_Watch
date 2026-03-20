-- ============================================================
-- Water Source Mapping and Quality Reporting System
-- Seed Data - Sample/Test Data
-- NOTE: Passwords are bcrypt hashes of 'Password123'
-- ============================================================

-- ─── Users ────────────────────────────────────────────────────
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Admin User',        'admin@watersystem.com',        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
  ('Samuel Karuga',     'samuel.karuga@watersystem.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'field_officer'),
  ('Jane Mwangi',       'jane.mwangi@watersystem.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'field_officer'),
  ('Shawn Wafula',      'shawn.wafula@watersystem.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'public'),
  ('Mary Achieng',      'mary.achieng@watersystem.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'public'),
  ('Peter Otieno',      'peter.otieno@watersystem.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'public')
ON CONFLICT (email) DO NOTHING;


-- ─── Water Sources ────────────────────────────────────────────
INSERT INTO water_sources (name, type, latitude, longitude, status, created_by) VALUES
  ('Limuru Borehole A',     'borehole',   -1.1073,  36.6518, 'safe',    1),
  ('Nairobi River Point 3', 'river',      -1.2840,  36.8220, 'unsafe',  2),
  ('Thika Road Well',       'well',       -1.0500,  36.9200, 'safe',    2),
  ('Kiambu Spring',         'spring',     -1.1700,  36.8350, 'unknown', 3),
  ('Ruiru Reservoir',       'reservoir',  -1.1483,  36.9597, 'safe',    1),
  ('Athi River Source',     'river',      -1.4500,  36.9800, 'unsafe',  3),
  ('Ngong Hills Borehole',  'borehole',   -1.3670,  36.6500, 'safe',    2),
  ('Kikuyu Spring B',       'spring',     -1.2500,  36.6600, 'unknown', 1)
ON CONFLICT DO NOTHING;


-- ─── Sensor Readings ──────────────────────────────────────────
INSERT INTO sensor_readings (water_source_id, ph, turbidity, temperature, dissolved_oxygen, conductivity, contaminant_level) VALUES
  (1, 7.2, 1.5,  22.0, 8.2,  320.0, 0.10),
  (1, 7.1, 1.8,  21.5, 8.0,  310.0, 0.12),
  (3, 7.4, 2.1,  20.0, 7.8,  450.0, 0.08),
  (5, 7.0, 1.2,  19.5, 9.0,  280.0, 0.05),
  (7, 7.3, 1.9,  23.0, 7.5,  390.0, 0.09);

INSERT INTO sensor_readings (water_source_id, ph, turbidity, temperature, dissolved_oxygen, conductivity, contaminant_level) VALUES
  (2, 5.8, 12.5, 28.0, 3.2, 1800.0, 1.20),
  (2, 5.5, 15.0, 29.5, 2.8, 2100.0, 1.80),
  (6, 9.5,  8.0, 31.0, 4.1, 2800.0, 0.90),
  (6, 9.8, 10.2, 32.5, 3.8, 3000.0, 1.10);

INSERT INTO sensor_readings (water_source_id, ph, turbidity, temperature, dissolved_oxygen, conductivity, contaminant_level) VALUES
  (4, 6.6, 3.8, 24.0, 5.5, 600.0, 0.45),
  (8, 8.3, 3.5, 25.0, 5.8, 550.0, 0.40);


-- ─── Reports ──────────────────────────────────────────────────
INSERT INTO reports (water_source_id, submitted_by, description, latitude, longitude, status) VALUES
  (2, 4, 'The water from this river point has a foul smell and appears brownish. Cattle nearby may have contaminated it.', -1.2840, 36.8220, 'verified'),
  (6, 5, 'Water appears foamy and has an oily film on the surface. Possible industrial discharge upstream.', -1.4500, 36.9800, 'verified'),
  (4, 6, 'Spring water has changed colour slightly over the past week. Tastes slightly different from usual.', -1.1700, 36.8350, 'pending'),
  (8, 4, 'The spring flow has reduced significantly. Water looks slightly murky after the rains.', -1.2500, 36.6600, 'pending'),
  (1, 5, 'Borehole pump is making unusual sounds. Water still looks clean though.', -1.1073, 36.6518, 'dismissed')
ON CONFLICT DO NOTHING;


-- ─── Alerts ───────────────────────────────────────────────────
INSERT INTO alerts (water_source_id, parameter, threshold_value, actual_value, severity) VALUES
  (2, 'ph',                6.5,   5.8,    'medium'),
  (2, 'turbidity',         4.0,   12.5,   'high'),
  (2, 'contaminant_level', 0.5,   1.20,   'high'),
  (6, 'ph',                8.5,   9.5,    'medium'),
  (6, 'conductivity',      2500,  2800.0, 'low'),
  (6, 'temperature',       30.0,  31.0,   'low'),
  (6, 'contaminant_level', 0.5,   0.90,   'medium')
ON CONFLICT DO NOTHING;


-- ─── Notifications ────────────────────────────────────────────
INSERT INTO notifications (user_id, message, type, is_read) VALUES
  (1, 'Alert [HIGH]: turbidity at Nairobi River Point 3 is 12.5 (threshold: 4.0).', 'push', false),
  (1, 'Alert [HIGH]: contaminant_level at Nairobi River Point 3 is 1.2 (threshold: 0.5).', 'push', false),
  (2, 'Alert [HIGH]: turbidity at Nairobi River Point 3 is 12.5 (threshold: 4.0).', 'push', true),
  (3, 'Alert [MEDIUM]: ph at Athi River Source is 9.5 (threshold: 8.5).', 'push', false),
  (1, 'New community report submitted for Athi River Source. Please review.', 'push', true)
ON CONFLICT DO NOTHING;

-- â”€â”€â”€ Feedback â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO feedbacks (report_id, admin_id, message, visibility) VALUES
  (2, 1, 'Our team verified the turbidity spike on Nairobi River Point 3 and redirected the downstream intake until the discharge is contained.', 'public'),
  (3, 1, 'Monitoring the Kiambu spring closely; please advise nearby residents to boil water until the lab tests clear the source.', 'internal')
ON CONFLICT DO NOTHING;
