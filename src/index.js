// on importe la librairie de fastify
import fastify from 'fastify'

// on crée une application en utilisant fastify
// l'import de notre librairie: on configure
// fastify pour afficher les logs

const app = fastify({ logger: true })

// on crée une route fastify sur l'URI "/"
app.get(`/`, async () => {
    return { text: 'Bienvenue' }
})

// cette fonction démarre notre server d'api
const start = async () => {
    console.log('lancement de notre serveur...')

    await app.listen(3000)

    console.log('le serveur est lancé, vous pouvez visiter : http://localhost:3000')
}
// lancement de la fonction de démarrage
start()