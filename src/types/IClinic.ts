import mongoose, { Document } from 'mongoose'

export interface IClinic extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  owner: string
  dentists: number
  adress: string
  coordinates: string
  openinghours: {
    [key: string]: string
  }
}
