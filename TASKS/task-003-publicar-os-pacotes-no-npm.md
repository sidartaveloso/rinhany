# 🧩 Task 003 — Publicar os pacotes no npm

- Status: in-progress
- Type: chore
- Assignee: sidartaveloso

## Description
Nenhum pacote do rinhany está no npm; quem usa entra por `link:../rinhany/packages/...` (veloso-play, versiona-ai). Isso basta para projeto privado, mas não para um pacote publicado: a task-141 do taskin põe uma rinha Jev x Laya na CLI publicada (`taskin estimate`) e precisa de `@rinhany/core` no registro, e de `@rinhany/testing` para a suíte de contrato. Deixar os quatro pacotes publicáveis e publicar a 0.1.0.

## Tasks
<!-- [x] feito · [ ] em aberto · [ ] ... — adiado: <razão> para o que se decidiu não fazer -->
- [x] O guarda-chuva `rinhany` não reexporta mais o `@rinhany/testing` no `.`: importar `rinhany` carregava o vitest (achado da task-008 do veloso-play). O teste de contrato continua em `rinhany/testing`
- [x] O export `./testing` do guarda-chuva apontava para `dist/testing/index.js`, que não existe; o `tsc` gera `dist/testing.js`. Corrigido
- [x] `@rinhany/testing` declara o `vitest` como `peerDependencies` (`>=3.2.0`): ele importa `describe`/`it` em tempo de execução, e tem de ser o vitest de quem roda o teste, não um segundo
- [x] `license`, `author` e `repository` (com `directory`) nos quatro manifestos; `.changeset/config.json` com `access: public` (pacote com escopo nasce privado sem isso)
- [x] `release.yml` ganha o passo `pnpm changeset publish`, com `id-token: write` e proveniência; o `NPM_TOKEN` do repositório cobre o workflow até o trusted publishing ser configurado
- [x] Verificação: `pnpm build` e `pnpm test` verdes (core 37, cli 61); `pnpm pack --dry-run` do core e do testing só leva `dist/`, sem teste; `import('rinhany')` não traz mais `testarBaseAlgoritmo`
- [ ] Primeira publicação, manual, logado no npm: `pnpm build && pnpm changeset publish` na raiz (publica `@rinhany/core`, `@rinhany/cli`, `@rinhany/testing` e `rinhany` em 0.1.0; o site e o exemplo são privados)
- [ ] Configurar o trusted publishing de cada pacote no npmjs.com, depois que ele existir, e tirar o `NPM_TOKEN`
- [ ] Desligar os eventos `golpe`/`nocaute` por tempo quando a rinha não é de tempo — adiado: a task-141 do taskin usa narrador silencioso e não precisa; é a task-008 do veloso-play

## Notes
- Quem espera: taskin task-141 (`packages/difficulty-estimator`), hoje com `link:` para esta pasta.
- A primeira publicação não dá para ser pelo workflow com OIDC: o npm só aceita configurar trusted publisher em pacote que já existe.
