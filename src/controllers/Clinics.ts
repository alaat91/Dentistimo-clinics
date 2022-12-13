import Clinic from '../models/Clinic'

// method that creates a new clinic if not already existing
async function createClinic(message: string) {
  try {
    // eslint-disable-next-line no-console
    console.log(message)
    const clinicInfo = JSON.parse(message)
    const { name, owner, dentists, address, city, coordinate, openinghours } = clinicInfo
  
    // eslint-disable-next-line no-console
    if (!(name && owner && dentists && address && city && coordinate && openinghours))
      return 'All input is required'
  
    // find existing clinic from DB
    const existingClinic = Clinic.find({ name })

    // check if clinic already exists
    if ((await existingClinic).length > 0)
      return 'Clinic already exists'

    // create new clinic
    const clinic = new Clinic({ name, owner, dentists, address, city, coordinate, openinghours })

    // eslint-disable-next-line no-console
    console.log(clinic)

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
  
    // eslint-disable-next-line no-console
    console.log(id)
    return 'Clinic has been deleted'
  } 
    
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return error
  }
}

// update specific clinic given the ID
async function updateClinic(message: string) {
  try {
    const clinicInfo = JSON.parse(message)
    const id = clinicInfo
    const clinic = await Clinic.findOneAndUpdate(id)
    
    if (!clinic) {
      return 'Invalid clinic ID'
    }
  
    if (clinic === null) {
      return 'Clinic does not exist'
    }
  
    // eslint-disable-next-line no-console
    console.log(clinic)
    return 'Clinic has been updated'
  } 
    
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return error
  }
}

// export funtions
export default { createClinic, getClinic, deleteClinic, updateClinic }