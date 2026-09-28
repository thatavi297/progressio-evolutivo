export interface ExerciseTranslation {
  id: number
  name: string
  description: string
  language: number
}

export interface ExerciseCategory {
  id: number
  name: string
}

export interface ExerciseEquipment {
  id: number
  name: string
}

export interface Exercise {
  id: number
  uuid: string

  category: ExerciseCategory

  translations: ExerciseTranslation[]

  equipment: ExerciseEquipment[]
}

export interface ExerciseApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Exercise[]
}