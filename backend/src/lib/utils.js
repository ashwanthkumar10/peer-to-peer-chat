import  jwt from "jsonwebtoken"

//creating the jwt token 
export const generateToken = (userId , res) =>{
    const token = jwt.sign ({userId}, process.env.JWT_SECRET ,{
        expiresIn:"7d" //tolen expires in 7 days
    });


    res.cookie("jwt", token ,{
        maxAge : 7 * 24 * 60 * 60 * 1000 , // 7 days in milli seconds
        httpOnly:true,
        sameSite:"strict", // prevents XSS attacks cross-site scripting attacks
        secure:process.env.NODE_ENV !== "development"

    });

return token;
    }
