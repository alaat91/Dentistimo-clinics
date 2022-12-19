export interface IClinic {
  name: string
  owner: string
  dentists: number
  address: string
  city: string
  coordinate: {
    longitude: string
    latitude: string
  }
  openinghours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
  }
}
