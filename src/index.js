// on importe la librairie de fastify
import fastify from 'fastify'
import fastifyMongo from 'fastify-mongodb'

// on crée une application en utilisant fastify
// l'import de notre librairie: on configure
// fastify pour afficher les logs

const app = fastify({ logger: true })

//On connecte la BDD MongoDB
app.register(fastifyMongo, {
    url: 'mongodb+srv://MyTodoApp:MyTodoApp@cluster0.obacx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
})

// on crée une route fastify sur l'URI "/"
app.get('/', async () => {
    return { text: 'Hello Word' }
})


// On crée une route qui retourne ts les livres de notre BDD (MANGODB)
app.get('/books', async () => {
    // mangodb est 1 BDD qui contient des collections
    // c'est un peu comme des tables
    //ici on récupère notre collection "books"
    const collection = app.mongo.db.collection('books')

    // sur cette collection, nous pouvons utiliser plusieurs fonctions.
    // Ici, nous allons récupérer tous les livres
    const books = await collection.find().toArray()
    // nous retournons ts les livres de la BDD
    return books
})

// on déclare un shema qui nous permettra de valider les donnees envoyées dans la request POST/books
const createBookSchema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string' },
        author: { type: 'string' },
        price: { type: 'number' },
        stars: { type: 'number' }
    },
    required: [
        'title',
        'description',
        'image',
        'author',
        'price',
        'stars'
    ]
}

// on crée une route qui nous permettra d'ajouter (de créer) un nouveau livre et nous lui rattachons un schema
app.post('/books', {
    schema: {
        body: createBookSchema
    }
}, async (request) => {
    // nous récupérons ttes les données qu'il y a dans le corps de la requete(cela correspond à notre livre)
    const book = request.body

    // pour enregistrer le livre ds ma BDD , j'ai besoin de la collection
    const collection = app.mongo.db.collection('books')

    // on enregistre le livre dans la BDD 
    const result = await collection.insertOne(book)

    // on retourne le livre qui a été enregistré dans la BDD
    return result.ops[0]// tous les documents qui ont été enregistrés dans mangodb
})

// cette fonction démarre notre server d'api
const start = async () => {
    console.log('lancement de notre serveur...')

    await app.listen(3000)

    console.log('le serveur est lancé, vous pouvez visiter : http://localhost:3000')
}
// lancement de la fonction de démarrage
start()