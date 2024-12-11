import axios from 'axios'

const uri=import.meta.env.VITE_BASE_URI;

const instance=axios.create({
    baseURL:uri
});

export default instance