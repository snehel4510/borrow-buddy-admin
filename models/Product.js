import mongoose, {model, Schema, models} from "mongoose";

const ProductSchema = new Schema({
  title: {type:String, required:true},
  description: String,
  price: {type: Number, required: false},
  images: [{type:String, required: true}],
  category: {type:mongoose.Types.ObjectId, ref:'Category'},
  properties: {type:Object},
  seller: String
}, {
  timestamps: true,
});

export const Product = models?.Product || model('Product', ProductSchema);