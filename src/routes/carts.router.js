import { Router } from 'express'
import { CartModel } from "../dao/models/cartModel.js";

const router = Router()

//Crear un carrito
router.post("/create_cart", async(req, res)=>{
  try {
const result= await CartModel.create({products:[]})
res.send({ status: "sucess", payload: result });
} catch (error) {
  console.log("cannot create  cart with mongoose", error);
}
})

//agregar producto a un carrito
router.post("/carts/:cid/:pid", async (req, res)=>{
  const idCart = req.params.cid;
  const idProd = req.params.pid;
  let quantity= req.query.quantity||1
  let existingProduct=[]
  try{
    const cart= await CartModel.findById(idCart)
    
    if(cart.products.length>0){
      existingProduct= cart.products.filter(item =>item.product._id==idProd)
     }
     if(existingProduct.length==0){
      cart.products.push(
        {product:idProd,
        quantity})
       }
   else{
    console.log("el producto existe", existingProduct)
       cart.products.forEach(item=>{
       if(item.product._id==idProd){  
           item.quantity+=1
           }
     })
      }
  cart.save()
  res.redirect("/carts");
}    
   catch (error) {
      console.log("cannot get carts with mongoose", error);
    }   
})
// Accion eliminar un producto de un carrito existente
router.delete("/delete/:cid/products/:pid", async (req, res) => {
  const idCart = req.params.cid;
  const idProd = req.params.pid;
  try {
  const cart= await CartModel.findById(idCart)
  if(cart.products.length>0){
     cart.products.forEach(item=>{
        if(item.product._id==idProd){  
            if(item.quantity>1){
              item.quantity=item.quantity-1
            }
          else{
            const result = cart.products.filter(product => product==item);
              console.log("los productos en el carro son", result);
              cart.products=result
              }
          }
        })
    }
cart.save()
  res.send({ status: "sucess", payload: cart.products}).redirect("/carts");
  }
  catch(error){
    console.log("cannot delete product in cart", error);
  }

});
//Accion de actualizar cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const idCart = req.params.cid;
  const idProd = req.params.pid;
  const queryQuantity= parseInt(req.query?.quantity);
  let existingProduct=[]
  try {
  const cart= await CartModel.findById(idCart)
  existingProduct= cart.products.filter(item =>item.product._id==idProd)
  
  if(existingProduct.length>0 && queryQuantity){
     cart.products.forEach(item=>{
        if(item.product._id==idProd){  
            item.quantity=item.quantity+ queryQuantity
          }
        })
    }
cart.save()
  res.send({ status: "sucess", payload: cart.products});
  }
  catch(error){
    console.log("cannot update quantity of a product in cart", error);
  }
});
//Accion de agregar a un carrito un array pasado por query PIDEN QUE SEA EN EL BODY NO USAR FROEACH EN ASYNC AWAY VALIDAR
//SI ES ID VALIDO Y SI EXISTE EN LA TABLA VER CLASE 17 MINUTO 25
router.put("/:cid", async (req, res) => {
  const idCart = req.params.cid;
  //example query products=64cf9b52c0622518055592be-6 
  const queryProducts =req.query?.products;
  let arrayData=[]
  if(queryProducts){
    arrayData=queryProducts.split("-")
  }
  const newProducts=[{product: arrayData[0],quantity:arrayData[1]}]
  console.log("los newProducts", newProducts)
  try {
    const result= await CartModel.updateOne({ _id: idCart}, {products: newProducts});
    res.send({ status: "sucess", payload: result});
  }
  catch(error){
    console.log("cannot update products array in cart", error);
  }
});

// Accion eliminar un carrito existente
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
  const result= await CartModel.deleteOne({ _id: id});
  res.send({ status: "sucess", payload: result});
  }
  catch(error){
    console.log("cannot delete cart", error);
  }
});
// Accion eliminar todos los productos de un carrito existente
router.delete("/:cid", async (req, res) => {
  const id = req.params.cid;
  const products=[];
  try {
  const result= await CartModel.updateOne({ _id: id}, {products: products});
  res.send({ status: "sucess", payload: result});
  }
  catch(error){
    console.log("cannot delete cart", error);
  }
});


export default router