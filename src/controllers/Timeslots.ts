import Clinic from '../models/Clinic'
import Dentist from '../models/Dentist'
import { ITimeSlot } from '../types/ITimeSlot'

const getTimeSlots = async (message: string) => {
  try {
    const { clinic, start, end } = JSON.parse(message)
    const currentClinic = await Clinic.findById(clinic)
    const dentists = await Dentist.find({ clinic })

    const startDate = new Date(start)
    const endDate = new Date(end)

    // Constants
    const DAY_MS = 86400000
    const THIRTY_MINUTES_MS = 1800000

    if (!currentClinic) {
      return {
        error: 400,
        message: 'Clinic does not exist',
      }
    }

    // check if start date is before end date
    // make sure that the end date is atleast a day after the start date
    if (
      startDate.getTime() >= endDate.getTime() ||
      startDate.getTime() - endDate.getTime() <= DAY_MS
    ) {
      return {
        error: 400,
        message: 'Invalid date range',
      }
    }

    const slots:ITimeSlot[] = []
    for (let i = startDate.getTime(); i <= endDate.getTime(); i += DAY_MS) {
      const date = new Date(i)
      const day = date
        .toLocaleDateString('default', { weekday: 'long' })
        .toLowerCase()
      if (day === 'saturday' || day === 'sunday') continue
      const openinghours = currentClinic.openinghours[day]
      const clinicOpen = openinghours.split('-')[0]
      const clinicClose = openinghours.split('-')[1]
      const clinicOpenHours = parseInt(clinicOpen.split(':')[0])
      const clinicOpenMinutes = parseInt(clinicOpen.split(':')[1])
      date.setHours(clinicOpenHours, clinicOpenMinutes, 0, 0)
      const clinicCloseHours = parseInt(clinicClose.split(':')[0])
      const clinicCloseMinutes = parseInt(clinicClose.split(':')[1])
      const clinicCloseDate = new Date(date)
      clinicCloseDate.setHours(clinicCloseHours, clinicCloseMinutes, 0, 0)
      // create slots for each dentist
      dentists.forEach((dentist) => {
        const lunchBreakStart = parseTimeString(dentist.lunchBreak.split('-')[0], date)
        const lunchBreakEnd = parseTimeString(dentist.lunchBreak.split('-')[1], date)
        const fikaBreakStart = parseTimeString(dentist.fikaBreak.split('-')[0], date)
        const fikaBreakEnd  = parseTimeString(dentist.fikaBreak.split('-')[1], date)
        for(let j = date.getTime(); j <= clinicCloseDate.getTime(); j += THIRTY_MINUTES_MS){
          const slot = new Date(j)
          if(slot.getTime() >= lunchBreakStart.getTime() && slot.getTime() <= lunchBreakEnd.getTime()) continue
          if(slot.getTime() + THIRTY_MINUTES_MS >= lunchBreakStart.getTime() && slot.getTime() + THIRTY_MINUTES_MS <= lunchBreakEnd.getTime()) continue
          if(slot.getTime() >= fikaBreakStart.getTime() && slot.getTime() <= fikaBreakEnd.getTime()) continue
          if(slot.getTime() + THIRTY_MINUTES_MS >= fikaBreakStart.getTime() && slot.getTime() + THIRTY_MINUTES_MS <= fikaBreakEnd.getTime()) continue
          slots.push({
            dentist: dentist._id,
            clinic: currentClinic._id.toString(),
            start: slot.getTime(),
            end: slot.getTime() + THIRTY_MINUTES_MS
          })
        }
      })
    }

    return slots

  } catch (error) {
    return {
      error: 500,
      message: (error as Error).message,
    }
  }
}

const parseTimeString = (time: string, date: Date) => {
  const hours = parseInt(time.split(':')[0])
  const minutes = parseInt(time.split(':')[1])
  if(date){
    date.setHours(hours, minutes, 0, 0)
    return date
  } else {
    const newDate = new Date()
    newDate.setHours(hours, minutes, 0, 0)
    return newDate
  }
}
