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
// import mqtt from 'mqtt'
const dotenv = __importStar(require("dotenv"));
//import clinic from './controllers/Clinics'
const mongoose_1 = __importDefault(require("mongoose"));
//
dotenv.config();
// Variables
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinicsDB';
// const clinic = mqtt.connect(process.env.MQTT_URI || 'mqtt://localhost:1883')
// Connect to MongoDB
mongoose_1.default.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    else if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('Connected to MongoDB');
    }
});
/*
client.on('connect', () => {
  client.subscribe('auth/user/create')
  client.subscribe('auth/user/login')
  client.subscribe('auth/users/getall')
  client.subscribe('auth/users/update')
  client.subscribe('auth/user/delete')
})

client.on('message', async (topic: string, message:Buffer) => {
  switch (topic) {
    case 'auth/user/create': {
      // call createUser function
      const newUser = await user.createUser(message.toString())
      client.publish('gateway/user/create', JSON.stringify(newUser))
      break
    }
    case 'auth/user/login': {
      // call loginUser function
      const loggedIn = await user.login(message.toString())
      client.publish('gateway/user/login', JSON.stringify(loggedIn))
      break
    }
    case 'auth/users/all':
      // call getAllUsers function
      break
    case 'auth/user/update':
      // call updateUser function
      break
    case 'auth/user/delete':
      // call deleteUser function
      break
  }
})
*/
