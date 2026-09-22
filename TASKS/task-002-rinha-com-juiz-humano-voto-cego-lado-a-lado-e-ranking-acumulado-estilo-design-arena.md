# 🧩 Task 002 — Rinha com juiz humano: voto cego lado a lado e ranking acumulado (estilo Design Arena)

- Status: pending
- Type: feat
- Assignee: sidartaveloso

## Description
Permitir rinhas cujo vencedor é decidido por pessoas, não por métrica: candidatos apresentados às cegas, em pares, voto humano, ranking acumulado por competidor entre rodadas. Definir se cabe no rinhany ou numa deriva dele.

## Contexto
Hoje o rinhany é um motor de **competição com ranking automático**: o `runner` produz resultados, o `agregador` soma métricas e o `Juiz.julgar(resultados)` devolve rankings de forma síncrona, a partir de números. Isso cobre benchmarks (tempo, precisão, F1).

Existe uma classe de rinhas em que a qualidade **não é mensurável por métrica**: ilustrações, personagens, logotipos, layouts, peças de texto, qualquer saída criativa gerada por modelos ou por pessoas. Nessas, a métrica automática no máximo diz quem é *elegível*; quem decide é o olho humano. A referência é o [Design Arena](https://www.designarena.ai/): a mesma tarefa vai para vários modelos, as saídas aparecem lado a lado sem identificação, a pessoa vota, e os votos acumulam num leaderboard por modelo (ranking tipo Elo).

Pergunta central desta task: essa capacidade entra no rinhany (um `Juiz` assíncrono, alimentado por votos) ou nasce como **deriva** dele (um pacote/projeto irmão que reutiliza executor, tipos e papéis, mas tem ciclo de vida próprio)? A resposta depende do quanto o ciclo muda: no automático a rinha termina quando o último runner termina; no humano ela termina quando houver votos suficientes, o que pode levar dias e envolver várias pessoas.

## O que deve existir (independente de onde)
1. **Candidato e urna.** Uma rodada produz N candidatos para a mesma tarefa (um por competidor, ou vários por competidor quando o gerador é não determinístico). Os candidatos vão para uma urna; a identidade do competidor fica oculta até o voto ser registrado.
2. **Elegibilidade antes do voto.** Filtros automáticos decidem quem entra na urna (formato válido, tamanho, licença declarada, requisitos da tarefa). Elegibilidade não é julgamento: nunca ordena, só admite ou recusa, com motivo.
3. **Voto cego em pares.** Apresentação de dois candidatos por vez, ordem aleatória, mesma moldura para os dois (mesma tela, mesmo tamanho, mesma legenda). Opções: A, B, empate, ambos ruins. Só depois do voto se revela quem era quem. Um votante não vê o mesmo par duas vezes.
4. **Ranking por votos.** Elo ou Bradley–Terry sobre os pares; intervalo de confiança ou número mínimo de comparações antes de declarar vencedor. Enquanto não houver votos suficientes, o relatório diz explicitamente **"sem vencedor"** em vez de inventar um. Nada é registrado como decidido sem ter sido decidido.
5. **Persistência dos votos.** Primeiro em arquivo local (JSON append-only, um registro por voto: par, escolha, votante, instante). Interface para trocar o armazenamento depois (SQLite, serviço).
6. **Leaderboard acumulado.** Ranking por competidor que atravessa rinhas: o Elo de um gerador de ilustrações é o mesmo entre tarefas diferentes, como no Design Arena. Ranking por rinha (quem venceu esta tarefa) e ranking global (quem tende a vencer) são coisas distintas e ambas aparecem.
7. **Apresentação.** Um `Apresentador` para o terminal (mostra o estado da urna e o ranking parcial) e uma página local mínima para votar (dois candidatos lado a lado, botões, sem framework). Os papéis `Narrador` e `Público` continuam valendo: cada voto é um evento.
8. **Vários votantes.** Identificação simples do votante (nome), sem autenticação na primeira versão; o ranking pode ser filtrado por votante ou por grupo.

## O que não muda e o que não faz sentido
- O `runner` continua sendo quem produz os candidatos; a urna é uma etapa depois do runner, antes do relatório.
- Os eventos do ringue baseados em tempo (golpe, nocaute pelo mais rápido) não fazem sentido numa rinha de voto; o tema deve poder desligá-los ou substituí-los por eventos de urna (candidato admitido, voto registrado, líder mudou).
- Não é objetivo desta task publicar um site ou receber votos anônimos da internet.

## Tasks
- [ ] Decidir: dentro do rinhany (`Juiz` assíncrono + urna no core) ou deriva (pacote irmão que importa o core). Registrar os critérios e a decisão no README do que for criado
- [ ] Modelo de dados: `Candidato`, `Par`, `Voto`, `Urna`, `Elegibilidade` (admitido/recusado com motivo)
- [ ] `julgarPorVotos(votos)`: Elo e Bradley–Terry, com mínimo de comparações e "sem vencedor" enquanto não atingir
- [ ] Armazenamento de votos em arquivo JSON append-only, com interface para outros backends
- [ ] Sorteio de pares: cobertura uniforme, ordem aleatória por exibição, sem repetir par para o mesmo votante
- [ ] Página local de votação (HTML puro) e apresentador de terminal com ranking parcial
- [ ] Leaderboard acumulado entre rinhas (persistente por competidor)
- [ ] Exemplo em `examples/` com um domínio visual simples (por exemplo, ícones SVG gerados por estratégias diferentes) para provar o ciclo de ponta a ponta
- [ ] Testes: ranking com votos insuficientes não declara vencedor; empate; votante repetido; par nunca repetido

## Notes
- Referência de produto: Design Arena (https://www.designarena.ai/) — comparação cega, voto, leaderboard por modelo.
- Referência de método: Elo (pares) e Bradley–Terry (estimativa de força por máxima verossimilhança); LMArena/Chatbot Arena usa Bradley–Terry com intervalos de confiança por bootstrap.
- Princípio a preservar do rinhany: os quatro papéis (Juiz, Narrador, Apresentador, Público) injetáveis; o que muda é que o Juiz deixa de ser uma função pura sobre resultados e passa a depender de um estado externo (os votos).
