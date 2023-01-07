import { IMQTTResponse } from './MQTTResponse'

export interface IBooking extends IMQTTResponse {
  request_id: string
  dentist_id: string
  issuance: number
  date: number
}
