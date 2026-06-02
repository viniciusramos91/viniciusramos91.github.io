# CLAUDE.md

Guia para humanos e IAs trabalhando neste repositório. Escrito em pt-BR porque todo
o conteúdo e a audiência do site são em português.

## Visão geral

Site institucional, blog e funil de marketing da **Python Academy**
(`pythonacademy.com.br`) - produz conteúdo educacional sobre Python/Django e vende a
formação paga "Jornada Python" via links de afiliado (Hotmart). É um site estático
**Jekyll** com ~105 posts, landing pages de cursos/ebooks e páginas de captura de email.

## Stack

- **Jekyll 4.3.3** (gerador de site estático Ruby) - `bundle exec jekyll serve`
- **Ruby 3.3.0** (definido no `Gemfile` e `README.md`)
- **Bundler 2.5.11**, gems travadas em `Gemfile.lock`
- Markdown: **kramdown 2.4.0** (input GFM); syntax highlight: **rouge 4.2.1** (tema Monokai)
- CSS: **SCSS** compilado inline via **jekyll-assets** (ver Pegadinhas)
- Plugins: `jekyll-assets` (pipeline de assets), `jekyll-sitemap`, `jekyll-paginate`,
  `jekyll-lazy-load-image`, `jemoji` (`:emoji:`)
- Front-end de terceiros via CDN: Bootstrap 3.4.1, AOS (animações), jQuery, fontes Google
- **Não há `package.json` nem `Makefile`.** Node entra só na publicação (uglify-js/uglifycss/sass globais)

## Estrutura de diretórios

| Pasta | Papel |
|---|---|
| `_posts/` | Artigos do blog (`AAAA-MM-DD-slug.md`). URL final `/blog/:title` |
| `_drafts/` | Rascunhos não publicados (não entram no build sem `--drafts`) |
| `_layouts/` | Templates: `post`, `basic`, `page`, `author`, `ebook`, `ebook-download`, `slider`, `error` |
| `_includes/` | Partials Liquid. `_partials/` = head/navbar/footer/scripts/meta-tags; raiz = banners, forms de email, pixels de tracking |
| `_data/global.yml` | Config global de conteúdo (title, description SEO, redes sociais, links de cursos afiliados) |
| `_authors/` | Coleção de autores (`.md` com front matter). URL `/autores/:path` |
| `_sliders/` | Coleção de sliders/tutoriais especiais. URL `/sliders/:path` |
| `assets/` | `css/` (SCSS), `js/`, `img/`, `fonts/`, `authors/`, `ebooks/`, `posts/` (thumbnails por slug) |
| `blog/`, `cursos/`, `ebooks/`, `pydicas/`, `autores/`, `sliders/`, `black-friday/`, `jornada-python/`, `jornada-django/` | **Páginas-fonte** (landing pages e índices). NÃO confundir com a saída em `_site/` |
| `docs/` | Planejamento interno de SEO/conteúdo (`00-revisao-SEO.md`, `01-plano-seniorizacao-massa.md`) |
| `scripts/` | `publish.sh` (script de deploy legado - ver Pegadinhas) |
| `_site/` | **Saída do build. Gerada, gitignored, nunca editar.** |

Páginas soltas na raiz: `index.html`, `sobre.html`, `zen-of-python.html`, `404.html`.

## Comandos essenciais

```bash
# Setup (ver README.md para RVM + Ruby 3.3.0 + bundler 2.5.11)
bundle install

# Dev server - http://127.0.0.1:4000 (host/porta fixados em _config.yml)
bundle exec jekyll serve

# Build de produção (habilita GA/GTM/Pixel - só rodam quando JEKYLL_ENV=production)
JEKYLL_ENV=production bundle exec jekyll build

# Ver rascunhos localmente
bundle exec jekyll serve --drafts

# Deploy (LEGADO - ver Pegadinhas antes de usar)
scripts/publish.sh

# Docker (alternativa de dev)
docker build -t pythonacademy . && docker run -p 4000:4000 pythonacademy
```

Não há suíte de testes nem linter configurados.

## Convenções de código

- **Posts** (`_posts/AAAA-MM-DD-slug.md`): front matter com `title` (tag `<title>`/SEO),
  `h1` (título visível, pode diferir do `title`), `description` (≤156 chars), `author`
  (slug que casa com `_authors/`), `categories`, `tags`, `header_color` (hex do gradiente
  do banner), `assets_slug` (aponta para `/assets/posts/{slug}/thumbnail.png`),
  `last_modified_at`, `level`. `layout: post` é aplicado por default (`_config.yml`).
- **Layout default**: páginas → `basic`; posts e drafts → `post` (definido em `defaults`).
  As grandes landing pages (`index.html`, `blog/index.html`, `sobre.html`, etc.) usam
  `layout: null` e montam o `<head>` à mão incluindo `_partials/head.html`.
