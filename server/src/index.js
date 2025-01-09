import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import app from './App.js';
import dbConnection from './db/dbConnection.js';

const startServer = async () => {
  try {
    await dbConnection();
    console.log('Database connected successfully');

    app.listen(process.env.PORT, () => {
      console.log(`Server started on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error.message);
    process.exit(1);
  }
};

startServer();
