"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const dentistSchema = new Schema({
    name: { type: String, required: true },
    clinic: { type: Schema.Types.ObjectId, ref: 'clinic', required: true },
    lunchBreak: { type: String, required: true },
    fikaBreak: { type: String, required: true },
});
exports.default = mongoose_1.default.model('dentist', dentistSchema);
