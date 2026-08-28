import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const name = user?.user_metadata?.name || 'Motorista'
  const email = user?.email || ''

  return (
    <div>
      <Header title="Perfil" subtitle="Suas informações e preferências." />

      <Card className="mb-4 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/20 text-xl font-semibold text-brand-200">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-base font-semibold text-ink-high">{name}</p>
          <p className="text-sm text-ink-mid">{email}</p>
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        <MenuItem as={Link} to="/app/relatorios" label="Relatórios" />
        <MenuItem label="Editar dados pessoais" />
        <MenuItem label="Veículo e cidade" />
        <MenuItem label="Notificações" />
        <MenuItem label="Ajuda e suporte" />
      </div>

      <Button variant="danger" className="mt-6 w-full" onClick={handleSignOut}>
        Sair da conta
      </Button>
    </div>
  )
}

function MenuItem({ label, as: Comp = 'div', ...props }) {
  return (
    <Card as={Comp} className="flex items-center justify-between py-3.5" {...props}>
      <span className="text-sm font-medium text-ink-high">{label}</span>
      <span className="text-ink-low">›</span>
    </Card>
  )
}
