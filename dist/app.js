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
const Clinics_1 = __importDefault(require("./controllers/Clinics"));
const mongoose_1 = __importDefault(require("mongoose"));
const Dentists_1 = __importDefault(require("./controllers/Dentists"));
const Timeslots_1 = require("./controllers/Timeslots");
//
dotenv.config();
// Variables
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/clinics';
const client = mqtt_1.default.connect(process.env.MQTT_URI || 'mqtt://localhost:1883');
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
client.on('connect', () => {
    client.subscribe('clinics/#');
});
client.on('message', async (topic, message) => {
    switch (topic) {
        case 'clinics/slots/available': {
            const { clinic, start, end, responseTopic } = JSON.parse(message.toString());
            const availableSlots = await (0, Timeslots_1.getTimeSlots)(clinic, start, end);
            client.publish(responseTopic, JSON.stringify(availableSlots));
            break;
        }
        case 'clinics/create': {
            // call createUser function
            const newClinic = await Clinics_1.default.createClinic(message.toString());
            client.publish('gateway/clinic/create', JSON.stringify(newClinic));
            break;
        }
        case 'clinics/get': {
            // call getClinic function
            const existingClinic = await Clinics_1.default.getClinic(message.toString());
            client.publish('gateway/clinics/get', JSON.stringify(existingClinic));
            break;
        }
        case 'clinics/update': {
            // call updateClinic function
            const updatedClinic = await Clinics_1.default.updateClinic(message.toString());
            client.publish('gateway/clinics/update', JSON.stringify(updatedClinic));
            break;
        }
        case 'clinics/delete': {
            // call deleteClinic function
            const deletedClinic = await Clinics_1.default.deleteClinic(message.toString());
            client.publish('gateway/clinics/delete', JSON.stringify(deletedClinic));
            break;
        }
        // Dentist Operations
        case 'clinics/dentists/create': {
            // call createUser function
            const newDentist = await Dentists_1.default.createDentist(message.toString());
            client.publish('gateway/clinics/dentists/create', JSON.stringify(newDentist));
            break;
        }
        case 'clinics/dentists/get': {
            // call getClinic function
            const dentist = message
                ? await Dentists_1.default.getDentist(message.toString())
                : await Dentists_1.default.getAllDentists();
            client.publish('gateway/clinics/dentists/get', JSON.stringify(dentist));
            break;
        }
        case 'clinics/dentists/update': {
            // call updateClinic function
            const updatedDentist = await Dentists_1.default.updateDentist(message.toString());
            client.publish('gateway/clinics/dentists/update', JSON.stringify(updatedDentist));
            break;
        }
        case 'clinics/dentists/delete': {
            // call deleteClinic function
            const deletedDentist = await Dentists_1.default.deleteDentist(message.toString());
            client.publish('gateway/clinics/dentists/delete', JSON.stringify(deletedDentist));
            break;
        }
    }
});
