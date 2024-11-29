import { ProductModel } from "./models/productModel.js";

export class ProductsMongooseManager {

  static async getProducts (data)  {
    console.log('la data es', data)
    if(data) return await ProductModel.aggregate(data)
      else return await ProductModel.find().lean()
   
 }
 static async getProductsPaginates (queryMongo,limit, page)  {
  return await ProductModel.paginate(queryMongo,{
 page,
 limit,
 lean: true
})
 }
static async addProduct(title, description, price, thumbnail=[], code, stock,category){
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
   
    let newProd= await ProductModel.create(newProduct)
     return newProd.toJSON()
  
  }

static async getProductBy (filter={})  {
  return await ProductModel.findOne(filter).lean()
}

static async updateProduct (id, changes)  {
    return await ProductModel.findByIdAndUpdate(id, changes, {new:true}).lean()
 }

static async deleteProduct (id)  {
  return await ProductModel.findByIdAndDelete(id).lean()
}
 };

