# AI Rules

> Lido automaticamente pelo Dyad a cada prompt. Mantenha este arquivo **curto e direto** â€” regras longas diluem as importantes.
> Detalhes de arquitetura estÃ£o em `docs/frontend.md`, `docs/backend.md` e nos `README.md` de cada contexto em `src/contexts/`.

---

## Projeto

- React + TypeScript + Vite + Supabase. Stack completa em `docs/frontend.md`.
- PÃ¡gina principal: `src/pages/Index.tsx` â€” **sempre atualizar** ao adicionar componentes visÃ­veis.
- Rotas: todas em `src/App.tsx`, nunca em outros arquivos.
- CÃ³digo-fonte: somente dentro de `src/`.

---

## Consulta aos Guias de Detalhe

Ao receber uma tarefa:

1. Leia este `AI_RULES.md` primeiro.
2. Identifique o contexto funcional em `src/contexts/<nome>/`.
3. Se o contexto ainda nÃ£o existir, crie a estrutura inicial completa do contexto, incluindo `README.md`.
4. Leia o `README.md` do contexto relevante antes de editar cÃ³digo.
5. Consulte apenas a seÃ§Ã£o necessÃ¡ria dos guias abaixo, usando o **Ãndice Operacional** no topo de cada arquivo:
   - `docs/frontend.md` â†’ tarefas de UI, pÃ¡ginas, hooks, formulÃ¡rios, rotas, auth e experiÃªncia do usuÃ¡rio
   - `docs/backend.md` â†’ tarefas de schema, tabelas, RLS, RPC, triggers, views e migrations
6. Se a tarefa for full-stack, consulte os dois guias.
7. Ao finalizar mudanÃ§as de arquitetura, atualize o `README.md` do contexto.

Regra prÃ¡tica:
- NÃ£o releia `docs/frontend.md` ou `docs/backend.md` por completo sem necessidade.
- Leia apenas a seÃ§Ã£o relevante para a tarefa atual.

---

## Stack â€” NÃ£o substituir sem aprovaÃ§Ã£o

- UI: **shadcn/ui** (jÃ¡ instalado). NÃ£o editar `src/components/ui/`. Criar wrappers se precisar customizar.
- EstilizaÃ§Ã£o: **Tailwind CSS** apenas. Sem CSS customizado. Classes condicionais via `cn()` de `src/lib/utils.ts`.
- Ãcones: **lucide-react** (jÃ¡ instalado).
- FormulÃ¡rios: **React Hook Form + Zod**.
- Dados da API: **TanStack Query** â€” nunca `useEffect` para fetch.
- NotificaÃ§Ãµes: **sonner**.
- Roteamento: **React Router**.

---

## Regras de CÃ³digo

- TypeScript estrito â€” sem `any`. Sem `object` em props. Use tipos especÃ­ficos.
- Componentes: mÃ¡x. **150 linhas**. Acima disso, extrair hook â†’ subcomponente â†’ types.
- Pages: mÃ¡x. **120 linhas**, apenas composiÃ§Ã£o â€” sem lÃ³gica.
- Hooks: mÃ¡x. **120 linhas**.
- JSDoc obrigatÃ³rio em todo componente, hook e funÃ§Ã£o utilitÃ¡ria.
- ComentÃ¡rios explicam o *porquÃª*, nunca o Ã³bvio.
- Named exports para componentes de feature. Default export sÃ³ em pages.
- Imports absolutos com alias `@/`.
- Sem `console.log`. Sem cÃ³digo comentado morto.

---

## Contextos â€” Arquitetura do Projeto

O projeto Ã© dividido em contextos funcionais em `src/contexts/<nome>/`. Cada contexto tem:
- `README.md` â€” arquitetura, tabelas usadas, decisÃµes tÃ©cnicas. **Sempre atualizar apÃ³s mudanÃ§as.**
- `components/`, `hooks/`, `services/`, `<nome>.types.ts`

**Regra obrigatÃ³ria:** ao criar um novo contexto em `src/contexts/<nome>/`, criar tambÃ©m o `README.md` desse contexto no mesmo commit.

**Ao receber uma tarefa:** leia o `README.md` do contexto relevante antes de editar cÃ³digo.  
**Ao finalizar uma tarefa com mudanÃ§as de arquitetura:** atualize o `README.md` do contexto.  
**Se o contexto ainda nÃ£o existir:** crie a estrutura inicial completa, incluindo `README.md`.

---

## SeguranÃ§a & Git

- `.env` **nunca commitado**. EstÃ¡ no `.gitignore`. Versionar apenas `.env.example`.
- Nunca expor `service_role` key no front-end. Apenas `anon` key.
- Supabase client: somente `src/integrations/supabase/client.ts`.
- Nunca commitar direto na `main`. Branches: `feature/*`, `fix/*`, `release/*`.

---

## Versionamento

- O Dyad versiona automaticamente cada ediÃ§Ã£o via git. Use o painel de versÃµes para reverter.
- Releases pÃºblicos: SemVer em `package.json` + tag git + entrada no `CHANGELOG.md`.

---

## Arquivos Protegidos â€” NÃ£o modificar sem confirmaÃ§Ã£o

- `src/components/ui/*` â€” componentes shadcn/ui
- `src/integrations/supabase/client.ts` â€” cliente Supabase
- `supabase/migrations/*` â€” nunca alterar migrations existentes, apenas criar novas
- `.env` â€” nunca tocar
