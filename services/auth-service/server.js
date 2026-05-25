require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        service: 'auth-service'
    });
});

// Login endpoint
app.post('/login', (req, res) => {

    const { username, password } = req.body;

    // Fake authentication
    if (username === 'admin' && password === 'password') {

        const token = jwt.sign(
            { username: username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({
            message: 'Login successful',
            token: token
        });
    }

    return res.status(401).json({
        message: 'Invalid credentials'
    });
});

// Protected route example
app.get('/protected', (req, res) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(token, JWT_SECRET);

        return res.json({
            message: 'Protected data accessed',
            user: decoded
        });

    } catch (err) {

        return res.status(403).json({
            message: 'Invalid token'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
});
