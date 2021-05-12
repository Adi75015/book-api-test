// on importe la librairie de fastify
import fastify from 'fastify'
import fastifyMongo from 'fastify-mongodb'
import fastifyCors from 'fastify-cors'
import { config } from 'dotenv'
// initialise les valeurs de configuration (lecture du fichier.env)
config()

// initialise les valeurs de configuration
// on crée une application en utilisant fastify
// l'import de notre librairie: on configure
// fastify pour afficher les logs

const app = fastify({ logger: true })

//On connecte la BDD MongoDB
app.register(fastifyMongo, {
    url: process.env.MONGO_URL
})

// on enregistre le plugin CORS afin de pouvoir communiquer avec 1 client (ex: une apllication React Native)
app.register(fastifyCors)
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


// on crée une route qui retourne qu'1 livre par son identifiant
app.get('/books/:id', async (request) => {
    // on récupère l'indentifiant que j ai rentré dans notre url
    const id = request.params.id

    // on récupère notre collection dans mangodb
    const collection = app.mongo.db.collection('books')

    // Ici on s'assure de ne pas avoir d'erreur
    try {
        // nous récupérons le livre de l'id spécifié dans la route
        const book = await collection.findOne({ _id: new app.mongo.ObjectId(id) })
        // on retourne le livre récupéré depuis la BDD
        // si il n' a pas de livre, nous levons une erreur
        if (!book) {
            throw new Error('this books does not exist')
        }
        // si tout s'est bien passé, on retourne le livre
        return book
    } catch (error) {
        // ici, si la moindre erreur est survenu à l'intérieur du block try, nous éxecutons le code suivant
        // on change le status cide par 404 (Not Found)
        reply.status(404)

        // on retourne le message de l'erreur
        return { error: error.message }
    }
})


// Mise à jour d'un livre
app.patch('/books/:id', async (request) => {
    // Pour mettre à jour un livre avec MongoDB
    // il faut utiliser : await collection.updateOne({ _id: new app.mongo.ObjectId(id) }, nouveauLivre)
    const id = request.params.id
    const updateFields = request.body
    // Pour mettre à jour un livre avec MongoDB
    // il faut utiliser : await collection.updateOne({ _id: new app.mongo.ObjectId(id) }, nouveauLivre)
    const collection = app.mongo.db.collection('books')

    // Nous mettons le livre avec l'identifiant donnée
    // en luis spécifiant les champs à changer en
    // second argument
    await collection.updateOne(
        // Ici on spécifie des "Query" qui nous permettent
        // de définir le livre à mettre à jour
        { _id: new app.mongo.ObjectId(id) },
        // On specifie dans le clefs "$set" les champs à mettre
        // à jour
        { $set: updateFields },
    )

    // On récupére le livre mis à jour dans la base de données
    const book = await collection.findOne({
        _id: new app.mongo.ObjectId(id),
    })

    // On retourne le livre
    return book
})

// Suppression d'un livre
app.delete('/books/:id', async (request) => {
    // Pour supprimer un livre avec MongoDB
    // il faut utiliser : await collection.deleteOne({ _id: new app.mongo.ObjectId(id) })
    const id = request.params.id
    // Pour supprimer un livre avec MongoDB
    // il faut utiliser : await collection.deleteOne({ _id: new app.mongo.ObjectId(id) })
    const collection = app.mongo.db.collection('books')

    await collection.deleteOne({
        _id: new app.mongo.ObjectId(id)
    })
    reply.status(204)

    return null
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
    // A l'intérieur de result on as tout les opérations qui ont
    // étaient enregistré.
    // Pour accéder à tout ce qui a été enregistré dans la BDD
    // on utilise result.ops
    // Ici on as inséré un seul élément, result.ops sera donc
    // un tableaux avec une seul valeur à l'intérieur: Notre livre.

    // On retourne le livre qui a été enregistré dans la base de
    // données

    // on retourne le livre qui a été enregistré dans la BDD
    reply.status(201)
    return result.ops[0]// tous les documents qui ont été enregistrés dans mangodb
})

// cette fonction démarre notre server d'api
const start = async () => {
    console.log('lancement de notre serveur...')

    await app.listen(process.env.PORT, process.env.HOST)

    console.log('le serveur est lancé, vous pouvez visiter : http://${process.env.HOST}:${process.env.PORT}')
}
// lancement de la fonction de démarrage
start()