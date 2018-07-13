// SLACK WEATHER FORECAST WEBHOOK

// NOTE ABOUT THE SLACK WEATHER FORECAST WEBHOOK
// IN ORDER TO MAKE THE SLACK WEBHOOK RUN THE FOLLOWING SLACK SHOULD BE TYPED INTO SLACK weather, cityName
const axios = require('axios');

module.exports = function (context, done) {
  // Grab the cityName typed into slack and remove the prefix weather,
  const citySearch = context.body.text.replace('weather,', '');
  // Encode the city name for the API request
  const encodedCitySearch = encodeURI(citySearch);
  // World Weather Online API Token
  const token = context.secrets.worldWeatherOnlineKey

  axios.get(`http://api.worldweatheronline.com/premium/v1/weather.ashx?key=${token}&q=${encodedCitySearch}&format=json`)
    .then((response) => {
      const queryLocation = response.data.data.request[0].query;
      const currentCondition = response.data.data.current_condition;
      let temp = null
      let feelsLikeTemp = null
      let weatherDesc = null
      let humidity = null
      let windDirection = null
      let windSpeedMph = null

      // Loop over the current condition array and set all variables with their data
      currentCondition.map((res) => {
        temp = res.temp_F
        feelsLikeTemp = res.FeelsLikeF
        weatherDesc = res.weatherDesc[0].value
        humidity = res.humidity
        windDirection = res.winddir16Point
        windSpeedMph = res.windspeedMiles
      })

        // Send the following response back to Slack
        done(null, { text: `*Today's Weather Forecast at ${queryLocation}* \n
        Description: ${weatherDesc} \r
        Current Temperature: ${temp}\xB0 F \r
        Feels Like: ${feelsLikeTemp}\xB0 F \r
        Humidity: ${humidity}%
        Wind: ${windDirection} ${windSpeedMph}mph \r`, "attachments": [
        {
            "text": "*Need a coding break?* \n Make a selection",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "game",
                    "text": "Chess",
                    "type": "button",
                    "value": "chess",
                    "url": "https://www.chess.com/play/computer"
                },
                {
                    "name": "music",
                    "text": "Chill Music",
                    "style": "primary",
                    "type": "button",
                    "value": "chillMusic",
                    "url": "https://www.youtube.com/watch?v=8iU8LPEa4o0&t=2279s"
                }
            ]
        }
    ]
  });
    })
    .catch((error) => {
      console.log(error)
    })
};
