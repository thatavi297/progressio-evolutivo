import type {
  Workout,
  WorkoutExercise,
} from '../types/Workout'

import type {
  ProgressRecord,
} from '../types/Progress'

const WORKOUTS_KEY = 'progressio_treinos'
const LEGACY_WORKOUT_KEY = 'progressio_treino'
const HISTORY_KEY = 'progressio_historico'

function gerarId() {
  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`
}

function criarTreinoInicial(
  exercicios: WorkoutExercise[] = [],
): Workout {
  return {
    id: gerarId(),
    nome: 'Treino A',
    exercicios,
    criadoEm: new Date().toISOString(),
  }
}

export function buscarTreinos(): Workout[] {
  const dadosNovos =
    localStorage.getItem(WORKOUTS_KEY)

  if (dadosNovos) {
    try {
      const treinos: Workout[] =
        JSON.parse(dadosNovos)

      if (
        Array.isArray(treinos) &&
        treinos.length > 0
      ) {
        return treinos
      }
    } catch {
      // Se houver dados inválidos,
      // o treino será recriado abaixo.
    }
  }

  const dadosAntigos =
    localStorage.getItem(
      LEGACY_WORKOUT_KEY,
    )

  let exerciciosAntigos:
    WorkoutExercise[] = []

  if (dadosAntigos) {
    try {
      exerciciosAntigos =
        JSON.parse(dadosAntigos)
    } catch {
      exerciciosAntigos = []
    }
  }

  const treinoInicial =
    criarTreinoInicial(
      exerciciosAntigos,
    )

  const treinos = [
    treinoInicial,
  ]

  salvarTreinos(treinos)

  return treinos
}

export function salvarTreinos(
  treinos: Workout[],
): void {
  localStorage.setItem(
    WORKOUTS_KEY,
    JSON.stringify(treinos),
  )
}

export function criarTreino(
  nome: string,
): Workout {
  const treinos = buscarTreinos()

  const novoTreino: Workout = {
    id: gerarId(),
    nome,
    exercicios: [],
    criadoEm: new Date().toISOString(),
  }

  salvarTreinos([
    ...treinos,
    novoTreino,
  ])

  return novoTreino
}

export function renomearTreino(
  id: string,
  nome: string,
): Workout[] {
  const treinos =
    buscarTreinos()

  const atualizados =
    treinos.map((treino) =>
      treino.id === id
        ? {
            ...treino,
            nome,
          }
        : treino,
    )

  salvarTreinos(atualizados)

  return atualizados
}

export function excluirTreino(
  id: string,
): Workout[] {
  const treinos =
    buscarTreinos()

  if (treinos.length <= 1) {
    throw new Error(
      'Você precisa manter pelo menos um treino.',
    )
  }

  const atualizados =
    treinos.filter(
      (treino) =>
        treino.id !== id,
    )

  salvarTreinos(atualizados)

  return atualizados
}

export function adicionarAoTreino(
  exercicio: WorkoutExercise,
  treinoId?: string,
): void {
  const treinos =
    buscarTreinos()

  const destino =
    treinoId ??
    treinos[0]?.id

  if (!destino) {
    throw new Error(
      'Nenhum treino disponível.',
    )
  }

  const treino =
    treinos.find(
      (item) =>
        item.id === destino,
    )

  if (!treino) {
    throw new Error(
      'Treino não encontrado.',
    )
  }

  const jaExiste =
    treino.exercicios.some(
      (item) =>
        item.id === exercicio.id,
    )

  if (jaExiste) {
    throw new Error(
      'Este exercício já está neste treino.',
    )
  }

  const atualizados =
    treinos.map((item) =>
      item.id === destino
        ? {
            ...item,
            exercicios: [
              ...item.exercicios,
              exercicio,
            ],
          }
        : item,
    )

  salvarTreinos(atualizados)
}

export function buscarTreino():
  WorkoutExercise[] {
  return (
    buscarTreinos()[0]
      ?.exercicios ?? []
  )
}

export function salvarTreino(
  exercicios: WorkoutExercise[],
): void {
  const treinos =
    buscarTreinos()

  if (treinos.length === 0) {
    return
  }

  const atualizados = [
    {
      ...treinos[0],
      exercicios,
    },
    ...treinos.slice(1),
  ]

  salvarTreinos(atualizados)
}

export function buscarHistorico():
  ProgressRecord[] {
  const dados =
    localStorage.getItem(
      HISTORY_KEY,
    )

  if (!dados) {
    return []
  }

  try {
    return JSON.parse(dados)
  } catch {
    return []
  }
}

export function registrarTreino(
  exercicios: WorkoutExercise[],
  data: string,
  treino?: {
    id: string
    nome: string
  },
): void {
  const historicoAtual =
    buscarHistorico()

  const novosRegistros:
    ProgressRecord[] =
    exercicios.map(
      (exercicio, index) => ({
        id: `${Date.now()}-${exercicio.id}-${index}`,

        exercicioId:
          exercicio.id,

        nome:
          exercicio.nome,

        data,

        tipo:
          exercicio.tipo,

        carga:
          exercicio.carga,

        series:
          exercicio.series,

        repeticoes:
          exercicio.repeticoes,

        tempoMinutos:
          exercicio.tempoMinutos,

        treinoId:
          treino?.id,

        treinoNome:
          treino?.nome,
      }),
    )

  const historicoSemDuplicados =
    historicoAtual.filter(
      (registro) =>
        !novosRegistros.some(
          (novo) =>
            novo.exercicioId ===
              registro.exercicioId &&
            novo.data ===
              registro.data &&
            novo.treinoId ===
              registro.treinoId,
        ),
    )

  const atualizado = [
    ...historicoSemDuplicados,
    ...novosRegistros,
  ]

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(atualizado),
  )
}