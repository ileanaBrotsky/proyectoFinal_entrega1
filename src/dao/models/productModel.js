import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema(
  {
    code: { type: String, require: true, index: true },
    title: {
      type: String,
      require: true,
      index: true
    },
    description: String,
   
    thumbnail: {
      type: Array,
      default: [],
    },
    price: Number,
    stock: Number,
    category: String,
    status: Boolean,
  },
  {
    timestamps: true,
    //strict: false
  }
);
productSchema.plugin(mongoosePaginate)
export const ProductModel = mongoose.model( "products", productSchema);

