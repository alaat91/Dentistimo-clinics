"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Dentist_1 = __importDefault(require("../models/Dentist"));
/**  Create a new Dentist */
const createDentist = async (message) => {
    try {
        const { name, clinic, lunchBreak, fikaBreak } = JSON.parse(message);
        const dentist = await Dentist_1.default.create({
            name,
            clinic,
            lunchBreak,
            fikaBreak,
        });
        return dentist;
    }
    catch (error) {
        return {
            error: 500,
            message: error.message,
        };
    }
};
/** Get all dentists from the databse */
const getAllDentists = async () => {
    try {
        const dentists = await Dentist_1.default.find();
        return dentists;
    }
    catch (error) {
        return {
            error: 500,
            message: error.message,
        };
    }
};
/** Get all dentists for a clinic */
const getDentistsForClinic = async (message) => {
    try {
        const { clinic } = JSON.parse(message);
        const dentists = await Dentist_1.default.find({ clinic });
        return dentists;
    }
    catch (error) {
        return {
            error: 500,
            message: error.message,
        };
    }
};
/** Get a specific dentist*/
const getDentist = async (message) => {
    try {
        const { id } = JSON.parse(message);
        const dentist = await Dentist_1.default.findById(id);
        return dentist;
    }
    catch (error) {
        return {
            error: 500,
            message: error.message,
        };
    }
};
/** Update a dentist */
const updateDentist = async (message) => {
    try {
        const { id, name, clinic, lunchBreak, fikaBreak } = JSON.parse(message);
        const dentist = await Dentist_1.default.findByIdAndUpdate(id, { name, clinic, lunchBreak, fikaBreak }, { new: true });
        return dentist;
    }
    catch (error) {
        return {
            error: 500,
            message: error.message,
        };
    }
};
/** Delete a dentist */
const deleteDentist = async (message) => {
    try {
        const { id } = JSON.parse(message);
        const dentist = await Dentist_1.default.findByIdAndDelete(id);
        return dentist;
    }
    catch (error) {
        return {
            error: 500,
            message: error.message,
        };
    }
};
exports.default = {
    createDentist,
    getAllDentists,
    getDentistsForClinic,
    getDentist,
    updateDentist,
    deleteDentist,
};
