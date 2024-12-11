import mongoose from 'mongoose'

const orderSchema = mongoose.Schema({
   userId: String,
   Products: [{
      productId: String,
      productName: String,
      productDesc: String,
      productPrice: Number,
      productImagesurl: String,
      quantity:Number
   }],
   address: {
      addressId: String,
      name: String,
      pincode: String,
      landmark: String,
      street: String,
      houseno: String,
      phoneno: Number
   },
   totalPrice: Number,
   paymentStatus: String,
   paymentId:String,
   orderStatus: {
      type: String,
      default: 'pending'
   }
})

export default mongoose.model('order', orderSchema);