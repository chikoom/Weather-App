export class Render{
  constructor(){
    this.weatherTemplate = Handlebars.compile($('#weather-template').html())
  }
  renderData(data){
    const templateHTML = weatherTemplateTemplate({ data })
    $('#results').append(templateHTML)
  }
}