/* ============================================
   Companhia Dragão Avarento - Main Script
   Navegação, categorias, favoritos e inicialização
   ============================================ */

// Categorias Module
const Categorias = {
    render() {
        this.renderCategorias();
        this.renderClasses();
        this.renderRaridades();
    },

    renderCategorias() {
        const stats = Database.getStats();
        const container = document.getElementById('categoriasGrid');
        const icons = {
            'Equipamentos': '⚔️',
            'Craft': '🔨',
            'Poções': '🧪',
            'Itens Diversos': '✨'
        };

        container.innerHTML = Object.entries(stats.byCategory).map(([cat, qtd]) => `
            <div class="cat-card" style="cursor:pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 6px 20px rgba(201,168,76,0.3)';" onmouseout="this.style.transform=''; this.style.boxShadow='';" onclick="Categorias.filtrarPorCategoria('${escapeHtml(cat)}')">
                <div class="cat-icon">${icons[cat] || '📦'}</div>
                <div class="cat-name">${escapeHtml(cat)}</div>
                <div class="cat-count">${qtd} itens em estoque</div>
                <div class="cat-hint" style="font-size:0.7rem; color:#c9a84c; margin-top:8px; opacity:0.7;">Clique para ver os itens</div>
            </div>
        `).join('');
    },

    filtrarPorCategoria(categoria) {
        navigateTo('estoque');
        setTimeout(() => {
            const select = document.getElementById('estoqueFiltroCategoria');
            if (select) {
                for (let opt of select.options) {
                    if (opt.value === categoria) {
                        select.value = categoria;
                        Estoque.loadItems();
                        showNotification(`📦 Exibindo itens de: ${categoria}`, 'info');
                        break;
                    }
                }
            }
        }, 100);
    },

    renderClasses() {
        const items = Database.getAll();
        const classCount = {};
        items.forEach(item => {
            classCount[item.classe] = (classCount[item.classe] || 0) + 1;
        });

        const icons = {
            'Magos': '🧙',
            'Guerreiros': '⚔️',
            'Arqueiros': '🏹',
            'Druidas': '🌿',
            'Sacerdotes': '✝️',
            'Ladinos': '🗡️',
            'Universal': '🌟'
        };

        const container = document.getElementById('classesGrid');
        container.innerHTML = Object.entries(classCount).map(([classe, qtd]) => `
            <div class="cat-card" style="cursor:pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 6px 20px rgba(201,168,76,0.3)';" onmouseout="this.style.transform=''; this.style.boxShadow='';" onclick="Categorias.filtrarPorClasse('${escapeHtml(classe)}')">
                <div class="cat-icon">${icons[classe] || '⚔️'}</div>
                <div class="cat-name">${escapeHtml(classe)}</div>
                <div class="cat-count">${qtd} itens</div>
                <div class="cat-hint" style="font-size:0.7rem; color:#c9a84c; margin-top:8px; opacity:0.7;">Clique para ver os itens</div>
            </div>
        `).join('');
    },

    filtrarPorClasse(classe) {
        navigateTo('estoque');
        setTimeout(() => {
            const select = document.getElementById('estoqueFiltroClasse');
            if (select) {
                for (let opt of select.options) {
                    if (opt.value === classe) {
                        select.value = classe;
                        Estoque.loadItems();
                        showNotification(`⚔️ Exibindo itens para: ${classe}`, 'info');
                        break;
                    }
                }
            }
        }, 100);
    },

    renderRaridades() {
        const stats = Database.getStats();
        const container = document.getElementById('raridadesGrid');

        const rarityIcons = {
            'Comum': '⚪',
            'Incomum': '🟢',
            'Raro': '🔵',
            'Épico': '🟣',
            'Lendário': '🟠',
            'Mítico': '🔴',
            'Divino': '🟡'
        };

        container.innerHTML = Object.entries(stats.byRarity)
            .sort((a, b) => (RARITY_ORDER[b[0]] || 0) - (RARITY_ORDER[a[0]] || 0))
            .map(([raridade, qtd]) => `
                <div class="cat-card" style="cursor:pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 6px 20px rgba(201,168,76,0.3)';" onmouseout="this.style.transform=''; this.style.boxShadow='';" onclick="Categorias.filtrarPorRaridade('${escapeHtml(raridade)}')">
                    <div class="cat-icon">${rarityIcons[raridade] || '⚪'}</div>
                    <div class="cat-name">${escapeHtml(raridade)}</div>
                    <div class="cat-count">${qtd} itens</div>
                    <div class="cat-hint" style="font-size:0.7rem; color:#c9a84c; margin-top:8px; opacity:0.7;">Clique para ver os itens</div>
                </div>
            `).join('');
    },

    filtrarPorRaridade(raridade) {
        navigateTo('estoque');
        setTimeout(() => {
            const select = document.getElementById('estoqueFiltroRaridade');
            if (select) {
                for (let opt of select.options) {
                    if (opt.value === raridade) {
                        select.value = raridade;
                        Estoque.loadItems();
                        showNotification(`✨ Exibindo itens ${raridade}s`, 'info');
                        break;
                    }
                }
            }
        }, 100);
    }
};

