
import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import {
  treinos,
  type Treino,
} from '../data/treinos'

type Parametros = {
  id: string
}

type DadosTreino = Pick<Treino, 'nome' | 'exercicios'>

function dadosValidos(dados: unknown): dados is DadosTreino {
  if (!dados || typeof dados !== 'object') {
    return false
  }

  const treino = dados as Partial<DadosTreino>

  return (
    typeof treino.nome === 'string' &&
    treino.nome.trim().length > 0 &&
    Array.isArray(treino.exercicios) &&
    treino.exercicios.every((exercicio) =>
      exercicio !== null &&
      typeof exercicio === 'object' &&
      Number.isInteger(exercicio.id) &&
      typeof exercicio.nome === 'string' &&
      typeof exercicio.categoria === 'string' &&
      typeof exercicio.equipamento === 'string' &&
      (exercicio.tipo === undefined ||
        exercicio.tipo === 'musculacao' ||
        exercicio.tipo === 'cardio') &&
      typeof exercicio.series === 'number' &&
      exercicio.series >= 0 &&
      typeof exercicio.repeticoes === 'number' &&
      exercicio.repeticoes >= 0 &&
      typeof exercicio.carga === 'number' &&
      exercicio.carga >= 0 &&
      (exercicio.tempoMinutos === undefined ||
        (typeof exercicio.tempoMinutos === 'number' &&
          exercicio.tempoMinutos >= 0))
    )
  )
}

export async function rotasTreinos(app: FastifyInstance) {

  // GET - Listar treinos
  app.get('/treinos', async () => {
    return treinos
  })

  // GET - Buscar por ID
  app.get<{ Params: Parametros }>(
    '/treinos/:id',
    async (request, reply) => {
      const treino = treinos.find(
        (item) => item.id === request.params.id
      )

      if (!treino) {
        return reply.code(404).send({
          erro: 'Treino não encontrado',
        })
      }

      return treino
    }
  )

  // POST - Criar treino
  app.post<{ Body: DadosTreino }>(
    '/treinos',
    async (request, reply) => {
      if (!dadosValidos(request.body)) {
        return reply.code(400).send({
          erro: 'Dados inválidos',
        })
      }

      const novoTreino: Treino = {
        id: randomUUID(),
        nome: request.body.nome.trim(),
        exercicios: request.body.exercicios,
        criadoEm: new Date().toISOString(),
      }

      treinos.push(novoTreino)

      return reply.code(201).send(novoTreino)
    }
  )

  // PUT - Atualizar treino
  app.put<{
    Params: Parametros
    Body: DadosTreino
  }>(
    '/treinos/:id',
    async (request, reply) => {
      const indice = treinos.findIndex(
        (item) => item.id === request.params.id
      )

      if (indice === -1) {
        return reply.code(404).send({
          erro: 'Treino não encontrado',
        })
      }

      if (!dadosValidos(request.body)) {
        return reply.code(400).send({
          erro: 'Dados inválidos',
        })
      }

      const atualizado: Treino = {
        ...treinos[indice],
        nome: request.body.nome.trim(),
        exercicios: request.body.exercicios,
      }

      treinos[indice] = atualizado

      return atualizado
    }
  )

  // DELETE - Excluir treino
  app.delete<{ Params: Parametros }>(
    '/treinos/:id',
    async (request, reply) => {
      const indice = treinos.findIndex(
        (item) => item.id === request.params.id
      )

      if (indice === -1) {
        return reply.code(404).send({
          erro: 'Treino não encontrado',
        })
      }

      if (treinos.length <= 1) {
        return reply.code(400).send({
          erro: 'É necessário manter pelo menos um treino',
        })
      }

      treinos.splice(indice, 1)

      return reply.code(204).send()
    }
  )
}
