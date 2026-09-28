import type {
  Exercise,
  ExerciseApiResponse,
} from '../types/Exercise'

const EXERCISES_API_URL =
  '/wger/api/v2/exerciseinfo/?limit=60'

const LANGUAGES_API_URL =
  '/wger/api/v2/language/?limit=100'

interface Language {
  id: number
  short_name: string
  full_name: string
  full_name_en: string
}

interface LanguageApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Language[]
}

export interface ExerciseLanguageIds {
  ingles: number | null
  portugues: number | null
}

export async function buscarExercicios(): Promise<
  Exercise[]
> {
  const resposta = await fetch(
    EXERCISES_API_URL,
  )

  if (!resposta.ok) {
    throw new Error(
      'Não foi possível carregar os exercícios.',
    )
  }

  const dados: ExerciseApiResponse =
    await resposta.json()

  return dados.results
}

export async function buscarIdsIdiomas(): Promise<
  ExerciseLanguageIds
> {
  const resposta = await fetch(
    LANGUAGES_API_URL,
  )

  if (!resposta.ok) {
    throw new Error(
      'Não foi possível carregar os idiomas.',
    )
  }

  const dados: LanguageApiResponse =
    await resposta.json()

  const ingles = dados.results.find(
    (idioma) =>
      idioma.short_name.toLowerCase() === 'en',
  )

  const portugues = dados.results.find(
    (idioma) =>
      idioma.short_name.toLowerCase() === 'pt',
  )

  return {
    ingles: ingles?.id ?? null,
    portugues: portugues?.id ?? null,
  }
}