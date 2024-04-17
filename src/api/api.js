import axios from 'axios'
const local = 'http://localhost:5000'
const production = 'https://nile-hope-3.onrender.com'         

const api = axios.create({
    baseURL: `${production}/api`,
    withCredentials : true
})
export default api 