# Companhia Dragão Avarento

## Sistema de Gerenciamento de Estoque RPG Medieval Fantasy

![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0-c9a84c)![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)![Tamanho](https://img.shields.io/badge/tamanho-~11_KB-c9a84c)![Dados](https://img.shields.io/badge/itens-30_pacotes-c9a84c)

Um sistema web completo de gerenciamento de estoque com tema visual inspirado em RPGs medievais. Desenvolvido com **HTML5**, **CSS3** e **JavaScript puro**, sem dependências de frameworks ou bibliotecas externas. O sistema simula o estoque de uma guilda de comerciantes em um universo de fantasia medieval, com categorias de itens, classes de personagens, raridades e um painel de estatísticas detalhado.

---

## Funcionalidades

### Dashboard

O painel principal exibe um resumo completo do estoque, incluindo cards com contadores de itens por categoria (Equipamentos, Craft, Poções e Itens Diversos), uma lista dos últimos itens cadastrados, itens com baixo estoque, um gráfico de barras com a quantidade por categoria e um painel de estatísticas com o total de ouro investido, o valor total do estoque, o item mais raro e a categoria e classe com mais itens.

### Estoque

A tabela de estoque apresenta todos os itens com as seguintes funcionalidades:

| Recurso | Descrição |
| --- | --- |
| **Ordenação** | Por nome, preço, quantidade, raridade e data de cadastro (ascendente/descendente) |
| **Paginação** | 10 itens por página com navegação entre páginas |
| **Filtros** | Por categoria, classe, raridade e favoritos |
| **Busca** | Campo de pesquisa textual no estoque |
| **Visualização** | Modal detalhado com todas as informações do item |
| **Edição** | Modal para alterar dados de qualquer item |
| **Favoritos** | Marcar/desmarcar itens como favoritos com estrela |
| **Exclusão** | Remover itens com confirmação de segurança |

### Cadastro de Itens

Formulário completo para adicionar novos itens ao estoque, com campos para nome, imagem (por URL ou upload de arquivo), categoria, classe, raridade, preço em ouro, quantidade, peso, descrição, fornecedor e data de cadastro. O sistema valida campos obrigatórios e exibe notificações de feedback.

### Pesquisa Avançada

Pesquisa em tempo real com filtros combinados por categoria, classe, raridade, faixa de preço e faixa de quantidade. Os resultados são exibidos em cards visuais com indicadores de raridade e favoritos, mostrando o total de itens encontrados.

### Categorias

Página dedicada com cards clicáveis organizados em três seções (Categorias, Classes e Raridades). Cada card exibe um ícone temático e a contagem de itens. Ao clicar em qualquer card, o sistema navega automaticamente para a página de Estoque com o filtro correspondente já aplicado.

### Relatórios

Relatórios detalhados com quantidade por categoria, quantidade por classe, valor total do estoque por categoria e total geral, itens mais caros e itens com menor estoque. Possui opções de exportação em JSON, CSV e impressão.

### Configurações

Painel de configurações que permite alternar entre tema escuro e claro, trocar o logo da empresa, renomear a guilda, limpar todo o banco de dados (com dupla confirmação) e restaurar os 30 itens iniciais do sistema.

---

## Itens Iniciais

O sistema vem com 30 itens pré-cadastrados, distribuídos da seguinte forma:

| Categoria | Itens | Exemplos |
| --- | --- | --- |
| **Equipamentos** | 12 | Espada Longa de Ferro, Armadura de Aço, Capa da Invisibilidade, Grimório das Chamas |
| **Craft** | 12 | Couro de Lobo Negro, Escama de Dragão Vermelho, Mithril Refinado, Cristal Arcano |
| **Poções** | 4 | Poção de Vida, Poção de Mana, Poção de Força, Veneno de Aranha Gigante |
| **Itens Diversos** | 2 | Flor Lunar, Núcleo de Golem |

As classes abrangem Guerreiros, Arqueiros, Magos, Ladinos, Sacerdotes, Druidas e Universal. As raridades vão de Comum a Divino.

---

## Tecnologias Utilizadas

O projeto utiliza apenas tecnologias nativas do navegador, sem dependências externas.

| Tecnologia | Uso |
| --- | --- |
| **HTML5** | Estrutura semântica da aplicação e formulários |
| **CSS3** | Tema RPG medieval com gradientes, animações, transições e responsividade |
| **JavaScript (ES6+)** | Lógica de negócio, navegação SPA, manipulação de DOM e persistência |
| **LocalStorage** | Persistência de dados, configurações e favoritos entre sessões |
| **Google Fonts** | Tipografia medieval (Cinzel, MedievalSharp, Uncial Antiqua) |
| **SVG (inline)** | Placeholders de imagens gerados dinamicamente com cores por raridade |

---

## Estrutura do Projeto

```
companhia-dragao-avarento/
├── index.html          # Página principal com toda a estrutura HTML
├── style.css           # Estilos com tema RPG medieval (dark e light)
├── database.js         # Dados iniciais (30 itens), LocalStorage e API de dados
├── utils.js            # Funções utilitárias (formatação, notificações, SVGs)
├── dashboard.js        # Renderização do painel principal com gráfico
├── estoque.js          # Tabela de estoque com filtros, paginação e CRUD
├── cadastro.js         # Formulário de cadastro de itens
├── pesquisa.js         # Busca avançada em tempo real
├── relatorios.js       # Relatórios e exportação (JSON, CSV, impressão)
├── config.js           # Configurações (tema, logo, nome, reset)
├── script.js           # Navegação, menu, categorias, favoritos e inicialização
└── assets/             # Pastas reservadas para imagens, ícones e fontes
```

---

## Como Executar

O projeto não requer servidor de aplicação nem dependências. Basta abrir o arquivo `index.html` diretamente no navegador.

### Método direto

1. Descompacte o arquivo ZIP do projeto.

1. Dê um duplo clique no arquivo `index.html`.

1. O sistema abrirá no navegador padrão com os 30 itens iniciais já carregados.

### Com Live Server no VS Code (recomendado)

1. Abra o projeto no Visual Studio Code.

1. Instale a extensão **Live Server** (Ritwick Dey) pelo marketplace de extensões.

1. Clique com o botão direito no `index.html` e selecione **Open with Live Server**.

1. O navegador abrirá automaticamente em `http://127.0.0.1:5500` com atualização em tempo real.

### Com qualquer servidor estático

```bash
# Python 3
python3 -m http.server 8080

# Node.js (com http-server )
npx http-server -p 8080

# PHP
php -S localhost:8080
```

---

## Navegação do Sistema

O menu lateral fixo permite navegar entre as sete seções do sistema. No desktop, o menu pode ser colapsado para um modo compacto. No mobile, o menu se transforma em um overlay com botão hamburguer. A barra superior contém busca global, botão de favoritos e alternância de tema.

---

## Personalização

As configurações do sistema permitem personalizar a aparência e os dados:

- **Tema**: Alternância entre escuro (padrão ) e claro com transição suave.

- **Logo**: Upload de imagem personalizada em formato base64.

- **Nome da empresa**: Renomear a guilda exibida no menu lateral.

- **Dados**: Limpar todo o estoque ou restaurar os 30 itens iniciais.

Todas as preferências são salvas automaticamente no `LocalStorage` do navegador.

---

## Licença

Este projeto é livre para uso, modificação e distribuição.

---

> "Que as moedas fluam e os dragões prosperem." — Companhia Dragão Avarento
