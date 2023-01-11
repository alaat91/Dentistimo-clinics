import mqtt from 'mqtt'
import * as dotenv from 'dotenv'
import clinic from './controllers/Clinics'
import mongoose, { ConnectOptions } from 'mongoose'
import dentists from './controllers/Dentists'
import { getTimeSlots, verifySlot } from './controllers/Timeslots'
import { preloadData } from './util/autoinject/injector'

//
dotenv.config()

// Variables
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/clinics'
export const client = mqtt.connect(
  process.env.MQTT_URI || 'mqtt://localhost:1883'
)

// Connect to MongoDB
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions,
  async (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } else if (process.env.NODE_ENV !== 'production') {
      await preloadData()
      // eslint-disable-next-line no-console
      console.log('Connected to MongoDB')
    }
  }
)

client.on('connect', () => {
  client.subscribe('clinics/#')
})

client.on('message', async (topic: string, message: Buffer) => {
  const parsedMessage = JSON.parse(message.toString())
  switch (topic) {
    case 'clinics/slots/available': {
      const { clinic, start, end, responseTopic } = JSON.parse(
        message.toString()
      )
      const availableSlots = await getTimeSlots(clinic, start, end)
      client.publish(responseTopic, JSON.stringify(availableSlots))
      break
    }
    case 'clinics/slots/verify': {
      const { start, dentist, responseTopic } = JSON.parse(message.toString())
      const availableSlots = await verifySlot(start, dentist)
      client.publish(responseTopic, JSON.stringify(availableSlots))
      break
    }
    case 'clinics/create': {
      // call createUser function
      const newClinic = await clinic.createClinic(message.toString())
      client.publish('gateway/clinic/create', JSON.stringify(newClinic))
      break
    }
    case 'clinics/get': {
      const response = await clinic.getClinic(message.toString())
      client.publish(parsedMessage.responseTopic, JSON.stringify(response))
      break
    }
    case 'clinics/get/all': {
      const response = await clinic.getAllClinics()
      client.publish(parsedMessage.responseTopic, JSON.stringify(response))
      break
    }
    case 'clinics/update': {
      // call updateClinic function
      const updatedClinic = await clinic.updateClinic(message.toString())
      client.publish(parsedMessage.responseTopic, JSON.stringify(updatedClinic))
      break
    }
    case 'clinics/delete': {
      // call deleteClinic function
      const deletedClinic = await clinic.deleteClinic(message.toString())
      client.publish(parsedMessage.responseTopic, JSON.stringify(deletedClinic))
      break
    }
    // Dentist Operations
    case 'clinics/dentists/create': {
      // call createUser function
      const newDentist = await dentists.createDentist(message.toString())
      client.publish(parsedMessage.responseTopic, JSON.stringify(newDentist))
      break
    }
    case 'clinics/dentists/get': {
      // call getClinic function
      const dentist = await dentists.getDentist(message.toString())
      client.publish(parsedMessage.responseTopic, JSON.stringify(dentist))
      break
    }
    case 'clinics/dentists/get/all': {
      const allDentists = await dentists.getAllDentists()
      client.publish(parsedMessage.responseTopic, JSON.stringify(allDentists))
      break
    }
    case 'clinics/dentists/update': {
      // call updateClinic function
      const updatedDentist = await dentists.updateDentist(message.toString())
      client.publish(
        parsedMessage.responseTopic,
        JSON.stringify(updatedDentist)
      )
      break
    }
    case 'clinics/dentists/delete': {
      // call deleteClinic function
      const deletedDentist = await dentists.deleteDentist(message.toString())
      client.publish(
        parsedMessage.responseTopic,
        JSON.stringify(deletedDentist)
      )
      break
    }
  }
})
