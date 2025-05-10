// import mongoose from "mongoose";

// const connectDB = async() => {

//     mongoose.connection.on(`connected`, () => console.log("Database Connected"))

//     await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)
// }

// export default connectDB



import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/prescripto";
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Database Connection Failed:", error);
        process.exit(1);
    }
};

export default connectDB;
