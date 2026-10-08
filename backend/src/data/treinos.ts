
export interface ExercicioTreino {
  id: number
  nome: string
  categoria: string
  equipamento: string
  tipo?: 'musculacao' | 'cardio'
  series: number
  repeticoes: number
  carga: number
  tempoMinutos?: number
}

export interface Treino {
  id: string
  nome: string
  exercicios: ExercicioTreino[]
  criadoEm: string
}

export const treinos: Treino[] = [
  {
    id: 'treino-a',
    nome: 'Treino A',
    exercicios: [],
    criadoEm: new Date().toISOString(),
  },
]
