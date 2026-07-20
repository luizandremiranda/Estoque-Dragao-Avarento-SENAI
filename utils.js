/* ============================================
   Companhia Dragão Avarento - Utility Functions
   ============================================ */

// Formatar valor em ouro
function formatGold(value) {
    return '🪙 ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// Formatar peso
function formatWeight(value) {
    return Number(value).toFixed(1) + ' kg';
}

// Formatar data
function formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
}

// Gerar SVG placeholder para imagem
function generateItemImage(name, rarity) {
    const color = RARITY_COLORS[rarity] || '#9e9e9e';
    const icon = '&#x2694;';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${color}33"/>
                <stop offset="100%" style="stop-color:#1a1a2e"/>
            </linearGradient>
        </defs>
        <rect width="80" height="80" rx="8" fill="url(#grad)" stroke="${color}" stroke-width="2"/>
        <text x="40" y="48" text-anchor="middle" font-size="28">${icon}</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    container.appendChild(notif);

    // Atualizar badge
    updateNotifBadge();

    // Remover após animação
    setTimeout(() => {
        if (notif.parentNode) {
            notif.parentNode.removeChild(notif);
        }
        updateNotifBadge();
    }, 3000);
}

// Atualizar badge de notificações
function updateNotifBadge() {
    const badge = document.getElementById('notifBadge');
    if (badge) {
        const count = document.querySelectorAll('.notification').length;
        badge.textContent = count;
    }
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Gerar ID único
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Debounce para pesquisa
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Copiar para clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado para a área de transferência!', 'success');
    });
}

// Criar elemento de imagem do item
function createItemImage(item) {
    const img = document.createElement('img');
    img.className = 'item-img';
    if (item.imagem) {
        img.src = item.imagem;
    } else {
        img.src = generateItemImage(item.name, item.raridade);
    }
    img.alt = item.name;
    img.onerror = function() {
        this.src = generateItemImage(this.alt, item.raridade);
    };
    return img;
}

// Ordenar por raridade
function sortByRarity(items, ascending = true) {
    return items.sort((a, b) => {
        const orderA = RARITY_ORDER[a.raridade] || 0;
        const orderB = RARITY_ORDER[b.raridade] || 0;
        return ascending ? orderA - orderB : orderB - orderA;
    });
}

// Filtrar itens
function filterItems(items, filters) {
    return items.filter(item => {
        if (filters.search) {
            const search = filters.search.toLowerCase();
            const match = item.name.toLowerCase().includes(search) ||
                item.categoria.toLowerCase().includes(search) ||
                item.classe.toLowerCase().includes(search) ||
                item.raridade.toLowerCase().includes(search) ||
                (item.descricao && item.descricao.toLowerCase().includes(search));
            if (!match) return false;
        }
        if (filters.categoria && item.categoria !== filters.categoria) return false;
        if (filters.classe && item.classe !== filters.classe) return false;
        if (filters.raridade && item.raridade !== filters.raridade) return false;
        if (filters.precoMin !== undefined && item.preco < filters.precoMin) return false;
        if (filters.precoMax !== undefined && item.preco > filters.precoMax) return false;
        if (filters.quantidadeMin !== undefined && item.quantidade < filters.quantidadeMin) return false;
        if (filters.quantidadeMax !== undefined && item.quantidade > filters.quantidadeMax) return false;
        if (filters.favoritos && !item.favorito) return false;
        return true;
    });
}

// Ordenar itens
function sortItems(items, sortKey) {
    const [field, direction] = sortKey.split('-');
    const sorted = [...items].sort((a, b) => {
        let valA, valB;
        switch (field) {
            case 'nome':
                valA = a.name.toLowerCase();
                valB = b.name.toLowerCase();
                break;
            case 'preco':
                valA = a.preco;
                valB = b.preco;
                break;
            case 'quantidade':
                valA = a.quantidade;
                valB = b.quantidade;
                break;
            case 'raridade':
                valA = RARITY_ORDER[a.raridade] || 0;
                valB = RARITY_ORDER[b.raridade] || 0;
                break;
            case 'data':
                valA = a.dataCadastro;
                valB = b.dataCadastro;
                break;
            default:
                valA = a.name;
                valB = b.name;
        }
        if (direction === 'asc') {
            return valA > valB ? 1 : -1;
        } else {
            return valA < valB ? 1 : -1;
        }
    });
    return sorted;
}
