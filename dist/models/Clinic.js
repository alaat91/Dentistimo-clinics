"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Dentist_1 = __importDefault(require("./Dentist"));
// Define clinic schema
const clinicSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    coordinate: {
        longitude: { type: String, required: true },
        latitude: { type: String, required: true },
    },
    openinghours: {
        monday: { type: String, required: true },
        tuesday: { type: String, required: true },
        wednesday: { type: String, required: true },
        thursday: { type: String, required: true },
        friday: { type: String, required: true },
    },
}, { timestamps: true, toJSON: { virtuals: true } });
// add virtual dentists
clinicSchema.virtual('dentists').get(function () {
    return Dentist_1.default.count({ clinic: this._id });
});
// Export Clinic
exports.default = mongoose_1.default.model('clinic', clinicSchema);
