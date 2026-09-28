import {
  useEffect,
  useState,
} from 'react'

import {
  ArrowLeft,
  Dumbbell,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  buscarExercicios,
  buscarIdsIdiomas,
} from '../services/exerciseApi'

import {
  adicionarAoTreino,
  buscarTreinos,
} from '../services/workoutStorage'

import type {
  Exercise,
  ExerciseTranslation,
} from '../types/Exercise'

import type {
  Workout,
} from '../types/Workout'

interface Idiomas {
  ingles: number | null
  portugues: number | null
}

function ExerciseDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [exercicio, setExercicio] =
    useState<Exercise | null>(null)

  const [idiomas, setIdiomas] =
    useState<Idiomas>({
      ingles: null,
      portugues: null,
    })

  const [treinos, setTreinos] =
    useState<Workout[]>([])

  const [
    treinoSelecionadoId,
    setTreinoSelecionadoId,
  ] = useState('')

  const [carregando, setCarregando] =
    useState(true)

  const [erro, setErro] =
    useState('')

  const [series, setSeries] =
    useState(3)

  const [repeticoes, setRepeticoes] =
    useState(10)

  const [carga, setCarga] =
    useState(0)

  const [
    tempoMinutos,
    setTempoMinutos,
  ] = useState(30)

  const [mensagem, setMensagem] =
    useState('')

  const [
    tipoMensagem,
    setTipoMensagem,
  ] = useState<
    'sucesso' | 'erro' | ''
  >('')

  useEffect(() => {
    async function carregarDetalhes() {
      try {
        setCarregando(true)
        setErro('')

        const [
          exercicios,
          dadosIdiomas,
        ] = await Promise.all([
          buscarExercicios(),
          buscarIdsIdiomas(),
        ])

        const encontrado =
          exercicios.find(
            (item) =>
              item.id === Number(id),
          )

        if (!encontrado) {
          throw new Error()
        }

        setExercicio(encontrado)
        setIdiomas(dadosIdiomas)
      } catch {
        setErro(
          'Não foi possível carregar este exercício.',
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarDetalhes()
  }, [id])

  useEffect(() => {
    const dados =
      buscarTreinos()

    setTreinos(dados)

    if (dados.length > 0) {
      setTreinoSelecionadoId(
        dados[0].id,
      )
    }
  }, [])

  function obterTraducoes(
    item: Exercise,
  ): {
    portugues:
      | ExerciseTranslation
      | undefined
    ingles:
      | ExerciseTranslation
      | undefined
  } {
    const portugues =
      idiomas.portugues !== null
        ? item.translations.find(
            (traducao) =>
              traducao.language ===
              idiomas.portugues,
          )
        : undefined

    const ingles =
      idiomas.ingles !== null
        ? item.translations.find(
            (traducao) =>
              traducao.language ===
              idiomas.ingles,
          )
        : undefined

    return {
      portugues,
      ingles,
    }
  }

  function verificarCardio(
    item: Exercise,
  ) {
    const categoria =
      item.category?.name
        ?.toLowerCase()
        .trim() ?? ''

    return (
      categoria.includes('cardio') ||
      categoria.includes(
        'cardiovascular',
      )
    )
  }

  function adicionar() {
    if (!exercicio) {
      return
    }

    if (!treinoSelecionadoId) {
      setTipoMensagem('erro')

      setMensagem(
        'Escolha um treino para adicionar o exercício.',
      )

      return
    }

    const cardio =
      verificarCardio(exercicio)

    if (cardio) {
      if (tempoMinutos <= 0) {
        setTipoMensagem('erro')

        setMensagem(
          'Informe um tempo válido para o exercício.',
        )

        return
      }
    } else {
      if (series <= 0) {
        setTipoMensagem('erro')

        setMensagem(
          'Informe uma quantidade válida de séries.',
        )

        return
      }

      if (repeticoes <= 0) {
        setTipoMensagem('erro')

        setMensagem(
          'Informe uma quantidade válida de repetições.',
        )

        return
      }

      if (carga < 0) {
        setTipoMensagem('erro')

        setMensagem(
          'A carga não pode ser negativa.',
        )

        return
      }
    }

    const {
      portugues,
      ingles,
    } = obterTraducoes(exercicio)

    try {
      adicionarAoTreino(
        {
          id: exercicio.id,

          nome:
            portugues?.name ??
            ingles?.name ??
            'Exercício',

          categoria:
            exercicio.category
              ?.name ??
            'Não informada',

          equipamento:
            exercicio.equipment
              ?.map(
                (item) =>
                  item.name,
              )
              .join(', ') ||
            'Sem equipamento',

          tipo: cardio
            ? 'cardio'
            : 'musculacao',

          series: cardio
            ? 0
            : series,

          repeticoes: cardio
            ? 0
            : repeticoes,

          carga: cardio
            ? 0
            : carga,

          tempoMinutos: cardio
            ? tempoMinutos
            : undefined,
        },

        treinoSelecionadoId,
      )

      const treino =
        treinos.find(
          (item) =>
            item.id ===
            treinoSelecionadoId,
        )

      setTipoMensagem(
        'sucesso',
      )

      setMensagem(
        `Exercício adicionado ao ${
          treino?.nome ??
          'treino'
        }!`,
      )
    } catch (error) {
      setTipoMensagem('erro')

      if (
        error instanceof Error
      ) {
        setMensagem(
          error.message,
        )
      } else {
        setMensagem(
          'Não foi possível adicionar o exercício.',
        )
      }
    }
  }

  if (carregando) {
    return (
      <section className="exercise-status">
        <div className="loading-circle" />

        <h3>
          Carregando exercício...
        </h3>
      </section>
    )
  }

  if (erro || !exercicio) {
    return (
      <section className="exercise-status">
        <div className="error-icon">
          <AlertCircle
            size={28}
          />
        </div>

        <h3>
          Exercício não encontrado
        </h3>

        <p>{erro}</p>

        <button
          className="primary-action"
          onClick={() =>
            navigate(
              '/exercicios',
            )
          }
        >
          Voltar para exercícios
        </button>
      </section>
    )
  }

  const {
    portugues,
    ingles,
  } = obterTraducoes(exercicio)

  const cardio =
    verificarCardio(exercicio)

  return (
    <div className="exercise-details-page">
      <button
        className="back-button"
        onClick={() =>
          navigate('/exercicios')
        }
      >
        <ArrowLeft size={18} />

        Voltar para exercícios
      </button>

      <div className="exercise-details-grid">
        <section className="exercise-info-card">
          <div className="exercise-big-icon">
            {cardio ? (
              <Clock size={42} />
            ) : (
              <Dumbbell size={42} />
            )}
          </div>

          <span className="section-label">
            {exercicio.category
              ?.name ??
              'EXERCÍCIO'}
          </span>

          <div className="exercise-details-language">
            <span className="exercise-language-label">
              PORTUGUÊS
            </span>

            <h2>
              {portugues?.name ??
                'Tradução não disponível'}
            </h2>
          </div>

          <div className="exercise-details-english">
            <span className="exercise-language-label">
              ENGLISH
            </span>

            <h3>
              {ingles?.name ??
                'Translation not available'}
            </h3>
          </div>

          <div className="exercise-info-block">
            <span>
              Tipo
            </span>

            <strong>
              {cardio
                ? 'Cardio'
                : 'Musculação'}
            </strong>
          </div>

          <div className="exercise-info-block">
            <span>
              Equipamento
            </span>

            <strong>
              {exercicio.equipment
                ?.map(
                  (item) =>
                    item.name,
                )
                .join(', ') ||
                'Sem equipamento'}
            </strong>
          </div>

          <div className="exercise-description">
            <span>
              DESCRIÇÃO EM PORTUGUÊS
            </span>

            {portugues?.description ? (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    portugues.description,
                }}
              />
            ) : (
              <div>
                Tradução em português
                não disponível para este
                exercício.
              </div>
            )}
          </div>

          <div className="exercise-description exercise-description-english">
            <span>
              DESCRIPTION IN ENGLISH
            </span>

            {ingles?.description ? (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    ingles.description,
                }}
              />
            ) : (
              <div>
                English description is
                not available for this
                exercise.
              </div>
            )}
          </div>
        </section>

        <section className="workout-config-card">
          <span className="section-label">
            CONFIGURAR EXERCÍCIO
          </span>

          <h3>
            Adicionar ao meu treino
          </h3>

          <p className="config-description">
            {cardio
              ? 'Escolha a ficha e informe por quanto tempo você realiza este exercício.'
              : 'Escolha a ficha e informe séries, repetições e carga.'}
          </p>

          <div className="config-field">
            <label htmlFor="treino">
              Adicionar ao treino
            </label>

            <select
              id="treino"
              className="workout-select"
              value={
                treinoSelecionadoId
              }
              onChange={(event) => {
                setTreinoSelecionadoId(
                  event.target.value,
                )

                setMensagem('')
              }}
            >
              {treinos.map(
                (treino) => (
                  <option
                    value={
                      treino.id
                    }
                    key={
                      treino.id
                    }
                  >
                    {treino.nome}
                  </option>
                ),
              )}
            </select>
          </div>

          {cardio ? (
            <div className="config-field">
              <label htmlFor="tempo">
                Tempo do exercício
              </label>

              <div className="weight-input">
                <input
                  id="tempo"
                  type="number"
                  min="1"
                  step="1"
                  value={
                    tempoMinutos
                  }
                  onChange={(event) =>
                    setTempoMinutos(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                />

                <span>min</span>
              </div>

              <small>
                Informe quantos minutos
                você pretende realizar
                este exercício.
              </small>
            </div>
          ) : (
            <>
              <div className="config-fields">
                <div className="config-field">
                  <label htmlFor="series">
                    Séries
                  </label>

                  <input
                    id="series"
                    type="number"
                    min="1"
                    value={series}
                    onChange={(event) =>
                      setSeries(
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </div>

                <div className="config-field">
                  <label htmlFor="repeticoes">
                    Repetições
                  </label>

                  <input
                    id="repeticoes"
                    type="number"
                    min="1"
                    value={
                      repeticoes
                    }
                    onChange={(event) =>
                      setRepeticoes(
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />
                </div>
              </div>

              <div className="config-field">
                <label htmlFor="carga">
                  Carga atual
                </label>

                <div className="weight-input">
                  <input
                    id="carga"
                    type="number"
                    min="0"
                    step="0.5"
                    value={carga}
                    onChange={(event) =>
                      setCarga(
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />

                  <span>kg</span>
                </div>

                <small>
                  Informe a carga que
                  você utiliza atualmente
                  neste exercício.
                </small>
              </div>
            </>
          )}

          {mensagem && (
            <div
              className={
                tipoMensagem ===
                'sucesso'
                  ? 'detail-message detail-message-success'
                  : 'detail-message detail-message-error'
              }
            >
              {tipoMensagem ===
              'sucesso' ? (
                <CheckCircle2
                  size={19}
                />
              ) : (
                <AlertCircle
                  size={19}
                />
              )}

              <span>
                {mensagem}
              </span>
            </div>
          )}

          <button
            className="add-workout-button"
            onClick={adicionar}
          >
            {cardio ? (
              <Clock size={19} />
            ) : (
              <Dumbbell size={19} />
            )}

            Adicionar ao treino
          </button>

          {tipoMensagem ===
            'sucesso' && (
            <button
              className="go-workout-button"
              onClick={() =>
                navigate(
                  '/treinos',
                )
              }
            >
              Ver meus treinos
            </button>
          )}
        </section>
      </div>
    </div>
  )
}

export default ExerciseDetails