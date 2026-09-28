import {
  ArrowLeft,
  Home,
  CircleHelp,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  function voltar() {
    navigate(-1)
  }

  function irParaInicio() {
    navigate('/dashboard')
  }

  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <div className="not-found-logo">
          P
        </div>

        <div className="not-found-icon">
          <CircleHelp size={42} />
        </div>

        <span className="not-found-code">
          ERRO 404
        </span>

        <h1>
          Página não encontrada
        </h1>

        <p>
          O endereço que você tentou acessar não existe ou foi alterado.
        </p>

        <div className="not-found-actions">
          <button
            type="button"
            className="not-found-secondary"
            onClick={voltar}
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <button
            type="button"
            className="not-found-primary"
            onClick={irParaInicio}
          >
            <Home size={18} />
            Ir para o painel
          </button>
        </div>

        <span className="not-found-brand">
          Progressio — Sua evolução, treino após treino.
        </span>
      </section>
    </main>
  )
}

export default NotFound