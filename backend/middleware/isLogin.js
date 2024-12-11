import jwt from "jsonwebtoken";

export const isLogin=(req,res,next)=>{
    
      const token=req.cookies.user_token;
      if(!token) return res.json({success:false,message:'you need to login!!'}); 

      const decodedUser=jwt.verify(token,process.env.JWT_SECRET);
      req.user=decodedUser;
      next();

}