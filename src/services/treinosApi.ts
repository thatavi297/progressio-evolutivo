
import type { Workout } from '../types/Workout'

const API_URL = 'http://localhost:3333'

type DadosTreino = Pick<Workout, 'nome' | 'exercicios'>

async function verificarResposta(response: Response) {
  if (!response.ok) {
    const dados = await response.json().catch(() => null)

    throw new Error(
      dados?.erro || `Erro HTTP: ${response.status}`
    )
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

// GET - Listar treinos
export async function listarTreinos(): Promise<Workout[]> {
  const response = await fetch(`${API_URL}/treinos`)
  return verificarResposta(response)
}

// GET - Buscar treino pelo ID
export async function buscarTreinoPorId(
  id: string
): Promise<Workout> {
  const response = await fetch(
    `${API_URL}/treinos/${encodeURIComponent(id)}`
  )

  return verificarResposta(response)
}

// POST - Criar treino
export async function cadastrarTreino(
  dados: DadosTreino
): Promise<Workout> {
  const response = await fetch(`${API_URL}/treinos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })

  return verificarResposta(response)
}

// PUT - Atualizar treino
export async function atualizarTreino(
  id: string,
  dados: DadosTreino
): Promise<Workout> {
  const response = await fetch(
    `${API_URL}/treinos/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    }
  )

  return verificarResposta(response)
}

// DELETE - Excluir treino
export async function deletarTreino(
  id: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/treinos/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
    }
  )

  await verificarResposta(response)
}
