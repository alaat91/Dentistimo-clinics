import mqtt from 'mqtt'
import * as dotenv from 'dotenv'
import clinic from './controllers/Clinics'
import mongoose, { ConnectOptions } from 'mongoose'

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
    } else if(process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('Connected to MongoDB')
    }
  }
)

client.on('connect', () => {
  client.subscribe('clinic/post')
  client.subscribe('clinic/get')
})

client.on('message', async(topic: string, message: Buffer) => {
  switch (topic) {
    case 'clinic/post': {
      // call createUser function
      // eslint-disable-next-line no-console
      const newClinic = await clinic.createClinic(message.toString())
      client.publish('gateway/clinic/post', JSON.stringify(newClinic))
      break
    }
    case 'clinic/get': {
      // call getClinic function
      // eslint-disable-next-line no-console
      const existingClinic = await clinic.getClinic(message.toString())
      client.publish('gateway/clinic/get', JSON.stringify(existingClinic))
      break
    }
    case 'clinic/getall':
      // call getAllClinics function
      break
    case 'clinic/update':
      // call updateClinic function
      break
    case 'clinic/delete':
      // call deleteClinic function
      break
  }
})
