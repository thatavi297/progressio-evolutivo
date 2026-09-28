import { useState } from 'react'
import { Dumbbell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { fazerLogin } from '../services/authStorage'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function entrar(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setErro('')

    const loginValido =
      fazerLogin(
        email.trim(),
        senha,
      )

    if (!loginValido) {
      setErro(
        'E-mail ou senha inválidos.',
      )

      return
    }

    navigate('/dashboard', {
      replace: true,
    })
  }

  return (
    <main className="login-page">
      <section className="login-left">
        <div className="brand">
          <div className="brand-icon">
            <Dumbbell size={27} />
          </div>

          <div>
            <h1>Progressio</h1>

            <p>
              Treinos e evolução
            </p>
          </div>
        </div>

        <div className="login-message">
          <span>
            SUA EVOLUÇÃO EM MOVIMENTO
          </span>

          <h2>
            Treine. Registre. Evolua.
          </h2>

          <p>
            Organize seus treinos,
            acompanhe suas cargas e
            tempos e visualize sua
            evolução ao longo do tempo.
          </p>
        </div>
      </section>

      <section className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <p className="login-small-title">
              PROGRESSIO
            </p>

            <h2>
              Acesse sua conta
            </h2>

            <p>
              Entre para organizar seus
              treinos e acompanhar sua
              evolução.
            </p>
          </div>

          <form onSubmit={entrar}>
            <div className="form-group">
              <label htmlFor="email">
                E-mail
              </label>

              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(event) => {
                  setEmail(
                    event.target.value,
                  )

                  setErro('')
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">
                Senha
              </label>

              <input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(event) => {
                  setSenha(
                    event.target.value,
                  )

                  setErro('')
                }}
              />
            </div>

            {erro && (
              <div className="login-error">
                {erro}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
            >
              Entrar
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Login