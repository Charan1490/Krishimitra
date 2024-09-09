const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Charan@123',
    database: 'krishimitra'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
});

// Chatbot route
app.post('/chatbot', async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const botResponse = response.data.choices[0].message.content;
        res.json({ reply: botResponse });
    } catch (error) {
        console.error('Error in chatbot:', error.message);
        res.status(500).send('Error in chatbot response');
    }
});

// Register route
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

    db.query(query, [name, email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error in registration');
        }
        res.redirect('/welcome.html');
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error logging in');
        }
        if (result.length > 0) {
            res.redirect('/welcome.html');
        } else {
            res.status(400).send('Invalid credentials');
        }
    });
});

// Fallback route for non-existent paths
app.get('*', (req, res) => {
    res.status(404).send('Page not found');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
