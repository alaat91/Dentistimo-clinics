"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../models/UserModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// variable declarations
const SALT_ROUNDS = 10;
// create user function
async function createUser(firstName, lastName, SSN, email, password, confirmPassword, phoneNumber) {
    // validate user input
    if (!(firstName && lastName && SSN && email && password))
        return 'All input is required';
    // find existing user from DB
    const existingUsers = UserModel_1.default.find({ email });
    // check if user already exists
    if ((await existingUsers).length > 0)
        return 'Email is already taken';
    // check if passwords match
    if (password !== confirmPassword)
        return ('Passwords do not match');
    // encrypt provided password
    const encryptedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    // create new user
    const user = new UserModel_1.default({ firstName, lastName, SSN, email, password: encryptedPassword, phoneNumber });
    // create token with an expire date of 2 hrs
    const token = jsonwebtoken_1.default.sign({ user_id: user._id, email }, 'secret', {
        expiresIn: "2h",
    });
    // save user token to created user
    user.token = token;
    // save new user to DB
    user.save();
    return 'User has been created';
}
// login function
async function login(email, password) {
    // Validate user input
    if (!(email && password)) {
        return ('All input is required');
    }
    // Validate if user exist in our database
    const user = await UserModel_1.default.findOne({ email });
    // if user exists and passwords match, then create and assign user token
    if (user && (await bcrypt_1.default.compare(password, user.password))) {
        // Create token
        const token = jsonwebtoken_1.default.sign({ user_id: user._id, email }, 'secret', {
            expiresIn: "2h",
        });
        // save user token
        user.token = token;
    }
}
// export funtions
exports.default = { createUser, login };
