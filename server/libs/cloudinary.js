import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary} from 'cloudinary';

// Datos para conectarse con la cuenta donde se subiran las imagenes
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Subir una imagen a cloudinary
export const uploadImage = async filePath => {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'Willow - Programa de Gestion (Products Images)'
    })
}

// Eliminar una imagen de cloudinary
export const deleteImage = async id => {
    return await cloudinary.uploader.destroy(id)
}
