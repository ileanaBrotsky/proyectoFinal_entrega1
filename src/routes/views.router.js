import { Router } from "express";
import { ProductModel } from "../dao/models/productModel.js";
import { CartModel } from "../dao/models/cartModel.js";

const router = Router();
//HOME- SALUDO BIENVENIDA Y DATOS DEL USUARIO
router.get("/", async (req, res) => {
  let  user={ name:'Hilda'}
    res.render('index',{user:user, style:'index.css'})
});
//====================================================================//
//CARRITO 
// Ver todos los carritos
router.get("/carts", async (req, res) => {
  try {
 const carts= await CartModel.find().populate("products.product").lean().exec()
    res.render('carts',{carts, style:'index.css'})
  } catch (error) {
    console.log("cannot get carts with mongoose", error);
  }
});

//Ver un carrito
router.get("/carts/:idc", async (req, res)=>{
let cartID= req.params.idc;
let totalAmount=0
console.log("el cartId",cartID)
try{
 const cart= await CartModel.findById(cartID).populate('products.product').lean().exec()
 cart.products.forEach(item=>{ 
  totalAmount= totalAmount + item.quantity * item.product.price  
 })
      res.render('my_cart',{cart, totalAmount})
}catch (error) {
  console.log("cannot get carts with mongoose", error);
}
})
//====================================================================//
//  PRODUCTS 
// Ver todos los productos con accion agregar al carrito, con aggregate y pagination
router.get("/products", async (req, res) => {
   let limit =parseInt(req.query?.limit)||10
   let page=parseInt(req.query?.page) || 0
   let sort=parseInt(req.query?.sort)||1
   //example price,500
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
let products= await ProductModel.aggregate([
  //1-buscar con un filtro o todos
  // {$match: {queryMongo}},//NO ANDA
  //2-buscar con limite o 10
   {$limit: limit},
   //3- ordenar asc o desc segun corresponda o nada
   {$sort: {price: sort}}

])
res.render("products", { products, style: "index.css" });
  } catch (error) {
    console.log("cannot get products with mongoose", error);
  }
});

// Ver todos los productos con PAGINACION
router.get("/products_paginated", async (req, res) => {
  let limit =parseInt(req.query?.limit)||10
   let page=parseInt(req.query?.page) || 1
   let sort=parseInt(req.query?.sort)||1
   //example price,500
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
  //console.log("la query de mongo es", queryMongo)
   }
 try {
     const result = await ProductModel.paginate(queryMongo,{
       page,
       limit,
       lean: true
     })
res.render("products_paginated", result);
 } catch (error) {
   console.log("cannot get products with mongoose", error);
 }
});


// vista para editar productos con disparadores de acciones
router.get("/edit_products", async (req, res) => {
  try {
    const products = await ProductModel.find().lean().exec();
    res.render('edit_products',{products, style:'index.css'})
  } catch (error) {
    console.log("cannot get products with mongoose", error);
  }
});
// Vista para agregar nuevo producto
router.get("/create", async (req, res) => {
  res.render("create", {});
});

// Vista para modificar producto existente
router.get("/update/:code", async (req, res) => {
  const code = req.params.code;
  try {
    const productSelected = await ProductModel.findOne({ code: code });
    res.render("update", productSelected);
  }
  catch (error) 
  {
    console.log("cannot update products", error);
  }
});
//Vista para ver un producto
router.get("/product/:code", async (req, res) => {
  const code = req.params.code;
  try {
    const productSelected = await ProductModel.findOne({ code: code });
    res.render("product_view", productSelected);
  }
  catch (error) 
  {
    console.log("cannot see product", error);
  }
});




//=============CRUD CON SOCKETS=====================//
router.get('/realtimeproducts',async (req, res)=>{
  try {
    const products = await ProductModel.find().lean().exec();
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
