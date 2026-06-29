import type {
  ComandoRenderizacao,
  CorCanvas,
  EventoLuta,
  RinhaTheme,
  TextoOverlay,
} from "@rinhany/core";

const LARGURA = 80;
const ALTURA = 50;

const COR_ARENA: CorCanvas = "verde";
const COR_CORDAS: CorCanvas = "laranja";
const COR_FUNDO: CorCanvas = "nenhuma";

const POS_LUTADOR_1_X = 14;
const POS_LUTADOR_2_X = 55;
const POS_LUTADOR_Y = 22;

const spritesEquipe: Record<string, CorCanvas> = {};

const CORES_DISPONIVEIS: ReadonlyArray<CorCanvas> = ["branco", "preto"];

const corDoAlgoritmo = (id: string): CorCanvas => {
  if (spritesEquipe[id]) {
    return spritesEquipe[id];
  }
  const cor = CORES_DISPONIVEIS[Object.keys(spritesEquipe).length % CORES_DISPONIVEIS.length];
  spritesEquipe[id] = cor;
  return cor;
};

// ===========================
// Sprites (pixel art 8×9)
// ===========================

const SPRITE_BOXER: ReadonlyArray<string> = [
  "   ##   ",
  "  ####  ",
  "  ####  ",
  " ###### ",
  "   ##   ",
  "  #  #  ",
  "  #  #  ",
  "  #  #  ",
  "  #  #  ",
];

const SPRITE_SOCO: ReadonlyArray<string> = [
  "   ##  #",
  "  ####  ",
  "  ####  ",
  " ###### ",
  "   ##   ",
  "  #  #  ",
  "  #  #  ",
  "  #  #  ",
  "  #  #  ",
];

const SPRITE_TONTO: ReadonlyArray<string> = [
  "  ##    ",
  " ####   ",
  " ####   ",
  " ###### ",
  "  ##    ",
  " #  #   ",
  " #  #   ",
  "  # #   ",
  "  #  #  ",
];

const SPRITE_QUEDA: ReadonlyArray<string> = [
  " ###### ",
  "  ##### ",
  "    ### ",
  "   ## # ",
  "  #  #  ",
  "  #  #  ",
];

const reverterSprite = (sprite: ReadonlyArray<string>): ReadonlyArray<string> =>
  sprite.map((linha) => [...linha].reverse().join(""));

// ===========================
// Helpers do canvas
// ===========================

type Buffer = Array<Array<CorCanvas>>;

const criarBuffer = (): Buffer =>
  Array.from({ length: ALTURA }, () => Array(LARGURA).fill(COR_ARENA));

const pixel = (buf: Buffer, x: number, y: number, cor: CorCanvas): void => {
  if (x >= 0 && x < LARGURA && y >= 0 && y < ALTURA) {
    buf[y][x] = cor;
  }
};

const rect = (
  buf: Buffer,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cor: CorCanvas,
): void => {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      pixel(buf, x, y, cor);
    }
  }
};

const borda = (
  buf: Buffer,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  g: number,
  cor: CorCanvas,
): void => {
  rect(buf, x1, y1, x2, y1 + g - 1, cor);
  rect(buf, x1, y2 - g + 1, x2, y2, cor);
  rect(buf, x1, y1, x1 + g - 1, y2, cor);
  rect(buf, x2 - g + 1, y1, x2, y2, cor);
};

const desenharSprite = (
  buf: Buffer,
  sprite: ReadonlyArray<string>,
  x: number,
  y: number,
  cor: CorCanvas,
): void => {
  for (let sy = 0; sy < sprite.length; sy++) {
    const linha = sprite[sy];
    for (let sx = 0; sx < linha.length; sx++) {
      if (linha[sx] !== " ") {
        pixel(buf, x + sx, y + sy, cor);
      }
    }
  }
};

// ===========================
// Montagem do quadro
// ===========================

type FrameInput = {
  readonly nomeRinha: string;
  readonly spriteEsq: ReadonlyArray<string>;
  readonly corEsq: CorCanvas;
  readonly spriteDir: ReadonlyArray<string>;
  readonly corDir: CorCanvas;
  readonly eventos?: ReadonlyArray<TextoOverlay>;
  readonly pausaMs?: number;
};

