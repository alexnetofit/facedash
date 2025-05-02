# FaceDash

FaceDash é uma aplicação web para monitoramento de métricas do Facebook Ads, permitindo visualizar gastos, CPM, CPC, CTR e conversões em um painel intuitivo.

## Tecnologias

- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (autenticação e banco de dados)
- Facebook SDK JavaScript
- SWR para fetching dos dados
- Chart.js para visualização de dados
- Headless UI para componentes

## Funcionalidades

- **Autenticação**: Cadastro e login de usuários
- **Integração com Facebook**: Conecte suas contas de anúncios do Facebook
- **Dashboard**: Visualize métricas importantes em um único lugar
- **Gráficos**: Acompanhe a evolução diária das métricas
- **Seleção de contas**: Escolha quais contas de anúncios monitorar

## Como executar localmente

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/facedash.git
cd facedash
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
NEXT_PUBLIC_FACEBOOK_APP_ID=seu_app_id_do_facebook
FACEBOOK_APP_SECRET=seu_app_secret_do_facebook
```

4. Execute o servidor de desenvolvimento
```bash
npm run dev
```

5. Acesse a aplicação em `http://localhost:3000`

## Deploy

A aplicação está configurada para deploy na Vercel. Basta conectar o repositório e configurar as variáveis de ambiente.

## Estrutura do Projeto

```
/src
  /app                  # Rotas e páginas da aplicação
    /api                # Rotas da API
    /dashboard          # Páginas do dashboard
    /login              # Página de login
    /register           # Página de registro
  /components           # Componentes reutilizáveis
  /hooks                # Hooks personalizados
  /lib                  # Bibliotecas e utilitários
  /middleware.ts        # Middleware do Next.js
```

## Licença

MIT
