import { CartModel } from "./models/cartModel.js";

export class CartsMongooseManager {

//Traer todos los carritos
static async getCarts ()  {
    return await CartModel.find().populate("products.product").lean().exec()
 }
//Agregar carrito
static async addCart(){
    let newCart= await CartModel.create({products:[]})
     return newCart.toJSON()
  
  }
//traer carrito por filtro 
static async getCartBy (filter={})  {
  return await CartModel.findOne(filter).populate('products.product').lean().exec()
}
//Editar carrito
static async updateCart (id, changes)  {
    return await CartModel.findByIdAndUpdate(id, changes, {new:true}).lean()
 }
//Eliminar carrito
static async deleteCart (id)  {
  return await CartModel.findByIdAndDelete(id).lean()
}
 };

