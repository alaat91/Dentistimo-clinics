import mongoose from 'mongoose'
import { IDentist } from '../types/IDentist'

const Schema = mongoose.Schema

const dentistSchema = new Schema({
  name: { type: String, required: true },
  clinic: { type: Schema.Types.ObjectId, ref: 'clinic', required: true },
  lunchBreak: { type: String, required: true },
  fikaBreak: { type: String, required: true },
})

export default mongoose.model<IDentist>('dentist', dentistSchema)