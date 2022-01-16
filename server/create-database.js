const { connectDatabase } = require('./database');

const run = () => {
  const conn = connectDatabase();

  console.log('Creating tables...');
  conn.connect((err) => {
    if (err) {
      console.error('Error during import.');
      console.log(err);
    }

    conn.query(`
        CREATE TABLE IF NOT EXISTS terms (
          term_id INT AUTO_INCREMENT PRIMARY KEY,
          code VARCHAR(8) NOT NULL,
          name VARCHAR(64) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS courses (
          course_id INT AUTO_INCREMENT PRIMARY KEY,
          term VARCHAR(8) NOT NULL,
          code VARCHAR(16) NOT NULL,
          subject VARCHAR(8) NOT NULL,
          number VARCHAR(8) NOT NULL,
          title VARCHAR(256) NOT NULL,
          description TEXT NOT NULL,
          searchables TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS donations (
          donation_id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(32) NOT NULL,
          amount DECIMAL NOT NULL
        )`, (error) => {
      if (error) {
        console.error('error when creating tables');
        console.log(error);
      } else {
        console.log('Table created');
      }
      conn.end();
    })
  });
};

run();
