/* ============================================
   Companhia Dragão Avarento - Dashboard Module
   ============================================ */

   const Dashboard = {
    // Renderizar dashboard completo
    render() {
        const stats = Database.getStats();
        const config = Database.getConfig();

        // Atualizar cards de estatísticas
        document.getElementById('statTotalItens').textContent = stats.total;
        document.getElementById('statTotalCategorias').textContent = Object.keys(stats.byCategory).length;
        document.getElementById('statCraft').textContent = stats.craft;
        document.getElementById('statEquipamentos').textContent = stats.equipamentos;
        document.getElementById('statPocoes').textContent = stats.pocoes;
        document.getElementById('statDiversos').textContent = stats.diversos;

        // Últimos itens cadastrados
        this.renderLastItems();

        // Itens com pouco estoque
        this.renderLowStock();

        // Gráfico de categorias
        this.renderCategoryChart(stats.byCategory);

        // Painel de estatísticas
        this.renderStatsPanel(stats);
    },

    // Renderizar últimos itens
    renderLastItems() {
        const container = document.getElementById('lastItems');
        const lastItems = Database.getLastItems(5);

        if (lastItems.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Nenhum item cadastrado.</p></div>';
            return;
        }

        container.innerHTML = lastItems.map(item => `
            <div class="last-item">
                ${item.imagem ? `<img src="${escapeHtml(item.imagem)}" class="last-item-img" alt="${escapeHtml(item.name)}">` : `<img src="${generateItemImage(item.name, item.raridade)}" class="last-item-img" alt="${escapeHtml(item.name)}">`}
                <div>
                    <div class="last-item-name">${escapeHtml(item.name)}</div>
                    <div class="last-item-cat">${escapeHtml(item.categoria)} · ${escapeHtml(item.raridade)}</div>
                </div>
                <span class="rarity-badge rarity-${item.raridade.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}">${escapeHtml(item.raridade)}</span>
            </div>
        `).join('');
    },

    // Renderizar itens com pouco estoque
    renderLowStock() {
        const container = document.getElementById('lowStockItems');
        const lowStock = Database.getLowStock();

        if (lowStock.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Todos os itens têm estoque suficiente!</p></div>';
            return;
        }

        container.innerHTML = lowStock.map(item => `
            <div class="last-item">
                ${item.imagem ? `<img src="${escapeHtml(item.imagem)}" class="last-item-img" alt="${escapeHtml(item.name)}">` : `<img src="${generateItemImage(item.name, item.raridade)}" class="last-item-img" alt="${escapeHtml(item.name)}">`}
                <div>
                    <div class="last-item-name">${escapeHtml(item.name)}</div>
                    <div class="last-item-cat">Qtd: ${item.quantidade} · ${formatGold(item.preco)}</div>
                </div>
            </div>
        `).join('');
    },

    // Renderizar gráfico de categorias
    renderCategoryChart(data) {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        // Ajustar para retina
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = 250 * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = 250;

        // Limpar canvas
        ctx.clearRect(0, 0, width, height);

        const categories = Object.keys(data);
        const values = Object.values(data);
        const maxVal = Math.max(...values, 1);
        const barWidth = Math.min(60, (width - 60) / categories.length - 20);
        const startX = 40;
        const chartHeight = height - 50;
        const chartWidth = width - 60;

        // Cores das barras
        const colors = {
            'Equipamentos': '#c9a84c',
            'Craft': '#8b6914',
            'Poções': '#4caf50',
            'Itens Diversos': '#9c27b0'
        };

        // Desenhar eixos
        ctx.strokeStyle = '#3a3a4e';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, 10);
        ctx.lineTo(startX, chartHeight);
        ctx.lineTo(width - 20, chartHeight);
        ctx.stroke();

        // Desenhar barras
        categories.forEach((cat, i) => {
            const x = startX + 10 + i * (chartWidth / categories.length) + (chartWidth / categories.length - barWidth) / 2;
            const barHeight = (values[i] / maxVal) * (chartHeight - 20);
            const y = chartHeight - barHeight;

            // Gradiente da barra
            const gradient = ctx.createLinearGradient(x, y, x, chartHeight);
            gradient.addColorStop(0, colors[cat] || '#c9a84c');
            gradient.addColorStop(1, (colors[cat] || '#c9a84c') + '44');

            // Sombra
            ctx.shadowColor = 'rgba(201, 168, 76, 0.3)';
            ctx.shadowBlur = 8;

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
            ctx.fill();

            ctx.shadowBlur = 0;

            // Valor acima da barra
            ctx.fillStyle = '#c9a84c';
            ctx.font = 'bold 12px Cinzel, serif';
            ctx.textAlign = 'center';
            ctx.fillText(values[i], x + barWidth / 2, y - 5);

            // Rótulo abaixo
            ctx.fillStyle = '#b8a88a';
            ctx.font = '10px MedievalSharp, cursive';
            const label = cat.length > 10 ? cat.substring(0, 10) + '...' : cat;
            ctx.fillText(label, x + barWidth / 2, chartHeight + 15);
        });

        // Título
        ctx.fillStyle = '#c9a84c';
        ctx.font = '11px Cinzel, serif';
        ctx.textAlign = 'left';
        ctx.fillText('Quantidade Total', startX, chartHeight + 35);
    },

    // Renderizar painel de estatísticas
    renderStatsPanel(stats) {
        document.getElementById('statOuroInvestido').textContent = formatGold(stats.totalInvested);
        document.getElementById('statValorEstoque').textContent = formatGold(stats.totalValue);

        // Itens mais raros
        const rareNames = stats.rareItems.length > 0
            ? stats.rareItems.map(i => i.name).join(', ')
            : 'Nenhum item lendário+';
        document.getElementById('statItensRaros').textContent = rareNames.length > 50 ? rareNames.substring(0, 50) + '...' : rareNames;

        document.getElementById('statCatMaisItens').textContent = stats.topCategory;
        document.getElementById('statClasseMaisEquip').textContent = stats.topEquipClass;
    }
};
