import Clinic from '../models/Clinic'
import Dentist from '../models/Dentist'
import { IBooking } from '../types/IBooking'
import { ITimeSlot } from '../types/ITimeSlot'
import { getMQTTResponse } from '../util/getMQTTResponse'

/**
 * Generate 30 minute time slots for a given date range, for a given clinic
 * @param clinic clinic id for which to generate time slots
 * @param start start time of the date range (ms)
 * @param end end time of date range (ms)
 * @returns an array of ITimeslot
 */
export const getTimeSlots = async (
  clinic: string,
  startTime: number,
  endTime: number
) => {
  try {
    const currentClinic = await Clinic.findById(clinic)
    const dentists = await Dentist.find({ clinic })

    const start = resetTime(startTime)
    const end = resetTime(endTime)

    const startDate = new Date(start)
    const endDate = new Date(end)

    // Constants
    const DAY_MS = 86400000
    const THIRTY_MINUTES_MS = 1800000

    if (!currentClinic) {
      return {
        error: {
          code: 400,
          message: 'Clinic does not exist',
        },
      }
    }

    // check if start date is before end date
    // make sure that the end date is atleast a day after the start date
    if (
      startDate.getTime() >= endDate.getTime() ||
      endDate.getTime() - startDate.getTime() <= DAY_MS
    ) {
      return {
        error: {
          code: 400,
          message: 'Invalid date range',
        },
      }
    }
    // get all bookings within the interval
    const bookings = (await getMQTTResponse(
      'bookings/get/range',
      'clinics/bookings',
      { start, end }
    )) as IBooking[]

    const slots: Map<number, ITimeSlot> = new Map<number, ITimeSlot>()
    for (let i = startDate.getTime(); i <= endDate.getTime(); i += DAY_MS) {
      const date = new Date(i)
      const day = date
        .toLocaleDateString('EN-US', { weekday: 'long' })
        .toLowerCase()
      if (day === 'saturday' || day === 'sunday') continue
      const openinghours =
        currentClinic.openinghours[
          day as keyof typeof currentClinic.openinghours
        ]
      // set current date to clinic open time
      parseTimeString(openinghours.split('-')[0], date)
      // turn closing time to a date object
      const clinicCloseDate = parseTimeString(
        openinghours.split('-')[1],
        new Date(i)
      )
      // create slots for each dentist
      dentists.forEach((dentist) => {
        const lunchBreakStart = parseTimeString(
          dentist.lunchBreak.split('-')[0]
        )
        const lunchBreakEnd = parseTimeString(dentist.lunchBreak.split('-')[1])
        const fikaBreakStart = parseTimeString(dentist.fikaBreak.split('-')[0])
        const fikaBreakEnd = parseTimeString(dentist.fikaBreak.split('-')[1])
        for (
          let j = date.getTime();
          j < clinicCloseDate.getTime();
          j += THIRTY_MINUTES_MS
        ) {
          const slot = new Date(j)
          // skip slot if the time has elapsed
          if (slot.getTime() < Date.now()) continue
          if (slot.getTime() + THIRTY_MINUTES_MS < Date.now()) continue
          // skip slot if it is during lunch break or fika break
          if (
            slot.getTime() >= lunchBreakStart.getTime() &&
            slot.getTime() <= lunchBreakEnd.getTime()
          )
            continue
          if (
            slot.getTime() + THIRTY_MINUTES_MS >= lunchBreakStart.getTime() &&
            slot.getTime() + THIRTY_MINUTES_MS <= lunchBreakEnd.getTime()
          )
            continue
          if (
            slot.getTime() >= fikaBreakStart.getTime() &&
            slot.getTime() <= fikaBreakEnd.getTime()
          )
            continue
          if (
            slot.getTime() + THIRTY_MINUTES_MS >= fikaBreakStart.getTime() &&
            slot.getTime() + THIRTY_MINUTES_MS <= fikaBreakEnd.getTime()
          )
            continue
          // skip slot if it is already booked
          const booked = bookings.some(
            (booking) =>
              booking.date === slot.getTime() &&
              booking.dentist_id === dentist._id.toString()
          )
          if (booked) continue
          slots.set(slot.getTime(), {
            dentist: dentist._id.toString(),
            clinic: currentClinic._id.toString(),
            start: slot.getTime(),
            end: slot.getTime() + THIRTY_MINUTES_MS,
          })
        }
      })
    }

    return Array.from(slots.values())
  } catch (error) {
    return {
      error: {
        code: 500,
        message: (error as Error).message,
      },
    }
  }
}

