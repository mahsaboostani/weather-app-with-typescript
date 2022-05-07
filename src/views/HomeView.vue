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
    <div v-if="search">
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
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  data() {
    return {
      apiKey: "a9cfcebffa1dd461fc17139b19ddf402" as string,
      apiUrl: "https://api.openweathermap.org/data/2.5/" as string,
      apiKeyDate: "cc811118deff4a44b57c1b9dd9f187c4" as string,
      apiUrlDate: "https://api.ipgeolocation.io/timezone?" as string,
      search: "" as string,
      weather: {} as any,
      date: {} as any,
      rain: false as boolean,
    };
  },
  methods: {
    fetchWeather(e: any) {
      if (e.key === "Enter") {
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
            return response.data;
          })
          .then((results) => console.log(results.data));
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
