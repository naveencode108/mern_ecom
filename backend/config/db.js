import mongoose from 'mongoose'

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/e_commerce`)
        console.log('connected to db');
    }
    catch (er) {
        console.log(er.message);
    }
})();

export default mongoose.connection;


