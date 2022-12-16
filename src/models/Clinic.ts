import mongoose from 'mongoose'
import { IClinic } from '../types/IClinic'
import Dentist from './Dentist'

// Define clinic schema
const clinicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    coordinate: {
      longitude: { type: String, required: true },
      latitude: { type: String, required: true },
    },
    openinghours: {
      monday: { type: String, required: true },
      tuesday: { type: String, required: true },
      wednesday: { type: String, required: true },
      thursday: { type: String, required: true },
      friday: { type: String, required: true },
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

// add virtual dentists
clinicSchema.virtual('dentists').get(function () {
  return Dentist.count({ clinic: this._id })
})
// Export Clinic
export default mongoose.model<IClinic>('clinic', clinicSchema)
