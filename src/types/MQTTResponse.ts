export interface IMQTTResponse {
  user_id: string
  error?: {
    code: number
    message: string
  }
}

export type MQTTResponse = IMQTTResponse | IMQTTResponse[]
