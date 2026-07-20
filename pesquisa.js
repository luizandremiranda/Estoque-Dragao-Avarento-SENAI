/* ============================================
   Companhia Dragão Avarento - Pesquisa Module
   Pesquisa em tempo real
   ============================================ */

   const Pesquisa = {
    // Inicializar
    init() {
        this.bindEvents();
    },

    // Bind de eventos
    bindEvents() {
        const searchInput = document.getElementById('pesquisaInput');
        searchInput.addEventListener('input', debounce(() => this.performSearch(), 200));

        document.getElementById('pesquisaFiltroCategoria').addEventListener('change', () => this.performSearch());
        document.getElementById('pesquisaFiltroClasse').addEventListener('change', () => this.performSearch());
        document.getElementById('pesquisaFiltroRaridade').addEventListener('change', () => this.performSearch());
        document.getElementById('pesquisaPrecoMin').addEventListener('input', debounce(() => this.performSearch(), 300));
        document.getElementById('pesquisaPrecoMax').addEventListener('input', debounce(() => this.performSearch(), 300));
        document.getElementById('pesquisaQtdMin').addEventListener('input', debounce(() => this.performSearch(), 300));
        document.getElementById('pesquisaQtdMax').addEventListener('input', debounce(() => this.performSearch(), 300));
    },

    // Realizar pesquisa
    performSearch() {
        const search = document.getElementById('pesquisaInput').value.trim().toLowerCase();
        const categoria = document.getElementById('pesquisaFiltroCategoria').value;
        const classe = document.getElementById('pesquisaFiltroClasse').value;
        const raridade = document.getElementById('pesquisaFiltroRaridade').value;
        const precoMin = document.getElementById('pesquisaPrecoMin').value;
        const precoMax = document.getElementById('pesquisaPrecoMax').value;
        const qtdMin = document.getElementById('pesquisaQtdMin').value;
        const qtdMax = document.getElementById('pesquisaQtdMax').value;

        const filters = {
            search: search || undefined,
            categoria: categoria || undefined,
            classe: classe || undefined,
            raridade: raridade || undefined,
            precoMin: precoMin !== '' ? parseFloat(precoMin) : undefined,
            precoMax: precoMax !== '' ? parseFloat(precoMax) : undefined,
            quantidadeMin: qtdMin !== '' ? parseInt(qtdMin) : undefined,
            quantidadeMax: qtdMax !== '' ? parseInt(qtdMax) : undefined
        };

        const items = Database.getAll();
        const results = filterItems(items, filters);

        this.renderResults(results);
        this.renderStats(results, items.length);
    },

    // Renderizar resultados
    renderResults(results) {
        const container = document.getElementById('searchResults');

        if (results.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">🔍</div>
                    <p>Nenhum item encontrado com os filtros selecionados.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = results.map(item => `
            <div class="search-result-card" onclick="Estoque.viewItem(${item.id})">
                ${item.imagem ? `<img src="${escapeHtml(item.imagem)}" class="search-result-img" alt="${escapeHtml(item.name)}" onerror="this.src='${generateItemImage(item.name, item.raridade)}'">` : `<img src="${generateItemImage(item.name, item.raridade)}" class="search-result-img" alt="${escapeHtml(item.name)}">`}
                <div class="search-result-info">
                    <div class="search-result-name">${escapeHtml(item.name)} ${item.favorito ? '⭐' : ''}</div>
                    <div class="search-result-detail">${escapeHtml(item.categoria)} · ${escapeHtml(item.classe)}</div>
                    <div class="search-result-detail"><span class="rarity-badge rarity-${this.getRarityClass(item.raridade)}">${escapeHtml(item.raridade)}</span> · ${formatGold(item.preco)} · Qtd: ${item.quantidade}</div>
                </div>
            </div>
        `).join('');
    },

    // Renderizar estatísticas da pesquisa
    renderStats(results, total) {
        const container = document.getElementById('searchStats');
        container.textContent = `Encontrados ${results.length} de ${total} itens.`;
    },

    // Obter classe CSS da raridade
    getRarityClass(rarity) {
        const map = {
            'Comum': 'comum',
            'Incomum': 'incomum',
            'Raro': 'raro',
            'Épico': 'epico',
            'Lendário': 'lendario',
            'Mítico': 'mitico',
            'Divino': 'divino'
        };
        return map[rarity] || 'comum';
    }
};
