export const clinics = [
  {
    _id: '6399e643f52fe4f964ddb8ae',
    name: 'Your Dentist',
    owner: 'Dan Tist',
    address: 'Spannmålsgatan 20',
    city: 'Gothenburg',
    coordinate: { longitude: '11.969388', latitude: '57.707619' },
    openinghours: {
      monday: '9:00-17:00',
      tuesday: '8:00-17:00',
      wednesday: '7:00-16:00',
      thursday: '9:00-17:00',
      friday: '9:00-15:00',
    },
  },
  {
    _id: '6399e6db5eeb90d26babb4f9',
    name: 'Tooth Fairy Dentist',
    owner: 'Tooth Fairy',
    address: 'Slottskogen',
    city: 'Gothenburg',
    coordinate: { longitude: '11.942625', latitude: '57.685255' },
    openinghours: {
      monday: '7:00-19:00',
      tuesday: '7:00-19:00',
      wednesday: '7:00-19:00',
      thursday: '7:00-19:00',
      friday: '7:00-19:00',
    },
  },
  {
    _id: '6399e864eb2dac64f056dd9b',
    name: 'The Crown',
    owner: 'Carmen Corona',
    address: 'Lindholmsallén 19',
    city: 'Gothenburg',
    coordinate: { longitude: '11.940386', latitude: '57.709872' },
    openinghours: {
      monday: '6:00-15:00',
      tuesday: '8:00-17:00',
      wednesday: '7:00-12:00',
      thursday: '7:00-17:00',
      friday: '8:00-16:00',
    },
  },
  {
    _id: '6399e8c9cbf55cbbd72155df',
    name: 'Lisebergs Dentists',
    owner: 'Glen Hysén',
    address: 'Liseberg',
    city: 'Gothenburg',
    coordinate: { longitude: '11.991153', latitude: '57.694723' },
    openinghours: {
      monday: '10:00-18:00',
      tuesday: '10:00-18:00',
      wednesday: '10:00-18:00',
      thursday: '10:00-18:00',
      friday: '10:00-18:00',
    },
  },
]

export const dentists = [
  {
    name: 'Victor Campanello',
    clinic: '6399e6db5eeb90d26babb4f9',
    lunchBreak: '12:00-13:00',
    fikaBreak: '15:00-15:30',
  },
  {
    name: 'Armin Balesic',
    clinic: '6399e643f52fe4f964ddb8ae',
    lunchBreak: '12:00-13:00',
    fikaBreak: '15:00-15:30',
  },
  {
    name: 'Alaa Taleb',
    clinic: '6399e864eb2dac64f056dd9b',
    lunchBreak: '12:00-13:00',
    fikaBreak: '15:00-15:30',
  },
  {
    name: 'Umar Mahmood',
    clinic: '6399e8c9cbf55cbbd72155df',
    lunchBreak: '12:00-13:00',
    fikaBreak: '15:00-15:30',
  },
]
