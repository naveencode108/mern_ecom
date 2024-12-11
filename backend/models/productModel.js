import mongoose  from "mongoose"


const productSchema=mongoose.Schema({
    productName:{
        type:String
    },
    productDesc:{
        type:String
    },
    productPrice:{
        type:Number
    },
    productImagesurl:{
        type:[]
    },
    stock:{type:Number},
    category:{type:String},
     
    reviews:[{
        _id:false,
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        rating:{
            type:Number
        },
        reviewText:{
            type:String
        },
        reviewImage:[{
            type:String
        }],
        reviewVideo:[{
            type:String
        }],
        reviewData:{
            type:Date,
            default:Date.now
        }
    }]
})
export default mongoose.model('product',productSchema)