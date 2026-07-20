/* ============================================
   Companhia Dragão Avarento - Database Module
   Gerenciamento de LocalStorage e Dados Iniciais
   ============================================ */

   const DB_KEY = 'dragao_avarento_estoque';
   const CONFIG_KEY = 'dragao_avarento_config';
   
   // Cores de raridade
   const RARITY_COLORS = {
       'Comum': '#9e9e9e',
       'Incomum': '#4caf50',
       'Raro': '#2196f3',
       'Épico': '#9c27b0',
       'Lendário': '#ff9800',
       'Mítico': '#f44336',
       'Divino': '#ffd700'
   };
   
   const RARITY_ORDER = {
       'Comum': 1,
       'Incomum': 2,
       'Raro': 3,
       'Épico': 4,
       'Lendário': 5,
       'Mítico': 6,
       'Divino': 7
   };
   
   // Imagens geradas via placeholder SVG com tema medieval
   function getPlaceholderImage(name, color1, color2) {
       const c1 = color1 || '5c3a1e';
       const c2 = color2 || '1a1a2e';
       const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
           <defs>
               <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" style="stop-color:#${c1}"/>
                   <stop offset="100%" style="stop-color:#${c2}"/>
               </linearGradient>
           </defs>
           <rect width="120" height="120" fill="url(#bg)"/>
           <text x="60" y="65" text-anchor="middle" font-family="serif" font-size="36" fill="#c9a84c">&#x2694;</text>
           <text x="60" y="95" text-anchor="middle" font-family="serif" font-size="8" fill="#e8d5b7">${name.substring(0, 15)}</text>
       </svg>`;
       return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
   }
   
   // Dados iniciais - 30 itens
   const INITIAL_ITEMS = [
       {
           id: 1,
           name: 'Espada Longa de Ferro',
           imagem: '',
           categoria: 'Equipamentos',
           classe: 'Guerreiros',
           raridade: 'Comum',
           preco: 150,
           quantidade: 25,
           peso: 3.5,
           descricao: 'Uma espada longa forjada em ferro resistente. Ideal para guerreiros em formação.',
           fornecedor: 'Forja do Martelo Vermelho',
           dataCadastro: '2025-01-15',
           favorito: false
       },
       {
           id: 2,
           name: 'Espada Bastarda',
           imagem: '',
           categoria: 'Equipamentos',
           classe: 'Guerreiros',
           raridade: 'Incomum',
           preco: 380,
           quantidade: 12,
           peso: 4.2,
           descricao: 'Espada versátil que pode ser usada com uma ou duas mãos. Forjada em aço de alta qualidade.',
           fornecedor: 'Forja do Martelo Vermelho',
           dataCadastro: '2025-01-18',
           favorito: false
       },
       {
           id: 3,
           name: 'Machado de Guerra',
           imagem: '',
           categoria: 'Equipamentos',
           classe: 'Guerreiros',
           raridade: 'Raro',
           preco: 520,
           quantidade: 8,
           peso: 5.0,
           descricao: 'Machado pesado com lâmina duplamente afiada. Favorito entre os bárbaros do norte.',
           fornecedor: 'Forja Anã de Khaz Morad',
           dataCadastro: '2025-01-20',
           favorito: true
       },
       {
           id: 4,
           name: 'Martelo Anão',
           imagem: '',
           categoria: 'Equipamentos',
           classe: 'Guerreiros',
           raridade: 'Épico',
           preco: 890,
           quantidade: 4,
           peso: 6.5,
           descricao: 'Martelo de guerra forjado pelos anões das montanhas profundas. Incrustado com runas de poder.',
           fornecedor: 'Forja Anã de Khaz Morad',
           dataCadastro: '2025-01-22',
           favorito: false
       },
       {
           id: 5,
           name: 'Arco Élfico',
           imagem: '',
           categoria: 'Equipamentos',
           classe: 'Arqueiros',
           raridade: 'Raro',
           preco: 450,
           quantidade: 10,
           peso: 1.8,
           descricao: 'Arco longo élfico feito de madeira sagrada. Leve e preciso, com alcance superior.',
           fornecedor: 'Artesãos da Floresta de Silverwood',
           dataCadastro: '2025-01-25',
           favorito: true
       },
       {
           id: 6,
           name: 'Besta Pesada',
           imagem: '',
           categoria: 'Equipamentos',
           classe: 'Arqueiros',
           raridade: 'Incomum',
           preco: 320,
           quantidade: 15,
           peso: 4.0,
           descricao: 'Besta robusta capaz de perfurar armaduras. Requer força considerável para recarregar.',
           fornecedor: 'Arsenal do Reino de Valdor',
           dataCadastro: '2025-01-28',
           favorito: false
       },
       {
           id: 7,
           name: 'Cajado Arcano',
           imagem: '',
           categoria: 'Equipamentos',
           classe: 'Magos',
           raridade: 'Raro',
           preco: 680,
           quantidade: 6,
           peso: 2.0,
           descricao: 'Cajado entalhado com símbolos arcanos. Amplifica o poder mágico do portador.',
           fornecedor: 'Torre dos Magos de Eldoria',
           dataCadastro: '2025-02-01',
           favorito: false
       },
       {
           id: 8,
           name: 'Grimório das Chamas',
           imagem: '',
           categoria: 'Equipamentos',
           classe: 'Magos',
           raridade: 'Lendário',
           preco: 1500,
           quantidade: 2,
           peso: 1.5,
           descricao: 'Livro mágico antigo contendo feitiços de fogo poderosos. Suas páginas brilham com energia arcana.',
           fornecedor: 'Biblioteca Arcana de Mystril',
           dataCadastro: '2025-02-05',
           favorito: true
       },
       {
           id: 9,
           name: 'Adaga Sombria',
           imagem: '',
           categoria: 'Equipamentos',
           classe: 'Ladinos',
           raridade: 'Épico',
           preco: 750,
           quantidade: 7,
           peso: 0.5,
           descricao: 'Adaga forjada em sombras. Quase invisível à luz e letal em mãos ágeis.',
           fornecedor: 'Guilda dos Assassinos Sombrios',
           dataCadastro: '2025-02-08',
           favorito: false
       },
       {
           id: 10,
           name: 'Escudo do Guardião',
           imagem: '',
           categoria: 'Equipamentos',
           classe: 'Sacerdotes',
           raridade: 'Raro',
           preco: 420,
           quantidade: 11,
           peso: 3.0,
           descricao: 'Escudo abençoado com proteções divinas. Bloqueia ataques físicos e mágicos.',
           fornecedor: 'Templo da Luz Eterna',
           dataCadastro: '2025-02-10',
           favorito: false
       },
       {
           id: 11,
           name: 'Armadura de Aço',
           imagem: '',
           categoria: 'Equipamentos',
           classe: 'Guerreiros',
           raridade: 'Épico',
           preco: 1200,
           quantidade: 3,
           peso: 25.0,
           descricao: 'Armadura completa forjada em aço temperado. Oferece proteção excepcional contra ataques.',
           fornecedor: 'Forja Real de Valdor',
           dataCadastro: '2025-02-12',
           favorito: true
       },
       {
           id: 12,
           name: 'Capa da Invisibilidade',
           imagem: '',
           categoria: 'Equipamentos',
           classe: 'Ladinos',
           raridade: 'Mítico',
           preco: 2500,
           quantidade: 1,
           peso: 0.3,
           descricao: 'Capa mágica extremamente rara que torna o portador completamente invisível. Peça única.',
           fornecedor: 'Mercador Misterioso',
           dataCadastro: '2025-02-15',
           favorito: true
       },
       {
           id: 13,
           name: 'Poção de Vida',
           imagem: '',
           categoria: 'Poções',
           classe: 'Universal',
           raridade: 'Comum',
           preco: 50,
           quantidade: 100,
           peso: 0.2,
           descricao: 'Poção vermelha que restaura pontos de vida. Essencial para qualquer aventureiro.',
           fornecedor: 'Botica da Aldeia de Willow',
           dataCadastro: '2025-01-10',
           favorito: false
       },
       {
           id: 14,
           name: 'Poção de Mana',
           imagem: '',
           categoria: 'Poções',
           classe: 'Magos',
           raridade: 'Incomum',
           preco: 80,
           quantidade: 60,
           peso: 0.2,
           descricao: 'Poção azul brilhante que restaura mana. Fundamental para conjuradores.',
           fornecedor: 'Botica da Aldeia de Willow',
           dataCadastro: '2025-01-12',
           favorito: false
       },
       {
           id: 15,
           name: 'Poção de Força',
           imagem: '',
           categoria: 'Poções',
           classe: 'Guerreiros',
           raridade: 'Raro',
           preco: 200,
           quantidade: 20,
           peso: 0.3,
           descricao: 'Poção dourada que aumenta temporariamente a força física do consumidor.',
           fornecedor: 'Alquimista do Mercado Negro',
           dataCadastro: '2025-02-18',
           favorito: false
       },
       {
           id: 16,
           name: 'Couro de Lobo Negro',
           imagem: '',
           categoria: 'Craft',
           classe: 'Universal',
           raridade: 'Incomum',
           preco: 120,
           quantidade: 30,
           peso: 2.0,
           descricao: 'Pele macia e resistente de lobo negro. Excelente material para confecção de armaduras leves.',
           fornecedor: 'Caçadores da Floresta Sombria',
           dataCadastro: '2025-01-20',
           favorito: false
       },
       {
           id: 17,
           name: 'Presa de Javali Gigante',
           imagem: '',
           categoria: 'Craft',
           classe: 'Universal',
           raridade: 'Raro',
           preco: 250,
           quantidade: 15,
           peso: 1.5,
           descricao: 'Presa afiada de javali gigante. Usada em armas e como componente mágico.',
           fornecedor: 'Caçadores da Floresta Sombria',
           dataCadastro: '2025-01-25',
           favorito: false
       },
       {
           id: 18,
           name: 'Garra de Grifo',
           imagem: '',
           categoria: 'Craft',
           classe: 'Universal',
           raridade: 'Épico',
           preco: 500,
           quantidade: 5,
           peso: 1.0,
           descricao: 'Garra cortante de grifo. Material raro usado em armaduras de elite e encantamentos.',
           fornecedor: 'Caçadores de Montanha',
           dataCadastro: '2025-02-01',
           favorito: true
       },
       {
           id: 19,
           name: 'Chifre de Minotauro',
           imagem: '',
           categoria: 'Craft',
           classe: 'Universal',
           raridade: 'Raro',
           preco: 350,
           quantidade: 8,
           peso: 3.0,
           descricao: 'Chifre resistente de minotauro. Excelente para confecção de armas pesadas e poções de vigor.',
           fornecedor: 'Caçadores do Labirinto',
           dataCadastro: '2025-02-05',
           favorito: false
       },
       {
           id: 20,
           name: 'Escama de Dragão Vermelho',
           imagem: '',
           categoria: 'Craft',
           classe: 'Universal',
           raridade: 'Lendário',
           preco: 2000,
           quantidade: 3,
           peso: 4.0,
           descricao: 'Escama de dragão vermelho, extremamente resistente ao fogo. Material lendário para armaduras supremas.',
           fornecedor: 'Caçador de Dragões Solitário',
           dataCadastro: '2025-02-10',
           favorito: true
       },
       {
           id: 21,
           name: 'Olho de Basilisco',
           imagem: '',
           categoria: 'Craft',
           classe: 'Magos',
           raridade: 'Mítico',
           preco: 3000,
           quantidade: 2,
           peso: 0.5,
           descricao: 'Olho petrificado de basilisco. Ingrediente para poções de petrificação e encantamentos poderosos.',
           fornecedor: 'Alquimista do Mercado Negro',
           dataCadastro: '2025-02-15',
           favorito: false
       },
       {
           id: 22,
           name: 'Cristal Arcano',
           imagem: '',
           categoria: 'Craft',
           classe: 'Magos',
           raridade: 'Épico',
           preco: 800,
           quantidade: 10,
           peso: 0.3,
           descricao: 'Cristal pulsante com energia mágica pura. Componente essencial para encantamentos de alto nível.',
           fornecedor: 'Mina dos Cristais de Arcanum',
           dataCadastro: '2025-01-30',
           favorito: false
       },
       {
           id: 23,
           name: 'Essência Sombria',
           imagem: '',
           categoria: 'Craft',
           classe: 'Ladinos',
           raridade: 'Raro',
           preco: 400,
           quantidade: 12,
           peso: 0.1,
           descricao: 'Líquido escuro extraído de criaturas das sombras. Usado em venenos e poções de invisibilidade.',
           fornecedor: 'Alquimista do Mercado Negro',
           dataCadastro: '2025-02-03',
           favorito: false
       },
       {
           id: 24,
           name: 'Madeira Encantada',
           imagem: '',
           categoria: 'Craft',
           classe: 'Druidas',
           raridade: 'Incomum',
           preco: 180,
           quantidade: 20,
           peso: 2.5,
           descricao: 'Madeira de árvores encantadas. Mantém propriedades mágicas e é ideal para cajados e arcos.',
           fornecedor: 'Artesãos da Floresta de Silverwood',
           dataCadastro: '2025-01-28',
           favorito: false
       },
       {
           id: 25,
           name: 'Ferro Negro',
           imagem: '',
           categoria: 'Craft',
           classe: 'Universal',
           raridade: 'Incomum',
           preco: 90,
           quantidade: 50,
           peso: 5.0,
           descricao: 'Ferro escuro e resistente encontrado apenas em minas profundas. Excelente para forja de armas.',
           fornecedor: 'Minas de Deephold',
           dataCadastro: '2025-01-15',
           favorito: false
       },
       {
           id: 26,
           name: 'Mithril Refinado',
           imagem: '',
           categoria: 'Craft',
           classe: 'Universal',
           raridade: 'Lendário',
           preco: 1800,
           quantidade: 5,
           peso: 1.0,
           descricao: 'Metal prateado quase indestrutível e extremamente leve. Usado apenas em itens de elite.',
           fornecedor: 'Minas de Khaz Morad',
           dataCadastro: '2025-02-08',
           favorito: true
       },
       {
           id: 27,
           name: 'Couro de Wyvern',
           imagem: '',
           categoria: 'Craft',
           classe: 'Universal',
           raridade: 'Épico',
           preco: 600,
           quantidade: 8,
           peso: 3.0,
           descricao: 'Couro resistente de wyvern. Ideal para armaduras leves com boa proteção.',
           fornecedor: 'Caçadores de Montanha',
           dataCadastro: '2025-02-12',
           favorito: false
       },
       {
           id: 28,
           name: 'Veneno de Aranha Gigante',
           imagem: '',
           categoria: 'Poções',
           classe: 'Ladinos',
           raridade: 'Raro',
           preco: 300,
           quantidade: 15,
           peso: 0.1,
           descricao: 'Veneno extraído de aranhas gigantes. Usado em flechas e adagas envenenadas.',
           fornecedor: 'Caçadores da Caverna de Arachne',
           dataCadastro: '2025-02-18',
           favorito: false
       },
       {
           id: 29,
           name: 'Flor Lunar',
           imagem: '',
           categoria: 'Itens Diversos',
           classe: 'Druidas',
           raridade: 'Incomum',
           preco: 100,
           quantidade: 40,
           peso: 0.05,
           descricao: 'Flor rara que só desabrocha sob a luz da lua cheia. Ingrediente para poções de cura avançadas.',
           fornecedor: 'Colhedores da Noite',
           dataCadastro: '2025-01-22',
           favorito: false
       },
       {
           id: 30,
           name: 'Núcleo de Golem',
           imagem: '',
           categoria: 'Itens Diversos',
           classe: 'Universal',
           raridade: 'Divino',
           preco: 5000,
           quantidade: 1,
           peso: 10.0,
           descricao: 'Núcleo mágico de um golem antigo. Fonte de energia mágica pura. Peça de valor incalculável.',
           fornecedor: 'Ruínas de Aetheria',
           dataCadastro: '2025-02-20',
           favorito: true
       }
   ];
   
   // Configurações padrão
   const DEFAULT_CONFIG = {
       companyName: 'Companhia Dragão Avarento',
       theme: 'dark',
       logo: '',
       itemsPerPage: 10,
       lowStockThreshold: 5
   };
   
   // Funções do banco de dados
   const Database = {
       // Inicializar banco
       init() {
           if (!localStorage.getItem(DB_KEY)) {
               localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_ITEMS));
           }
           if (!localStorage.getItem(CONFIG_KEY)) {
               localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
           }
       },
   
       // Obter todos os itens
       getAll() {
           return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
       },
   
       // Obter item por ID
       getById(id) {
           const items = this.getAll();
           return items.find(item => item.id === id);
       },
   
       // Adicionar item
       add(item) {
           const items = this.getAll();
           // Gerar novo ID
           const maxId = items.reduce((max, i) => Math.max(max, i.id), 0);
           item.id = maxId + 1;
           item.dataCadastro = item.dataCadastro || new Date().toISOString().split('T')[0];
           item.favorito = item.favorito || false;
           item.imagem = item.imagem || getPlaceholderImage(item.name);
           items.push(item);
           localStorage.setItem(DB_KEY, JSON.stringify(items));
           return item;
       },
   
       // Atualizar item
       update(id, data) {
           const items = this.getAll();
           const index = items.findIndex(item => item.id === id);
           if (index !== -1) {
               items[index] = { ...items[index], ...data };
               localStorage.setItem(DB_KEY, JSON.stringify(items));
               return items[index];
           }
           return null;
       },
   
       // Excluir item
       remove(id) {
           const items = this.getAll();
           const filtered = items.filter(item => item.id !== id);
           localStorage.setItem(DB_KEY, JSON.stringify(filtered));
           return filtered;
       },
   
       // Alternar favorito
       toggleFavorite(id) {
           const items = this.getAll();
           const item = items.find(i => i.id === id);
           if (item) {
               item.favorito = !item.favorito;
               localStorage.setItem(DB_KEY, JSON.stringify(items));
               return item.favorito;
           }
           return false;
       },
   
       // Limpar banco
       clearAll() {
           localStorage.setItem(DB_KEY, JSON.stringify([]));
       },
   
       // Restaurar dados iniciais
       restore() {
           localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_ITEMS));
       },
   
       // Obter configurações
       getConfig() {
           return JSON.parse(localStorage.getItem(CONFIG_KEY) || JSON.stringify(DEFAULT_CONFIG));
       },
   
       // Salvar configuração
       saveConfig(config) {
           localStorage.setItem(CONFIG_KEY, JSON.stringify({ ...this.getConfig(), ...config }));
       },
   
       // Estatísticas
       getStats() {
           const items = this.getAll();
           const total = items.length;
   
           const byCategory = {};
           const byClass = {};
           const byRarity = {};
           let totalValue = 0;
           let totalInvested = 0;
   
           items.forEach(item => {
               // Por categoria
               byCategory[item.categoria] = (byCategory[item.categoria] || 0) + item.quantidade;
   
               // Por classe
               byClass[item.classe] = (byClass[item.classe] || 0) + 1;
   
               // Por raridade
               byRarity[item.raridade] = (byRarity[item.raridade] || 0) + 1;
   
               // Valores
               totalValue += item.preco * item.quantidade;
               totalInvested += item.preco * item.quantidade;
           });
   
           // Itens com pouco estoque
           const config = this.getConfig();
           const lowStock = items.filter(item => item.quantidade <= config.lowStockThreshold);
   
           // Categoria com mais itens
           const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
   
           // Classe com mais equipamentos
           const equipItems = items.filter(i => i.categoria === 'Equipamentos');
           const equipByClass = {};
           equipItems.forEach(item => {
               equipByClass[item.classe] = (equipByClass[item.classe] || 0) + 1;
           });
           const topEquipClass = Object.entries(equipByClass).sort((a, b) => b[1] - a[1])[0];
   
           // Itens mais raros
           const rareItems = items
               .filter(i => RARITY_ORDER[i.raridade] >= 5)
               .sort((a, b) => RARITY_ORDER[b.raridade] - RARITY_ORDER[a.raridade]);
   
           return {
               total,
               byCategory,
               byClass,
               byRarity,
               totalValue,
               totalInvested,
               lowStock,
               topCategory: topCategory ? topCategory[0] : '-',
               topEquipClass: topEquipClass ? topEquipClass[0] : '-',
               rareItems: rareItems.slice(0, 5),
               equipamentos: items.filter(i => i.categoria === 'Equipamentos').length,
               craft: items.filter(i => i.categoria === 'Craft').length,
               pocoes: items.filter(i => i.categoria === 'Poções').length,
               diversos: items.filter(i => i.categoria === 'Itens Diversos').length
           };
       },
   
       // Últimos itens
       getLastItems(count = 5) {
           const items = this.getAll();
           return items
               .sort((a, b) => b.id - a.id)
               .slice(0, count);
       },
   
       // Itens com pouco estoque
       getLowStock() {
           const config = this.getConfig();
           const items = this.getAll();
           return items.filter(item => item.quantidade <= config.lowStockThreshold);
       },
   
       // Favoritos
       getFavorites() {
           const items = this.getAll();
           return items.filter(item => item.favorito);
       }
   };
   
   // Inicializar automaticamente
   Database.init();
   
