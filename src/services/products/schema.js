import mongoose from "mongoose"

export const ProductsSchema = new mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    }
})