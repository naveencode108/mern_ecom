import axios from 'axios'

const uri=import.meta.env.VITE_BACKEND_URI
const instance=axios.create({
    baseURL:uri
});

export default instance