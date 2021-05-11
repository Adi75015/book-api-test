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
app.get(`/`, async () => {
    return { text: 'Bienvenue' }
})

// création de la route qui retourne les livres
app.get('/books', async () => {
    return []
})

// cette fonction démarre notre server d'api
const start = async () => {
    console.log('lancement de notre serveur...')

    await app.listen(3000)

    console.log('le serveur est lancé, vous pouvez visiter : http://localhost:3000')
}
// lancement de la fonction de démarrage
start()