- **Idioma/UI**: pt-BR em todo conteúdo; HTML com `lang="pt-BR"`.
- **CSS**: um `.scss` por contexto em `assets/css/` (`master`, `post`, `index`, `blog`...).
  Há um arquivo SCSS por página/seção; convenções de nomenclatura seguem o nome da página.
- **Imagens em Markdown**: usar tag Liquid `{% link assets/... %}` (não caminhos crus),
  e referências de imagem no estilo kramdown (`![alt][id]` + `[id]: <{% link ... %}>`).
- **Links de afiliado/CTA**: centralizados em `_data/global.yml` e em includes de banner.

## Fluxos críticos

- **Entrada**: `index.html` (home) e `blog/index.html` (listagem do blog). Ambos
  `layout: null`, com JSON-LD de SEO embutido.
- **Renderização de post**: `_layouts/post.html` - banner com `header_color`, metadados
  do autor (lookup em `site.authors` por `slug`), CTA "Jornada Python", newsletter,
  popup de cupom (scroll 30%), e seção "Continue aprendendo" listando todos os posts.
  Toda a navegação de posts é **server-side via Jekyll** (o antigo `posts.json` foi
  descontinuado - comentários no código confirmam).
- **Modelos de dados centrais**: três coleções (`posts`, `authors`, `sliders`) + o
  singleton `_data/global.yml`. Autores são a entidade relacional principal: posts
  referenciam autor por slug.
- **Funil de conversão**: posts → banners/popups → landing pages (`jornada-python/`,
  `cursos/`, `ebooks/`) → Hotmart/formulários (Sendinblue/Mailchimp em `_includes/`).
  Páginas de "obrigado" pós-compra em `jornada-python/obrigado/` e `jornada-django/obrigado/`.

## Pegadinhas (não óbvio)

- **CSS é compilado e injetado inline** em `<style>` dentro do `<head>`, via
  `{% asset master.scss %}` + filtro `scssify` (jekyll-assets). Não existem `<link>`
  para folhas de estilo próprias. Editar o `.scss` correto, não procurar CSS no HTML.
- **`scripts/publish.sh` está DESATUALIZADO.** Ele faz push para
  `viniciusramos91.github.io.git` e `git push origin main:master`, mas o `origin` real é
  `git@github.com:PythonAcademyBrasil/pythonacademy.com.br.git` e o `_config.yml` aponta
  para um terceiro repo (`viniciusramos91/pythonacademy.github.io`). **A confirmar** qual
  é o mecanismo de deploy atual (provavelmente GitHub Pages a partir deste repo, dado o
  `CNAME` = `pythonacademy.com.br`). Não rode `publish.sh` às cegas.
- **Mismatch de Ruby**: `Gemfile`/`README` pedem Ruby 3.3.0; o `Dockerfile` usa
  `ruby:2.7.6`. O Docker pode falhar no `bundle install` com gems travadas para 3.3 - **a confirmar**.
- **Tracking só em produção**: GA, GTM e Facebook Pixel ficam atrás de
  `{% if jekyll.environment == "production" %}`. Em dev não disparam (esperado).
- **`safe: false`** no `_config.yml`: plugins customizados são permitidos (incompatível
  com o modo seguro do GitHub Pages clássico).
- **Config de plugins suspeita**: no `_config.yml`, `plugins_dir` é definido duas vezes -
  primeiro como `_plugins`, depois sobrescrito por uma *lista* de nomes de plugins (que
  deveria estar na chave `plugins:`). Os plugins funcionam porque estão no grupo
  `:jekyll_plugins` do `Gemfile` (auto-require do Bundler), não por essa lista. **A confirmar**/limpar.
- **Paginação configurada mas desligada**: `jekyll-paginate` está no Gemfile, porém
  `paginate`/`paginate_path` estão comentados no `_config.yml`.
- **Duplicação de `<head>`**: `_layouts/basic.html` e `_layouts/post.html` repetem quase
  o mesmo bloco `capture` de title/description/og-image. Alterar SEO geralmente exige
  mexer nos dois (ou no `index.html`, que também replica isso).
- **Black Friday**: `/black-friday/` é bloqueado no `robots.txt` (campanha temporária).
- `_config.yml` lista fontes de assets que não existem (`assets/images`, `assets/videos`...);
  o diretório real de imagens é `assets/img`.

## O que evitar

- **Não editar `_site/`** nem os caches `.jekyll-cache/`, `.sass-cache/`, `.asset-cache/`
  (gerados; alguns estão no `.gitignore`).
- **Não editar `blog/posts.json`** para mudar navegação - é legado; posts são renderizados
  server-side.
- Não tratar `scripts/publish.sh` como fonte de verdade do deploy (ver Pegadinhas).
- Evitar adicionar CSS via `<link>`: seguir o padrão de inline+`scssify` já estabelecido.
- `ebooks/linkedin/` está no `exclude` do `_config.yml` (não é publicado) - mudanças ali não aparecem no site.
- Não confundir as pastas-fonte da raiz (`blog/`, `cursos/`, `autores/`...) com a saída em `_site/`.
