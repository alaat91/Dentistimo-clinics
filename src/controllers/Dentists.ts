import { HydratedDocument } from 'mongoose'
import Dentist from '../models/Dentist'
import { IDentist } from '../types/IDentist'
import { MQTTErrorException } from '../util/errors/MQTTErrorException'

/**  Create a new Dentist */
const createDentist = async (message: string) => {
  try {
    const { name, clinic, lunchBreak, fikaBreak } = JSON.parse(message)
    const dentist = await Dentist.create({
      name,
      clinic,
      lunchBreak,
      fikaBreak,
    })
    return dentist
  } catch (error) {
    return {
      error: 500,
      message: (error as Error).message,
    }
  }
}

/** Get all dentists from the databse */
const getAllDentists = async () => {
  try {
    const dentists = await Dentist.find()
    return dentists
  } catch (error) {
    return {
      error: 500,
      message: (error as Error).message,
    }
  }
}

/** Get all dentists for a clinic */
const getDentistsForClinic = async (message: string) => {
  try {
    const { clinic } = JSON.parse(message)
    const dentists: HydratedDocument<IDentist>[] = await Dentist.find({
      clinic,
    })
    return dentists
  } catch (error) {
    return {
      error: 500,
      message: (error as Error).message,
    }
  }
}

/** Get a specific dentist*/
const getDentist = async (message: string) => {
  try {
    const { id } = JSON.parse(message)
    const dentist: HydratedDocument<IDentist> | null = await Dentist.findById(
      id
    )
    if (!dentist)
      throw new MQTTErrorException({
        code: 400,
        message: 'Dentist does not exist',
      })
    return dentist
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

/** Update a dentist */
const updateDentist = async (message: string) => {
  try {
    const { id, name, clinic, lunchBreak, fikaBreak } = JSON.parse(message)
    const dentist = await Dentist.findByIdAndUpdate(
      id,
      { name, clinic, lunchBreak, fikaBreak },
      { new: true }
    )
    return dentist
  } catch (error) {
    return {
      error: 500,
      message: (error as Error).message,
    }
  }
}

/** Delete a dentist */
const deleteDentist = async (message: string) => {
  try {
    const { id } = JSON.parse(message)
    const dentist = await Dentist.findByIdAndDelete(id)
    return dentist
  } catch (error) {
    return {
      error: 500,
      message: (error as Error).message,
    }
  }
}

export default {
  createDentist,
  getAllDentists,
  getDentistsForClinic,
  getDentist,
  updateDentist,
  deleteDentist,
}
