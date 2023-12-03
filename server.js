const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const bcrypt = require('bcrypt'); // used for encrypting password 

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.static(path.join(__dirname, 'public'))); // allow for static file serving

// MySQL connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Tessywess_1259', 
  database: 'overhaul' 
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

app.post('/adduser', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) { // if username or password is not provided

    return res.status(400).send('Username and password are required');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // encrypt password
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)'; // store as new user in db
    connection.query(sql, [username, hashedPassword], (err) => {
      if (err) throw err;
      res.send('User created successfully!');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) { // if username or password is not provided

      return res.status(400).send('Username and password are required');
    }
  
    const sql = 'SELECT password FROM users WHERE username = ?'; // retrive password based on username given
    connection.query(sql, [username], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
  
      if (results.length > 0) {
        const passwordIsValid = await bcrypt.compare(password, results[0].password); // compare provided password with stored
        if (passwordIsValid) {
          res.send('Login successful!'); // validate successful login
        } else {
          res.status(401).send('Invalid password');
        }
      } else {
        res.status(404).send('User not found');
      }
    });
  });

app.post('/addfile', async (req, res) => {
  const { username, filename, file_content } = req.body;

  try {
    const sql = 'INSERT INTO files (username, filename, file_content) VALUES (?, ?, ?)';
    connection.query(sql, [username, filename, file_content], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      res.status(201).send('Note added successfully!');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Endpoint to retrieve file names, based on username
app.get('/retrievefiles', (req, res) => {
  const username = req.query.username; // Assuming username is passed as a query parameter

  try {
    const sql = 'SELECT filename FROM files WHERE username = ?';
    connection.query(sql, [username], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      res.status(200).json(results); // Send the query results as JSON
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Endpoint to retrieve file content, based on file name
app.get('/retrievefilecontent', (req, res) => {
  const filename = req.query.filename; // Assuming username is passed as a query parameter

  try {
    const sql = 'SELECT file_content FROM files WHERE filename = ?';
    connection.query(sql, [filename], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      res.status(200).json(results); // Send the query results as JSON
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Endpoint to alter content of a file
app.post('/alterfile', async (req, res) => {
  const { username, filename, file_content } = req.body;

  try {
    const sql = 'UPDATE files SET file_content = ? WHERE username = ? AND filename = ?';
    connection.query(sql, [file_content, username, filename], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(200).json({ message: 'File updated successfully!' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Endpoint to delete a file
app.post('/deletefile', async (req, res) => {
  const { username, filename } = req.body;

  try {
    const sql = 'DELETE FROM files WHERE username = (?) AND filename = (?)';
    connection.query(sql, [username, filename], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      res.status(200).send('File deleted successfully!');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


    

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { // Start server on port 3000
  console.log(`Server is running on port ${PORT}`);
});