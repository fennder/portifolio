# Abrindo Portas

Portfólio profissional de `Abrindo Portas Tecnologia e Negócios`, construído como site estático com Eleventy e Tailwind via CDN.

## Visão geral

- Projeto Eleventy (`@11ty/eleventy`) para gerar HTML estático a partir de `src/`
- `src/` contém as páginas e templates de origem
- `_site/` é a pasta de saída gerada pelo build
- O site usa HTML, CSS e JavaScript puros
- Tailwind é carregado via CDN no template `src/_includes/head.html`

## Estrutura do projeto

- `package.json`
  - `devDependencies`
    - `@11ty/eleventy` ^3.1.6
  - `scripts`
    - `start`: `npx @11ty/eleventy --serve`
    - `build`: `npx @11ty/eleventy`
- `src/`
  - `index.html` — página inicial
  - `projects.html` — portfólio de projetos
  - `resume.html` — experiência e competências
  - `contact.html` — página de contato
  - `privacidade.html` — política de privacidade
  - `termos.html` — termos de uso
  - `_data/site.json` — dados globais do site (título, descrição, contato, redes, analytics)
  - `_includes/`
    - `head.html` — SEO, Open Graph, Tailwind, fontes, analytics, modo escuro
    - `navbar-home.html` — navegação da home
    - `navbar-simple.html` — navegação de páginas internas
    - `scripts.html` — interações JavaScript (dark mode, menu mobile, smooth scroll)
    - `footer-full.html`, `footer-legal.html`, `footer-simple.html` — rodapés reutilizáveis
    - `whatsapp-button.html` — botão flutuante de WhatsApp
- `assets/` — imagens e recursos estáticos
- `css/`
  - `styles.css`
  - `styles-optimized.css`
- `_site/` — saída estática gerada (não editar manualmente)

## Páginas principais

- `index.html`
  - home com apresentação, serviços, CTA e timeline de experiência
- `projects.html`
  - cases de projetos e depoimentos
- `resume.html`
  - experiência, educação e tecnologias
- `contact.html`
  - formulário de contato e informações de atendimento
- `privacidade.html`
  - política de privacidade
- `termos.html`
  - termos de uso

## Como desenvolver

Instale dependências se necessário:

```bash
npm install