import cloudinary from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const projectName = "Ecommerce-Store";

const uploadToCloudinary = async(filePath)=>{
try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: `profile/${projectName}`,
      resource_type:"auto"
    });

    fs.unlinkSync(filePath); // delete local server file
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
}

export default uploadToCloudinary