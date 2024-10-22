import { Router } from 'express'
import {uploader,procesaErrores} from '../utils.js'
import ProductsManager from "../dao/productsManager.js";

const router = Router()
const ProductM = new ProductsManager("products.json");

router.get("/", async (req, res) => {
  try {
    const products = await ProductM.getProducts();
    let limit = parseInt(req.query.limit);
    if (limit && limit <= products.length) {
      products.length=limit
    }
    res.setHeader('Content-Type','application/json');
    return  res.status(200).send(products);
   
  } catch (error) {
    procesaErrores(res,error)
  }
});



router.get("/:pid", async (req, res) => {
  let {pid}=req.params
  pid=Number(pid) 
  if(isNaN(pid)){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`El id debe ser numérico`})
  }
  try {
    console.log('entra')
    let product=await ProductM.getProductById(pid)
    if(!product){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error:`No existe producto con id ${pid}`})
    }
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({product});
  } catch (error) {
   procesaErrores(res,error)
  }
});

router.post('/', uploader.single('file'), async (req, res) => {
  // if (!req.file) {
  //   return res.status(400).send({ status: "error", error: "No se encontró el archivo" });
  // }
try{
  let {title, description, code, price, stock, category}=req.body
  let thumbnail= [req.file.path?req.file.path:''];
  let status=true
  res.status(200).send( await ProductM.addProduct(title, description,parseInt( price), thumbnail, status, code,  parseInt(stock),category))
  console.log(req.file)
}   catch (error) {
   procesaErrores(res,error)
  }
});

router.put("/:pid", async (req, res) => {
  let {pid}=req.params
  pid=Number(pid) 
  if(isNaN(pid)){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`El id debe ser numérico`})
  }
  try {
    let product=await ProductM.getProductById(pid)
    if(!product){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error:`No existe producto con id ${pid}`})
    }
    let {entry, value}= req.body;
    res.setHeader('Content-Type','application/json');
    return res.status(200).send(await ProductM.updateProduct(pid, entry, value));
  } catch (error) {
   procesaErrores(res,error)
  }
});
router.delete("/:pid", async (req, res) => {
  try {
    res.status(200).send(await ProductM.deleteProduct(parseInt(req.params.pid)));
  } catch (error) {
   procesaErrores(res,error)
  }
});
export default router