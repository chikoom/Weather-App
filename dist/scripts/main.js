import { Render } from "../views/Render.js"
import { App } from "../model/App.js"

const app = new App()
const render = new Render()



/*
A handleSearch function, which should call to the server and render new weather data for the specific city the user searched for.
Hint: This function needs to be async to work

An on click for your search button, which calls your handleSearch function as it's callback function
An on click for each of the save buttons that:
Saves that city in your DB
An on click for each of the remove buttons that:
Deletes that city from your DB
*/

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
loadPage()
