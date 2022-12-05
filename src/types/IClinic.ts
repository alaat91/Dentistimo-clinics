import mongoose, { Document } from "mongoose"

export interface IClinic extends Document{
  _id: mongoose.Types.ObjectId
  name: string
  owner: string
  dentists: string
  adress: string
  coordinates: string
  openingHours: string
  freeTimeSlots?: string
}