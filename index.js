const {getUsuarios, addUsuario, getTransferencias, deleteUsuario, addTransferencia} = require('./db/consultas')

const express = require('express')
const app = express()



app.listen(3000, ()=>{
    console.log('Servidor andando en puerto 3000');
})

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

app.use(express.json())

app.get('/usuarios', async (req,res)=>{
    try {
        const usuarios = await getUsuarios()
        res.json(usuarios)
    } catch (error) {
        console.log(error);
    }
})

app.post('/usuario', async (req,res)=>{
    try {
        // Paso la informacion al objeto data para poder trabajarla en la consulta
        const data = Object.values(req.body) 
        const resultado = await addUsuario(data)
        res.status(201).json(resultado)
    } catch (error) {
        
    }
})

app.delete('/usuario?:id',async(req,res)=>{
    try {
        const {id} = req.query
        const resultado = await deleteUsuario(id)
        res.json(resultado)
    } catch (error) {
        
    }
})

app.get('/transferencias', async(req,res)=>{
    try {
        const transferencias = await getTransferencias()
        console.log(transferencias)
        res.json(transferencias)
    } catch (error) {
        console.log(error);
    }
})

app.post('/transferencia', async (req,res)=>{
    try{
        const data = Object.values(req.body)
        console.log('info que viene desde el post transferencia',req.body);
        const resultado = await addTransferencia(data)
        return res.status(201).json(resultado)
    }catch(error){
        console.log(error);
    }
})