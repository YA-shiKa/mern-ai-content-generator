const errorHandler=(err,req,res,next)=>{
    const statusCode=res.statusCode===2000?500:res.statusCode;
    res.status(statusCode);
    res.json({
        message:err.message,
        stack: process.env.NODE_ENV==="development"?err.stack:{},


    });
};
module.exports={
    errorHandler,
};