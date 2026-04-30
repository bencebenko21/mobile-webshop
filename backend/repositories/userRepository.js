const pool = require('../db');

async function getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];

    try{
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch(err){
        console.error('Error executing query', err.stack);
        throw err;
    }
}

async function createUser(firstName, lastName, email, hashedPassword, phoneNumber, zipCode, city, streetName, floorFlat) {
    const query = `
        INSERT INTO users (first_name, last_name, email, user_password, phone_number, zip_code, city, street_name, floor_flat)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `;
    const values = [firstName, lastName, email, hashedPassword, phoneNumber, zipCode, city, streetName, floorFlat];
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch(err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

module.exports = {
    getUserByEmail,
    createUser
};

