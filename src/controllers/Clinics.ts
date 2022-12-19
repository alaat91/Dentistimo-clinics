/* eslint-disable semi */
import { HydratedDocument } from 'mongoose'
import Clinic from '../models/Clinic'
import { IClinic } from '../types/IClinic'
import { MQTTErrorException } from '../util/errors/MQTTErrorException'

// method that creates a new clinic if not already existing
async function createClinic(message: string) {
  try {
    const clinicInfo = JSON.parse(message)
    const { name, owner, address, city, coordinate, openinghours } = clinicInfo
    if (!(name && owner && address && city && coordinate && openinghours))
      return 'All input is required'

    // find existing clinic from DB
    const existingClinic = Clinic.find({ name })

    // check if clinic already exists
    if ((await existingClinic).length > 0) return 'Clinic already exists'

    // create new clinic
    const clinic = new Clinic({
      name,
      owner,
      address,
      city,
      coordinate,
      openinghours,
    })

    // save new clinic to database
    const newClinic = await clinic.save()
    return newClinic
  } catch (error) {
    return 'Something is wrong with the JSON data'
  }
}

// return specific clinic given the ID
async function getClinic(message: string) {
  try {
    const clinicInfo = JSON.parse(message)
    const { clinic } = clinicInfo
    const currentClinic: HydratedDocument<IClinic> | null =
      await Clinic.findById(clinic)
    if (!currentClinic)
      throw new MQTTErrorException({
        code: 400,
        message: 'Clinic does not exist',
      })
    return currentClinic
  } catch (error) {
    if (error instanceof MQTTErrorException) {
      return {
        error: {
          code: error.code,
          message: error.message,
        },
      }
    }
    return {
      error: {
        code: 500,
        message: (error as Error).message,
      },
    }
  }
}

// TODO getAllClinics
async function getAllClinics() {
  try {
    const allClinics: HydratedDocument<IClinic>[] = await Clinic.find({})
    return allClinics
  } catch (error) {
    return error
  }
}

// delete specific clinic given the ID
async function deleteClinic(message: string) {
  try {
    const clinicInfo = JSON.parse(message)
    const { id } = clinicInfo
    await Clinic.findByIdAndDelete(id)

    if (!id) {
      return 'Invalid clinic ID'
    }

    return 'Clinic has been deleted'
  } catch (error) {
    return error
  }
}

// update specific clinic given the ID
async function updateClinic(message: string) {
  try {
    const clinicInfo = JSON.parse(message)
    const id = clinicInfo
    const clinic = await Clinic.findOneAndUpdate(
      id,
      { clinicInfo },
      { new: true }
    )

    return clinic
  } catch (error) {
    return error
  }
}

// export funtions
export default {
  createClinic,
  getClinic,
  deleteClinic,
  updateClinic,
  getAllClinics,
}
