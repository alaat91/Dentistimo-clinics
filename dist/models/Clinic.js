"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define clinic schema
const clinicSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    dentists: { type: String, required: true },
    adress: { type: String, required: true },
    coordinates: { type: String, required: true },
    openingHours: { type: String, required: true },
    freeTimeSlots: { type: String, required: true },
});
// Export Clinic
exports.default = mongoose_1.default.model('clinic', clinicSchema);
