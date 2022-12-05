"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(firstName, lastName, SSN, email, password, phoneNumber, token) {
        this.firstName = firstName,
            this.lastName = lastName,
            this.SSN = SSN,
            this.email = email,
            this.password = password,
            this.phoneNumber = phoneNumber,
            this.token = token;
    }
}
exports.default = User;
