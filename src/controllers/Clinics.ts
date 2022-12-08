import Clinic from '../models/Clinic'

// method that creates a new clinic if not already existing
async function createClinic(message: string) {
  // eslint-disable-next-line no-console
  try {
    const clinicInfo = JSON.parse(message)
    const { name, owner, dentists, adress, coordinates , openingHours } = clinicInfo
  
    // eslint-disable-next-line no-console
    if (!(name && owner && dentists && adress && coordinates && openingHours))
      return 'All input is required'
  
    // find existing clinic from DB
    const existingClinic = Clinic.find({ name })

    // check if clinic already exists
    if ((await existingClinic).length > 0)
      return 'Clinic already exists'

    // eslint-disable-next-line no-console

    const clinic = new Clinic({ name, owner, dentists, adress, coordinates, openingHours })

    // eslint-disable-next-line no-console
    clinic.save()

    // eslint-disable-next-line no-console
    console.log(clinic)
    
  } catch (error) {
    return 'Something went wrong!'
  }
}

// return specific clinic given the ID
async function getClinic(message: string) {
  try {
    const clinicInfo = JSON.parse(message)
    const { id } = clinicInfo

    if (!(id))
      return 'ID is missing'

    // find existing clinic from DB
    const existingClinic = Clinic.findById(id)

    // check if clinic already exists
    if (existingClinic === null)
      return 'Clinic does not exist'

    return existingClinic

  } catch (error) {
    return 'Missing JSON file?'
  }
}

// TODO getAllClinics

// TODO deleteClinic

// TODO updateClinic

// export funtions
export default { createClinic, getClinic }