import {v2 as cloudinary} from cloudinary


cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
     api_key:  process.env.CLOUDINARY_API_KEY, 
     api_secret:  process.env.CLOUDINARY_API_SECRET
})

/** 
 * @param {String} localFilePath - The path to the local file to upload.
 * @returns {Object|null} - Cloudinary response object on success, or null on failure.
*/
const uploadToCloudinary =async (localFilePath) =>{
    try {
        if(!localFilePath){
            console.log("No file path is provided for cloudinary")
            return null;
        }

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto", // Auto-detect the file type (image, video, etc.)
        });

        fs.unlinkSync(localFilePath);
        return response; //this response will have the uploaded url

    } catch (error) {
        //if the upload fails remove the files from the server 
        console.error("Error uploading file to Cloudinary:", error);

        try {
            await fs.unlink(localFilePath);
            console.log(`Local file deleted: ${localFilePath}`);
        } catch (unlinkError) {
            console.error(`Failed to delete local file: ${localFilePath}`, unlinkError);
        }
        return null;
    }
}

export default uploadToCloudinary