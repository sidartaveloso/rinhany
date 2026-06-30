import { useEffect, useState, type ReactNode, type SVGProps } from 'react'

const GITHUB_URL = 'https://github.com/sidartaveloso/rinhany'
const NPM_URL = 'https://www.npmjs.com/package/rinhany'

type IconProps = SVGProps<SVGSVGElement>

function IconBase({ children, className = 'h-5 w-5', ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {children}
    </svg>
  )
}

const Github = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </IconBase>
)

const ArrowRight = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </IconBase>
)

const Check = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M20 6 9 17l-5-5" />
  </IconBase>
)

const Copy = (p: IconProps) => (
  <IconBase {...p}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </IconBase>
)

const Cpu = (p: IconProps) => (
  <IconBase {...p}>
    <rect width="16" height="16" x="4" y="4" rx="2" />
    <rect width="6" height="6" x="9" y="9" rx="1" />
    <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
  </IconBase>
)

const Terminal = (p: IconProps) => (
  <IconBase {...p}>
    <path d="m4 17 6-6-6-6" />
    <path d="M12 19h8" />
  </IconBase>
)

const Trophy = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    <path d="M6 5H2v2a3 3 0 0 0 3 3h1" />
    <path d="M18 5h4v2a3 3 0 0 1-3 3h-1" />
  </IconBase>
)

const Zap = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </IconBase>
)

const Package = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
    <path d="M12 22V12" />
    <polyline points="3.29 7 12 12 20.71 7" />
  </IconBase>
)

const Play = (p: IconProps) => (
  <IconBase {...p}>
    <polygon points="6 3 20 12 6 21 6 3" />
  </IconBase>
)

const Flag = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" x2="4" y1="22" y2="15" />
  </IconBase>
)

const Boxes = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
    <path d="m7 16.5-4.74-2.85" />
    <path d="m7 16.5 5-3" />
    <path d="M7 16.5v5.17" />
    <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
    <path d="m17 16.5-5-3" />
    <path d="m17 16.5 4.74-2.85" />
    <path d="M17 16.5v5.17" />
    <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
    <path d="M12 8 7.26 5.15" />
    <path d="m12 8 4.74-2.85" />
    <path d="M12 13.5V8" />
  </IconBase>
)

const Gauge = (p: IconProps) => (
  <IconBase {...p}>
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </IconBase>
)

const ScrollText = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M15 12h-5" />
    <path d="M15 8h-5" />
    <path d="M19 17V5a2 2 0 0 0-2-2H4" />
    <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
  </IconBase>
)

const TestTube = (p: IconProps) => (
  <IconBase {...p}>
    <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2" />
    <path d="M8.5 2h7" />
    <path d="M14.5 16h-5" />
  </IconBase>
)

