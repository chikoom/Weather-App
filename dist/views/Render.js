export class Render{
  constructor(){
    this.citiesTemplate = Handlebars.compile($('#cities-template').html())
    this.mainCityTemplate = Handlebars.compile($('#mainCity-template').html())
  }
  renderData(data){
    const templateHTML = this.citiesTemplate({ data })
    $('#saved-cities-container').empty().append(templateHTML)
  }
  renderMainArea(data){
    const templateHTML = this.mainCityTemplate(data)
    $('#main-city-container').empty().append(templateHTML)
  }
}

Handlebars.registerHelper('imgUrlFormatter', function(opts) {
  return opts.fn(this).replace(' ', '-')
})
Handlebars.registerHelper('tempFormatter', function(opts) {
  let temp = opts.fn(this)
  temp = temp.split('.')[0]+'°'
  return temp
})
Handlebars.registerHelper('lastUpadte', function(opts) {
  const aestTime = new Date(opts.fn(this)).toLocaleString("en-US", {timeZone: "Asia/Jerusalem"})
  return aestTime
})
