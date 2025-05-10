import validator from "validator"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"

//API for controlling doctors

const addDoctor = async (req, res) => {
    try {
        console.log("Multer Middleware Reached");
        console.log("Request Headers:", req.headers);
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);
        console.log("Request Files:", req.files); // For multiple files

    if (!req.file) {
        return res.status(400).json({ success: false, message: "No image file uploaded" });
    }

    //res.status(200).json({ success: true, message: "Doctor added successfully", file: req.file });
    

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        // Upload image to Cloudinary
        const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path);
        const imageUrl = cloudinaryUpload.secure_url;
        

        const hashedPassword = await bcrypt.hash(password, 10);

        const doctorData = new doctorModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            degree: req.body.degree,
            experience: req.body.experience,
            about: req.body.about,
            fees: req.body.fees,
            speciality: req.body.speciality,
            address: JSON.parse(req.body.address), // Ensure it's valid JSON
            image: imageUrl,
            date: Date.now()
        });



    //    const doctor = new Doctor(req.body);
        await doctorData.save(); 

        return res.status(201).json({ success: true, message: "Doctor Added", doctor: doctorData });

    } catch (error) {
        console.error("Error adding doctor:", error);
        if (!res.headersSent) { // Prevent sending multiple responses
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
}


// const addDoctor = async (req, res) => {
//     try {
//         console.log("Multer Middleware Reached");
//         console.log("Request Headers:", req.headers);
//         console.log("Request Body:", req.body);
//         console.log("Request File:", req.file);
//         console.log("Request Files:", req.files);

//         if (!req.file) {
//             return res.status(400).json({ success: false, message: "No image file uploaded" });
//         }

//         const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;

//         if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
//             return res.status(400).json({ success: false, message: "Missing Details" });
//         }

//         // Upload image to Cloudinary
//         const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path);
//         const imageUrl = cloudinaryUpload.secure_url;

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const doctorData = new doctorModel({
//             name,
//             email,
//             password: hashedPassword,
//             degree,
//             experience,
//             about,
//             fees,
//             speciality,
//             address: JSON.parse(address),
//             image: imageUrl,
//             date: Date.now()
//         });

//         await doctorData.save();

//         return res.status(201).json({ success: true, message: "Doctor Added", doctor: doctorData });

//     } catch (error) {
//         console.error("Error adding doctor:", error);

//         // Prevent multiple responses
//         if (!res.headersSent) {
//             return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//         }
//     }
// };


//API for Admin login
const loginAdmin =  async(req,res) => {
    try {
        
        const {email, password } = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ){
         
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ success: true, token });
        } 
        else{
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};



//API to get all doctors list for the admin panel 
const allDoctors = async (req,res) => {

    try {
        
        const doctors = await doctorModel.find({}).select('-password');
        res.json({success:true,doctors});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }

}

//API to get all appointment list
const appointmentsAdmin = async(req,res) =>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const {appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        //releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to get dashboard data for  the admin panel 
const adminDashboard = async(req,res) => {
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})
        
        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard}


