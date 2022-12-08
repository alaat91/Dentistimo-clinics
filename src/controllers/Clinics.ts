import Clinic from '../models/Clinic'

// method that creates a new clinic if not already existing
async function createClinic(message: string) {
  // eslint-disable-next-line no-console
  console.log('kladdkaka1')
  try {
    const userInfo = JSON.parse(message)
    const { name, owner, dentists, adress, coordinates , openingHours } = userInfo
  
    // eslint-disable-next-line no-console
    console.log('kladdkaka5')
    if (!(name && owner && dentists && adress && coordinates && openingHours))
      return 'All input is required'
  
    // find existing clinic from DB
    const existingClinic = Clinic.find({ name })

    // check if clinic already exists
    if ((await existingClinic).length > 0)
      return 'Clinic already exists'

    // eslint-disable-next-line no-console
    console.log('kladdkaka4')

    const clinic = new Clinic({ name, owner, dentists, adress, coordinates, openingHours })

    // eslint-disable-next-line no-console
    console.log('kladdkaka3')
    clinic.save()

    // eslint-disable-next-line no-console
    console.log(clinic)
    
  } catch (error) {
    return 'Something went wrong!'
  }
}

// TODO getClinic

// TODO getAllClinics

// TODO deleteClinic

// TODO updateClinic

// export funtions
export default { createClinic }