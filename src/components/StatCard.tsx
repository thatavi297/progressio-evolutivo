import type { ReactNode } from 'react'

interface StatCardProps {
  titulo: string
  valor: string | number
  icone: ReactNode
}

function StatCard({
  titulo,
  valor,
  icone,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-icon">
        {icone}
      </div>

      <div>
        <span>{titulo}</span>
        <strong>{valor}</strong>
      </div>
    </article>
  )
}

export default StatCard