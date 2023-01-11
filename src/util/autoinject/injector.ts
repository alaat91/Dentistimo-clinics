import mongoose from 'mongoose'
import Clinic from '../../models/Clinic'
import Dentist from '../../models/Dentist'
import { clinics, dentists } from './data'

export async function preloadData() {
  await mongoose.connection.db.dropDatabase()
  clinics.forEach(async (clinic) => {
    try {
      const newClinic = await new Clinic(clinic)
      newClinic.save()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Something went wrong with preloading the database')
    }
  })
  dentists.forEach(async (dentist) => {
    try {
      const newDentist = await new Dentist(dentist)
      newDentist.save()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Something went wrong with preloading the database')
    }
  })
}
