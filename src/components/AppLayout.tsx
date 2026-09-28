import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import {
  LayoutDashboard,
  Dumbbell,
  ClipboardList,
  TrendingUp,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

import { useState } from 'react'

import {
  fazerLogout,
} from '../services/authStorage'

function AppLayout() {
  const navigate = useNavigate()

  const [menuAberto, setMenuAberto] =
    useState(false)

  function sair() {
    fazerLogout()

    navigate('/login', {
      replace: true,
    })
  }

  return (
    <div className="app-layout">
      <aside
        className={`sidebar ${
          menuAberto
            ? 'sidebar-open'
            : ''
        }`}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              P
            </div>

            <div>
              <h1>Progressio</h1>

              <span>
                Treine. Registre. Evolua.
              </span>
            </div>
          </div>

          <button
            className="sidebar-close"
            onClick={() =>
              setMenuAberto(false)
            }
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({
              isActive,
            }) =>
              isActive
                ? 'nav-item nav-item-active'
                : 'nav-item'
            }
            onClick={() =>
              setMenuAberto(false)
            }
          >
            <LayoutDashboard
              size={20}
            />

            <span>Painel</span>
          </NavLink>

          <NavLink
            to="/exercicios"
            className={({
              isActive,
            }) =>
              isActive
                ? 'nav-item nav-item-active'
                : 'nav-item'
            }
            onClick={() =>
              setMenuAberto(false)
            }
          >
            <Dumbbell size={20} />

            <span>
              Exercícios
            </span>
          </NavLink>

          <NavLink
            to="/treinos"
            className={({
              isActive,
            }) =>
              isActive
                ? 'nav-item nav-item-active'
                : 'nav-item'
            }
            onClick={() =>
              setMenuAberto(false)
            }
          >
            <ClipboardList
              size={20}
            />

            <span>
              Meus Treinos
            </span>
          </NavLink>

          <NavLink
            to="/progresso"
            className={({
              isActive,
            }) =>
              isActive
                ? 'nav-item nav-item-active'
                : 'nav-item'
            }
            onClick={() =>
              setMenuAberto(false)
            }
          >
            <TrendingUp
              size={20}
            />

            <span>
              Progresso
            </span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-button"
            onClick={sair}
          >
            <LogOut size={19} />

            <span>Sair</span>
          </button>
        </div>
      </aside>

      {menuAberto && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setMenuAberto(false)
          }
        />
      )}

      <div className="app-content">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() =>
              setMenuAberto(true)
            }
            aria-label="Abrir menu"
          >
            <Menu size={24} />
          </button>

          <div className="topbar-user">
            <div>
              <strong>
                Usuário Progressio
              </strong>

              <span>
                Meu acompanhamento
              </span>
            </div>

            <div className="user-avatar">
              U
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout