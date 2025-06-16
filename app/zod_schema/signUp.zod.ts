import * as zod from 'zod' ;


const signUpZodSchema = zod.object({
    username : zod.string().min(3, "Username should not be less than 3 characters !").max(30, "Username should be less than 30 characters") , 
    password : zod.string().min(8, "Password should be longer than 8 characters! ") 
})

export default signUpZodSchema