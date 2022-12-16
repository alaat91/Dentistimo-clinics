"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeSlots = void 0;
const Clinic_1 = __importDefault(require("../models/Clinic"));
const Dentist_1 = __importDefault(require("../models/Dentist"));
/**
 * Generate 30 minute time slots for a given date range, for a given clinic
 * @param clinic clinic id for which to generate time slots
 * @param start start time of the date range (ms)
 * @param end end time of date range (ms)
 * @returns an array of ITimeslot
 */
const getTimeSlots = async (clinic, start, end) => {
    try {
        const currentClinic = await Clinic_1.default.findById(clinic);
        const dentists = await Dentist_1.default.find({ clinic });
        const startDate = new Date(start);
        const endDate = new Date(end);
        // Constants
        const DAY_MS = 86400000;
        const THIRTY_MINUTES_MS = 1800000;
        if (!currentClinic) {
            return {
                error: {
                    code: 400,
                    message: 'Clinic does not exist',
                },
            };
        }
        // check if start date is before end date
        // make sure that the end date is atleast a day after the start date
        if (startDate.getTime() >= endDate.getTime() ||
            endDate.getTime() - startDate.getTime() <= DAY_MS) {
            return {
                error: {
                    code: 400,
                    message: 'Invalid date range',
                },
            };
        }
        const slots = [];
        for (let i = startDate.getTime(); i <= endDate.getTime(); i += DAY_MS) {
            const date = new Date(i);
            const day = date
                .toLocaleDateString('default', { weekday: 'long' })
                .toLowerCase();
            if (day === 'saturday' || day === 'sunday')
                continue;
            const openinghours = currentClinic.openinghours[day];
            // set current date to clinic open time
            parseTimeString(openinghours.split('-')[0], date);
            // turn closing time to a date object
            const clinicCloseDate = parseTimeString(openinghours.split('-')[1]);
            // create slots for each dentist
            dentists.forEach((dentist) => {
                const lunchBreakStart = parseTimeString(dentist.lunchBreak.split('-')[0]);
                const lunchBreakEnd = parseTimeString(dentist.lunchBreak.split('-')[1]);
                const fikaBreakStart = parseTimeString(dentist.fikaBreak.split('-')[0]);
                const fikaBreakEnd = parseTimeString(dentist.fikaBreak.split('-')[1]);
                for (let j = date.getTime(); j < clinicCloseDate.getTime(); j += THIRTY_MINUTES_MS) {
                    const slot = new Date(j);
                    // skip slot if it is during lunch break or fika break
                    if (slot.getTime() >= lunchBreakStart.getTime() &&
                        slot.getTime() <= lunchBreakEnd.getTime())
                        continue;
                    if (slot.getTime() + THIRTY_MINUTES_MS >= lunchBreakStart.getTime() &&
                        slot.getTime() + THIRTY_MINUTES_MS <= lunchBreakEnd.getTime())
                        continue;
                    if (slot.getTime() >= fikaBreakStart.getTime() &&
                        slot.getTime() <= fikaBreakEnd.getTime())
                        continue;
                    if (slot.getTime() + THIRTY_MINUTES_MS >= fikaBreakStart.getTime() &&
                        slot.getTime() + THIRTY_MINUTES_MS <= fikaBreakEnd.getTime())
                        continue;
                    slots.push({
                        dentist: dentist._id,
                        clinic: currentClinic._id.toString(),
                        start: slot.getTime(),
                        end: slot.getTime() + THIRTY_MINUTES_MS,
                    });
                }
            });
        }
        return slots;
    }
    catch (error) {
        return {
            error: {
                code: 500,
                message: error.message,
            },
        };
    }
};
exports.getTimeSlots = getTimeSlots;
/**
 * Takes in a time string returns a date object with the time set to the time string
 * @param time the time string in the format HH:MM
 * @param date optional parametet to set the time on a specific date instead of a new object
 * @returns a date object
 */
const parseTimeString = (time, date) => {
    const hours = parseInt(time.split(':')[0]);
    const minutes = parseInt(time.split(':')[1]);
    if (date) {
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
    else {
        const newDate = new Date();
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
    }
};
