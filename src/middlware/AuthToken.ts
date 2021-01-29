import { Request, Response, NextFunction } from "express"
import * as jwt from "jsonwebtoken"
import authConfig from "../config/authConfig"


class AuthToken {
    
    generateToken(params = {}){
    //TODO: mudar para 5 min
        return jwt.sign(params, authConfig.secret, { expiresIn : 86400 })
    }

    validateToken(request: Request, response: Response, next: NextFunction){
        const authHeader = request.headers.authorization
    
        if(!authHeader){
            return response.status(401).send({error: 'No token provided'})
        }
    
        let parts = []
        parts = authHeader.split(' ')
    
        if(parts.length != 2){
            return response.status(401).send({error: 'Token error'})
        }
    
        const [scheme, token ] = parts
    
        if (!/^Bearer$/i.test(scheme)){
            return response.status(401).send({error: 'Token malformatted'})
        }

        let jwtPayload;
    
        try {
            jwtPayload = jwt.verify(token, authConfig.secret)    
        } catch (error) {
            return response.status(401).send({error: 'Token invalid'})            
        }

        response.locals.jwtPayload = jwtPayload
    
        next()
    }

}

export default AuthToken
