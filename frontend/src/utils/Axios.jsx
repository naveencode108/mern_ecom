import axios from 'axios'

const uri=import.meta.env.BASE_URI;
const instance=axios.create({
    baseURL:uri
});

export default instance