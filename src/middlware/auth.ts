import * as jwt from "jsonwebtoken"
import auth from "../config/auth"

const generateToken = (params = {}) =>{
    //TODO: mudar para 5 min
    return jwt.sign(params, auth.secret, { expiresIn : 86400 })
}

export default generateToken