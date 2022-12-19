export class MQTTErrorException extends Error {
  code: number
  constructor({ code, message }: { code: number; message: string }) {
    super(message)
    this.name = 'MQTTErrorException'
    this.code = code
  }
}
