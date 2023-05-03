import React from "react";

const PreviewImage = ({file}) => {
    const [preview, setPreview] = React.useState(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        setPreview(reader.result);
    };

    return (
        <div className="flex justify-center items-center w-60 my-4 mx-auto" >
            {
                preview ? <img src={preview} alt="Preview" className="h-full"/> : "Cargando..."
            }
        </div>
    );
};

export default PreviewImage;