import express from "express";
import handlebars from "express-handlebars"
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import __dirname from './utils.js'
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io";
import ProductsManager from "./dao/productsManager.js";
import mongoose from "mongoose";
const PORT=8080
const app = express();
const ProductM = new ProductsManager("products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))


app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)
//el router de vistas en app va al final de todos
app.use('/',viewsRouter);

// Motores de plantilla
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname + '/views');
app.set('view engine','handlebars');

mongoose.set('strictQuery', false);
const url= "mongodb+srv://ileanabrotsky:CoderCoder@cluster0.0rc0s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const httpServer= app.listen(PORT, () => console.log(`Running in port ${PORT}...`));
const enviroment= async()=>{
    try{
        await mongoose.connect(url,{dbName:"ecommerce"}) 
        console.log('DB Connected...')
    }
    catch (error) {
        console.log("Error: ", error.message);
    } 
        const io= new Server(httpServer);
        io.on('connection', socket=>{
            console.log("Nuevo cliente socket conectando")

        socket.on('addNewProduct', async data =>{
            console.log("el producto es",data);
            let {title, description, thumbnail, code, price, stock, category}= data;
            try {
            await ProductM.addProduct(title, description,parseInt( price), thumbnail,  code,  parseInt(stock),category)
            .then(()=>{ ProductM.getProducts().then((result)=>{socket.emit("uploadList",result)})}) 
            }
            catch (error) {
                console.log("cannot create products", error);
            }
        })
})
}

enviroment();