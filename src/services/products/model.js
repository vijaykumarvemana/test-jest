import { ProductsSchema } from "./schema.js";
import mongoose from "mongoose";

export const ProductModel = mongoose.model("products", ProductsSchema)