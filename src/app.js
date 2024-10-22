import express from "express";
 import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import __dirname from './utils.js'

const PORT=8080
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))

app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)

app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

const server=app.listen(PORT, () => console.log(`Running in port ${PORT}...`));
