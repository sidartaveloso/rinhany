import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'pt-BR',
  title: 'rinhany',
  description: 'Motor extensível de rinha de algoritmos',
  base: '/docs/',
  themeConfig: {
    nav: [
      { text: 'Início', link: '/' },
      { text: 'Guia', link: '/guide/getting-started' },
    ],
    sidebar: [
      {
        text: 'Introdução',
        items: [
          { text: 'O que é rinhany?', link: '/' },
          { text: 'Começando', link: '/guide/getting-started' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/sidartaveloso/rinhany' }],
  },
})
