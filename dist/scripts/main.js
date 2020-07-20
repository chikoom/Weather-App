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
    console.log(position)
    return app.getCityLatLon(position.coords.latitude,position.coords.longitude)
  }).then(data => {
    render.renderMainArea(data)
  })
  .catch(err => {
    console.error(err.message)
  })
  //const data = await app.getDataFromDB()
  //render.renderData(data)
}

const handleSearch = async (cityName) => {
  app.getCityData(city)
}

loadPage()
