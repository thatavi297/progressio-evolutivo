
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { rotasTreinos } from './routes/treinos'

const app = Fastify({
  logger: true,
})

async function iniciarServidor() {
  try {
    // Configuração do CORS
    await app.register(cors, {
      origin: true,
      methods: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
      ],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
      ],
    })

    // Rotas dos treinos
    await app.register(rotasTreinos)

    // Rota para verificar se a API está funcionando
    app.get('/health', async () => {
      return {
        status: 'ok',
        mensagem: 'API do Progressio funcionando!',
      }
    })

    // Iniciar servidor
    await app.listen({
      port: 3333,
      host: '0.0.0.0',
    })
  } catch (erro) {
    app.log.error(erro)
    process.exit(1)
  }
}

iniciarServidor()
