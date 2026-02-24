
import jwt from "jsonwebtoken"
const fetchUser = async(req, res, next)=>{
    try {
        const token = req.header("Authorization")
        if(!token){
            return res.status(401).json({success:false, error:"Please authenticate using a valid token"})
        }
        const jwt_secret = process.env.JWT_SECRET
        const data = jwt.verify(token, jwt_secret)
        req.user=data.user
        next()
    } catch (error) {
            return res.status(401).json({error:"Please authenticate using a valid token"})
    }
}

export default fetchUser