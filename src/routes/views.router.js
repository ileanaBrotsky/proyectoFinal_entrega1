import { Router } from "express";
import {procesaErrores} from '../utils.js'
import ProductsManager from "../dao/productsManager.js";

const router = Router();
const ProductM = new ProductsManager("products.json");

router.get("/", async (req, res) => {
  let  user={ name:'Ile'}
  try {
    const products = await ProductM.getProducts();
    let limit = parseInt(req.query.limit);
    if (limit && limit <= products.length) {
      products.length=limit
    }
    //res.setHeader('Content-Type','application/json');
    return  res.status(200).render('home',{user, products, style:'index.css'});
   
  } catch (error) {
    procesaErrores(res,error)
  }
});


//=============CRUD CON SOCKETS=====================//
router.get('/realtimeproducts',async (req, res)=>{
  try {
    const products = await ProductM.getProducts();
      let limit = parseInt(req.query.limit);
      if (limit && limit <= products.length) {
        products.length=limit
      }
        res.status(200).render('realTimeProducts',{products:products, style:'index.css'});
     
    } catch (error) {
       console.log("hubo un error: ", error);
    }
})

//=============================================================//

export default router;
