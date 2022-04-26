const {getUsuarios, addUsuario, getTransferencias, deleteUsuario, addTransferencia, editUsuario, cambioEstado} = require('./db/consultas')

const express = require('express')
const app = express()



app.listen(3000, ()=>{
    console.log('Servidor andando en puerto 3000');
})

app.get('/', (req,res)=>{
    try {
        res.sendFile(__dirname + '/index.html')   
    } catch (error) {
        res.status(404).send('Not Found');
    }
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
        res.status(500)
    }
})

app.put('/usuario?:id', async(req,res)=>{
    // En este caso la informacion viene a traves de la query string (id) y a traves del body (name, balance)
    try {
        const data = Object.values(req.body)
        const {id} = req.query
        data.push(id)
        const resultado = await editUsuario(data)
        res.status(201).json(resultado)
    } catch (error) {
        res.status(500)
        console.log(error);
    }
})

// agregamos url para activar usuario

app.put('/activarUsuario?:id', async(req,res)=>{
    try {
        const {id} = req.query
        const resultado = await cambioEstado(id)
        res.status(201).json(resultado)
    } catch (error) {
        res.status(500)
        res.status(500)
    }
})

// modificamos metodo Delete para que cambie el estado del valor "estado" a false de un usuario y así que no lo muestre.
app.delete('/usuario?:id',async(req,res)=>{
    try {
        const {id} = req.query
        const resultado = await deleteUsuario(id)
        res.json(resultado)
    } catch (error) {
        res.status(500)
    }
})

app.get('/transferencias', async(req,res)=>{
    try {
        const transferencias = await getTransferencias()
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
        res.status(500)
        console.log(error);
    }
})

app.get('/*',(req,res)=>{
    // res.status(404).send('<h1>Esta pagina no existe :( pero te redireccionaremos a la pagina principal</h1>')
    // console.log('estoy fuera de timeout');
    res.redirect(301, '/')
})