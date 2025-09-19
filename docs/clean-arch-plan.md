# Plano de Migração para Clean Architecture

Este documento descreve um plano prático para migrar o projeto Gymcats para uma estrutura baseada em Clean Architecture, com foco em casos de uso testáveis e independentes de frameworks.

Objetivos principais
- Isolar regras de negócio em casos de uso (use-cases).
- Definir portas (interfaces) para dependências externas (DB, notificação, cron) sob `src/core/ports`.
- Modelar entidades puras em `src/core/entities`.
- Implementar use-cases puros em `src/core/usecases` e testá-los com uma biblioteca de testes (Vitest).
- Usar `date-fns` para manipulação de datas.

Fases
1. Análise (feito): ler PRD e tarefas (já revisadas).
2. Preparação: adicionar Vitest (`devDependency`) e script `test` no `package.json`.
3. Criar contratos (ports) e entidades.
4. Implementar use-cases core e versões em memória de repositórios para testes.
5. Escrever testes unitários para cada use-case.
6. Refatorar adaptadores existentes (Prisma) para implementar os ports.
7. Gradual migration: trocar chamadas diretas por injeção de portas nos handlers API.

Componentes recomendados
- Entities (pure): User, ActivityLog, Score, BonusRule
- Ports (interfaces): ActivityRepository, ScoreRepository, UserRepository, Clock (date abstraction for tests)
- Use-cases (pure functions/classes): AddActivityUseCase, CalculateDailyScoreUseCase, ApplyConsistencyBonusesUseCase
- Adapters: PrismaActivityRepository, PrismaScoreRepository (implement ports)
- Tests: Vitest unit tests for each use-case. Use in-memory repo fakes and the real `date-fns` for date calculations.

Contract examples (summary)
- ActivityRepository
  - findByUserIdAndDate(userId: string, date: Date): Promise<ActivityLog | null>
  - add(activity: ActivityLog): Promise<void>
  - listByUserAndRange(userId: string, start: Date, end: Date): Promise<ActivityLog[]>

- ScoreRepository
  - getByUserAndDate(userId: string, date: Date): Promise<number>
  - setScoreForDate(userId: string, date: Date, score: number): Promise<void>

Use-case responsibilities
- AddActivityUseCase: valida entradas, cria ActivityLog via ActivityRepository, e delega recálculo de pontuação (ou emite evento). Deve retornar o novo total diário.
- CalculateDailyScoreUseCase: sumariza activities daquele dia e aplica regras de pontuação (limites, bonus), usando `date-fns` para normalizar datas.
- ApplyConsistencyBonusesUseCase: checa histórico (últimos N dias) e aplica bônus via ScoreRepository.

Testing strategy
- Unit tests para use-cases: usar repositórios em memória (fakes) e um Clock injetado que possa ser fixado.
- Testes devem cobrir happy path e edge cases: já existente, dia limiar (23:59), streaks interrompidos e máximos diários.
- Evitar testes end-to-end na fase inicial — manter foco em regras de negócio.

Ferramentas e libs
- date-fns (já presente) para manipular datas (startOfDay, subDays, isSameDay, differenceInCalendarDays).
- Vitest para testes unitários (rápido, moderno e compatível com TS).

Substituindo scripts por seeds
- Repositórios antigos que usam arquivos em `scripts/` para popular fixtures devem migrar para o seed do Prisma. Recomenda-se criar `prisma/seed.ts` com funções que criam os dados de teste (usuários, activities, scores). Assim o fluxo se integra ao `prisma db seed` e pode ser usado em CI.
- Exemplos de comandos úteis (adicionar no README/dev setup):
  - Gerar client: `pnpm prisma generate` (ou `npm run prisma generate`)
  - Aplicar migrações: `pnpm prisma migrate dev` (ou `prisma migrate deploy` em CI)
  - Rodar seed: `pnpm prisma db seed` (assegure `package.json`/`prisma` config aponte para `prisma/seed.ts`).

Notas finais
- Ao final, criar adaptadores que implementem os ports usando Prisma (e.g., `src/adapters/prisma/activity-repo.ts`).
- Migrar handlers API (em `src/app/api/...`) para usar os use-cases via injeção de dependência (simples factory no `src/app/providers.tsx` ou inject manualmente em cada rota).
- Revisar e ampliar testes conforme novos casos aparecem.
