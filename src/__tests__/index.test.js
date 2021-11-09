import supertest from "supertest"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { app } from "../app.js"

dotenv.config()

const request = supertest(app)

describe("Testing the testing environment", () => {

    it("should test that true is true", () => {
        expect(true).toBe(true);
    });

    it("should test that false is false", () => {
        expect(false).toBe(false);
    });

    it("should test that 1 is 1", () => {
        expect(1).toBe(1);
    });

    it("should test that 0 is 0", () => {
        expect(0).toBe(0);
    });

})

describe("Testing the products endpoints", () => {

    // beforeAll

    // We are going to connect to the testing database in Mongo.
    // From here on, all the following testing operations will be performed on the testing database.

    beforeAll((done) => {
        mongoose.connect(process.env.MONGO_TEST_URL).then(() => {
            console.log("Connected to Mongo!")
            done()
        })
    })

    it("should test that the /test endpoint is returning a success message", async () => {
        const response = await request.get("/test")

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Test success")
    })

    const validProduct = {
        name: "Test product",
        price: 10
    }

    it("should test that with a valid product the POST /product endpoint is adding a new product", async () => {
        const response = await request.post("/products").send(validProduct)
        expect(response.status).toBe(201)
    })

    it("should test that with an invalid product the POST /product endpoint is returning a 400 error", async () => {
        const response = await request.post("/products").send({})
        expect(response.status).toBe(400)
    })

    it("should test that the GET /products endpoint is returning a list of products", async () => {

        const productResponse = await request.post("/products").send(validProduct)

        console.log(productResponse.body)

        const response = await request.get("/products")

        expect(response.status).toBe(200)
        expect(response.body.some(p => p._id.toString() === productResponse.body.product._id)).toBe(true)
    })
    it("should test that the GET /products/:id endpoint is returning a product", async () => { 
        const productResponse = await request.post("/products").send(validProduct)
        expect(productResponse.status).toBe(201)

        const response = await request.get(`/products/${productResponse.body.product._id}`)
        expect(response.status).toBe(200)
        expect(response.body.name).toBe(validProduct.name)
    })

    it("should test the PUT /products/:id endpoint is editing the product", async () => {
        const productResponse = await request.post("/products").send(validProduct)
        expect(productResponse.status).toBe(201)
        
        const response = await request.put(`/products/${productResponse.body.product._id}`).send({
            name: "Test product is different",    
            price: 10
        })
        expect(response.status).toBe(200)
        expect(response.body.name).toBe("Test product edited")
    })

    it("should test the DELETE /products/:id endpoint is deleting the product", async () => {
        const productResponse = await request.post("/products").send(validProduct)
        expect(productResponse.status).toBe(201)
          
        const response = await request.delete(`/products/${productResponse.body.product._id}`)
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Product deleted")
    })


    // afterAll 

    // We are going to drop the testing database in Mongo
    // We don't need this fake/dummy data anymore because it was just a test

    afterAll((done) => {
        mongoose.connection.dropDatabase()
            .then(() => {
                return mongoose.connection.close()
            })
            .then(() => {
                console.log("Dropped database!")
                done()
            })
    })

})