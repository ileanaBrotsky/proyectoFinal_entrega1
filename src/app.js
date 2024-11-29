import express from "express";
import handlebars from "express-handlebars"
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import { config } from "./config/config.js";
import { conectarDB } from "./connDB.js";
import __dirname from './utils.js'
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io";
import {ProductsMongooseManager as ProductsManager }from './dao/productsMongooseManager.js';
import { MessagesMongooseManager } from './dao/messagesMongooseManager.js';
import mongoose from "mongoose";
const PORT=config.PORT
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))


app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)
//el router de vistas en app va al final de todos
app.use('/',viewsRouter);

// Motores de plantilla
app.engine('handlebars',handlebars.engine());
app.set('view engine','handlebars');
app.set('views',__dirname + '/views');

mongoose.set('strictQuery', false);
const httpServer= app.listen(PORT, () => console.log(`Running in port ${PORT}...`));
conectarDB(config.MONGO_URL,config.DB_NAME)
       
const io= new Server(httpServer);
io.on('connection', socket=>{
    console.log("Nuevo cliente socket conectando")
    socket.on('new',async(user)=>{
        console.log(`${user} se acaba de conectar`);
        try {
          let  messages = await MessagesMongooseManager.getMessages();
           
            io.emit('messagesLogs', messages)
          } catch (error) {
            console.log("cannot get chats with mongoose", error);
          }
})
  socket.on('message', async(data)=>{
    
    const messageGenerated = await MessagesMongooseManager.addMessage(data);
      try {
      let  messages = await MessagesMongooseManager.getMessages();
           
        io.emit('messagesLogs', messages)
      } catch (error) {
        console.log("cannot create message", error);
      }
  })
socket.on('addNewProduct', async data =>{
    console.log("el producto es",data);
    let {title, description, thumbnail, code, price, stock, category}= data;
    try {
    await ProductsManager.addProduct(title, description,parseInt( price), thumbnail,  code,  parseInt(stock),category)
    .then(()=>{ ProductsManager.getProducts().then((result)=>{socket.emit("uploadList",result)})}) 
    }
    catch (error) {
        console.log("cannot create products", error);
    }
})

})
