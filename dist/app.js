"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const dotenv = __importStar(require("dotenv"));
const Users_1 = __importDefault(require("./controllers/Users"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv.config();
// Variables
const mongoURI = 'mongodb://localhost:27017/users';
const client = mqtt_1.default.connect(process.env.MQTT_URI || 'mqtt://localhost:1883');
// Connect to MongoDB
mongoose_1.default.connect(mongoURI);
client.on('connect', () => {
    client.subscribe('auth/create/user');
    client.subscribe('auth/login/user');
    client.subscribe('auth/getall/users');
    client.subscribe('auth/update/users');
    client.subscribe('auth/delete/user');
    client.publish('auth/create/user', 'haloo');
});
client.on('message', (topic, message) => {
    switch (topic) {
        case 'auth':
            // eslint-disable-next-line no-console
            console.log(message.toString());
            client.end();
            break;
        case 'auth/create/user':
            // call createUser function
            Users_1.default.createUser('victor', 'campanello', '123456789', 'druner@gmail.com', 'Password123', 'Password123', '123456789');
            // eslint-disable-next-line no-console
            break;
        case 'auth/login/user':
            // call loginUser function
            // eslint-disable-next-line no-console
            console.log("testing mqtt");
            break;
        case 'auth/getall/users':
            // call getAllUsers function
            break;
        case 'auth/update/user':
            // call updateUser function
            break;
        case 'auth/delete/user':
            // call deleteUser function
            break;
    }
});
