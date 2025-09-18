import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ActivityCalendar } from '@/components/activity-calendar'

export default async function CalendarioPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return <div>Você precisa estar logado para ver o calendário.</div>
  }
  return (
    <div className="max-w-2xl mx-auto pt-16 md:pt-6">
      {/* <h1 className="text-3xl font-bold mb-4">Calendário de Atividades</h1> */}
      <ActivityCalendar userId={session.user.id} />
    </div>
  )
}
