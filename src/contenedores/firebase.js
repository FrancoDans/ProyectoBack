var admin = require("firebase-admin");

var serviceAccount = require("../../db/productos-56155-firebase-adminsdk-wt2w7-6dfa095c28.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://console.firebase.google.com/u/0/project/productos-56155/firestore/data/~2Fproducts?hl=es-419"

});

const db = admin.firestore();

const query = db.collection("products");

class ContenedorFirebase {

    constructor(query) {
        this.coleccion = db.collection(query)
    }

    async readById(id) {
        try {
            const doc = await this.coleccion.doc(id).get();
            if (!doc.exists) {
                throw new Error(`Error al listar por id: no se encontró`)
            } else {
                const data = doc.data();
                return { ...data}
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async readAll() {
        try {
            const result = []
            const snapshot = await this.coleccion.get();
            snapshot.forEach(doc => {
                result.push({ id: doc.id, ...doc.data() })
            })
            return result
        } catch (error) {
            throw new Error(`Error al listar todo: ${error}`)
        }
    }

    async save(newProduct) {
        try {
            const guardado = await this.coleccion.add(newProduct);
            return { ...newProduct, id: guardado.id }
        } catch (error) {
            throw new Error(error)
        }
    }

    async uptade(newProduct) {
        try {
            const actualizado = await this.coleccion.doc(newProduct.id).set(nuevoElem);
            return actualizado
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteById(id) {
        try {
            const item = await this.coleccion.doc(id).delete();
            return item
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async deleteAll() {
        
        try {
            const docs = await this.listarAll()
            const ids = docs.map(p => p.id)
            const promesas = ids.map(id => this.borrar(id))
            const resultados = await Promise.allSettled(promesas)
            const errores = resultados.filter(r => r.status == 'rejected')
            if (errores.length > 0) {
                throw new Error('no se borró todo. volver a intentarlo')
            }
            // const ref = firestore.collection(path)
            // ref.onSnapshot((snapshot) => {
            //     snapshot.docs.forEach((doc) => {
            //         ref.doc(doc.id).delete()
            //     })
            // })
        } catch (error) {
            throw new Error(error)
        }
    }

   
}

export default ContenedorFirebase