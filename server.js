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
  password: 'GuppyAzam123', 
  database: 'overhaul' 
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Endpoint to insert a new user
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

// Endpoint to login a user and verify the password
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
  

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { // Start server on port 3000
  console.log(`Server is running on port ${PORT}`);
});