// Favoritos Module
const Favoritos = {
    show() {
        const items = Database.getFavorites();
        const container = document.getElementById('favModalBody');

        if (items.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⭐</div><p>Nenhum item favorito.</p><p style="font-size:0.8rem; margin-top:10px;">Clique na estrela de um item para adicioná-lo aos favoritos.</p></div>';
        } else {
            container.innerHTML = `
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:12px;">
                    ${items.map(item => `
                        <div class="search-result-card" onclick="Estoque.viewItem(${item.id}); Favoritos.close();">
                            ${item.imagem ? `<img src="${escapeHtml(item.imagem)}" class="search-result-img" alt="${escapeHtml(item.name)}" onerror="this.src='${generateItemImage(item.name, item.raridade)}'">` : `<img src="${generateItemImage(item.name, item.raridade)}" class="search-result-img" alt="${escapeHtml(item.name)}">`}
                            <div class="search-result-info">
                                <div class="search-result-name">⭐ ${escapeHtml(item.name)}</div>
                                <div class="search-result-detail">${escapeHtml(item.categoria)} · ${escapeHtml(item.classe)}</div>
                                <div class="search-result-detail"><span class="rarity-badge rarity-${this.getRarityClass(item.raridade)}">${escapeHtml(item.raridade)}</span> · ${formatGold(item.preco)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        document.getElementById('favModal').classList.add('active');
    },

    close() {
        document.getElementById('favModal').classList.remove('active');
    },

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

// Navegação
function navigateTo(page) {
    // Atualizar menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });

    // Atualizar página
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Atualizar título
    const titles = {
        'dashboard': '🏰 Dashboard',
        'estoque': '📦 Estoque',
        'cadastro': '➕ Cadastrar Item',
        'pesquisa': '🔍 Pesquisa',
        'categorias': '🗂 Categorias',
        'relatorios': '📊 Relatórios',
        'configuracoes': '⚙️ Configurações'
    };
    document.getElementById('pageTitle').textContent = titles[page] || page;

    // Fechar menu mobile
    closeMobileMenu();

    // Renderizar conteúdo da página
    switch (page) {
        case 'dashboard':
            Dashboard.render();
            break;
        case 'estoque':
            Estoque.loadItems();
            break;
        case 'pesquisa':
            Pesquisa.performSearch();
            break;
        case 'categorias':
            Categorias.render();
            break;
        case 'relatorios':
            Relatorios.render();
            break;
    }
}

// Menu mobile
function openMobileMenu() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('menuOverlay').classList.add('active');
}

function closeMobileMenu() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('menuOverlay').classList.remove('active');
}

// Menu toggle desktop (collapse sidebar)
let sidebarCollapsed = false;
function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (sidebarCollapsed) {
        sidebar.style.width = '60px';
        sidebar.querySelector('.company-info').style.display = 'none';
        sidebar.querySelectorAll('.menu-text').forEach(el => el.style.display = 'none');
        sidebar.querySelectorAll('.menu-item').forEach(el => el.style.justifyContent = 'center');
        sidebar.querySelector('.logo-container').style.justifyContent = 'center';
        sidebar.querySelector('.sidebar-footer').style.justifyContent = 'center';
        mainContent.style.marginLeft = '60px';
    } else {
        sidebar.style.width = '260px';
        sidebar.querySelector('.company-info').style.display = 'block';
        sidebar.querySelectorAll('.menu-text').forEach(el => el.style.display = '');
        sidebar.querySelectorAll('.menu-item').forEach(el => el.style.justifyContent = '');
        sidebar.querySelector('.logo-container').style.justifyContent = '';
        sidebar.querySelector('.sidebar-footer').style.justifyContent = '';
        mainContent.style.marginLeft = '260px';
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carregar tema salvo
    const config = Database.getConfig();
    if (config.theme) {
        document.documentElement.setAttribute('data-theme', config.theme);
    }

    // Menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            navigateTo(item.dataset.page);
        });
    });

    // Menu toggle mobile
    document.getElementById('menuToggleMobile').addEventListener('click', openMobileMenu);
    document.getElementById('menuToggleDesktop').addEventListener('click', toggleSidebar);
    document.getElementById('menuOverlay').addEventListener('click', closeMobileMenu);

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        Config.toggleTheme(newTheme);
    });

    // Header search
    const headerSearch = document.getElementById('headerSearchInput');
    headerSearch.addEventListener('input', debounce((e) => {
        const value = e.target.value;
        if (value.length > 0) {
            navigateTo('pesquisa');
            document.getElementById('pesquisaInput').value = value;
            Pesquisa.performSearch();
        }
    }, 300));

    // Header favoritos
    document.getElementById('headerFavBtn').addEventListener('click', () => {
        Favoritos.show();
    });

    // Fechar modal de favoritos
    document.getElementById('favModalClose').addEventListener('click', () => Favoritos.close());
    document.getElementById('favModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('favModal')) {
            Favoritos.close();
        }
    });

    // Inicializar módulos
    Cadastro.init();
    Estoque.init();
    Pesquisa.init();
    Relatorios.init();
    Config.init();

    // Renderizar dashboard inicial
    Dashboard.render();

    // Notificação de boas-vindas
    setTimeout(() => {
        showNotification('🐉 Bem-vindo à Companhia Dragão Avarento!', 'info');
    }, 500);

    // Redimensionar gráfico ao mudar de tamanho
    window.addEventListener('resize', debounce(() => {
        const dashboardPage = document.getElementById('page-dashboard');
        if (dashboardPage.classList.contains('active')) {
            Dashboard.render();
        }
    }, 300));
});
