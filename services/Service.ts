import axios from "axios";
export default {
    getCity(search: string, apiKeyCity: string) {
        return axios.get(`https://api.geoapify.com/v1/geocode/autocomplete?apiKey=${apiKeyCity}&text=${search}&type=city`);
    },
    getWeather(search: string, apiUrl: string, apiKey: string) {
        return axios.get(`${apiUrl}weather?q=${search}&units=metric&appid=${apiKey}`);
    },
    getDate(search: string, apiUrlDate: string, apiKeyDate: string) {
        return axios.get(`${apiUrlDate}apiKey=${apiKeyDate}&location=${search}`);
    },
}