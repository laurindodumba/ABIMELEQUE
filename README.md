
# Encontros que Transformam

Uma aplicação web para a gestão e divulgação da conferência "Encontros que Transformam": site público com informações e formulário de inscrição, e uma área administrativa para visualizar cadastros.

## Objetivo

Permitir que participantes se inscrevam online e que administradores validem e consultem os cadastros recebidos. O sistema fornece uma página pública informativa e um painel administrativo com estatísticas e listagem de cadastros.

## Funcionalidades

- Página pública com informações, oradores e partners.
- Formulário de cadastro (nome, e-mail, telefone, cidade, escolaridade, mensagem).
- Área administrativa com autenticação (login), estatísticas e listagem de cadastros.
- API REST para envio e consulta de cadastros.
- Inicialização automática de um utilizador administrador no banco quando necessário.

## Tecnologias Utilizadas

- Frontend: HTML, CSS, Tailwind (CDN), Bootstrap (CDN), JavaScript
- Backend: Node.js, Express
- Banco de Dados: PostgreSQL (via `pg`)
- Autenticação: JWT
- Outras libs: `bcryptjs`, `cors`, `dotenv`, `pg`

## Estrutura do Projeto

Resumo das pastas principais:

- `backend/` – servidor Express, rotas, controllers e inicialização da base de dados
	- `src/routes` – rotas da API (`/api/cadastros`, `/api/admin`)
	- `src/controllers` – lógica de negócios (cadastros, admin)
	- `src/database` – conexão com PostgreSQL e script de inicialização
- `frontend/` – conteúdo público do site
	- `src/index.html` – página inicial
	- `src/styles.css`, `src/index.css` – estilos
	- `src/script.js` – comportamentos do frontend (toggle menu, submit formulário)
	- `src/pages` – páginas administrativas (`admin-login.html`, `admin-dashboard.html`)

## Instalação

1. Clonar o repositório:

```bash
git clone https://github.com/laurindodumba/EncontrosQueTransformam.git
cd EncontrosQueTransformam
```

2. Backend: instalar dependências e executar

```bash
cd backend
npm install
cp .env.example .env # ajustar variáveis conforme necessário
npm run start
```

3. Frontend: instalar dependências e executar

```bash
cd frontend
npm install
npm run start
```

Observação: o frontend é servido por um pequeno servidor Express (`frontend/server.js`). Em produção pode ser servido por qualquer host estático (Nginx, Vercel, Netlify, etc.).

## Variáveis de Ambiente

As variáveis relevantes (arquivo `.env` no `backend/`):

- `PORT` – porta do servidor (ex: `5000`)
- `DATABASE_URL` – string de conexão PostgreSQL
- `JWT_SECRET` – segredo para assinatura dos tokens JWT
- `ADMIN_USER` – nome de utilizador administrador inicial (opcional)
- `ADMIN_PASSWORD` – senha do administrador inicial (opcional)

## Scripts

Backend (`backend/package.json`):

- `start` — Inicia o servidor (`node server.js`)
- `dev` — Inicia em modo desenvolvimento (aqui mapeado para `node server.js`)

Frontend (`frontend/package.json`):

- `start` — Inicia o servidor do frontend (`node server.js`)

## Fluxo da Aplicação

Usuário → Preenche formulário na página pública → Frontend envia `POST /api/cadastros` → Backend grava em PostgreSQL.

Administrador → Faz `POST /api/admin/login` → Recebe JWT → Consulta `GET /api/cadastros` (rota protegida) → Visualiza no painel administrativo.

## Arquitetura

- Frontend (HTML/CSS/JS) comunica com o Backend via chamadas HTTP à API REST.
- Backend (Express) expõe endpoints e interage com PostgreSQL via `pg`.
- Autenticação administrativa usa JWT enviado no cabeçalho `Authorization: Bearer <token>`.

## Estrutura da API (principais endpoints)

- `POST /api/cadastros` — criar um novo cadastro (público)
- `GET /api/cadastros` — listar cadastros (protegido por JWT)
- `POST /api/admin/login` — login do administrador (gera JWT)

## Segurança

- Autenticação via JWT para rotas administrativas.
- Senhas de administradores são armazenadas hashed com `bcryptjs`.
- Rotas protegidas usam middleware (`auth`) para validar tokens.
- Uploads: projeto atual não expõe upload público; para implementar uploads, usar `multer` e validação de tipos/extensões e limites de tamanho.

## Responsividade

O frontend foi otimizado com abordagem Mobile‑First e pontos de quebra (`@media`) para:

- Smartphones: interfaces simplificadas, redução de padding, fontes menores e ocultação de colunas secundárias nas tabelas administrativas.
- Tablets: layout em duas colunas quando apropriado.
- Desktop: espaçamentos e imagens ampliados, grid completo de oradores.

Principais melhorias realizadas na responsividade (resumo técnico):

- Navbar responsiva com botão de menu para mobile.
- Hero e grids adaptativos com `clamp()` e `max-width` para evitar transbordamentos.
- Cards e imagens trocam alturas fixas por `max-height` e `object-fit: cover`.
- Tabelas administrativas permitem quebra de texto; coluna de mensagem oculta em telas muito pequenas para evitar overflow.
- Overflow horizontal global bloqueado (`overflow-x: hidden`) e ajustes nos logos/marquee.

## Melhorias Futuras

- Converter o frontend para um framework (React/Vue) e componentes reutilizáveis.
- Adicionar testes end‑to‑end e unitários (Jest / Playwright).
- Implementar CI/CD para builds e deploy automático.
- Suportar upload de imagem para oradores com validação segura.
- Internacionalização (i18n) para múltiplos idiomas.

## Autor

Desenvolvedor: Laurindo Dumba (contribuições atuais no repositório)

## Licença

Por favor adicione a licença desejada (ex: MIT) no `package.json` e no repositório.




