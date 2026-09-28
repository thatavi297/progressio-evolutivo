# Progressio

O **Progressio** é uma aplicação web desenvolvida para organização de treinos de academia e acompanhamento da evolução dos usuários.

A proposta do sistema é permitir que o usuário monte diferentes fichas de treino, escolha exercícios, configure séries, repetições e cargas para exercícios de musculação ou tempo em minutos para exercícios de cardio, registrando sua evolução ao longo do tempo.

O sistema também apresenta informações dos exercícios em **português e inglês**, utilizando as traduções disponíveis na API externa.

O projeto foi desenvolvido utilizando **React, TypeScript e Vite**, com organização em componentes, páginas, serviços e tipos.

---

## Objetivo do projeto

O objetivo do Progressio é facilitar a organização dos treinos e permitir que o usuário acompanhe sua evolução de maneira simples.

O sistema diferencia exercícios de musculação e cardio.

Nos exercícios de musculação, o acompanhamento é realizado através de séries, repetições e carga utilizada.

Nos exercícios de cardio, o acompanhamento é realizado através do tempo em minutos.

Os registros são armazenados e utilizados para gerar históricos, indicadores e gráficos de evolução.

---

## Principais funcionalidades

O sistema possui as seguintes funcionalidades:

- Login de demonstração
- Controle de autenticação utilizando LocalStorage
- Proteção de rotas
- Dashboard com resumo das informações
- Catálogo de exercícios
- Consumo de API externa
- Busca de exercícios pelo nome
- Busca utilizando nomes em português e inglês
- Filtro de exercícios por categoria
- Exibição do nome dos exercícios em português e inglês
- Exibição das descrições em português e inglês quando disponíveis
- Página de detalhes de cada exercício
- Diferenciação entre musculação e cardio
- Exercícios de musculação com séries, repetições e carga
- Exercícios de cardio com tempo em minutos
- Criação de várias fichas de treino
- Renomeação de fichas de treino
- Exclusão de fichas
- Adição de exercícios em diferentes fichas
- Remoção de exercícios das fichas
- Registro da data do treino
- Histórico dos exercícios realizados
- Evolução de carga para musculação
- Evolução de tempo para cardio
- Gráficos de progresso
- Página específica de progresso
- Página de erro 404
- Menu de navegação
- Layout responsivo para diferentes tamanhos de tela

---

## Tecnologias utilizadas

O projeto foi desenvolvido utilizando:

- React
- TypeScript
- Vite
- React Router DOM
- Lucide React
- Recharts
- CSS
- LocalStorage
- Fetch API

---

## React

O React é utilizado na construção da interface e na organização da aplicação através de componentes reutilizáveis.

O projeto utiliza recursos como:

- Componentes
- Props
- useState
- useEffect
- Eventos
- Renderização condicional
- map
- filter
- Manipulação de arrays e objetos

---

## TypeScript

O TypeScript é utilizado para adicionar tipagem ao projeto.

Foram criadas interfaces para representar informações como:

- Exercícios
- Traduções dos exercícios
- Treinos
- Exercícios adicionados aos treinos
- Tipos de exercícios
- Registros de progresso
- Respostas da API

Isso ajuda na organização do código e reduz erros durante o desenvolvimento.

---

## React Router

O projeto utiliza o **React Router DOM** para controlar a navegação entre as páginas.

Entre as principais rotas estão:

```text
/login
/dashboard
/exercicios
/exercicios/:id
/treinos
/progresso
```

Também existe tratamento para rotas inexistentes através da página **404**.

---

## Rotas protegidas

As páginas internas do sistema são protegidas por autenticação.

Caso um usuário tente acessar uma página interna sem estar autenticado, ele é redirecionado para a página de login.

Após realizar o login corretamente, o usuário pode acessar as funcionalidades do sistema.

---

## Login de demonstração

Para acessar o sistema utilize:

### E-mail

```text
usuario@progressio.com
```

### Senha

```text
123456
```

O login é apenas uma simulação para esta etapa do projeto.

A autenticação é armazenada através do **LocalStorage** do navegador.

---

## Dashboard

O Dashboard apresenta uma visão geral das informações do usuário.

Entre as informações exibidas estão:

- Quantidade de fichas de treino
- Quantidade de exercícios cadastrados nas fichas
- Quantidade de treinos registrados
- Quantidade de exercícios com evolução
- Último treino registrado
- Evoluções recentes

O Dashboard também identifica o tipo do exercício.

Para musculação, são apresentados dados de séries, repetições e carga.

Para cardio, é apresentado o tempo em minutos.

As evoluções recentes também utilizam a unidade adequada:

```text
Musculação → kg
Cardio → min
```

---

## Catálogo de exercícios

A página de exercícios apresenta uma lista de exercícios obtidos através de uma API externa.

O usuário pode:

