const errorHandler=(err,req,res,next)=>{
    console.log("error handling triggered !!");
const statuscode=res.statuscode ? res.statuscode:500;
switch (statuscode) {
    case 200:
        res.json({
            title:"internal error",
            message:"internal server issue"
        });
        break;
    case 404:
        res.json({
            title:"No Record",
            message:"No record found !!"
        });
        break;
    default:
        res.json({title:"default case!!",message:"default"});
        break;
}
};

module.exports = errorHandler;