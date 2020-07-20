export class Render{
  constructor(){
    this.citiesTemplate = Handlebars.compile($('#cities-template').html())
    this.mainCityTemplate = Handlebars.compile($('#mainCity-template').html())
  }
  renderData(data){
    const templateHTML = this.resultsTemplate({ data })
    $('#results').append(templateHTML)
  }
  renderMainArea(data){
    console.log(data)
    const templateHTML = this.mainCityTemplate(data)
    $('#main-city-container').empty().append(templateHTML)
  }
}