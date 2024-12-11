import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const isAdmin = async (req, res, next) => {
    try {

        let token = req.cookies.admin_token;
        if (!token) return res.json({ message: 'you dont have token' });

        let { email } = jwt.verify(token, process.env.JWT_SECRET);

        if (email == process.env.SUPERADMIN_EMAIL) {
            req.admin=email;
            
            return next();
        }
        else {
            const isNormaladmin = await userModel.findOne({ email });
            if (isNormaladmin && isNormaladmin.role == 'admin') {
                req.admin=email;
                return next();
            }
            else {
                return res.json({ message: 'you dont have authority' });
            }
        }
    }
    catch (er) {
        return res.json({ message: er.message });
    }
}