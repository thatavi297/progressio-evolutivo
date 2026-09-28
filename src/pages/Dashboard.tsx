import {
  useEffect,
  useState,
} from 'react'

import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  TrendingUp,
  Trophy,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import StatCard from '../components/StatCard'

import {
  buscarHistorico,
  buscarTreinos,
} from '../services/workoutStorage'

import type {
  ProgressRecord,
} from '../types/Progress'

import type {
  Workout,
  WorkoutExercise,
} from '../types/Workout'

interface ExerciseEvolution {
  exercicioId: number
  nome: string
  valorInicial: number
  valorAtual: number
  diferenca: number
  ultimaData: string
  unidade: 'kg' | 'min'
}

function ehCardio(
  exercicio: WorkoutExercise,
) {
  if (exercicio.tipo === 'cardio') {
    return true
  }

  const categoria =
    exercicio.categoria
      ?.toLowerCase()
      .trim() ?? ''

  return (
    categoria.includes('cardio') ||
    categoria.includes(
      'cardiovascular',
    )
  )
}

function Dashboard() {
  const navigate = useNavigate()

  const [treinos, setTreinos] =
    useState<Workout[]>([])

  const [historico, setHistorico] =
    useState<ProgressRecord[]>([])

  useEffect(() => {
    setTreinos(buscarTreinos())
    setHistorico(buscarHistorico())
  }, [])

  const totalExercicios =
    treinos.reduce(
      (total, treino) =>
        total + treino.exercicios.length,
      0,
    )

  const sessoesRegistradas =
    new Set(
      historico.map(
        (registro) =>
          `${registro.data}-${
            registro.treinoId ??
            registro.treinoNome ??
            'treino'
          }`,
      ),
    ).size

  const historicoPorExercicio =
    new Map<number, ProgressRecord[]>()

  historico.forEach((registro) => {
    const registros =
      historicoPorExercicio.get(
        registro.exercicioId,
      ) ?? []

    registros.push(registro)

    historicoPorExercicio.set(
      registro.exercicioId,
      registros,
    )
  })

  const evolucoes: ExerciseEvolution[] =
    Array.from(
      historicoPorExercicio.entries(),
    )
      .map(
        ([exercicioId, registros]) => {
          const cardio =
            registros.some(
              (registro) =>
                registro.tipo ===
                  'cardio' ||
                typeof registro
                  .tempoMinutos ===
                  'number',
            )

          const registrosValidos =
            cardio
              ? registros.filter(
                  (registro) =>
                    typeof registro
                      .tempoMinutos ===
                    'number',
                )
              : registros

          const ordenados = [
            ...registrosValidos,
          ].sort(
            (a, b) =>
              a.data.localeCompare(
                b.data,
              ),
          )

          const primeiro =
            ordenados[0]

          const ultimo =
            ordenados[
              ordenados.length - 1
            ]

          if (!primeiro || !ultimo) {
            return null
          }

          const valorInicial =
            cardio
              ? primeiro.tempoMinutos ??
                0
              : primeiro.carga

          const valorAtual =
            cardio
              ? ultimo.tempoMinutos ??
                0
              : ultimo.carga

          return {
            exercicioId,
            nome: ultimo.nome,
            valorInicial,
            valorAtual,
            diferenca:
              valorAtual -
              valorInicial,
            ultimaData:
              ultimo.data,
            unidade:
              cardio
                ? 'min'
                : 'kg',
          } as ExerciseEvolution
        },
      )
      .filter(
        (
          item,
        ): item is ExerciseEvolution =>
          item !== null,
      )

  const exerciciosEvoluindo =
    evolucoes.filter(
      (item) =>
        item.diferenca > 0,
    ).length

  const evolucoesRecentes =
    [...evolucoes]
      .filter(
        (item) =>
          item.diferenca !== 0,
      )
      .sort(
        (a, b) =>
          b.ultimaData.localeCompare(
            a.ultimaData,
          ),
      )
      .slice(0, 3)

  const registroMaisRecente =
    historico.length > 0
      ? [...historico].sort(
          (a, b) =>
            b.data.localeCompare(
              a.data,
            ),
        )[0]
      : null

  const treinoMaisRecente =
    registroMaisRecente
      ? treinos.find(
          (treino) =>
            treino.id ===
            registroMaisRecente.treinoId,
        )
      : null

  const treinoDestaque =
    treinoMaisRecente ??
    treinos[0] ??
    null

  const exerciciosDestaque =
    treinoDestaque?.exercicios.slice(
      0,
      3,
    ) ?? []

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <span className="section-label">
            VISÃO GERAL
          </span>

          <h2>
            Olá! Pronto para evoluir?
          </h2>

          <p>
            Acompanhe suas fichas,
            registre suas cargas e
            tempos e visualize seu
            progresso.
          </p>
        </div>

        <button
          className="primary-action"
          onClick={() =>
            navigate('/treinos')
          }
        >
          Ver meus treinos

          <ArrowRight size={18} />
        </button>
      </section>

      <section className="dashboard-stats">
        <StatCard
          titulo="Fichas de treino"
          valor={treinos.length}
          icone={
            <ClipboardList size={23} />
          }
        />

        <StatCard
          titulo="Exercícios nas fichas"
          valor={totalExercicios}
          icone={
            <Dumbbell size={23} />
          }
        />

        <StatCard
          titulo="Treinos registrados"
          valor={sessoesRegistradas}
          icone={
            <CalendarDays size={23} />
          }
        />

        <StatCard
          titulo="Exercícios evoluindo"
          valor={exerciciosEvoluindo}
          icone={
            <TrendingUp size={23} />
          }
        />
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-panel">
          <div className="panel-header">
            <div>
              <span className="section-label">
                {registroMaisRecente
                  ? 'ÚLTIMO TREINO'
                  : 'TREINO EM DESTAQUE'}
              </span>

              <h3>
                {treinoDestaque?.nome ??
                  'Nenhum treino'}
              </h3>
            </div>

            <button
              className="text-button"
              onClick={() =>
                navigate('/treinos')
              }
            >
              Ver fichas
            </button>
          </div>

          {!treinoDestaque ||
          exerciciosDestaque.length ===
            0 ? (
            <div className="dashboard-empty">
              <Dumbbell size={29} />

              <strong>
                Nenhum exercício
                cadastrado
              </strong>

              <p>
                Adicione exercícios
                para começar a montar
                suas fichas.
              </p>

              <button
                className="text-button"
                onClick={() =>
                  navigate('/exercicios')
                }
              >
                Explorar exercícios
              </button>
            </div>
          ) : (
            <div className="current-workout-list">
              {exerciciosDestaque.map(
                (exercicio) => {
                  const cardio =
                    ehCardio(exercicio)

                  return (
                    <div
                      className="workout-exercise-row"
                      key={exercicio.id}
                    >
                      <div>
                        <strong>
                          {exercicio.nome}
                        </strong>

                        <span>
                          {cardio
                            ? `${exercicio.tempoMinutos ?? 0} minutos de cardio`
                            : `${exercicio.series} séries × ${exercicio.repeticoes} repetições`}
                        </span>
                      </div>

                      <div className="exercise-weight">
                        <strong>
                          {cardio
                            ? `${exercicio.tempoMinutos ?? 0} min`
                            : `${exercicio.carga} kg`}
                        </strong>

                        <span>
                          {cardio
                            ? 'Tempo atual'
                            : 'Carga atual'}
                        </span>
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          )}
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <div>
              <span className="section-label">
                PROGRESSO RECENTE
              </span>

              <h3>
                Evolução registrada
              </h3>
            </div>

            <button
              className="text-button"
              onClick={() =>
                navigate('/progresso')
              }
            >
              Ver tudo
            </button>
          </div>

          {evolucoesRecentes.length ===
          0 ? (
            <div className="dashboard-empty">
              <TrendingUp
                size={29}
              />

              <strong>
                Sem evolução registrada
              </strong>

              <p>
                Registre o mesmo
                exercício mais de uma
                vez para acompanhar sua
                evolução.
              </p>
            </div>
          ) : (
            <div className="progress-list">
              {evolucoesRecentes.map(
                (item) => (
                  <div
                    className="progress-item"
                    key={item.exercicioId}
                  >
                    <div>
                      <strong>
                        {item.nome}
                      </strong>

                      <span>
                        {item.valorInicial}{' '}
                        {item.unidade}
                        {' → '}
                        {item.valorAtual}{' '}
                        {item.unidade}
                      </span>
                    </div>

                    <div
                      className={
                        item.diferenca > 0
                          ? 'progress-badge'
                          : 'progress-badge progress-badge-negative'
                      }
                    >
                      {item.diferenca > 0
                        ? '+'
                        : ''}

                      {item.diferenca}{' '}
                      {item.unidade}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      </div>

      <section className="dashboard-start">
        <div>
          <span className="section-label">
            SEU DESEMPENHO
          </span>

          <h3>
            Acompanhe sua evolução
            treino após treino
          </h3>

          <p>
            Exercícios de musculação
            são acompanhados por carga,
            enquanto exercícios de
            cardio são acompanhados por
            tempo.
          </p>
        </div>

        <button
          className="secondary-action"
          onClick={() =>
            navigate('/progresso')
          }
        >
          Ver meu progresso

          <Trophy size={18} />
        </button>
      </section>
    </div>
  )
}

export default Dashboard