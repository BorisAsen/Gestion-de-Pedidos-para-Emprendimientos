import React from "react";

const PreviewImage = ({ file, url }) => {
  const [preview, setPreview] = React.useState(null);

  React.useEffect(() => {
    // console.log("File:", file); // Agrega esta línea para imprimir el valor de file
    // console.log("URL:", url); // Agrega esta línea para imprimir el valor de url
    
    if (file instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreview(reader.result);
      };
    } else if (typeof url === 'string' && url.trim() !== '') {
      setPreview(url);
    }
  }, [file, url]);

  return (
    <div className="flex justify-center items-center w-60 my-4 mx-auto">
      {preview ? <img src={preview} alt="Preview" className="h-full" /> : "Cargando..."}
    </div>
  );
};

export default PreviewImage;
