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
    };
    try {
        const {rows} = await pool.query(query);

        return rows
    } catch (error) {
        console.log(error);
        throw error
    }
}

const addUsuario = async(data)=>{
    const query = {
        text: 'INSERT INTO usuarios (nombre, balance) values($1,$2)',
        values:data
    };
    try {
        const res = await pool.query(query);
        return res
    } catch (error) {
        console.log(error);
        throw error
    }
}

const deleteUsuario = async(id)=>{
    const query={
        text:'UPDATE usuarios set estado = false where id = $1',
        values:[id]
    };
    try {
        await pool.query(query);
    } catch (error) {
        console.log(error);
        throw error
    }
}

const editUsuario = async(data)=>{
    const query={
        text:'UPDATE usuarios set nombre = $1, balance = $2 where id = $3',
        values:data
    };
    try {
        await pool.query(query);
    } catch (error) {
        console.log(error);
        throw error
    }
}

const cambioEstado = async(id)=>{
    const query = {
        text: 'UPDATE usuarios set estado = true where id = $1',
        values: [id]
    };
    try {
        await pool.query(query);
    } catch (error) {
        console.log(error);
        throw error
    }
}


const getTransferencias = async(data)=>{
    const query = {
        text: 'SELECT fecha , monto, (select nombre from usuarios as u where t.emisor = u.id) as nombre_emisor, (select nombre from usuarios as u where t.receptor = u.id) as nombre_receptor FROM transferencias as t'
    }
    try {
        const {rows} = await pool.query(query)
        return rows
    } catch (error) {
        console.log(error);
        throw error
    }
}

const addTransferencia = async(data)=>{
    const agregarTransferencia ={
        text: "INSERT INTO transferencias(emisor, receptor, monto, fecha) values ($1, $2, $3, NOW())",
        values: [data[0], data[1],Number(data[2])]
    };
    const actualizarDatosEmisor = {
        text: "UPDATE usuarios SET balance = balance - $1 WHERE id = $2",
        values: [Number(data[2]),Number(data[0])]
    };
    const actualizarDatosReceptor = {
        text: "UPDATE usuarios SET balance = balance + $1 WHERE id = $2",
        values: [Number(data[2]),Number(data[1])]
    };
    try {
        await pool.query('BEGIN');
        await pool.query(actualizarDatosEmisor);
        await pool.query(actualizarDatosReceptor);
        await pool.query(agregarTransferencia);
        await pool.query('COMMIT');
        return true;
    } catch (error) {
        await pool.query('ROLLBACK');
        console.log(error);
        throw error
    }
}
module.exports = {
    getUsuarios,
    addUsuario,
    getTransferencias,
    deleteUsuario,
    addTransferencia,
    editUsuario,
    cambioEstado
};