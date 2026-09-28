import {
  useEffect,
  useState,
} from 'react'

import {
  CalendarDays,
  Clock,
  Dumbbell,
  History,
  TrendingUp,
  Trophy,
} from 'lucide-react'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  buscarHistorico,
} from '../services/workoutStorage'

import type {
  ProgressRecord,
} from '../types/Progress'

function formatarData(data: string) {
  const [ano, mes, dia] =
    data.split('-')

  return `${dia}/${mes}/${ano}`
}

function formatarDataCurta(
  data: string,
) {
  const [, mes, dia] =
    data.split('-')

  return `${dia}/${mes}`
}

function Progress() {
  const [
    historico,
    setHistorico,
  ] = useState<ProgressRecord[]>([])

  const [
    exercicioSelecionado,
    setExercicioSelecionado,
  ] = useState<number | null>(null)

  useEffect(() => {
    const dados =
      buscarHistorico().sort(
        (a, b) =>
          a.data.localeCompare(b.data),
      )

    setHistorico(dados)

    if (dados.length > 0) {
      setExercicioSelecionado(
        dados[0].exercicioId,
      )
    }
  }, [])

  const exercicios = Array.from(
    new Map(
      historico.map((registro) => [
        registro.exercicioId,
        registro.nome,
      ]),
    ).entries(),
  ).map(([id, nome]) => ({
    id,
    nome,
  }))

  const registrosDoExercicio =
    historico
      .filter(
        (registro) =>
          registro.exercicioId ===
          exercicioSelecionado,
      )
      .sort(
        (a, b) =>
          a.data.localeCompare(b.data),
      )

  const cardio =
    registrosDoExercicio.some(
      (registro) =>
        registro.tipo === 'cardio' ||
        typeof registro.tempoMinutos ===
          'number',
    )

  /*
    Registros antigos de cardio podem
    não possuir tempoMinutos.

    Para o gráfico, usamos somente
    registros que realmente possuem
    tempo.
  */

  const registrosComMedida =
    cardio
      ? registrosDoExercicio.filter(
          (registro) =>
            typeof registro.tempoMinutos ===
            'number',
        )
      : registrosDoExercicio

  const primeiroRegistro =
    registrosComMedida[0]

  const ultimoRegistro =
    registrosComMedida[
      registrosComMedida.length - 1
    ]

  function obterValor(
    registro:
      | ProgressRecord
      | undefined,
  ) {
    if (!registro) {
      return 0
    }

    if (cardio) {
      return (
        registro.tempoMinutos ??
        0
      )
    }

    return registro.carga
  }

  const primeiroValor =
    obterValor(primeiroRegistro)

  const ultimoValor =
    obterValor(ultimoRegistro)

  const evolucao =
    primeiroRegistro &&
    ultimoRegistro
      ? ultimoValor -
        primeiroValor
      : 0

  const maiorValor =
    registrosComMedida.length > 0
      ? Math.max(
          ...registrosComMedida.map(
            (registro) =>
              obterValor(registro),
          ),
        )
      : 0

  const dadosGrafico =
    registrosComMedida.map(
      (registro) => ({
        data:
          formatarDataCurta(
            registro.data,
          ),

        valor:
          obterValor(registro),
      }),
    )

  const unidade =
    cardio ? 'min' : 'kg'

  const tituloAtual =
    cardio
      ? 'Tempo atual'
      : 'Carga atual'

  const tituloMaior =
    cardio
      ? 'Maior tempo'
      : 'Maior carga'

  const tituloGrafico =
    cardio
      ? 'Evolução do tempo'
      : 'Evolução da carga'

  const tituloPrimeiro =
    cardio
      ? 'Primeiro tempo'
      : 'Primeira carga'

  if (historico.length === 0) {
    return (
      <div className="progress-page">
        <section className="page-heading">
          <span className="section-label">
            EVOLUÇÃO
          </span>

          <h2>
            Meu Progresso
          </h2>

          <p>
            Acompanhe sua evolução de
            cargas e tempos ao longo
            dos treinos.
          </p>
        </section>

        <section className="empty-progress">
          <div className="empty-progress-icon">
            <TrendingUp size={36} />
          </div>

          <h3>
            Ainda não existem registros
          </h3>

          <p>
            Vá até Meus Treinos,
            registre um treino e sua
            evolução aparecerá aqui.
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className="progress-page">
      <section className="page-heading">
        <span className="section-label">
          EVOLUÇÃO
        </span>

        <h2>
          Meu Progresso
        </h2>

        <p>
          Acompanhe suas cargas e
          tempos, compare seus registros
          e visualize sua evolução em
          cada exercício.
        </p>
      </section>

      <section className="progress-filter-card">
        <div>
          <span>
            Exercício analisado
          </span>

          <strong>
            Escolha um exercício para
            visualizar o histórico.
          </strong>
        </div>

        <select
          value={
            exercicioSelecionado ??
            ''
          }
          onChange={(event) =>
            setExercicioSelecionado(
              Number(
                event.target.value,
              ),
            )
          }
        >
          {exercicios.map(
            (exercicio) => (
              <option
                value={exercicio.id}
                key={exercicio.id}
              >
                {exercicio.nome}
              </option>
            ),
          )}
        </select>
      </section>

      <section className="progress-stats">
        <article className="progress-stat-card">
          <div className="progress-stat-icon">
            {cardio ? (
              <Clock size={22} />
            ) : (
              <Dumbbell size={22} />
            )}
          </div>

          <div>
            <span>
              {tituloAtual}
            </span>

            <strong>
              {ultimoValor}{' '}
              {unidade}
            </strong>
          </div>
        </article>

        <article className="progress-stat-card">
          <div className="progress-stat-icon">
            <TrendingUp
              size={22}
            />
          </div>

          <div>
            <span>
              Evolução total
            </span>

            <strong>
              {evolucao > 0
                ? '+'
                : ''}

              {evolucao}{' '}
              {unidade}
            </strong>
          </div>
        </article>

        <article className="progress-stat-card">
          <div className="progress-stat-icon">
            <Trophy size={22} />
          </div>

          <div>
            <span>
              {tituloMaior}
            </span>

            <strong>
              {maiorValor}{' '}
              {unidade}
            </strong>
          </div>
        </article>

        <article className="progress-stat-card">
          <div className="progress-stat-icon">
            <CalendarDays
              size={22}
            />
          </div>

          <div>
            <span>
              Registros
            </span>

            <strong>
              {
                registrosComMedida.length
              }
            </strong>
          </div>
        </article>
      </section>

      <div className="progress-content-grid">
        <section className="progress-chart-card">
          <div className="progress-card-heading">
            <div>
              <span className="section-label">
                {cardio
                  ? 'TEMPO'
                  : 'CARGA'}
              </span>

              <h3>
                {tituloGrafico}
              </h3>
            </div>

            <span className="progress-current-weight">
              Atual:{' '}

              <strong>
                {ultimoValor}{' '}
                {unidade}
              </strong>
            </span>
          </div>

          {dadosGrafico.length ===
          0 ? (
            <div className="single-record-message">
              {cardio ? (
                <Clock size={30} />
              ) : (
                <TrendingUp
                  size={30}
                />
              )}

              <h4>
                Nenhum registro válido
              </h4>

              <p>
                Registre este exercício
                novamente para começar
                a acompanhar sua
                evolução.
              </p>
            </div>
          ) : dadosGrafico.length ===
            1 ? (
            <div className="single-record-message">
              <TrendingUp
                size={30}
              />

              <h4>
                Primeiro registro
                realizado
              </h4>

              <p>
                Registre este exercício
                novamente em outro
                treino para visualizar
                sua curva de evolução.
              </p>
            </div>
          ) : (
            <div className="progress-chart">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={dadosGrafico}
                  margin={{
                    top: 10,
                    right: 20,
                    bottom: 0,
                    left: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="data"
                    tick={{
                      fill:
                        '#64748b',
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    unit={` ${unidade}`}
                    tick={{
                      fill:
                        '#64748b',
                      fontSize: 12,
                    }}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="valor"
                    name={
                      cardio
                        ? 'Tempo'
                        : 'Carga'
                    }
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill:
                        '#ffffff',
                      stroke:
                        '#0ea5e9',
                      strokeWidth: 3,
                    }}
                    activeDot={{
                      r: 7,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="progress-summary-card">
          <span className="section-label">
            RESUMO
          </span>

          <h3>
            Evolução registrada
          </h3>

          <div className="progress-comparison">
            <div>
              <span>
                {tituloPrimeiro}
              </span>

              <strong>
                {primeiroValor}{' '}
                {unidade}
              </strong>
            </div>

            <div className="comparison-arrow">
              →
            </div>

            <div>
              <span>
                {tituloAtual}
              </span>

              <strong>
                {ultimoValor}{' '}
                {unidade}
              </strong>
            </div>
          </div>

          <div className="progress-difference">
            <TrendingUp size={21} />

            <div>
              <span>
                Diferença
              </span>

              <strong>
                {evolucao > 0
                  ? '+'
                  : ''}

                {evolucao}{' '}
                {unidade}
              </strong>
            </div>
          </div>
        </section>
      </div>

      <section className="progress-history-card">
        <div className="progress-card-heading">
          <div>
            <span className="section-label">
              HISTÓRICO
            </span>

            <h3>
              Registros do exercício
            </h3>
          </div>

          <History size={23} />
        </div>

        <div className="progress-history-table">
          {cardio ? (
            <>
              <div className="history-table-header">
                <span>
                  Data
                </span>

                <span>
                  Tempo
                </span>

                <span>
                  Tipo
                </span>

                <span>
                  Treino
                </span>
              </div>

              {[
                ...registrosDoExercicio,
              ]
                .reverse()
                .map(
                  (registro) => (
                    <div
                      className="history-table-row"
                      key={
                        registro.id
                      }
                    >
                      <span>
                        {formatarData(
                          registro.data,
                        )}
                      </span>

                      <strong>
                        {typeof registro
                          .tempoMinutos ===
                        'number'
                          ? `${registro.tempoMinutos} min`
                          : 'Sem registro'}
                      </strong>

                      <span>
                        Cardio
                      </span>

                      <span>
                        {registro.treinoNome ??
                          'Treino'}
                      </span>
                    </div>
                  ),
                )}
            </>
          ) : (
            <>
              <div className="history-table-header">
                <span>
                  Data
                </span>

                <span>
                  Carga
                </span>

                <span>
                  Séries
                </span>

                <span>
                  Repetições
                </span>
              </div>

              {[
                ...registrosDoExercicio,
              ]
                .reverse()
                .map(
                  (registro) => (
                    <div
                      className="history-table-row"
                      key={
                        registro.id
                      }
                    >
                      <span>
                        {formatarData(
                          registro.data,
                        )}
                      </span>

                      <strong>
                        {
                          registro.carga
                        }{' '}
                        kg
                      </strong>

                      <span>
                        {
                          registro.series
                        }
                      </span>

                      <span>
                        {
                          registro.repeticoes
                        }
                      </span>
                    </div>
                  ),
                )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Progress