const features = [
  {
    icon: Cpu,
    title: 'Engine extensível',
    description:
      'Executor, ringue, juiz e logger prontos. Você define o problema, os algoritmos e as métricas — o resto é com o core.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    icon: Terminal,
    title: 'CLI cinematográfica',
    description:
      'Apresentador, narrador e público no terminal. Transforme benchmarks em um espetáculo digno de uma rinha de verdade.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Trophy,
    title: 'Rankings automáticos',
    description:
      'Agregue resultados, compare algoritmos e gere relatórios. Cada rinha termina com um vencedor claro.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: TestTube,
    title: 'Contract tests',
    description:
      'Utilities de teste para validar contratos de BaseAlgoritmo. Garanta que cada competidor segue as regras.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
]

const packages = [
  {
    name: 'rinhany',
    desc: 'Meta-pacote que re-exporta tudo. Um único import para começar.',
    icon: Package,
  },
  {
    name: '@rinhany/core',
    desc: 'Engine: executor, ringue, types, juiz e logger.',
    icon: Boxes,
  },
  {
    name: '@rinhany/cli',
    desc: 'UI de terminal: apresentador, narrador, público e tema.',
    icon: ScrollText,
  },
  {
    name: '@rinhany/testing',
    desc: 'Utilities de teste e contract tests para algoritmos.',
    icon: Gauge,
  },
]

const steps = [
  {
    n: '01',
    title: 'Defina o problema',
    text: 'Datasets, algoritmos e a função runner que executa cada confronto.',
  },
  {
    n: '02',
    title: 'Rode a rinha',
    text: 'O executor orquestra as batalhas, mede tempo e coleta métricas.',
  },
  {
    n: '03',
    title: 'Veja o ranking',
    text: 'Agregue resultados, declare o vencedor e apresente no terminal.',
  },
]

const codeSnippet = `import { criarExecutorRinha } from "rinhany";

const relatorio = await criarExecutorRinha({
  nome: "Rinha de Busca",
  datasets: [
    { id: "grande", nome: "1M elementos", dados: gerarDados(1_000_000) },
  ],
  algoritmos: [
    { id: "linear",  nome: "Busca Linear",  impl: buscaLinear },
    { id: "binaria", nome: "Busca Binária", impl: buscaBinaria },
  ],
  runner: async (algoritmo, dataset) => {
    const inicio = performance.now();
    const resultado = algoritmo.impl(dataset.dados, alvo);
    return {
      algoritmo_id: algoritmo.id,
      dataset_id: dataset.id,
      saida: resultado,
      metricas: { encontrado: resultado !== -1 },
      tempo_execucao_ms: performance.now() - inicio,
      timestamp: new Date(),
    };
  },
  agregador: (resultados) => ({
    taxa_acerto: resultados.filter(r => r.metricas.encontrado).length
      / resultados.length,
  }),
}).executar();`

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'copiado' : 'copiar'}
    </button>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'nav-blur border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#" className="flex items-center gap-2.5 group">
          <img
            src="/rinhany-logo.png"
            alt="rinhany"
            className="h-8 w-auto object-contain opacity-90 transition group-hover:opacity-100"
          />
        </a>

        <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex">
          <a href="#features" className="transition hover:text-white">Recursos</a>
          <a href="#packages" className="transition hover:text-white">Pacotes</a>
          <a href="#code" className="transition hover:text-white">Código</a>
          <a href="#start" className="transition hover:text-white">Começar</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href="#start"
            className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-red-400"
          >
            Instalar
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(239,68,68,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(59,130,246,0.12),transparent_50%)]" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pb-20 pt-16 text-center sm:px-8 sm:pt-24">
        <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          Motor genérico de rinha de algoritmos · TypeScript
        </div>

        <div className="animate-fade-up delay-1 mb-8 w-full max-w-4xl">
          <img
            src="/rinhany-banner.png"
            alt="rinhany — algorithm benchmark engine"
            className="mx-auto w-full max-w-3xl drop-shadow-[0_20px_60px_rgba(239,68,68,0.15)]"
          />
        </div>

        <p className="animate-fade-up delay-2 mb-3 max-w-2xl text-lg font-medium text-white/90 sm:text-xl">
          Toda rinha reinventa sua própria infraestrutura.
        </p>
        <p className="animate-fade-up delay-3 mb-10 max-w-2xl text-base text-white/55 sm:text-lg">
          <span className="font-semibold text-white/80">rinhany</span> é o motor
          extensível que falta. Você traz o problema, os algoritmos e as métricas —
          rinhany cuida do ciclo de execução, dos rankings e da apresentação.
        </p>

        <div className="animate-fade-up delay-4 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#start"
            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-400 hover:shadow-red-400/30"
          >
            <Zap className="h-4 w-4" />
            Começar agora
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/85 transition hover:border-white/25 hover:bg-white/10"
          >
            <Github className="h-4 w-4" />
            Ver no GitHub
          </a>
          <a
            href="#code"
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-6 py-3 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
          >
            <Play className="h-4 w-4" />
            Ver exemplo
          </a>
        </div>

        <div className="animate-fade-up delay-5 mt-14 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-blue-500/10">
          <img
            src="/images/arena-hero.jpg"
            alt="Arena digital de algoritmos"
            className="h-auto w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(59,130,246,0.08),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Recursos</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Infraestrutura de rinha, <span className="gradient-text">pronta para usar</span>
          </h2>
          <p className="text-white/55">
            Pare de reescrever o mesmo harness a cada competição. Foque no que importa: o problema e os algoritmos.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <article
              key={f.title}
              className={`group rounded-2xl border ${f.border} bg-[#0c1019]/80 p-6 transition hover:bg-[#0c1019]`}
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.bg} ${f.color}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{f.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="relative border-y border-white/5 bg-black/30 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Como funciona</p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Três passos para a rinha</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6"
            >
              <span className="mb-4 block font-mono text-3xl font-bold text-white/15">{s.n}</span>
              <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
              <p className="text-sm text-white/55">{s.text}</p>
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-white/20 to-transparent md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Packages() {
  return (
    <section id="packages" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Monorepo</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Pacotes modulares</h2>
          <p className="text-white/55">
            Use o meta-pacote ou importe apenas o que precisa. Tudo em TypeScript, com tipagem de ponta a ponta.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {packages.map((p) => (
            <div
              key={p.name}
              className="flex gap-4 rounded-2xl border border-white/10 bg-[#0c1019] p-5 transition hover:border-white/15"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70">
                <p.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="font-mono text-sm font-semibold text-white">{p.name}</h3>
                  <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40">npm</span>
                </div>
                <p className="text-sm text-white/50">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function highlightLine(line: string): ReactNode {
  const parts: ReactNode[] = []
  const regex =
    /(\bimport\b|\bfrom\b|\bconst\b|\bawait\b|\basync\b|\breturn\b|\bnew\b)|("(?:\\.|[^"\\])*")|(\b\d[\d_]*\b)|(\/\/.*)|(\b[A-Za-z_][\w]*\b)|([{}()[\];,.:=<>!+\-*/&|?]+)|(\s+)/g

  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) parts.push(<span key={key++}>{line.slice(last, m.index)}</span>)
    const [token, kw, str, num, comment, ident, punct, space] = m
    if (kw) parts.push(<span key={key++} className="text-red-400">{token}</span>)
    else if (str) parts.push(<span key={key++} className="text-emerald-300/90">{token}</span>)
    else if (num) parts.push(<span key={key++} className="text-amber-300/90">{token}</span>)
    else if (comment) parts.push(<span key={key++} className="text-white/30">{token}</span>)
    else if (ident) {
      const isFn =
        /^(criarExecutorRinha|performance|filter|length|Date|gerarDados|buscaLinear|buscaBinaria)$/.test(token)
      parts.push(
        <span key={key++} className={isFn ? 'text-blue-300' : 'text-white/80'}>
          {token}
        </span>,
      )
    } else if (punct) parts.push(<span key={key++} className="text-white/40">{token}</span>)
    else if (space) parts.push(<span key={key++}>{token}</span>)
    else parts.push(<span key={key++}>{token}</span>)
    last = m.index + token.length
  }
  if (last < line.length) parts.push(<span key={key++}>{line.slice(last)}</span>)
  if (parts.length === 0) return line || '\u00A0'
  return <>{parts}</>
}

function CodeSection() {
  return (
    <section id="code" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(239,68,68,0.06),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Uso básico</p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Configure a rinha em poucas linhas
            </h2>
            <p className="mb-6 text-white/55">
              Traga datasets, algoritmos, um runner e um agregador. O executor orquestra os confrontos e devolve o relatório completo.
            </p>
            <ul className="space-y-3 text-sm text-white/65">
              {[
                'Tipagem forte com TypeScript ≥ 5.4',
                'Métricas customizáveis por rinha',
                'Demo incluída: rinha de ordenação',
                'Licença MIT — use em qualquer projeto',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="code-block overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-2 font-mono text-xs text-white/40">rinha.ts</span>
              </div>
              <CopyButton text={codeSnippet} />
            </div>
            <pre className="overflow-x-auto p-4 text-left text-[11px] leading-relaxed sm:text-xs">
              <code className="font-mono text-white/80">
                {codeSnippet.split('\n').map((line, idx) => (
                  <div key={idx} className="table-row">
                    <span className="table-cell select-none pr-4 text-right text-white/20">{idx + 1}</span>
                    <span className="table-cell whitespace-pre">{highlightLine(line)}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

function GetStarted() {
  const installCmd = 'pnpm add rinhany'
  const demoCmd = 'pnpm demo:ordenacao'

  return (
    <section id="start" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(59,130,246,0.1),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1019] via-[#0a0f1a] to-black">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
                <Flag className="h-3.5 w-3.5" />
                Pronto para competir
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Suba no ringue em minutos
              </h2>
              <p className="mb-8 text-white/55">
                Node.js ≥ 22 e TypeScript ≥ 5.4. Instale o pacote, monte sua rinha e rode a demo de ordenação para ver a magia acontecer.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm">
                  <span className="text-white/80">
                    <span className="text-red-400">$</span> {installCmd}
                  </span>
                  <CopyButton text={installCmd} />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm">
                  <span className="text-white/80">
                    <span className="text-blue-400">$</span> {demoCmd}
                  </span>
                  <CopyButton text={demoCmd} />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  <Github className="h-4 w-4" />
                  Repositório
                </a>
                <a
                  href={NPM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/10"
                >
                  <Package className="h-4 w-4" />
                  npm package
                </a>
              </div>
            </div>

            <div className="relative flex items-center justify-center border-t border-white/5 bg-black/40 p-8 lg:border-l lg:border-t-0">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.12),transparent_65%)]" />
              <img
                src="/rinhany-logo.png"
                alt="Logo rinhany"
                className="relative w-full max-w-md drop-shadow-[0_0_40px_rgba(239,68,68,0.2)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-white/40 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2">
          <img src="/rinhany-logo.png" alt="" className="h-5 w-auto opacity-60" />
          <span>© {new Date().getFullYear()} rinhany · MIT License</span>
        </div>
        <div className="flex items-center gap-5">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="transition hover:text-white/70">
            GitHub
          </a>
          <a href={NPM_URL} target="_blank" rel="noreferrer" className="transition hover:text-white/70">
            npm
          </a>
          <a
            href={`${GITHUB_URL}/blob/main/LICENSE`}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white/70"
          >
            License
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Packages />
        <CodeSection />
        <GetStarted />
      </main>
      <Footer />
    </div>
  )
}
