import type {
  ComandoCanvas,
  ComandoRenderizacao,
  CorCanvas,
  Narrador,
  RinhaTheme,
} from "@rinhany/core";

type ConfigNarradorTerminal = {
  readonly escrever?: (linha: string) => void;
  readonly tema?: RinhaTheme;
  readonly resolverNome?: (id: string) => string;
};

const CORES_ANSI: Record<CorCanvas, string> = {
  verde: "\x1b[42m",
  laranja: "\x1b[43m",
  branco: "\x1b[47m",
  preto: "\x1b[44m",
  cinza: "\x1b[100m",
  vermelho: "\x1b[41m",
  nenhuma: "\x1b[0m",
};

const RESET = "\x1b[0m";
const CURSOR_POS = (y: number, x: number) => `\x1b[${y};${x}H`;

const renderizarCanvas = (cmd: ComandoCanvas, escrever: (linha: string) => void): void => {
  let out = "\x1b[?25l\x1b[2J\x1b[H";
  for (const row of cmd.pixels) {
    for (const cor of row) {
      out += `${CORES_ANSI[cor]}  `;
    }
    out += `${RESET}\n`;
  }
  if (cmd.textos) {
    for (const t of cmd.textos) {
      out += `${CURSOR_POS(t.y + 1, t.x * 2 + 1)}${RESET}${t.texto}`;
    }
    out += "\x1b[H";
  }
  escrever(out);
};

const pausar = (ms: number): void => {
  if (ms <= 0) return;
  const fim = Date.now() + ms;
  while (Date.now() < fim) {}
};

const executarComandos = (
  comandos: ReadonlyArray<ComandoRenderizacao>,
  escrever: (linha: string) => void,
): void => {
  for (const cmd of comandos) {
    switch (cmd.tipo) {
      case "texto":
        escrever(cmd.conteudo);
        break;
      case "quadro":
        for (const linha of cmd.linhas) {
          escrever(linha);
        }
        break;
      case "canvas":
        renderizarCanvas(cmd, escrever);
        break;
      case "limpar":
        break;
      case "pausa":
        pausar(cmd.duracao_ms);
        break;
    }
  }
};

export const criarNarradorTerminal = (config: ConfigNarradorTerminal = {}): Narrador => {
  const escrever = config.escrever ?? ((linha) => console.log(linha));
  const tema = config.tema;
  const resolverNome = config.resolverNome;
  const opts = resolverNome ? { resolverNome } : undefined;

  return {
    onRinhaIniciar(ctx) {
      if (tema?.iniciar) {
        executarComandos(tema.iniciar(ctx), escrever);
        return;
      }
      escrever(`\n${"═".repeat(60)}`);
      escrever(`  🥊  ${ctx.nome.toUpperCase()}`);
      escrever(
        `  ${ctx.total_algoritmos} competidores · ${ctx.total_datasets} datasets · ${ctx.total_rodadas} rodadas`,
      );
      escrever(`${"═".repeat(60)}\n`);
    },
    onRodadaIniciar(ctx) {
      if (tema?.rodadaIniciar) {
        executarComandos(tema.rodadaIniciar(ctx), escrever);
        return;
      }
      escrever(`\n  ── Rodada ${ctx.rodada}/${ctx.total_rodadas}: ${ctx.dataset_nome} ──`);
    },
    onExecucaoIniciar(_ctx) {
      if (tema) return;
      escrever(`  [${_ctx.execucao}/${_ctx.total_execucoes}] ${_ctx.algoritmo_nome} ...`);
    },
    onExecucaoFinalizar(ctx) {
      if (tema) return;
      if (ctx.erro) {
        escrever(`  ❌ ${ctx.algoritmo_nome}: ERRO — ${ctx.erro.mensagem}`);
      } else {
        escrever(`  ✓ ${ctx.algoritmo_nome}: ${ctx.tempo_execucao_ms.toFixed(2)}ms`);
      }
    },
    onRodadaFinalizar(ctx) {
      if (tema) return;
      const validos = ctx.resultados.filter((r) => !r.erro).sort((a, b) => a.tempo_ms - b.tempo_ms);
      if (validos.length > 0) {
        escrever(
          `  🏅 Vencedor da rodada: ${validos[0]?.algoritmo_nome} (${validos[0]?.tempo_ms.toFixed(2)}ms)`,
        );
      }
    },
    onEventoLuta(evento) {
      if (tema?.eventoLuta) {
        executarComandos(tema.eventoLuta(evento, opts), escrever);
      } else if (tema) {
        escrever(tema.descrever(evento, opts));
      } else {
        escrever(`  💥 ${evento.tipo}: ${JSON.stringify(evento.ctx)}`);
      }
    },
    onRinhaFinalizar(ctx) {
      if (tema?.finalizar) {
        executarComandos(tema.finalizar(ctx), escrever);
        return;
      }
      escrever(`\n  Batalha encerrada em ${ctx.tempo_total_ms.toFixed(0)}ms\n`);
    },
  };
};
