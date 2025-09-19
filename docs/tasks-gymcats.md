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

## Testes e fixtures
- Usar Vitest para testes unitários e de integração leves. O script `test` já está configurado para rodar o Vitest (ver `package.json`).
- Substituir scripts de criação de fixtures por um seed do Prisma (`prisma/seed.ts`). Use `pnpm prisma db seed` (ou `npm run prisma db seed`) para popular o banco local e nas pipelines de CI antes de rodar testes de integração.
- Para criar usuários e dados de teste, inclua funções idempotentes no `prisma/seed.ts` para poder rodar o seed várias vezes durante desenvolvimento.

Padrão recomendado (Prisma seed)
- Adicione uma entrada `prisma.seed` no `package.json` que invoque `ts-node --transpile-only prisma/seed.ts` (ou `node` em JS). Isso permite usar `prisma db seed` sem scripts ad-hoc.
- Exemplo (já adicionado ao `package.json` deste repositório):
  - "prisma": { "seed": "ts-node --transpile-only prisma/seed.ts" }

Comandos úteis:
```bash
# gerar client
pnpm prisma generate

# aplicar migrações em dev
pnpm prisma migrate dev

# rodar seed (usa a configuração `prisma.seed` do package.json)
pnpm prisma db seed

# rodar testes
pnpm test
```
