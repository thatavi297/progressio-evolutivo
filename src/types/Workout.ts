export type ExerciseType =
  | 'musculacao'
  | 'cardio'

export interface WorkoutExercise {
  id: number
  nome: string
  categoria: string
  equipamento: string

  tipo?: ExerciseType

  series: number
  repeticoes: number
  carga: number

  tempoMinutos?: number
}

export interface Workout {
  id: string
  nome: string
  exercicios: WorkoutExercise[]
  criadoEm: string
}