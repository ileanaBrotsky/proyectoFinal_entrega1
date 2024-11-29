import { Router } from 'express'
import {ProductsMongooseManager as ProductsManager }from '../dao/productsMongooseManager.js';
import { isValidObjectId } from 'mongoose';

const router = Router()
//traer todos los productos
router.get('/', async (req, res) => {
  try {
    let products = await ProductsManager.getProducts();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ products });
  }
  catch (error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: `${error.message}` })
  }
})
//crear un producto
router.post('/', async (req, res) => {
  try {
    let { title, description, price, thumbnail = [], code, stock, category } = req.body
    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status: true
    };
    //flag full info
    if(!title|| !description || !price || !code || !stock || !category ){
          res.setHeader('Content-Type', 'application/json');
          return res.status(400).json('Faltan Datos')
        }
    //flag same code
        try {
          let allProducts = await ProductsManager.getProducts();
          if (allProducts.length > 0) {
           if( allProducts.find(prod => (prod.code === newProduct.code)) ){
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json('Codigo repetido')
          }}
        } catch (error) {
          console.log(`no se pudieron obtener prods para comparar, error: ${error.message}`)
        }
    let newProd= await ProductsManager.addProduct( title, description, price, thumbnail = [], code, stock, category )
    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({ newProd });
  }
  catch (error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: `${error.message}` })
  }
})
//editar un producto
router.put('/:id', async (req, res) => {
  console.log('entro en upload')
  let {id}=req.params
  let changes=req.body
  //flag is valid id
  if(!isValidObjectId){
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: `Id inválido` })
  }
 //flag is same code
  try {
    let allProducts = await ProductsManager.getProducts();
      if(changes?.code){
        if( allProducts.find(prod => (prod.code === changes.code)) ){
          res.setHeader('Content-Type', 'application/json');
          return res.status(400).json('Codigo repetido')
      }}
  }
  catch (error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: `${error.message}` })
  }
try{
let updateProd= await ProductsManager.updateProduct( id, changes)
res.setHeader('Content-Type', 'application/json');
return res.status(201).json({ updateProd }).redirect("/edit_products");
}
catch (error) {
res.setHeader('Content-Type', 'application/json');
return res.status(500).json({ error: `${error.message}` })
}
})
//traer un producto por id
router.get('/:id', async (req, res) => {
  let {id}=req.params
  //flag is valid id
  if(!isValidObjectId){
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: `Id inválido` })
  }
try{
let oneProd= await ProductsManager.getProductBy( {_id:id})
    if(!oneProd){
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({error: `No existen productos con id: ${id}` });
    }
res.setHeader('Content-Type', 'application/json');
return res.status(200).json({oneProd });
}
catch (error) {
res.setHeader('Content-Type', 'application/json');
return res.status(500).json({ error: `${error.message}` })
}
})

//Eliminar un producto por id
router.delete('/:id', async (req, res) => {
  console.log('entra en delete')
  let {id}=req.params
  //flag is valid id
  if(!isValidObjectId){
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: `Id inválido` })
  }
try{
let deletedProd= await ProductsManager.deleteProduct( id)
    if(!deletedProd){
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({error: `No existen productos con id: ${id}` });
    }
res.setHeader('Content-Type', 'application/json');
return res.status(200).json({deletedProd });
}
catch (error) {
res.setHeader('Content-Type', 'application/json');
return res.status(500).json({ error: `${error.message}` })
}
})


export default router