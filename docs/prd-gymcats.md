# 📝 PRD – Gymcats

## 📛 Nome do Projeto
Gymcats – PWA gamificada de saúde e performance

## 🎯 Objetivo
Criar um aplicativo web responsivo com foco em saúde e performance física. O usuário acumula pontos ao cumprir metas diárias de treino, cardio e ingestão de água. Há regras, penalidades e bonificações.

## 📦 Funcionalidades Principais
- Login e cadastro com autenticação (email/senha, Google)
- Registro simples de:
  - Água ingerida (marcação de "feito")
  - Treino de resistência (marcação de "feito")
  - Cardio (marcação de "feito")
- Pontuação automática por dia
- Regras de bônus e penalidades
- Histórico de atividades
- Visualização da pontuação e ranking
- Interface responsiva e PWA
- Deploy automático via Vercel

## ⚙️ Tecnologias
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Node.js, Prisma, PostgreSQL
- **Autenticação:** NextAuth.js
- **PWA:** `next-pwa`
- **Hospedagem:** Vercel
- **ORM:** Prisma
- **Banco:** PostgreSQL (Neon ou Railway)

## 🎨 Identidade Visual
- Logo: Gata estilizada (simbolizando força + leveza)
- Cores principais:
  - Rosa pastel `#FADADD`
  - Rosa queimado `#E75480`
  - Pink médio `#FF69B4`
  - Branco `#FFFFFF`
  - Cinza escuro para contraste

## 📊 Regras de Pontuação
- Água (marcar como "feito") = +2 pts
- Resistência (marcar como "feito") = +3 pts  
- Cardio (marcar como "feito") = +2 pts
- Máximo diário = 7 pts
- Bônus:
  - 3 dias seguidos = +3 pts
  - 5 dias seguidos = +5 pts
- Penalidades:
  - Não registrar até 23h59 = -2 pts
  - Nenhum treino na semana = -2 pts

**Observação:** Inspirado no Gymrats, as atividades são marcadas apenas como "feito" ou "não feito", sem necessidade de especificar quantidades ou duração.

## 🏆 Critérios de Desempate
1. Mais dias consecutivos com metas completas
2. Maior pontuação de ingestão de água
3. Desafio final do grupo (ex: 2km, polichinelos, burpees)

## 📱 Público-alvo
Pessoas que querem criar constância em hábitos saudáveis por meio de um desafio leve, competitivo e gamificado.

## 💡 Diferenciais
- Interface leve e divertida
- Recompensas por consistência
- Mascote (gata) como avatar/motivador visual
