import mongoose from 'mongoose'
import { IClinic } from '../types/IClinic'

// Define clinic schema
const clinicSchema = new mongoose.Schema<IClinic>(
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

// TODO: add dentist virtual

// Export Clinic
export default mongoose.model<IClinic>('clinic', clinicSchema)
