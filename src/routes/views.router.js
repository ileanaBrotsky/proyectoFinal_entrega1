import { Router } from 'express'
import {ProductsMongooseManager as ProductsManager }from '../dao/productsMongooseManager.js';
import {CartsMongooseManager as CartsManager}from '../dao/cartsMongooseManager.js';
import { MessagesMongooseManager } from '../dao/messagesMongooseManager.js';

const router = Router();
//====================================================================//
//  PRODUCTS 
// Ver todos los productos con accion agregar al carrito, con aggregate y pagination
router.get("/", async (req, res) => {
  let limit =parseInt(req.query?.limit)||10
  let page=parseInt(req.query?.page) || 1
  let sort=parseInt(req.query?.sort)||1
  //example price,500
  const queryParams= req.query?.query||''
 
 console.log("la queryParams", queryParams)
 let queryMongo={};
  if(queryParams){
   let field= queryParams.split(",")[0]
   let value= queryParams.split(",")[1]
    
   if(!isNaN(parseInt(value))) value= parseInt(value)
 
   queryMongo[field]=value
 console.log("la query de mongo es", queryMongo)
  }
 try {
let products= await ProductsManager.getProducts([ {$match: {queryMongo}},{$limit: limit}, {$sort: {price: sort}} ])
res.render("products", { products });
 } catch (error) {
   console.log("cannot get products with mongoose", error);
 }
});

// Ver todos los productos con PAGINACION
router.get("/products_paginated", async (req, res) => {
 let limit =parseInt(req.query?.limit)||10
  let page=parseInt(req.query?.page) || 1
  let sort=parseInt(req.query?.sort)||1
  //example price,100
  const queryParams= req.query?.query||''
 //  console.log("la queryParams", queryParams)
 let queryMongo={};
  if(queryParams){
   let field= queryParams.split(",")[0]
   let value= queryParams.split(",")[1]
    
   if(!isNaN(parseInt(value)))  {
     value= parseInt(value)
   }
   queryMongo[field]=value
 console.log("la query de mongo es", queryMongo)
  }
try {
    const result = await  ProductsManager.getProductsPaginates(queryMongo,limit, page, sort);
res.render("products_paginated", result);
} catch (error) {
  console.log("cannot get products with mongoose", error);
}
});


// vista para editar productos con disparadores de acciones
router.get("/edit_products", async (req, res) => {
 try {
   const products = await  ProductsManager.getProducts();
   res.render('edit_products',{products})
 } catch (error) {
   console.log("cannot get products with mongoose", error);
 }
});
// Vista para agregar nuevo producto
router.get("/create", async (req, res) => {
 res.render("create", {});
});

// Vista para modificar producto existente
router.get("/update/:id", async (req, res) => {
 const id = req.params.id;
 try {
   const productSelected = await ProductsManager.getProductBy({ _id: id });
   res.render("update", { product: productSelected });
 }
 catch (error) 
 {
   console.log("cannot update products", error);
 }
});
//Vista para ver un producto
router.get("/product/:id", async (req, res) => {
  const id = req.params._id;
 try {
   const productSelected = await  ProductsManager.getProductBy({ _id: id });
   res.render("product_view", { productSelected:productSelected });
 }
 catch (error) 
 {
   console.log("cannot see product", error);
 }
});

//=============CRUD CON SOCKETS=====================//
router.get('/realtimeproducts',async (req, res)=>{
 try {
   const products = await  ProductsManager.getProducts();
     let limit = parseInt(req.query.limit);
     if (limit && limit <= products.length) {
       products.length=limit
     }
       res.status(200).render('realTimeProducts',{products:products});
    
   } catch (error) {
      console.log("hubo un error: ", error);
   }
})
//====================================================================//
//CHAT- con websockets
router.get("/chat", async(req, res) => {
  try {
    const messages = await MessagesMongooseManager.getMessages();
  res.render("chat", { messages, });
  }
  catch (error) {
    console.log("cannot get messages with mongoose", error);
  }
});
//====================================================================//
//CARRITO 
// Ver todos los carritos**************************
router.get("/carts", async (req, res) => {
  try {
 const carts= await CartsManager.getCarts()
    res.render('carts',{carts,})
  } catch (error) {
    console.log("cannot get carts with mongoose", error);
  }
});

//Ver un carrito****************
router.get("/carts/:idc", async (req, res)=>{
let {idc}= req.params;
let totalAmount=0

try{
 const cart= await CartsManager.getCartBy({_id:idc})
 if(cart?.products){
 cart.products.forEach(item=>{ 
  totalAmount= totalAmount + item.quantity * item.product.price  
 })
    }
        res.render('my_cart',{cart, totalAmount})
}catch (error) {
  console.log("cannot get this cart with mongoose", error);
}
})

//=============================================================//

export default router;
