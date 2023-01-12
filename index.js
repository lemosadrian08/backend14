const express = require('express');
const errorMiddleware = require('./middlewares/error.middleware');
const session = require('express-session');

const os = require('os')
const cluster = require('cluster')

const dbConfig =require('./db/db.config')

const logger = require('./utils/logger')

const { engine } = require ('express-handlebars')

const apiRoutes = require('./routers/app.routers');
const path =require('path');
const webRoutes=require('./routers/web/web.routes')

const MongoContainer = require ('./models/containers/mongo.container')
const productsSchema = require('./models/schemas/products.schema')
const messagesSchema = require('./models/schemas/messages.schema')
const messagesApi = new MongoContainer("messages",messagesSchema)
const productsApi = new MongoContainer("products",productsSchema)


const passport= require('./middlewares/passport')

const MongoStore = require('connect-mongo')

const app = express();


const minimist = require ('minimist')
const args = minimist(process.argv.slice(2),{
  alias:{
    p: 'port',
    m: 'mode'
  },
  default:{
    port: 8080,
    mode: 'FORK'
  }
})

//views
app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: path.resolve(__dirname, './views/layouts'),
  partialsDir: path.resolve(__dirname, './views/partials')
}))
app.set('views', './views/layouts');
app.set('view engine', 'hbs');

const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./views/layouts")/* (path.resolve(__dirname, './public')) */);
app.use(session({
  name: 'my-session',
  secret: 'top-secret-51',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 5000 },
  store: MongoStore.create({
    mongoUrl: dbConfig.mongodb.uri,
      collectionName: 'sessions'
  })
}));

app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/', webRoutes)
app.use('/api', apiRoutes);
app.get('*', (req, res) => {
  const { method, url } = req
  logger.log('warn', `The route dosen't exist: ${method} => ${url}`)
  res.status(404).sendFile(path.resolve(__dirname + '/public/404.html'))
})
app.use(errorMiddleware);


if (args.mode == 'CLUSTER' && cluster.isPrimary){
  logger.log('info', `CLUSTER - PDI: ${process.pid}`);
  const cpus = os.cpus().length
  for(let i=0; i< cpus; i++){
    cluster.fork()
  }
}else{
  logger.log('info', `FORK - PDI: ${process.pid}`);
  const httpServer = new HttpServer(app);
  const io = new SocketServer(httpServer);


//Listen
const server = httpServer.listen(args.port, () => {
  MongoContainer.connect().then(() => {
/*     logger.log('silly', "127.0.0.1 - there's no place like home");
logger.log('debug', "127.0.0.1 - there's no place like home");
logger.log('verbose', "127.0.0.1 - there's no place like home");
logger.log('info', "127.0.0.1 - there's no place like home");
logger.log('warn', "127.0.0.1 - there's no place like home");
logger.log('error', "127.0.0.1 - there's no place like home");
logger.info("127.0.0.1 - there's no place like home");
logger.warn("127.0.0.1 - there's no place like home");
logger.error("127.0.0.1 - there's no place like home"); */
    logger.log('info', `Server is up and running on port ${args.port}`)
    logger.log('info', 'Connected to MongoDb')
  })
})


server.on('error', (error) => {
  logger.log('error', 'Error: ', error);
})


// Socket Events
//Products
io.on('connection', async (socket)=>{
  logger.log('info', "New Clien conection");
  
  socket.emit("products", await productsApi.getAll())

  socket.on("new-product", async (newProduct)=>{
    await productsApi.save(newProduct)
    io.sockets.emit("products", await productsApi.getAll()) 
  })
  
})

//Chat
io.on("connection",async (socket) => {
  logger.log('info', "There is a new client in the chat");
  
   socket.emit("messages", await messagesApi.getAll());
   
   socket.on("new-message", async (data) => {
     await messagesApi.save(data)
     io.sockets.emit("messages", await messagesApi.getAll()); 
    });
  });
}