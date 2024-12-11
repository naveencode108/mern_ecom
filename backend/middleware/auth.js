import jwt from "jsonwebtoken";


export const isAuth=(req,res,next)=>{
     const token=req.cookies.admin_token;
     if(!token) return json({success:false,message:'you dont have access'});

     try{
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decode;
        return next();
     }
     catch(er){
        return res.json({success:false,message:er.message});
     }
}