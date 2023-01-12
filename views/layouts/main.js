const socket = io();

const productsForm = document.getElementById("productsForm")

//Products
productsForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const product={
        title:productsForm[0].value,
        price:productsForm[1].value,
        thumbnail:productsForm[2].value,
    };
    socket.emit('new-product', product)
    productsForm.reset()
})

async function renderProducts(products) {

    const fetchHBS = await fetch("./productsTable.hbs");
  
    const textHBS = await fetchHBS.text();

    const template = Handlebars.compile(textHBS);
  
    const html = template({ products });
  

    document.getElementById("productsTable").innerHTML = html;
  }

socket.on("products", renderProducts);

  
  // Chat
  function renderChat(data) {

    /* 
    NORMAIZE
    const authorSchema = new normalizr.schema.Entity ('author',{}, {idAttribute:'email'})
    const messageSchema = new normalizr.schema.Entity ('message', {author: authorSchema}, {idAttribute:'id'})
    const messagesSchema =  new normalizr.schema.Entity('messages', {messages: [messageSchema]},{idAttribute:'id'})
    const denormaliedChats=normalizr.denormalize( data.result, messagesSchema, data.entities)
    const denormalizedMessages= denormaliedChats.messages */


    const html = data.map((m) => {
        return `<div>
              <strong style='color:blue'>${m.author.email}</strong>:
              <em style='color:brown'>${m.date}<em>
              <em style='color:green'>${m.text}</em> 
              </div>`;
      })
      .join(" ");
    document.getElementById("messages").innerHTML = html;
  }
  
  function addMessage() {
    let date = new Date();
    const message = {

      date: date,
      author: {
        email: document.getElementById("email").value,
        name: document.getElementById("name").value,
        lastname: document.getElementById("lastname").value,
        age: document.getElementById("age").value,
        alias: document.getElementById("alias").value,
        avatar: document.getElementById("avatar").value,
      },
      text: document.getElementById("text").value

    };
    socket.emit("new-message", message);
    return false;
  }
  
  socket.on("messages", function (data) {
    renderChat(data);
  });