const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({ 
  cloud_name: 'dwcp1jtow', 
  api_key: '326729192838599', 
  api_secret: 'z0MtEl4GrQpF0YYacsy0c185aiE' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("file not found");
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        console.log("file uploaded on cloudinary", response.url);
        return response;
    } catch (e) {
        //remove the locally saved temporary files when the upload operation is failed
        fs.unlinkSync(localFilePath);
        return null;
    }
};

module.exports = { uploadOnCloudinary };
