import { Document } from 'mongoose'

export interface IDentist extends Document {
  name: string
  clinic: string
  lunchBreak: string
  fikaBreak: string
}
