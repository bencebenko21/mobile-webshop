const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const saltRounds = 10;

async function registerUser(firstName, lastName, email, password, phoneNumber, zipCode, city, streetName, floorFlat) {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await userRepository.createUser(firstName, lastName, email, hashedPassword, phoneNumber, zipCode, city, streetName, floorFlat);
        delete user.user_password;
        return newUser;
    } catch (err) {
        console.error('Registration error:', err);
        throw err;
    }
}

async function loginUser(email, password) {
    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        const match = await bcrypt.compare(password, user.user_password);
        if (!match) {
            throw new Error('Invalid password');
        }
        delete user.user_password;
        return user;
    } catch (err) {
        console.error('Login error:', err);
        throw err;
    }
}

module.exports = {
    registerUser,
    loginUser
};