/* ============================================
   Companhia Dragão Avarento - Relatórios Module
   Relatórios e exportação
   ============================================ */

   const Relatorios = {
    // Inicializar
    init() {
        this.bindEvents();
    },

    // Bind de eventos
    bindEvents() {
        document.getElementById('btnExportJSON').addEventListener('click', () => this.exportJSON());
        document.getElementById('btnExportCSV').addEventListener('click', () => this.exportCSV());
        document.getElementById('btnImprimir').addEventListener('click', () => this.printReport());
    },

    // Renderizar relatórios
    render() {
        this.renderCategoryReport();
        this.renderClassReport();
        this.renderTotalValue();
        this.renderMostExpensive();
        this.renderLowestStock();
    },

    // Quantidade por categoria
    renderCategoryReport() {
        const stats = Database.getStats();
        const container = document.getElementById('relCatQuantidade');

        const html = Object.entries(stats.byCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, qtd]) => `
                <div class="relatorio-item">
                    <span class="relatorio-item-name">${escapeHtml(cat)}</span>
                    <span class="relatorio-item-value">${qtd} itens</span>
                </div>
            `).join('');

        container.innerHTML = html || '<p style="color: var(--text-muted);">Nenhum dado disponível.</p>';
    },

    // Quantidade por classe
    renderClassReport() {
        const stats = Database.getStats();
        const container = document.getElementById('relClasseQuantidade');

        const html = Object.entries(stats.byClass)
            .sort((a, b) => b[1] - a[1])
            .map(([classe, qtd]) => `
                <div class="relatorio-item">
                    <span class="relatorio-item-name">${escapeHtml(classe)}</span>
                    <span class="relatorio-item-value">${qtd} itens</span>
                </div>
            `).join('');

        container.innerHTML = html || '<p style="color: var(--text-muted);">Nenhum dado disponível.</p>';
    },

    // Valor total do estoque
    renderTotalValue() {
        const stats = Database.getStats();
        const container = document.getElementById('relValorEstoque');

        // Valor por categoria
        const items = Database.getAll();
        const valueByCategory = {};
        items.forEach(item => {
            const val = item.preco * item.quantidade;
            valueByCategory[item.categoria] = (valueByCategory[item.categoria] || 0) + val;
        });

        const html = Object.entries(valueByCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, val]) => `
                <div class="relatorio-item">
                    <span class="relatorio-item-name">${escapeHtml(cat)}</span>
                    <span class="relatorio-item-value">${formatGold(val)}</span>
                </div>
            `).join('');

        const totalHtml = `
            <div class="relatorio-item" style="border-top: 2px solid var(--gold-dark); padding-top: 10px; margin-top: 5px;">
                <span class="relatorio-item-name"><strong>TOTAL</strong></span>
                <span class="relatorio-item-value gold-text"><strong>${formatGold(stats.totalValue)}</strong></span>
            </div>
        `;

        container.innerHTML = html + totalHtml || '<p style="color: var(--text-muted);">Nenhum dado disponível.</p>';
    },

    // Itens mais caros
    renderMostExpensive() {
        const items = Database.getAll();
        const topExpensive = items
            .sort((a, b) => b.preco - a.preco)
            .slice(0, 5);

        const container = document.getElementById('relItensCaros');

        const html = topExpensive.map(item => `
            <div class="relatorio-item">
                <span class="relatorio-item-name">
                    ${escapeHtml(item.name)}
                    <span class="rarity-badge rarity-${this.getRarityClass(item.raridade)}" style="font-size:0.6rem; margin-left:5px;">${escapeHtml(item.raridade)}</span>
                </span>
                <span class="relatorio-item-value">${formatGold(item.preco)}</span>
            </div>
        `).join('');

        container.innerHTML = html || '<p style="color: var(--text-muted);">Nenhum dado disponível.</p>';
    },

    // Itens com menor estoque
    renderLowestStock() {
        const items = Database.getAll();
        const lowestStock = items
            .sort((a, b) => a.quantidade - b.quantidade)
            .slice(0, 10);

        const container = document.getElementById('relMenorEstoque');

        const html = lowestStock.map(item => `
            <div class="relatorio-item">
                <span class="relatorio-item-name">${escapeHtml(item.name)} (${escapeHtml(item.categoria)})</span>
                <span class="relatorio-item-value">${item.quantidade} un.</span>
            </div>
        `).join('');

        container.innerHTML = html || '<p style="color: var(--text-muted);">Nenhum dado disponível.</p>';
    },

    // Exportar JSON
    exportJSON() {
        const items = Database.getAll();
        const data = JSON.stringify(items, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        this.downloadFile(blob, 'companhia_dragao_avarento_estoque.json');
        showNotification('📄 Relatório JSON exportado com sucesso!', 'success');
    },

    // Exportar CSV
    exportCSV() {
        const items = Database.getAll();
        const headers = ['ID', 'Nome', 'Categoria', 'Classe', 'Raridade', 'Preço', 'Quantidade', 'Peso', 'Descrição', 'Fornecedor', 'Data Cadastro', 'Favorito'];

        const rows = items.map(item => [
            item.id,
            `"${item.name}"`,
            `"${item.categoria}"`,
            `"${item.classe}"`,
            `"${item.raridade}"`,
            item.preco,
            item.quantidade,
            item.peso,
            `"${item.descricao || ''}"`,
            `"${item.fornecedor || ''}"`,
            item.dataCadastro,
            item.favorito
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        this.downloadFile(blob, 'companhia_dragao_avarento_estoque.csv');
        showNotification('📊 Relatório CSV exportado com sucesso!', 'success');
    },

    // Imprimir
    printReport() {
        showNotification('🖨️ Preparando impressão...', 'info');
        setTimeout(() => window.print(), 500);
    },

    // Download file helper
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
