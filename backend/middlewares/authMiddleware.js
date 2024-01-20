import jwt from 'jsonwebtoken';

// create validation for worker routes
export const validateWorkerAndAdmin = (req,res,next) =>{
    const accessToken = req.cookies.accessToken;

    if(accessToken){
        // verify the token if exist
        jwt.verify(accessToken,process.env.SECRET_KEY,(err,decode)=>{
            if(err){
                console.log(err.message);
                res.status(403).json({error:"Token was changed by someone"})
            }else{
                if(decode.role === "ADMIN" || decode.role === "WORKER"){
                    next();
                }else{
                    res.status(403).json({error:"Unknown user"});
                }
            }
        })
    }else{
        res.status(403).json({error:"Token was not found!"});
    }
}

//validate admin routes
export const validateAdmin = (req,res,next) =>{
    const accessToken = req.cookies.accessToken;

    if(accessToken){
        // verify the token if exist
        jwt.verify(accessToken,process.env.SECRET_KEY,(err,decode)=>{
            if(err){
                console.log(err.message);
                res.status(403).json({error:"Token was changed by someone"})
            }else{
                if(decode.role === "ADMIN"  ){
                    next();
                }else{
                    res.status(403).json({error:"Unknown user"});
                }
            }
        })
    }else{
        res.status(403).json({error:"Token was not found!"});
    }
}