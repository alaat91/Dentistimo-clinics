import mongoose from "mongoose"
import { IClinic } from "../types/IClinic"

// Define clinic schema
const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  dentists: { type: String, required: true },
  adress: { type: String, required: true },
  coordinates: { type: String, required: true },
  openingHours: { type: String, required: true },
  freeTimeSlots: { type: String, required: true },
})
  
// Export Clinic
export default mongoose.model<IClinic>('clinic', clinicSchema)