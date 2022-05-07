<template>
  <div id="app" :class="{ rainy: rain }">
    <header>
      <h1>Weather App</h1>
    </header>
    <div class="search">
      <input
        v-model="search"
        @keypress="fetchWeather"
        class="search-bar"
        type="text"
        placeholder="Search..."
      />
    </div>
    <div v-if="enter && !error">
      <div class="location-box">
        <div class="location">
          {{ weather.name }}, {{ weather.sys.country }}
        </div>
        <div class="date">{{ date.date_time }}</div>
      </div>
      <div class="weather-box">
        <div class="temp">{{ Math.round(weather.main.temp) }}°C</div>
        <div class="weather">{{ weather.weather[0].main }}</div>
      </div>
    </div>
    <h1 v-if="error">The city did not find.</h1>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  data() {
    return {
      apiKey: process.env.VUE_APP_API_KEY_WEATHER as string,
      apiUrl: "https://api.openweathermap.org/data/2.5/" as string,
      apiKeyDate: process.env.VUE_APP_API_KEY_DATE as string,
      apiUrlDate: "https://api.ipgeolocation.io/timezone?" as string,
      search: "" as string,
      weather: {} as any,
      date: {} as any,
      rain: false as boolean,
      enter: false as boolean,
      error: false as boolean,
    };
  },
  methods: {
    fetchWeather(e: any) {
      this.error = false;
      if (e.key === "Enter") {
        this.enter = true;
        axios
          .get(
            `${this.apiUrl}weather?q=${this.search}&units=metric&appid=${this.apiKey}`
          )
          .then((response) => {
            this.weather = response.data;

            this.rain = false;
            if (this.weather.weather[0].main === "Rain") {
              this.rain = true;
            }
            console.log(response.data);
            return response.data;
          })
          .catch((error) => {
            console.log(error);
            this.error = true;
          });
        axios
          .get(
            `${this.apiUrlDate}apiKey=${this.apiKeyDate}&location=${this.search}`
          )
          .then((response) => {
            this.date = response.data;
          });
      }
    },
  },
});
</script>
<style scoped>
#app {
  background-image: url(../assets/sunny.jpg);
  height: 100vh;

  background-size: cover;
  background-repeat: no-repeat;
}
#app .rainy {
  background-image: url(../assets/rainy.jpg);
  height: 100vh;

  background-size: cover;
  background-repeat: no-repeat;
}
.search .search-bar {
  width: 50%;
  padding: 11px;
  align-items: center;
  font-size: 20px;
  border: none;
  border-radius: 0px 16px 0px 16px;
  background-color: rgba(255, 255, 255, 0.7);
  outline: none;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
}
.location-box .location {
  color: rgb(255, 255, 255);
  font-size: 40px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.5);
  margin-top: 50px;
}
.location-box .date {
  color: rgb(225, 241, 253);
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.5);
  font-style: italic;
}
.weather-box .temp {
  display: inline-block;
  padding: 10px 25px;
  color: #fff;
  font-size: 80px;
  font-weight: 600;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 16px;
  margin: 30px 0px;
}
.weather-box .weather {
  color: rgb(255, 255, 255);
  font-size: 40px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.5);
}
</style>
