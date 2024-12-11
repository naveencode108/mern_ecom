import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
   name: {
      type: String,
   },
   email: {
      type: String
   },
   password: {
      type: String
   },
   resetPasswordToken:{
      type:String,
      default:null
   },
   resetPasswordExpires:{
      type:Date,
      default:null
   },
   userImage:{
      type:String,
      default:'https://imgs.search.brave.com/wxLy7arqTfn8VJpNHhmSf2c8LdMwJ0KyzUxzpuJzPrY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMtMDAuaWNvbmR1/Y2suY29tL2Fzc2V0/cy4wMC9wZXJzb24t/aWNvbi01MTJ4NDgz/LWQ3cThocWo0LnBu/Zw'
   },
   role: {
      type: String,
      default: 'user'
   },
   cartData: [{
      productId: {
         type: mongoose.Types.ObjectId,
         ref: 'product'
      }, quantity: {
         type: Number,
         default: 1
      }
   }],
   wishlist:[{
      _id: false, 
      productId:{
         type:mongoose.Types.ObjectId,
         ref:'product'
      }
   }],
   address:[{
      name:String,
      pincode:String,
      landmark:String,
      street:String,
      houseno:String,
      phoneno:Number
   }]
});

export default mongoose.model('user', userSchema);