const montarFrame = (input: FrameInput): ReadonlyArray<ComandoRenderizacao> => {
  const buf = criarBuffer();
  const textos: TextoOverlay[] = [];

  // Fundo preto topo
  rect(buf, 0, 0, LARGURA - 1, 2, COR_FUNDO);
  textos.push({
    y: 0,
    x: Math.floor((LARGURA - input.nomeRinha.length) / 2),
    texto: `\x1b[97m${input.nomeRinha}\x1b[0m`,
  });

  // Arena
  rect(buf, 0, 3, LARGURA - 1, 45, COR_ARENA);

  // Cordas
  borda(buf, 2, 4, LARGURA - 3, 44, 2, COR_CORDAS);
  rect(buf, 2, 24, LARGURA - 3, 24, COR_CORDAS);

  // Fundo preto base
  rect(buf, 0, 46, LARGURA - 1, ALTURA - 1, COR_FUNDO);

  // Lutadores
  desenharSprite(buf, input.spriteEsq, POS_LUTADOR_1_X, POS_LUTADOR_Y, input.corEsq);
  desenharSprite(
    buf,
    reverterSprite(input.spriteDir),
    POS_LUTADOR_2_X,
    POS_LUTADOR_Y,
    input.corDir,
  );

  // Textos extras
  if (input.eventos) {
    for (const t of input.eventos) {
      textos.push(t);
    }
  }

  const pixels: ReadonlyArray<ReadonlyArray<CorCanvas>> = buf.map((linha) => Object.freeze(linha));

  const comandos: Array<ComandoRenderizacao> = [
    {
      tipo: "canvas",
      pixels: Object.freeze(pixels),
      textos: textos.length > 0 ? Object.freeze(textos) : undefined,
    },
  ];

  if (input.pausaMs) {
    comandos.push({ tipo: "pausa", duracao_ms: input.pausaMs });
    comandos.push({ tipo: "quadro", linhas: ["\n".repeat(ALTURA)] });
  }

  return comandos;
};

// ===========================
// Descritor textual
// ===========================

const resolverId = (id: string, fn?: (id: string) => string): string => fn?.(id) ?? id;

const descreverEvento = (
  evento: EventoLuta,
  options?: { readonly resolverNome?: (id: string) => string },
): string => {
  const r = options?.resolverNome;
  switch (evento.tipo) {
    case "golpe":
      return `🥊 ${resolverId(evento.ctx.agressor as string, r)} acerta ${resolverId(evento.ctx.vitima as string, r)} com um cruzado de direita!`;
    case "tonteou":
      return `😵 ${resolverId(evento.ctx.algoritmo as string, r)} está tonto!`;
    case "foi-pra-lona":
      return `💫 ${resolverId(evento.ctx.algoritmo as string, r)} foi para a lona!`;
    case "recuperou":
      return `🙌 ${resolverId(evento.ctx.algoritmo as string, r)} se recuperou!`;
    case "nocaute":
      return `🥊 NOCAUTE! ${resolverId(evento.ctx.vencedor as string, r)} vence ${resolverId(evento.ctx.perdedor as string, r)}!`;
  }
};

// ===========================
// Renderizadores de evento
// ===========================

const renderizarIniciar = (ctx: {
  readonly nome: string;
  readonly total_algoritmos: number;
  readonly total_datasets: number;
  readonly total_rodadas: number;
}): ReadonlyArray<ComandoRenderizacao> => {
  // Reset team mapping
  for (const key of Object.keys(spritesEquipe)) {
    delete spritesEquipe[key];
  }

  return montarFrame({
    nomeRinha: ctx.nome.toUpperCase(),
    spriteEsq: SPRITE_BOXER,
    corEsq: "branco",
    spriteDir: SPRITE_BOXER,
    corDir: "preto",
    eventos: [
      {
        y: 2,
        x: 20,
        texto: `\x1b[97m${ctx.total_algoritmos} lutadores · ${ctx.total_datasets} datasets\x1b[0m`,
      },
      { y: 48, x: 30, texto: "\x1b[90mACTIVISION\x1b[0m" },
    ],
    pausaMs: 600,
  });
};

const renderizarRodadaIniciar = (ctx: {
  readonly rodada: number;
  readonly total_rodadas: number;
  readonly dataset_id: string;
  readonly dataset_nome: string;
  readonly total_algoritmos: number;
}): ReadonlyArray<ComandoRenderizacao> => {
  return montarFrame({
    nomeRinha: `ROUND ${ctx.rodada}/${ctx.total_rodadas}`,
    spriteEsq: SPRITE_BOXER,
    corEsq: "branco",
    spriteDir: SPRITE_BOXER,
    corDir: "preto",
    eventos: [
      { y: 2, x: 28, texto: `\x1b[97m${ctx.dataset_nome}\x1b[0m` },
      { y: 48, x: 30, texto: "\x1b[90mACTIVISION\x1b[0m" },
    ],
    pausaMs: 400,
  });
};

