import { Router } from 'express'
import CartManager from "../dao/cartsManager.js";
import ProductsManager from "../dao/productsManager.js";
import { procesaErrores } from '../utils.js';
const router = Router()

const Carts1 = new CartManager("carts.json");
const ProductM = new ProductsManager("products.json");

router.post('/', async (req, res) => {
    try{
      res.status(200).send( await Carts1.addCart())
    }   catch (error) {
      procesaErrores(res,error)
      }
    });

router.get("/:cid", async (req, res) => {
  try {
    res.status(200).send(await Carts1.getCartById(parseInt(req.params.cid)));
  } catch (error) {
  procesaErrores(res,error)
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try{
       res.status(200).send(await Carts1.updateCart(parseInt(req.params.pid),parseInt(req.params.cid)))
    }   catch (error) {
      procesaErrores(res,error)
      }
    });
    


router.get("/", async (req, res) => {
  try {
    const carts = await Carts1.getCarts();
    let limit = parseInt(req.query.limit);
    if (limit && limit <= carts.length) {
      carts.length=limit
    }
      res.status(200).send(carts);
  } catch (error) {
   procesaErrores(res,error)
  }
});

export default router