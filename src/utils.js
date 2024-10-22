import {fileURLToPath} from 'url'
import { dirname } from 'path'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//middleware apra cargar archivo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //ubicacion del archivo
      cb(null, __dirname +"/public/img");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    } 
  });
  export const procesaErrores=(res, error)=>{
    console.log(error);
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
        {
            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle:`${error.message}`
        }
    )
}
 export const uploader = multer({ storage });
 export default __dirname