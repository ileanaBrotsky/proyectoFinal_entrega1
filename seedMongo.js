import { config } from "./src/config/config.js";
import readline from 'readline';
import { conectarDB } from "./src/connDB.js";
import { ProductModel } from "./src/dao/models/productModel.js";

let products = [
    {
        code: 1,
        title: "tijera escolar",
        description: "tijera filo medio",
        thumbnail:[],
        price: 120,
        stock: 10,
        status: true,
        category: "libreria"
    },
    {
        code: 2,
        title: "Cuaderno",
        description: "tapa dura, 50 hojas",
        thumbnail: [],
        price: 120,
        stock: 10,
        status: true,
        category: "libreria"
    },
    {
        code: 3,
        title: "lápiz",
        description: "color negro, 0.3",
        thumbnail: [],
        price: 120,
        stock: 10,
        status: true,
         category: "libreria"
    },
    {
        code: 4,
        title: "resaltador",
        description: "amarillo fluo, trazo grueso",
        thumbnail: [],
        price: 120,
        stock: 10,
        status: true,
         category: "libreria"
    },
    {
        code: 5,
        title: "resaltador",
        description: "verde fluo, trazo grueso",
        thumbnail: [],
        price: 120,
        stock: 10,
        status: true,
        category: "libreria"
    },
    {
        code: 6,
        title: "resaltador",
        description: "rosa fluo, trazo grueso",
        thumbnail: [],
        price: 120,
        stock: 10,
        status: true,
        category: "libreria"
    },
    {
        code: 7,
        title: "resaltador",
        description: "negro, trazo grueso",
        thumbnail: [],
        price: 120,
        stock: 10,
        status: true,
        category: "libreria"
    },
    {
        code: 8,
        title: "tijera",
        description: "grande, filo adultos",
        thumbnail: [],
        price: 120,
        stock: 5,
        status: true,
        category: "libreria"
    },
    {
        code: 9,
        title: "carpeta",
        description: "tapa dura, estampada",
        thumbnail:[],
        price: 120,
        stock: 8,
        status: true,
         category: "libreria"
    },
    {
        code: 10,
        title: "carpeta n. 5",
        description: "carpeta de dibujo niños",
        thumbnail: [],
        price: 120,
        stock: 75,
        status: true,
       category: "libreria"
    },
    {
        code: 11,
        title: "borrador",
        description: "para pizarrón marcadores",
        thumbnail: [],
        price: 120,
        stock: 10,
        status: true,
        category: "libreria"
    },
    {
        code: 12,
        title: "borrador",
        description: "para pizarrón pared",
        thumbnail: [],
        price: 120,
        stock: 10,
        status: true,
         category: "libreria"
    },
    {
        code: 13,
        title: "goma de borrar",
        description: "para tinta y lápiz",
        thumbnail: [],
        price: 120,
        stock: 10,
        status: true,
        category: "libreria"
    },
    {
        code: 14,
        title: "papel glasé",
        description: "metalizado x 20",
        thumbnail:[],
        price: 120,
        stock: 25,
        status: true,
        category: "libreria"
    },
    {
        code: 15,
        title: "papel glasé",
        description: "común x 10",
        thumbnail: [],
        price: 120,
        stock: 10,
        status: true,
       category: "libreria"
    },
    {
        code: 16,
        title: "borratinta",
        description: "con marcador doble acción",
        thumbnail: [],
        price: 120,
        stock: 10,
        status: true,
       category: "libreria"
    }
];

const creaData = async () => {

    await ProductModel.deleteMany()
    await ProductModel.insertMany(products)

    console.log(`Data generada...!!!`)
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

rl.question('Por favor, introduce tu clave: ', async (clave) => {
    if (clave === "CoderCoder123") {
        await conectarDB(config.MONGO_URL, config.DB_NAME)

        await creaData()
    } else {
        console.log(`Contraseña seed incorrecta...!!!`)
    }

    rl.close();
});