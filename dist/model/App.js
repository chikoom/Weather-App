export class App{
  constructor(){
    this.currentCity = {}
    this.cityData = []
  }
  async getDataFromDB(){
    const returnCityData = await $.get('/cities')
    this.cityData = [...returnCityData]
    return this.cityData
  }
  async getCityData(city){
    return await $.get(`/city/${city}`)
  }
  async getCityLatLon(latitude,longitude){
    return await $.get(`/city/${latitude}/${longitude}`)
  }
  async saveCurrentCity(){
    return await $.post(`/city/`, this.currentCity)
  }
  async removeCity(cityId){
     const deletedCity = await $.ajax({url:`/city/${cityId}`,type: 'DELETE'})
     this.cityData = this.cityData.filter(city => city._id !== deletedCity._id)
     return this.cityData
  }
  getUserLocation(){
    return new Promise(function(resolve,reject){
      navigator.geolocation.getCurrentPosition(resolve, reject, {enableHighAccuracy: true})
    })
  }
  setCurrentCity(data){
    this.currentCity = data
  }
}
