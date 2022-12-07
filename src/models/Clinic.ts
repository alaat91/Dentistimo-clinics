import mongoose from "mongoose"
import { IClinic } from "../types/IClinic"

// Define clinic schema
const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  dentists: { type: Number, required: true },
  adress: { type: String, required: true },
  coordinates: [{ 
    longitude: { type: String, required: true }, 
    latitude: { type: String, required: true } 
  }],
  openingHours: [{ 
    Monday: { type: String, required: true },
    Tuesday: {type: String, required: true },
    Wednesday: {type: String, required: true},
    Thursday: {type: String, required: true},
    Friday: {type: String, required: true}
  }]
})
  
// Export Clinic
export default mongoose.model<IClinic>('clinic', clinicSchema)