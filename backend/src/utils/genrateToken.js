import jwt from "jsonwebtoken"
import { config } from "../config"


const genrateAccessToken = (payload)=>{
    return jwt.sign(payload,config.jwtSecret,{expiresIn:config.jwtExpIn})
}

const genrateRefreshToken = (payload) =>{
    return jwt.sign(payload,config.jwtRefreshSecret,{expiresIn:config.jwtRefreshExpIn})
}

export {
    genrateAccessToken,
    genrateRefreshToken
}