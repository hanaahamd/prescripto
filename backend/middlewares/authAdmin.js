// import jwt from 'jsonwebtoken'

// //admin authentication middleware
// const authAdmin = async(req,res,next) => {
//     try {
       
//         const {atoken} = req.headers
//         if(!atoken){
//             return res.json({success:false,message:'Not Authorized Login Again'})
//         }
//         const token_decode = jwt.verify(atoken,process.env.JWT_SECRET)

//         if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
//             return res.json({success:false,message:'Not Authorized Login Again'})
//         }
//         next();
        
//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }
// }

// export default authAdmin


import jwt from 'jsonwebtoken'

const authAdmin = (req, res, next) => {
    console.log("🔥 Full Request Headers:", req.headers); // Debugging
    console.log("🔥 Authorization Header:", req.headers.authorization);

    if (!req.headers.authorization) {
        return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        console.log("✅ Decoded Token:", decoded);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authAdmin;



// import jwt from 'jsonwebtoken'
// const authAdmin = (req, res, next) => {
//     console.log("🔥 Full Request Headers:", req.headers); // Debugging
//     console.log("🔥 Authorization Header:", req.headers.authorization);

//     if (!req.headers.authorization) {
//         return res.status(401).json({ success: false, message: "Authorization header missing" });
//     }

//     const token = req.headers.authorization.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ success: false, message: "Token missing" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.admin = decoded;
//         console.log("✅ Decoded Token:", decoded);
//         next();
//     } catch (error) {
//         return res.status(401).json({ success: false, message: "Invalid or expired token" });
//     }
// };

// export default authAdmin;



