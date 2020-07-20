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
  async saveCity(data){
    return await $.post(`/city/`,data)
  }
  async removeCity(cityId){
    return await $.delete(`/city/`,data)
  }
  getUserLocation(){
    return new Promise(function(resolve,reject){
      navigator.geolocation.getCurrentPosition(resolve, reject, {enableHighAccuracy: true})
    })
  }
}
