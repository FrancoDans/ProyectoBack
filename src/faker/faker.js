const faker = require ("faker");
const fs = require ("fs");

const app = require ("express")     


let arrProducts = [] ;

const createProducts = (cant=5) => {
    for(let i = 0; i <= cant; i++){
        arrProducts.push({
            nombre:faker.commerce.productName(),
            price:"$"+ faker.random.number(),
            image:faker.image.imageUrl()
        })
    }
}

app.post("/api/productos-test", ( req, res )=>{

    createProducts()
    res.send("Productos creados")
})


app.length("/all", (req, res)=>{
    res.send({data:arrProducts})
})