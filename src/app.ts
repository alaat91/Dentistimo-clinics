import mqtt from 'mqtt'
import * as dotenv from 'dotenv'
import clinic from './controllers/Clinics'
import mongoose, { ConnectOptions } from 'mongoose'
import dentists from './controllers/Dentists'
import { getTimeSlots } from './controllers/Timeslots'

//
dotenv.config()

// Variables
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/clinics'
const client = mqtt.connect(process.env.MQTT_URI || 'mqtt://localhost:1883')

// Connect to MongoDB
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions,
  (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    } else if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('Connected to MongoDB')
    }
  }
)

client.on('connect', () => {
  client.subscribe('clinics/#')
})

client.on('message', async (topic: string, message: Buffer) => {
  switch (topic) {
    case 'clinics/slots/available': {
      const { clinic, start, end, responseTopic } = JSON.parse(
        message.toString()
      )
      const availableSlots = await getTimeSlots(clinic, start, end)
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
      // call getClinic function
      const existingClinic = await clinic.getClinic(message.toString())
      client.publish('gateway/clinics/get', JSON.stringify(existingClinic))
      break
    }
    case 'clinics/update': {
      // call updateClinic function
      const updatedClinic = await clinic.updateClinic(message.toString())
      client.publish('gateway/clinics/update', JSON.stringify(updatedClinic))
      break
    }
    case 'clinics/delete': {
      // call deleteClinic function
      const deletedClinic = await clinic.deleteClinic(message.toString())
      client.publish('gateway/clinics/delete', JSON.stringify(deletedClinic))
      break
    }
    // Dentist Operations
    case 'clinics/dentists/create': {
      // call createUser function
      const newDentist = await dentists.createDentist(message.toString())
      client.publish(
        'gateway/clinics/dentists/create',
        JSON.stringify(newDentist)
      )
      break
    }
    case 'clinics/dentists/get': {
      // call getClinic function
      const dentist = message
        ? await dentists.getDentist(message.toString())
        : await dentists.getAllDentists()
      client.publish('gateway/clinics/dentists/get', JSON.stringify(dentist))
      break
    }
    case 'clinics/dentists/update': {
      // call updateClinic function
      const updatedDentist = await dentists.updateDentist(message.toString())
      client.publish(
        'gateway/clinics/dentists/update',
        JSON.stringify(updatedDentist)
      )
      break
    }
    case 'clinics/dentists/delete': {
      // call deleteClinic function
      const deletedDentist = await dentists.deleteDentist(message.toString())
      client.publish(
        'gateway/clinics/dentists/delete',
        JSON.stringify(deletedDentist)
      )
      break
    }
  }
})
