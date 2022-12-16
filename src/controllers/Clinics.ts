/* eslint-disable semi */
import Clinic from '../models/Clinic'

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
    clinic.save()
    return 'Clinic has been created and saved to database'
  } catch (error) {
    return 'Something is wrong with the JSON data'
  }
}

// return specific clinic given the ID
async function getClinic(message: string) {
  try {
    const clinicInfo = JSON.parse(message)
    const { id } = clinicInfo

    if (!id) return 'ID is missing'

    // find existing clinic from DB
    const existingClinic = Clinic.findById(id)

    // check if clinic already exists
    if (existingClinic === null) return 'Clinic does not exist'

    return existingClinic
  } catch (error) {
    return 'Missing Clinic Information'
  }
}

// TODO getAllClinics
async function getAllClinics() {
  try {
    const allClinics = await Clinic.find()
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

    if (id === null) {
      return 'Clinic does not exist'
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

    if (!clinic) {
      return 'Invalid clinic ID'
    }

    if (clinic === null) {
      return 'Clinic does not exist'
    }

    return 'Clinic has been updated'
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
