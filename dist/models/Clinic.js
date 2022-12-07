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
    dentists: { type: Number, required: true },
    adress: { type: String, required: true },
    coordinates: [{
            longitude: { type: String, required: true },
            latitude: { type: String, required: true }
        }],
    openingHours: [{
            Monday: { type: String, required: true },
            Tuesday: { type: String, required: true },
            Wednesday: { type: String, required: true },
            Thursday: { type: String, required: true },
            Friday: { type: String, required: true }
        }]
});
// Export Clinic
exports.default = mongoose_1.default.model('clinic', clinicSchema);
