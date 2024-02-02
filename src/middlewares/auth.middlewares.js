import jwt from 'jsonwebtoken'
import User from '../../DB/model/user.model.js'

export const auth = (accessRoles) => {
    return async (req, res, next) => {
        try {
            const { accesstoken } = req.headers
            if (!accesstoken) return next(new Error('please login first', { cause: 400 }))

            if (!accesstoken.startsWith(process.env.TOKEN_PREFIX)) return next(new Error('invalid token prefix', { cause: 400 }))

            const token = accesstoken.split(process.env.TOKEN_PREFIX)[1]

            const decodedData = jwt.verify(token, process.env.TOKEN)

            if (!decodedData || !decodedData.id) return next(new Error('invalid token payload', { cause: 400 }))

            // user check 
            const findUser = await User.findById(decodedData.id)
            if (!findUser) return next(new Error('please signUp first', { cause: 404 }))
            // authorization check
            if (accessRoles && !accessRoles.includes(findUser.role)) return next(new Error('your not allowed to access', { cause: 404 }))
            req.authUser = findUser
            next()
        } catch (error) {
            next(new Error('catch error in auth middleware', { cause: 500 }))
        }
    }
}
