# 🐱 Gymcats - PWA Gamificada de Saúde

Uma aplicação web progressiva (PWA) gamificada para estabelecer e manter hábitos saudáveis através de um sistema de pontuação e desafios.

## 🎯 Funcionalidades

### ✅ Implementadas
- **Autenticação**: Login com Google e Email (NextAuth.js)
- **Sistema de Pontuação**: 
  - Água: 2L = +2 pts
  - Resistência: 30min = +3 pts  
  - Cardio: 20min = +2 pts
  - Máximo diário: 7 pts
- **Bônus por Consistência**:
  - 3 dias consecutivos = +3 pts
  - 5 dias consecutivos = +5 pts
- **Painel Interativo**: Registro e visualização de atividades
- **Histórico de Atividades**: Acompanhamento diário
- **Sequência (Streak)**: Contador de dias consecutivos
- **Interface Responsiva**: Design mobile-first
- **PWA Ready**: Manifest configurado

### 🚧 Em Desenvolvimento
- [ ] Penalidades automáticas
- [ ] Ranking entre usuários
- [ ] Notificações push
- [ ] Modo offline
- [ ] Ícones customizados do app

## 🛠️ Tecnologias

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js
- **Validação**: Zod + React Hook Form
- **PWA**: next-pwa (futuro)

## 🎨 Design System

### Cores
- Rosa pastel: `#FADADD`
- Rosa queimado: `#E75480` 
- Pink médio: `#FF69B4`
- Pink hot: `#FF1493`
- Cinza escuro: `#2D3748`

### Mascote
Gata estilizada simbolizando força e leveza 🐱

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL
### 🔧 Local setup (migrate + seed + test)

Recomenda-se usar o fluxo Prisma para gerar client, aplicar migrações e popular fixtures com seed.

1. Gere o client do Prisma:

```bash
pnpm prisma generate
# ou
npm run prisma:generate
```

2. Aplique migrações (desenvolvimento):

```bash
pnpm prisma migrate dev
```

3. Rode o seed (usa `prisma.seed` do `package.json`, que aponta para `prisma/seed.ts`):

```bash
pnpm prisma db seed
# ou
npm run seed
```

4. Rode os testes (Vitest):

```bash
pnpm test
# ou
npm test
```

Observações:
- Garanta que a variável de ambiente `DATABASE_URL` esteja configurada no seu `.env` antes de rodar migrações/seed.
- O seed é idempotente e cria um usuário de teste (`teste@gymcats.app`) e exemplos para popular o pódio.

### Instalação

1. **Clone o repositório**
\`\`\`bash
git clone <repo-url>
cd gymcats
\`\`\`

2. **Instale as dependências**
\`\`\`bash
npm install
\`\`\`

3. **Configure as variáveis de ambiente**
\`\`\`bash
cp .env.example .env
\`\`\`

Edite o `.env` com suas configurações:
\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/gymcats"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
\`\`\`

4. **Configure o banco de dados**
\`\`\`bash
# Iniciar Prisma dev server (desenvolvimento)
npx prisma dev

# OU configure seu próprio PostgreSQL e execute:
npx prisma migrate dev --name init
npx prisma generate
\`\`\`

5. **Execute a aplicação**
\`\`\`bash
npm run dev
\`\`\`

Acesse: [http://localhost:3000](http://localhost:3000)

### 🧪 Modo Demonstração

Para facilitar os testes durante o desenvolvimento, existe uma página de demonstração disponível em:
**[http://localhost:3000/demo](http://localhost:3000/demo)**

Esta página:
- Cria automaticamente um usuário de teste
- Permite registrar atividades
- Mostra toda a funcionalidade sem precisar configurar OAuth
- Funciona mesmo sem credenciais do Google configuradas

### ⚙️ Configuração OAuth (Opcional)

Para usar autenticação real com Google:

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google+ 
4. Crie credenciais OAuth 2.0
5. Configure as URLs autorizadas:
   - **Origens autorizadas**: \`http://localhost:3000\`
   - **URIs de redirecionamento**: \`http://localhost:3000/api/auth/callback/google\`
6. Adicione as credenciais no \`.env\`:
   \`\`\`env
   GOOGLE_CLIENT_ID="sua-client-id"
   GOOGLE_CLIENT_SECRET="sua-client-secret"
   \`\`\`

## 📊 Regras de Pontuação

### Pontos Diários
- ✅ **Água (≥2L)**: +2 pontos
- ✅ **Resistência (≥30min)**: +3 pontos  
- ✅ **Cardio (≥20min)**: +2 pontos
- 📊 **Máximo diário**: 7 pontos

### Bônus por Consistência
- 🔥 **3 dias consecutivos**: +3 pontos extras
- 🔥 **5 dias consecutivos**: +5 pontos extras

### Penalidades (futuro)
- ⚠️ **Não registrar até 23h59**: -2 pontos
- ⚠️ **Nenhum treino na semana**: -2 pontos

## 🏗️ Estrutura do Projeto

\`\`\`
src/
├── app/                    # App Router (Next.js 13+)
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticação
│   ├── painel/         # Painel principal
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes React
├── lib/                   # Utilitários e configurações
│   ├── auth.ts           # Configuração NextAuth
│   ├── prisma.ts         # Cliente Prisma
│   └── scoring.ts        # Lógica de pontuação
└── types/                # Tipos TypeScript
\`\`\`

## 🗄️ Schema do Banco

- **User**: Dados do usuário e pontuação total
- **ActivityLog**: Registro de atividades diárias
- **DailyScore**: Pontuação e metas por dia
- **Bonus**: Bônus por consistência
- **Penalty**: Penalidades (futuro)

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório** no Vercel
2. **Configure as variáveis de ambiente**
3. **Configure o banco** (Neon, Railway, ou outro)
4. **Deploy automático** a cada push

### Variáveis de Produção
\`\`\`env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="strong-secret-for-production"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
\`\`\`

## 🔮 Roadmap

### Próximas Features
- [ ] **Ranking Global**: Competição entre usuários
- [ ] **Notificações**: Lembretes para atingir metas
- [ ] **Penalidades**: Sistema de penalização
- [ ] **Desafios Especiais**: Metas semanais/mensais
- [ ] **Histórico Visual**: Gráficos de progresso
- [ ] **Badges**: Sistema de conquistas
- [ ] **Export de Dados**: Relatórios de progresso

### Melhorias Técnicas
- [ ] **Testes**: Jest + Testing Library
- [ ] **Offline Mode**: Cache e sincronização
- [ ] **Performance**: Otimizações de carregamento
- [ ] **Acessibilidade**: WCAG compliance
- [ ] **Internacionalização**: Suporte multi-idioma

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo \`LICENSE\` para mais detalhes.

---

**Desenvolvido com 💖 e muita ☕ para tornar hábitos saudáveis mais divertidos!**