/**
 * Takes in a time string returns a date object with the time set to the time string
 * @param time the time string in the format HH:MM
 * @param date optional parametet to set the time on a specific date instead of a new object
 * @returns a date object
 */

const parseTimeString = (time: string, date?: Date): Date => {
  const hours = parseInt(time.split(':')[0])
  const minutes = parseInt(time.split(':')[1])
  if (date) {
    date.setHours(hours, minutes, 0, 0)
    return date
  } else {
    const newDate = new Date()
    newDate.setHours(hours, minutes, 0, 0)
    return newDate
  }
}

const resetTime = (timestamp: number): number => {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date.getTime()
}

/** A helper function for validating whether a slot is valid to be booked */
// make sure that a slot is valid
// this includes checking if the slot is already booked
// checking if the slot is on the half hour
// checking if the slot is within the clinics opening hours and days
// checking if the slot is outside of dentists breaks
export const verifySlot = async (startTime: number, dentist_id: string) => {
  try {
    const start = resetTime(startTime)
    const THIRTY_MINUTES_MS = 1800000
    const end = start + THIRTY_MINUTES_MS
    if (start < Date.now()) return false
    const dentist = await Dentist.findById(dentist_id)
    if (!dentist) return false
    // get all bookings within the interval
    const bookings = (await getMQTTResponse(
      'bookings/get/range',
      'clinics/bookings',
      { start, end, clinic: dentist.clinic.toString() }
    )) as IBooking[]
    // check if the slot is already booked
    const booked = bookings.some(
      (booking) => booking.date === start && booking.dentist_id === dentist_id
    )
    if (booked) return false
    // check if the slot is on the half hour
    const startDate = new Date(start)
    const endDate = new Date(end)
    if (startDate.getMinutes() % 30 !== 0) return false

    // check if the slot is within the clinics opening hours and days
    const clinic = await Clinic.findById(dentist.clinic)
    if (!clinic) return false
    const day = startDate
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase()
    if (day === 'saturday' || day === 'sunday') return false
    const openinghours =
      clinic.openinghours[day as keyof typeof clinic.openinghours]
    const clinicOpenDate = parseTimeString(
      openinghours.split('-')[0],
      new Date(start)
    )
    const clinicCloseDate = parseTimeString(
      openinghours.split('-')[1],
      new Date(start)
    )
    if (startDate.getTime() < clinicOpenDate.getTime()) return false
    if (startDate.getTime() > clinicCloseDate.getTime()) return false

    // check if the slot start or end falls within the lunch break
    const lunchBreakStart = parseTimeString(
      dentist.lunchBreak.split('-')[0],
      new Date(start)
    )
    const lunchBreakEnd = parseTimeString(
      dentist.lunchBreak.split('-')[1],
      new Date(start)
    )
    if (
      startDate.getTime() >= lunchBreakStart.getTime() &&
      startDate.getTime() <= lunchBreakEnd.getTime()
    )
      return false
    if (
      endDate.getTime() >= lunchBreakStart.getTime() &&
      endDate.getTime() <= lunchBreakEnd.getTime()
    )
      return false
    // check if the slot start or end falls within the fika break
    const fikaBreakStart = parseTimeString(
      dentist.fikaBreak.split('-')[0],
      new Date(start)
    )
    const fikaBreakEnd = parseTimeString(
      dentist.fikaBreak.split('-')[1],
      new Date(start)
    )
    if (
      startDate.getTime() >= fikaBreakStart.getTime() &&
      startDate.getTime() <= fikaBreakEnd.getTime()
    )
      return false
    if (
      endDate.getTime() >= fikaBreakStart.getTime() &&
      endDate.getTime() <= fikaBreakEnd.getTime()
    )
      return false
    return true
  } catch (error) {
    return false
  }
}
