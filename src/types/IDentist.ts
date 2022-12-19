import { Types } from 'mongoose'

export interface IDentist {
  name: string
  clinic: Types.ObjectId
  lunchBreak: string
  fikaBreak: string
}
