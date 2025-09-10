import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    // Se estiver logado, redirecionar para o dashboard
    redirect('/dashboard')
  } else {
    // Se não estiver logado, redirecionar para login
    redirect('/auth/signin')
  }
}
