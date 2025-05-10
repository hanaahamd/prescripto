import express from 'express';
import upload from '../middlewares/multer.js';
import {addDoctor, allDoctors, loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard} from '../controllers/adminController.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';

const router = express.Router();





// router.post('/add-doctor', upload.single('image'), (req, res) => {
//     console.log("Incoming Request in Route!");
//     console.log("Request Body:", req.body);
//     console.log("Request File:", req.file);

//     if (!req.file) {
//         return res.status(400).json({ message: "No image file uploaded" });
//     }

//     addDoctor(req, res); // Directly call addDoctor without next()
// });


router.post("/add-doctor", upload.single("image"), async (req, res) => {
    try {
        console.log("File:", req.file);

        if (!req.file) {
            return res.status(400).json({ message: "File upload failed" });
        }

        await addDoctor(req, res); // ✅ Ensure `addDoctor` handles response correctly

    } catch (error) {
        console.error("Unexpected error:", error);
        if (!res.headersSent) { // ✅ Check before sending response
            res.status(500).json({ message: "Something went wrong" });
        }
    }
});




router.post('/login',loginAdmin);
router.post('/all-doctors',allDoctors);
router.post('/change-availability',changeAvailability);
router.post('/appointments',appointmentsAdmin);
router.post('/cancel-appointment',appointmentCancel);
router.get('/dashboard',adminDashboard);


export default router;
