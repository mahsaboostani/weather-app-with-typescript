<template>
  <div :class="{ rainy: rain }" id="app">
    <header>
      <h1>Weather App</h1>
    </header>
    <div class="search">
      <input
        @input="fetchCity"
        @change="fetchWeather"
        v-model="search"
        class="search-bar"
        type="text"
        placeholder="Search..."
        list="browsers"
        name="browser"
      />
      <datalist v-if="isOpen" id="browsers">
        <option
          v-for="city in cities"
          :key="city.index"
          :value="[city.city, getFirstLetters(city.country)]"
        >
          {{ city.county }},{{ city.country }}
        </option>
      </datalist>
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
    <h1 v-if="error">The weather status is not accessible.</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Service from "@/../services/Service";

export default defineComponent({
  data() {
    return {
      apiKey: process.env.VUE_APP_API_KEY_WEATHER as string,
      apiUrl: "https://api.openweathermap.org/data/2.5/" as string,
      apiKeyDate: process.env.VUE_APP_API_KEY_DATE as string,
      apiUrlDate: "https://api.ipgeolocation.io/timezone?" as string,
      apiKeyCity: process.env.VUE_APP_API_KEY_CITY as string,
      search: "" as string,
      weather: {} as any,
      date: {} as any,
      rain: false as boolean,
      enter: false as boolean,
      error: false as boolean,
      cities: [] as any,
      res: {} as any,
      isOpen: false as boolean,
      index: "" as string,
    };
  },

  methods: {
    async fetchCity() {
      // const language =
      //   window.navigator.userLanguage || window.navigator.language;
      if (this.search.length >= 3) {
        this.isOpen = true;
        await Service.getCity(this.search, this.apiKeyCity)
          .then((response: any) => {
            this.cities = [];
            this.res = response.data;
            for (let i = 0; i < this.res.features.length; i++) {
              const curCity: string = this.res.features[i].properties.city;
              const curCounty: string = this.res.features[i].properties.county;
              if (curCity && curCounty) {
                this.cities.push({
                  city: this.res.features[i].properties.city,
                  country: this.res.features[i].properties.country,
                  county: this.res.features[i].properties.county,
                });
              }
            }
            this.cities = [
              ...new Map(
                this.cities.map((item: object) => [JSON.stringify(item), item])
              ).values(),
            ];
            console.log(this.cities);
          })
          .catch((error: any) => {
            console.log(error);
          });
        console.log("r", this.res);

        console.log("c", this.cities);
      }
    },

    fetchWeather() {
      this.isOpen = false;
      this.error = false;
      Service.getWeather(this.search, this.apiUrl, this.apiKey)
        .then((response: any) => {
          this.weather = response.data;
          this.enter = true;
          this.rain = false;
          if (this.weather.weather[0].main === "Rain") {
            this.rain = true;
          }
          console.log(response.data);
          return response.data;
        })
        .catch((error: any) => {
          console.log(error);
          this.error = true;
        });
      Service.getDate(this.search, this.apiUrlDate, this.apiKeyDate).then(
        (response: any) => {
          this.date = response.data;
        }
      );
      // this.search = "";
    },

    getFirstLetters(str: string): string {
      if (str.split(" ").length === 2) {
        const firstLetters: string = str
          .split(" ")
          .map((word) => word[0])
          .join("");
        return firstLetters;
      } else {
        const firstLetters: string = str.substring(0, 2);
        return firstLetters;
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
