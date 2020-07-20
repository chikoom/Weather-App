export class App{
  constructor(){
    this.cityData = []
  }
  async getDataFromDB(){
    const returnCityData = await $.get('/cities')
    this.cityData = [...returnCityData]
    return this.cityData
  }
  async getCityData(city){
    return $.get(`/city/${city}`)
  }
  async saveCity(data){
    return $.post(`/city/`,data)
  }
  async removeCity(cityId){
    return $.delete(`/city/`,data)
  }
}