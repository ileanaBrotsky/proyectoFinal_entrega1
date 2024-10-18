import { Router } from 'express'
import {uploader} from '../utils.js'
import ProductManager from "../../productsManager.js";

const router = Router()

const Products1 = new ProductManager("products.json");

router.get("/", async (req, resp) => {
  try {
    const products = await Products1.getProducts();
    let limit = parseInt(req.query.limit);
    if (limit && limit <= products.length) {
      products.length=limit
    }
      resp.status(200).send(products);
   
  } catch (error) {
     console.log("hubo un error: ", error);
  }
});



router.get("/:pid", async (req, resp) => {
  try {
    resp.status(200).send(await Products1.getProductById(parseInt(req.params.pid)));
  } catch (error) {
    console.log("hubo un error: ", error);
  }
});

router.post('/', uploader.single('file'), async (req, resp) => {
  if (!req.file) {
    return resp.status(400).send({ status: "error", error: "No se encontró el archivo" });
  }
try{
  let {title, description, code, price, stock, category}=req.body
  let thumbnail= [req.file.path];
  let status=true
  resp.status(200).send( await Products1.addProduct(title, description,parseInt( price), thumbnail, status, code,  parseInt(stock),category))
  console.log(req.file)
}   catch (error) {
    console.log("hubo un error: ", error);
  }
});

router.put("/:pid", async (req, resp) => {
  try {
    let {entry, value}= req.body
    resp.status(200).send(await Products1.updateProduct(parseInt(req.params.pid), entry, value));
  } catch (error) {
    console.log("hubo un error: ", error);
  }
});
router.delete("/:pid", async (req, resp) => {
  try {
    resp.status(200).send(await Products1.deleteProduct(parseInt(req.params.pid)));
  } catch (error) {
    console.log("hubo un error: ", error);
  }
});
export default router