- Visualizar os exercícios
- Pesquisar pelo nome
- Pesquisar utilizando português ou inglês
- Filtrar pela categoria
- Visualizar informações do exercício
- Acessar a página de detalhes

Quando disponíveis na API, os cards apresentam o nome do exercício em:

```text
Português
English
```

A listagem utiliza recursos como:

- map
- filter
- key
- useState
- useEffect

---

## API externa

O Progressio utiliza a API pública do **wger Workout Manager** para carregar informações relacionadas aos exercícios.

A aplicação utiliza as traduções disponíveis na própria API para apresentar os exercícios em **português e inglês**.

Quando disponíveis, são exibidos:

- Nome em português
- Nome em inglês
- Descrição em português
- Descrição em inglês
- Categoria
- Equipamentos

A busca de exercícios também considera os nomes disponíveis nos dois idiomas.

O consumo da API é realizado utilizando:

```text
fetch
async/await
useEffect
```

Também foram implementados estados para:

- Carregamento
- Sucesso
- Erro

Caso ocorra algum problema na comunicação com a API, o sistema apresenta uma mensagem ao usuário e permite tentar novamente.

Durante o desenvolvimento, o Vite é utilizado como proxy para realizar a comunicação com a API.

---

## Detalhes do exercício

Ao selecionar um exercício, o usuário pode acessar uma página específica com suas informações.

Quando disponíveis na API, são apresentados:

- Nome em português
- Nome em inglês
- Descrição em português
- Descrição em inglês
- Categoria
- Equipamento
- Tipo do exercício

O sistema diferencia exercícios de **musculação** e **cardio**.

### Musculação

Para exercícios de musculação, o usuário configura:

- Ficha de destino
- Séries
- Repetições
- Carga em quilogramas

Exemplo:

```text
Séries: 4
Repetições: 10
Carga: 30 kg
```

### Cardio

Para exercícios de cardio, o usuário configura:

- Ficha de destino
- Tempo em minutos

Exemplo:

```text
Tempo: 30 min
```

Nos exercícios de cardio não são solicitadas séries, repetições ou carga.

Depois da configuração, o exercício pode ser adicionado à ficha escolhida.

---

## Fichas de treino

O sistema permite criar múltiplas fichas de treino.

Por exemplo:

```text
Treino A
Treino B
Treino C
```

Cada ficha possui seus próprios exercícios.

O usuário pode:

- Criar uma nova ficha
- Selecionar uma ficha
- Renomear uma ficha
- Excluir uma ficha
- Adicionar exercícios
- Remover exercícios
- Alterar séries
- Alterar repetições
- Alterar cargas
- Alterar o tempo dos exercícios de cardio

O sistema mantém pelo menos uma ficha de treino cadastrada.

Na tela de treinos, os exercícios são exibidos de acordo com seu tipo.

### Exemplo de musculação

```text
Supino reto

4 séries
10 repetições
30 kg
```

### Exemplo de cardio

```text
Cycling

30 min
```

O resumo da ficha também apresenta o total de séries dos exercícios de musculação e o tempo de cardio cadastrado.

---

## Registro de treino

Depois de configurar uma ficha, o usuário pode registrar o treino realizado.

Nos exercícios de musculação são armazenadas informações como:

- Exercício
- Data
- Carga
- Séries
- Repetições
- Ficha de treino
- Tipo do exercício

Nos exercícios de cardio são armazenadas informações como:

- Exercício
- Data
- Tempo em minutos
- Ficha de treino
- Tipo do exercício

Essas informações são utilizadas posteriormente para calcular e apresentar a evolução do usuário.

---

## Progresso

A página de progresso permite acompanhar a evolução dos exercícios registrados.

O usuário pode selecionar um exercício e consultar seus registros.

O comportamento da página depende do tipo do exercício.

### Musculação

Para exercícios de musculação, o sistema apresenta:

- Carga inicial
- Carga atual
- Maior carga registrada
- Evolução total da carga
- Quantidade de registros
- Séries
- Repetições
- Histórico de cargas
- Gráfico de evolução em quilogramas

Exemplo:

```text
Primeira carga: 20 kg
Carga atual: 30 kg
Evolução: +10 kg
Maior carga: 30 kg
```

### Cardio

Para exercícios de cardio, o sistema apresenta:

- Tempo inicial
- Tempo atual
- Maior tempo registrado
- Evolução total do tempo
- Quantidade de registros
- Histórico dos tempos
- Gráfico de evolução em minutos

Exemplo:

```text
Primeiro tempo: 20 min
Tempo atual: 30 min
Evolução: +10 min
Maior tempo: 30 min
```

O gráfico foi desenvolvido utilizando a biblioteca **Recharts**.

---

## Armazenamento de dados

Nesta etapa do projeto ainda não existe um backend próprio.

