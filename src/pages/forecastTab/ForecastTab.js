import React, {useState, useEffect} from 'react';
import './ForecastTab.css';
import axios from "axios";

const apiKey = '4b8466682d07ef8592271c0136a98757';

function ForecastTab({coordinates}) {
  const [ forecast, setForecast ] = useState([]);
  const [error, toggleError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      toggleError(false);
      try {
        const result = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,current,hourly&appid=${apiKey}&lang=nl`);
        console.log(result.data);
        setForecast(result.data.daily.slice(1, 6));
      } catch (e) {
        console.error(e);
        toggleError(true);
      }
    }

    if (coordinates) {
      fetchData();
    }

  }, [coordinates]);

  function createDateString(timestamp) {
    const day = new Date(timestamp * 1000);
    return day.toLocaleDateString('nl-NL', { weekday: 'long'});
  }

  return (
    <div className="tab-wrapper">
      {error &&
        <span>
          Er is iets misgegaan bij het ophalen van de data
        </span>
      }

      {forecast.length === 0 && !error &&
        <span className="no-forecast">
          Zoek eerst een locatie om het weer voor deze week te bekijken
        </span>
      }

      {forecast && forecast.map((day) => {
        return (
          <article className="forecast-day">
            <p className="day-description">
              {createDateString(day.dt)}
            </p>

            <section className="forecast-weather">
            <span>
              {day.temp.day}
            </span>
              <span className="weather-description">
              {day.weather[0].description}
            </span>
            </section>
          </article>
        )
        })}
    </div>
  );
};

export default ForecastTab;
