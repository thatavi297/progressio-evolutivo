import {
  useEffect,
  useState,
} from 'react'

import {
  Dumbbell,
  Search,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import {
  buscarExercicios,
  buscarIdsIdiomas,
} from '../services/exerciseApi'

import type {
  Exercise,
  ExerciseTranslation,
} from '../types/Exercise'

interface Idiomas {
  ingles: number | null
  portugues: number | null
}

function Exercises() {
  const navigate = useNavigate()

  const [exercicios, setExercicios] =
    useState<Exercise[]>([])

  const [idiomas, setIdiomas] =
    useState<Idiomas>({
      ingles: null,
      portugues: null,
    })

  const [busca, setBusca] =
    useState('')

  const [categoria, setCategoria] =
    useState('Todas')

  const [carregando, setCarregando] =
    useState(true)

  const [erro, setErro] =
    useState('')

  async function carregarExercicios() {
    try {
      setCarregando(true)
      setErro('')

      const [
        dadosExercicios,
        dadosIdiomas,
      ] = await Promise.all([
        buscarExercicios(),
        buscarIdsIdiomas(),
      ])

      setExercicios(dadosExercicios)
      setIdiomas(dadosIdiomas)
    } catch {
      setErro(
        'Não conseguimos carregar os exercícios. Tente novamente.',
      )
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarExercicios()
  }, [])

  function obterTraducoes(
    exercicio: Exercise,
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
        ? exercicio.translations.find(
            (traducao) =>
              traducao.language ===
              idiomas.portugues,
          )
        : undefined

    const ingles =
      idiomas.ingles !== null
        ? exercicio.translations.find(
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

  const categorias = [
    'Todas',

    ...Array.from(
      new Set(
        exercicios
          .map(
            (exercicio) =>
              exercicio.category?.name,
          )
          .filter(Boolean),
      ),
    ),
  ]

  const exerciciosFiltrados =
    exercicios.filter((exercicio) => {
      const {
        portugues,
        ingles,
      } = obterTraducoes(exercicio)

      if (
        !portugues?.name &&
        !ingles?.name
      ) {
        return false
      }

      const nomes = [
        portugues?.name ?? '',
        ingles?.name ?? '',
      ]
        .join(' ')
        .toLowerCase()

      const correspondeBusca =
        nomes.includes(
          busca.toLowerCase(),
        )

      const correspondeCategoria =
        categoria === 'Todas' ||
        exercicio.category?.name ===
          categoria

      return (
        correspondeBusca &&
        correspondeCategoria
      )
    })

  return (
    <div className="exercises-page">
      <section className="page-heading">
        <div>
          <span className="section-label">
            CATÁLOGO
          </span>

          <h2>Exercícios</h2>

          <p>
            Encontre exercícios em
            português e inglês para
            montar seus treinos e
            acompanhar sua evolução.
          </p>
        </div>
      </section>

      <section className="exercise-tools">
        <div className="exercise-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Pesquisar em português ou inglês..."
            value={busca}
            onChange={(event) =>
              setBusca(
                event.target.value,
              )
            }
          />
        </div>

        <select
          className="exercise-select"
          value={categoria}
          onChange={(event) =>
            setCategoria(
              event.target.value,
            )
          }
        >
          {categorias.map(
            (item) => (
              <option
                value={item}
                key={item}
              >
                {item}
              </option>
            ),
          )}
        </select>
      </section>

      {!carregando && !erro && (
        <div className="exercise-result-count">
          <strong>
            {
              exerciciosFiltrados.length
            }
          </strong>{' '}
          exercícios encontrados
        </div>
      )}

      {carregando && (
        <section className="exercise-status">
          <div className="loading-circle" />

          <h3>
            Carregando exercícios...
          </h3>

          <p>
            Estamos buscando o catálogo
            para você.
          </p>
        </section>
      )}

      {erro && (
        <section className="exercise-status">
          <div className="error-icon">
            <AlertCircle size={28} />
          </div>

          <h3>
            Ops! Algo deu errado.
          </h3>

          <p>{erro}</p>

          <button
            className="primary-action"
            onClick={
              carregarExercicios
            }
          >
            <RefreshCw size={17} />
            Tentar novamente
          </button>
        </section>
      )}

      {!carregando && !erro && (
        <>
          {exerciciosFiltrados.length ===
          0 ? (
            <section className="exercise-status">
              <Search size={32} />

              <h3>
                Nenhum exercício
                encontrado
              </h3>

              <p>
                Tente pesquisar outro
                nome ou alterar o
                filtro.
              </p>
            </section>
          ) : (
            <section className="exercise-grid">
              {exerciciosFiltrados.map(
                (exercicio) => {
                  const {
                    portugues,
                    ingles,
                  } =
                    obterTraducoes(
                      exercicio,
                    )

                  return (
                    <article
                      className="exercise-card"
                      key={
                        exercicio.id
                      }
                    >
                      <div className="exercise-card-icon">
                        <Dumbbell
                          size={28}
                        />
                      </div>

                      <div className="exercise-card-content">
                        <span className="exercise-category">
                          {exercicio
                            .category
                            ?.name ??
                            'Exercício'}
                        </span>

                        <div className="exercise-language-name">
                          <span className="exercise-language-label">
                            PORTUGUÊS
                          </span>

                          <h3>
                            {portugues
                              ?.name ??
                              'Tradução não disponível'}
                          </h3>
                        </div>

                        <div className="exercise-language-name exercise-language-name-en">
                          <span className="exercise-language-label">
                            ENGLISH
                          </span>

                          <p>
                            {ingles
                              ?.name ??
                              'Translation not available'}
                          </p>
                        </div>

                        <div className="exercise-equipment">
                          {exercicio
                            .equipment
                            ?.length >
                          0 ? (
                            exercicio.equipment.map(
                              (
                                equipamento,
                              ) => (
                                <span
                                  key={
                                    equipamento.id
                                  }
                                >
                                  {
                                    equipamento.name
                                  }
                                </span>
                              ),
                            )
                          ) : (
                            <span>
                              Sem
                              equipamento
                              informado
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        className="exercise-details-button"
                        onClick={() =>
                          navigate(
                            `/exercicios/${exercicio.id}`,
                          )
                        }
                      >
                        Ver detalhes

                        <ArrowRight
                          size={17}
                        />
                      </button>
                    </article>
                  )
                },
              )}
            </section>
          )}
        </>
      )}
    </div>
  )
}

export default Exercises