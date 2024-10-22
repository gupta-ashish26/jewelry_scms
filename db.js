const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL server.');

    // Step 1: Check if database exists, if not, create it
    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log(`Database '${process.env.DB_NAME}' checked/created.`);

        // Step 2: Switch to the new database
        connection.changeUser({ database: process.env.DB_NAME }, (err) => {
            if (err) {
                console.error('Error switching database:', err);
                return;
            }
            console.log(`Switched to database '${process.env.DB_NAME}'.`);

            // Step 3: Read and execute the SQL file
            const sqlFilePath = path.join(__dirname, 'setup.sql');
            const sqlStatements = fs.readFileSync(sqlFilePath, 'utf-8')
                .replace(/\r\n/g, '\n') // Normalize line endings
                .split(/;\s*[\r\n]+/) // Split by semicolon followed by whitespace or newlines
                .filter(Boolean); // Remove empty statements

            // Execute each SQL statement
            sqlStatements.forEach((sql, index) => {
                // console.log(`Executing SQL Statement ${index + 1}:`, sql); // Log the SQL statement
                connection.query(sql, (err, result) => {
                    if (err) {
                        console.error('Error executing SQL statement:', err);
                    } else {
                        // console.log('Executed:', sql);
                    }
                });
            });
        });
    });
});

module.exports = connection;
