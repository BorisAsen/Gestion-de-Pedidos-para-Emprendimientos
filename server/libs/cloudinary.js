import { v2 as cloudinary} from 'cloudinary'

// Datos para conectarse con la cuenta donde se subiran las imagenes
cloudinary.config({
    cloud_name: "dg1dyjyid",
    api_key: "165162932852235",
    api_secret: "jHwby9QNrpx8W3VSbegYmL2EZf0"
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
