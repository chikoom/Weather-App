import { Render } from "../views/Render.js"
import { App } from "../model/App.js"

const app = new App()
const render = new Render()

const loadPage = async () => {

  app.getUserLocation().then(position => {
    return app.getCityLatLon(position.coords.latitude,position.coords.longitude)
  }).then(data => {
    app.setCurrentCity(data)
    render.renderMainArea(app.currentCity)
  })
  .catch(err => {
    console.error(err.message)
  })
  const allData = await app.getDataFromDB()
  render.renderData(allData)
}

const syncOne = async function(){
  const cityIdToSync = $(this).closest('.saved-city-container').data().id
  const allData = await app.updateOne(cityIdToSync)
  render.renderData(allData)
}

const syncAll = async () => {
  const allData = await app.updateAll()
  render.renderData(allData)
}

const handleSearch = async () => {
  const cityName = $('#city-query').val()
  const data = await app.getCityData(cityName)
  app.setCurrentCity(data)
  render.renderMainArea(app.currentCity)
}

const handleSave = async () => {
  const response = await app.saveCurrentCity()
  const allData = await app.getDataFromDB()
  render.renderData(allData)
}

const handleDelete = async function(){
  const cityIdToDelete = $(this).closest('.saved-city-container').data().id
  const newData = await app.removeCity(cityIdToDelete)
  render.renderData(newData)
}

$('#btn-search').on('click', handleSearch)
$('#main-city-container').on('click', '.main-city-save', handleSave)
$('#saved-cities-container').on('click', '.saved-city-remove', handleDelete)
$('#sync-all').on('click', syncAll)
$('#saved-cities-container').on('click', '.saved-city-sync', syncOne)
loadPage()