Os dados criados pelo usuário são armazenados utilizando o **LocalStorage** do navegador.

São armazenadas informações relacionadas a:

- Autenticação
- Fichas de treino
- Exercícios das fichas
- Tipo dos exercícios
- Séries
- Repetições
- Cargas
- Tempos de cardio
- Histórico de treinos
- Histórico de progresso

Isso permite que os dados continuem disponíveis mesmo após atualizar a página.

Como o armazenamento é local, os dados pertencem ao navegador e ao dispositivo onde foram criados.

Por exemplo, os dados cadastrados no navegador do computador não aparecem automaticamente no celular.

Uma futura integração com backend e banco de dados permitirá sincronizar as informações entre diferentes dispositivos.

---

## Organização do projeto

O projeto foi organizado utilizando diferentes pastas para separar as responsabilidades da aplicação.

```text
progressio/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── AppLayout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── StatCard.tsx
│   │
│   ├── data/
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Exercises.tsx
│   │   ├── ExerciseDetails.tsx
│   │   ├── Workouts.tsx
│   │   ├── Progress.tsx
│   │   └── NotFound.tsx
│   │
│   ├── services/
│   │   ├── authStorage.ts
│   │   ├── exerciseApi.ts
│   │   └── workoutStorage.ts
│   │
│   ├── types/
│   │   ├── Exercise.ts
│   │   ├── Workout.ts
│   │   └── Progress.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Componentes

O projeto utiliza componentes para evitar repetição de código e melhorar a organização.

Um exemplo é o componente:

```text
StatCard
```

Ele é utilizado no Dashboard para apresentar diferentes estatísticas através de **props**.

Também existe o componente:

```text
AppLayout
```

responsável pela estrutura principal das páginas internas, incluindo menu lateral e barra superior.

O componente:

```text
ProtectedRoute
```

é responsável por impedir o acesso às páginas internas caso o usuário não esteja autenticado.

---

## Fluxo principal do sistema

O fluxo principal da aplicação é:

```text
Login
  ↓
Dashboard
  ↓
Exercícios
  ↓
Detalhes do exercício
  ↓
Adicionar à ficha
  ↓
Meus Treinos
  ↓
Registrar treino
  ↓
Progresso
```

---

## Responsividade

A interface foi desenvolvida para se adaptar a diferentes tamanhos de tela.

Foram utilizados recursos de CSS como:

- Grid
- Flexbox
- Media Queries

Em telas menores, elementos como menu lateral, cards, formulários, listas, botões e gráficos são reorganizados para melhorar a experiência do usuário.

O projeto também pode ser acessado através de outros dispositivos conectados à rede utilizada durante o desenvolvimento, desde que o servidor Vite esteja configurado para aceitar conexões pela rede.

---

## Identidade visual

O Progressio utiliza principalmente as cores:

- Azul céu
- Branco
- Tons claros de cinza

A proposta visual é apresentar uma interface simples, moderna e organizada.

---

## Como instalar o projeto

É necessário possuir o **Node.js** instalado no computador.

Depois de baixar ou clonar o projeto, abra o terminal dentro da pasta do projeto.

Entre na pasta:

```bash
cd progressio
```

Instale todas as dependências:

```bash
npm install
```

---

## Como executar o projeto

Depois de instalar as dependências, execute:

```bash
npm run dev
```

O Vite iniciará o servidor de desenvolvimento.

No terminal será exibido um endereço semelhante a:

```text
http://localhost:5173/
```

Abra esse endereço no navegador.

---

## Executar na rede local

Para permitir acesso através de outro dispositivo conectado à mesma rede, o Vite pode ser iniciado com:

```bash
npm run dev -- --host 0.0.0.0
```

O terminal exibirá um endereço de rede semelhante a:

```text
Network: http://192.168.x.x:5173/
```

Esse endereço pode ser utilizado por outro dispositivo que consiga se comunicar com o computador através da rede local.

---

## Dependências principais

Entre as principais dependências utilizadas estão:

```text
react
react-dom
react-router-dom
lucide-react
recharts
```

As dependências são instaladas automaticamente através do comando:

```bash
npm install
```

---

## Build do projeto

Para gerar uma versão de produção do projeto utilize:

```bash
npm run build
```

Esse comando realiza a compilação do projeto e gera os arquivos de produção.

---

## Página 404

O projeto possui uma página personalizada para endereços inexistentes.

Caso o usuário acesse uma rota que não existe, será exibida uma página informando:

```text
ERRO 404

Página não encontrada
```

O usuário poderá retornar ao sistema através dos botões disponíveis na página.

---

## Integrante

**Thainara de Fátima Jacob Vieira**

---

## Disciplina

**Programação para Sistemas Web**

Período: **2026.2**

---

## Projeto

**Progressio — Sistema de gerenciamento de treinos e acompanhamento de evolução**