# ✅ Tasks – Projeto Gymcats

## 🔧 Setup Inicial
- [x] Criar projeto com `create-next-app` (App Router, TypeScript)
- [x] Configurar Tailwind CSS
- [x] Instalar e configurar `next-auth`
- [x] Instalar Prisma e configurar PostgreSQL (via Neon/Railway)
- [ ] Configurar `next-pwa`

## 🧩 Autenticação
- [x] Setup NextAuth com Google e Credentials
- [x] Página de login com formulário de registro
- [x] Criação de usuário de teste
- [x] Proteção de rotas (middleware ou hooks)

## 📈 Lógica do Desafio
- [x] Modelar entidades no Prisma: User, ActivityLog, Bonus, Penalties, Score
- [x] Criar lógica de pontuação diária
- [x] Lógica de bônus por consistência (3 e 5 dias)
- [x] Penalidades automáticas por ausência
- [x] Reset semanal para penalidades

## 🖼️ UI/UX
- [x] Tela de Dashboard com:
  - [x] Registro de água (marcação simples de "feito")
  - [x] Registro de treino de resistência (marcação simples de "feito")
  - [x] Registro de cardio (marcação simples de "feito")
  - [x] Barra de progresso diária
  - [x] Pontuação total e diária
- [ ] Tela de Histórico
- [ ] Tela de Regras (resumo do desafio)
- [ ] Avatar/mascote da gata
- [x] Ícones e estilo visual

## 📱 PWA
- [ ] Configurar manifest e icons
- [ ] Instalação no celular
- [ ] Offline support

## 🚀 Deploy
- [x] Deploy automático via Vercel
- [x] Variáveis de ambiente (.env) seguras

## ✅ Extras
- [ ] Tema claro/escuro
- [x] Ranking de usuários (pontos totais)
- [ ] Notificações (via browser ou email)

## 📦 Bibliotecas
- `next-auth`
- `prisma`, `@prisma/client`
- `react-hook-form`
- `zod`
- `clsx`
- `next-pwa`
- `bcryptjs` (para autenticação por senha)
