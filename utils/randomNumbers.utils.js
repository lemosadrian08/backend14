
const randomNumbers=(qty)=>{
    let list = [];
    for (let i = 0; i < qty; i++) {
        let random = Math.floor(Math.random() * (1000 - 1 + 1) + 1)
        list[i] = random;
    }
    console.log(list);
    return list
}


process.on('message', (qty) => {
    const result = randomNumbers(qty)
    process.send(result)
  })

