import type {
  ExerciseType,
} from './Workout'

export interface ProgressRecord {
  id: string

  exercicioId: number
  nome: string
  data: string

  tipo?: ExerciseType

  carga: number
  series: number
  repeticoes: number

  tempoMinutos?: number

  treinoId?: string
  treinoNome?: string
}