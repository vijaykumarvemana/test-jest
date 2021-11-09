import express from "express";
import { ProductModel } from "./model.js";

const productsRouter = express.Router();


productsRouter.get("/", async (req, res) => {
    const products = await ProductModel.find({});

    res.send(products || []);
});

productsRouter.post("/", async (req, res) => {
    console.log(req.body)
    const { name, price } = req.body;

    if (!name || !price) {
        res.status(400).send({ error: "name and price are required" });
        return
    }
    const product = new ProductModel({ name, price });
    await product.save();

    console.log(product)

    res.status(201).send({ product });
})

productsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;  // req.params.id
    
    const product = await ProductModel.findById(id);

    if (!product) {
        res.status(404).send({ error: "product not found" });
        return
    }

    res.send(product);
})

productsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    const product = await ProductModel.findByIdAndUpdate(id, { name, price }, { new: true });
    if (!product) {
        res.status(404).send({ error: "product not found" });
        return
    }
    res.send(product);
})

productsRouter.delete("/:id", async (req, res) => {

    const { id } = req.params;
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) {
        res.status(404).send({ error: "product not found" });
        return
    }
    res.send({ message: "product deleted" });

})

export { productsRouter }