require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

// PostgreSQL connection
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Initialize database table
const initializeDatabase = async () => {

    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS videos (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                duration VARCHAR(50)
            )
        `);

        const result = await pool.query(
            'SELECT COUNT(*) FROM videos'
        );

        // Seed initial data
        if (parseInt(result.rows[0].count) === 0) {

            await pool.query(`
                INSERT INTO videos (title, duration)
                VALUES
                ('Docker Tutorial', '15 mins'),
                ('Kubernetes Explained', '25 mins'),
                ('Terraform on AWS', '20 mins')
            `);

            console.log('Sample videos inserted');
        }

    } catch (error) {
        console.error(error);
    }
};

initializeDatabase();

// Health endpoint
app.get('/health', (req, res) => {

    res.json({
        status: 'UP',
        service: 'video-service'
    });
});

// Get all videos
app.get('/videos', async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT * FROM videos ORDER BY id'
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Database error'
        });
    }
});

// Get single video
app.get('/videos/:id', async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT * FROM videos WHERE id = $1',
            [req.params.id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: 'Video not found'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Database error'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Video service running on port ${PORT}`);
});