const renderizarEventoLuta = (
  evento: EventoLuta,
  options?: { readonly resolverNome?: (id: string) => string },
): ReadonlyArray<ComandoRenderizacao> => {
  const r = options?.resolverNome;
  const algId = (id: string) => resolverId(id, r);
  const nomeRinha = evento.tipo === "nocaute" ? "NOCAUTE!" : "RINHA DE BOXE";

  switch (evento.tipo) {
    case "golpe": {
      const corAgressor = corDoAlgoritmo(evento.ctx.agressor);
      const corVitima = corDoAlgoritmo(evento.ctx.vitima);

      const spriteEsq = corAgressor === "branco" ? SPRITE_SOCO : SPRITE_BOXER;
      const spriteDir = corVitima === "preto" ? SPRITE_TONTO : SPRITE_BOXER;
      const corEsq = corAgressor === "branco" ? corAgressor : corVitima;
      const corDir = corAgressor === "preto" ? corAgressor : corVitima;

      return montarFrame({
        nomeRinha,
        spriteEsq,
        corEsq,
        spriteDir,
        corDir,
        eventos: [
          {
            y: 47,
            x: 10,
            texto: `  🥊 ${algId(evento.ctx.agressor)} acerta ${algId(evento.ctx.vitima)}!`,
          },
          { y: 48, x: 30, texto: "\x1b[90mACTIVISION\x1b[0m" },
        ],
      });
    }
    case "tonteou": {
      const cor = corDoAlgoritmo(evento.ctx.algoritmo);
      const sprite = cor === "branco" ? SPRITE_TONTO : SPRITE_BOXER;
      return montarFrame({
        nomeRinha,
        spriteEsq: cor === "branco" ? sprite : SPRITE_BOXER,
        corEsq: "branco",
        spriteDir: cor === "preto" ? sprite : SPRITE_BOXER,
        corDir: "preto",
        eventos: [
          { y: 47, x: 10, texto: `  😵 ${algId(evento.ctx.algoritmo)} está tonto!` },
          { y: 48, x: 30, texto: "\x1b[90mACTIVISION\x1b[0m" },
        ],
      });
    }
    case "foi-pra-lona": {
      const cor = corDoAlgoritmo(evento.ctx.algoritmo);
      return montarFrame({
        nomeRinha,
        spriteEsq: cor === "branco" ? SPRITE_QUEDA : SPRITE_BOXER,
        corEsq: cor === "branco" ? cor : "branco",
        spriteDir: cor === "preto" ? SPRITE_QUEDA : SPRITE_BOXER,
        corDir: cor === "preto" ? cor : "preto",
        eventos: [
          { y: 47, x: 10, texto: `  💫 ${algId(evento.ctx.algoritmo)} foi para a lona!` },
          { y: 48, x: 30, texto: "\x1b[90mACTIVISION\x1b[0m" },
        ],
      });
    }
    case "recuperou": {
      const _cor = corDoAlgoritmo(evento.ctx.algoritmo);
      return montarFrame({
        nomeRinha,
        spriteEsq: SPRITE_BOXER,
        corEsq: "branco",
        spriteDir: SPRITE_BOXER,
        corDir: "preto",
        eventos: [
          { y: 47, x: 10, texto: `  🙌 ${algId(evento.ctx.algoritmo)} se recuperou!` },
          { y: 48, x: 30, texto: "\x1b[90mACTIVISION\x1b[0m" },
        ],
      });
    }
    case "nocaute": {
      const corVencedor = corDoAlgoritmo(evento.ctx.vencedor);
      const corPerdedor = corDoAlgoritmo(evento.ctx.perdedor);
      return montarFrame({
        nomeRinha,
        spriteEsq: corVencedor === "branco" ? SPRITE_BOXER : SPRITE_QUEDA,
        corEsq: corVencedor === "branco" ? corVencedor : corPerdedor,
        spriteDir: corVencedor === "preto" ? SPRITE_BOXER : SPRITE_QUEDA,
        corDir: corVencedor === "preto" ? corVencedor : corPerdedor,
        eventos: [
          {
            y: 47,
            x: 10,
            texto: `  🥊 ${algId(evento.ctx.vencedor)} VENCE ${algId(evento.ctx.perdedor)}!`,
          },
          { y: 48, x: 30, texto: "\x1b[93mACTIVISION\x1b[0m" },
        ],
        pausaMs: 800,
      });
    }
  }
};

const renderizarFinalizar = (ctx: {
  readonly nome: string;
  readonly total_algoritmos: number;
  readonly total_datasets: number;
  readonly total_rodadas: number;
  readonly tempo_total_ms: number;
}): ReadonlyArray<ComandoRenderizacao> => {
  return montarFrame({
    nomeRinha: `🏆  CAMPEÃO  🏆`,
    spriteEsq: SPRITE_BOXER,
    corEsq: "branco",
    spriteDir: SPRITE_BOXER,
    corDir: "preto",
    eventos: [
      {
        y: 2,
        x: 24,
        texto: `\x1b[97m${ctx.nome.toUpperCase()} — ${ctx.tempo_total_ms.toFixed(0)}ms\x1b[0m`,
      },
      { y: 48, x: 30, texto: "\x1b[90mACTIVISION\x1b[0m" },
    ],
    pausaMs: 2000,
  });
};

export const temaBoxe: RinhaTheme = {
  nome: "Boxe Clássico",
  descricao: "Luta de boxe estilo Atari 2600 — canvas pixel ANSI",

  descrever: descreverEvento,

  iniciar: renderizarIniciar,
  rodadaIniciar: renderizarRodadaIniciar,
  eventoLuta: renderizarEventoLuta,
  finalizar: renderizarFinalizar,
};
