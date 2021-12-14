
import config from '../config.js'
const mongoose = requiere ("mongoose")
const {Schema, model} = require("mongoose")
import { asPOJO, renameField, removeField } from '../utils'

let nombreColeccion = mongoose.connect("mongodb://127.0.0.1:27017/productosM");;


await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

let esquema = new Schema({
    nombre:String,
    price:Number,
    url:String
})
class ContenedorMongoDb {
   
    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }

    async readById(id) {
        try {
            const docs = await this.coleccion.find({ '_id': id }, { __v: 0 })
            if (docs.length == 0) {
                throw new Error('Error al listar por id: no encontrado')
            } else {
                const result = renameField(asPOJO(docs[0]), '_id', 'id')
                return result
            }
        } catch (error) {
            throw new Error(`Error al listar por id: ${error}`)
        }
    }

    async readAll() {
        try {
            let docs = await this.coleccion.find({}, { __v: 0 }).lean()
            docs = docs.map(asPOJO)
            docs = docs.map(d => renameField(d, '_id', 'id'))
            return docs
        } catch (error) {
            throw new Error(`Error al listar todo: ${error}`)
        }
    }

    async save(newProduct) {
        try {
            let doc = await this.coleccion.create(newProduct);
            doc = asPOJO(doc)
            renameField(doc, '_id', 'id')
            removeField(doc, '__v')
            return doc
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async uptade(newProduct) {
        try {
            renameField(newProduct, 'id', '_id')
            const { n, nModified } = await this.coleccion.replaceOne({ '_id': newProduct._id }, newProduct)
            if (n == 0 || nModified == 0) {
                throw new Error('Error al actualizar: no encontrado')
            } else {
                renameField(newProduct, '_id', 'id')
                removeField(newProduct, '__v')
                return asPOJO(newProduct)
            }
        } catch (error) {
            throw new Error(`Error al actualizar: ${error}`)
        }
    }

    async delete(id) {
        try {
            const { n, nDeleted } = await this.coleccion.deleteOne({ '_id': id })
            if (n == 0 || nDeleted == 0) {
                throw new Error('Error al borrar: no encontrado')
            }
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async deleteAll() {
        try {
            await this.coleccion.deleteMany({})
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }
}

export default ContenedorMongoDb



