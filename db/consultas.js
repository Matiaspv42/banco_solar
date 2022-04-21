const {Pool} = require('pg')

const config = {
    user: 'postgres',
    password:'postgres',
    host:'localhost',
    database:'bancosolar',
    route:5432
};

const pool = new Pool(config);

const getUsuarios = async()=>{
    const query = {
        text:'SELECT * FROM usuarios'
    }
    try {
        const {rows} = await pool.query(query)

        return rows
    } catch (error) {
        console.log(error);
    }
}

const addUsuario = async(data)=>{
    const query = {
        text: 'INSERT INTO usuarios (nombre, balance) values($1,$2)',
        values:data
    }
    try {
        const res = await pool.query(query)
        return res
    } catch (error) {
        console.log(error);
    }
}

const deleteUsuario = async(id)=>{
    const query={
        text:'DELETE FROM usuarios WHERE id = $1',
        values:[id]
    }
    try {
        await pool.query(query)
    } catch (error) {
        console.log(error);
    }
}


const getTransferencias = async(data)=>{
    const query = {
        text: 'SELECT * FROM transferencias'
    }
    try {
        pool.query(query)
    } catch (error) {
        console.log(error);
    }
}

const addTransferencia = async(data)=>{
    const values = [data[0],data[1],Number(data[2])]
    const agregarTransferencia ={
        text: "INSERT INTO transferencias (emisor, receptor, monto) values ($1,$2,$3)",
        values
    };
    const actualizarDatosEmisor = {
        text: "UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2",
        values: [Number(data[2]),data[1]]
    }
    const actualizarDatosReceptor = {
        text: "UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2",
        values: [Number(data[2]),data[0]]
    }
    try {
        await pool.query('BEGIN')
        await pool.query(actualizarDatosEmisor)
        await pool.query(actualizarDatosReceptor)
        await pool.query(agregarTransferencia)
        await pool.query('COMMIT')
        return true;
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error);
        throw error
    }
}
module.exports = {
    getUsuarios,
    addUsuario,
    getTransferencias,
    deleteUsuario,
    addTransferencia
}