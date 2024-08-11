import mysql from 'mysql2/promise';

// Create a function to establish a database connection
async function createTestConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'hello@0706',
      database: 'booking_system_test', // Use a separate test database
    });
    console.log('Test database connection established.');
    return connection; // Return connection
  } catch (error) {
    console.error('Failed to connect to the test database:', error.message);
    throw error; // Re-throw the error to let tests handle it
  }
}

// Export the promise of the connection
export default createTestConnection();
