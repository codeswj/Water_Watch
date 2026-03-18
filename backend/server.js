const app = require('./src/app');
const { PORT } = require('./src/config/env');
const { pool } = require('./src/config/db');

const startServer = async () => {
  try {
    // Test DB connection before starting
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection verified.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
