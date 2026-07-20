/* ============================================
   Companhia Dragão Avarento - Estoque Module
   Tabela, paginação, ordenação e filtros
   ============================================ */

   const Estoque = {
    currentPage: 1,
    itemsPerPage: 10,
    filteredItems: [],
    deleteTargetId: null,

    // Inicializar
    init() {
        this.loadItems();
        this.bindEvents();
    },

    // Carregar itens com filtros
    loadItems() {
        const search = document.getElementById('estoqueSearch').value.toLowerCase();
        const categoria = document.getElementById('estoqueFiltroCategoria').value;
        const classe = document.getElementById('estoqueFiltroClasse').value;
        const raridade = document.getElementById('estoqueFiltroRaridade').value;
        const favoritos = document.getElementById('estoqueFiltroFavoritos').checked;

        let items = Database.getAll();

        // Filtrar
        items = items.filter(item => {
            if (search) {
                const match = item.name.toLowerCase().includes(search) ||
                    item.categoria.toLowerCase().includes(search) ||
                    item.classe.toLowerCase().includes(search) ||
                    item.raridade.toLowerCase().includes(search) ||
                    (item.descricao && item.descricao.toLowerCase().includes(search));
                if (!match) return false;
            }
            if (categoria && item.categoria !== categoria) return false;
            if (classe && item.classe !== classe) return false;
            if (raridade && item.raridade !== raridade) return false;
            if (favoritos && !item.favorito) return false;
            return true;
        });

        // Ordenar
        const sortKey = document.getElementById('estoqueOrdenacao').value;
        items = sortItems(items, sortKey);

        this.filteredItems = items;

        // Paginar
        const totalPages = Math.ceil(items.length / this.itemsPerPage);
        if (this.currentPage > totalPages) this.currentPage = Math.max(1, totalPages);

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const pageItems = items.slice(start, start + this.itemsPerPage);

        this.renderTable(pageItems);
        this.renderPagination(totalPages);
    },

    // Renderizar tabela
    renderTable(items) {
        const tbody = document.getElementById('stockTableBody');

        if (items.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10"><div class="empty-state"><div class="empty-state-icon">📦</div><p>Nenhum item encontrado.</p></div></td></tr>`;
            return;
        }

        tbody.innerHTML = items.map(item => `
            <tr>
                <td>${item.imagem ? `<img src="${escapeHtml(item.imagem)}" class="item-img" alt="${escapeHtml(item.name)}" onerror="this.src='${generateItemImage(item.name, item.raridade)}'">` : `<img src="${generateItemImage(item.name, item.raridade)}" class="item-img" alt="${escapeHtml(item.name)}">`}</td>
                <td><strong>${escapeHtml(item.name)}</strong></td>
                <td>${escapeHtml(item.categoria)}</td>
                <td>${escapeHtml(item.classe)}</td>
                <td><span class="rarity-badge rarity-${this.getRarityClass(item.raridade)}">${escapeHtml(item.raridade)}</span></td>
                <td>${formatGold(item.preco)}</td>
                <td>${item.quantidade}</td>
                <td>${formatWeight(item.peso)}</td>
                <td>${escapeHtml(item.descricao ? item.descricao.substring(0, 40) + '...' : '-')}</td>
                <td>
                    <button class="btn-action" onclick="Estoque.viewItem(${item.id})" title="Visualizar">👁️</button>
                    <button class="btn-action" onclick="Estoque.editItem(${item.id})" title="Editar">✏️</button>
                    <button class="btn-action" onclick="Estoque.toggleFav(${item.id})" title="Favoritar">${item.favorito ? '⭐' : '☆'}</button>
                    <button class="btn-action delete" onclick="Estoque.confirmDelete(${item.id})" title="Excluir">🗑️</button>
                </td>
            </tr>
        `).join('');
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
    },

    // Renderizar paginação
    renderPagination(totalPages) {
        const container = document.getElementById('pagination');

        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = `<button ${this.currentPage <= 1 ? 'disabled' : ''} onclick="Estoque.goToPage(${this.currentPage - 1})">◀ Anterior</button>`;

        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="${i === this.currentPage ? 'active' : ''}" onclick="Estoque.goToPage(${i})">${i}</button>`;
        }

        html += `<button ${this.currentPage >= totalPages ? 'disabled' : ''} onclick="Estoque.goToPage(${this.currentPage + 1})">Próximo ▶</button>`;

        container.innerHTML = html;
    },

    // Ir para página
    goToPage(page) {
        this.currentPage = page;
        this.loadItems();
    },

    // Visualizar item
    viewItem(id) {
        const item = Database.getById(id);
        if (!item) return;

        document.getElementById('modalItemName').textContent = item.name;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div style="text-align:center;">
                ${item.imagem ? `<img src="${escapeHtml(item.imagem)}" class="view-item-img" alt="${escapeHtml(item.name)}">` : `<img src="${generateItemImage(item.name, item.raridade)}" class="view-item-img" alt="${escapeHtml(item.name)}">`}
            </div>
            <div class="view-item-details">
                <div class="view-detail">
                    <div class="view-detail-label">Categoria</div>
                    <div class="view-detail-value">${escapeHtml(item.categoria)}</div>
                </div>
                <div class="view-detail">
                    <div class="view-detail-label">Classe</div>
                    <div class="view-detail-value">${escapeHtml(item.classe)}</div>
                </div>
                <div class="view-detail">
                    <div class="view-detail-label">Raridade</div>
                    <div class="view-detail-value"><span class="rarity-badge rarity-${this.getRarityClass(item.raridade)}">${escapeHtml(item.raridade)}</span></div>
                </div>
                <div class="view-detail">
                    <div class="view-detail-label">Preço</div>
                    <div class="view-detail-value gold-text">${formatGold(item.preco)}</div>
                </div>
                <div class="view-detail">
                    <div class="view-detail-label">Quantidade</div>
                    <div class="view-detail-value">${item.quantidade}</div>
                </div>
                <div class="view-detail">
                    <div class="view-detail-label">Peso</div>
                    <div class="view-detail-value">${formatWeight(item.peso)}</div>
                </div>
                <div class="view-detail">
                    <div class="view-detail-label">Fornecedor</div>
                    <div class="view-detail-value">${escapeHtml(item.fornecedor || '-')}</div>
                </div>
                <div class="view-detail">
                    <div class="view-detail-label">Data de Cadastro</div>
                    <div class="view-detail-value">${formatDate(item.dataCadastro)}</div>
                </div>
                <div class="view-detail full-width" style="grid-column: 1 / -1;">
                    <div class="view-detail-label">Descrição</div>
                    <div class="view-detail-value">${escapeHtml(item.descricao || '-')}</div>
                </div>
            </div>
        `;

        document.getElementById('viewModal').classList.add('active');
    },

    // Editar item
    editItem(id) {
        const item = Database.getById(id);
        if (!item) return;

        document.getElementById('editId').value = item.id;
        document.getElementById('editName').value = item.name;
        document.getElementById('editImagem').value = item.imagem || '';
        document.getElementById('editCategoria').value = item.categoria;
        document.getElementById('editClasse').value = item.classe;
        document.getElementById('editRaridade').value = item.raridade;
        document.getElementById('editPreco').value = item.preco;
        document.getElementById('editQuantidade').value = item.quantidade;
        document.getElementById('editPeso').value = item.peso;
        document.getElementById('editDescricao').value = item.descricao || '';
        document.getElementById('editFornecedor').value = item.fornecedor || '';

        document.getElementById('editModal').classList.add('active');
    },

    // Alternar favorito
    toggleFav(id) {
        const isFav = Database.toggleFavorite(id);
        showNotification(
            isFav ? '⭐ Item adicionado aos favoritos!' : '☆ Item removido dos favoritos.',
            'success'
        );
        this.loadItems();
    },

    // Confirmar exclusão
    confirmDelete(id) {
        const item = Database.getById(id);
        if (!item) return;

        this.deleteTargetId = id;
        document.getElementById('deleteMessage').textContent = `Tem certeza que deseja excluir "${item.name}"? Esta ação não pode ser desfeita.`;
        document.getElementById('deleteModal').classList.add('active');
    },

    // Excluir item
    deleteItem() {
        if (this.deleteTargetId === null) return;

        const item = Database.getById(this.deleteTargetId);
        Database.remove(this.deleteTargetId);
        showNotification(`🗑️ Item "${item.name}" excluído com sucesso!`, 'success');

        this.deleteTargetId = null;
        document.getElementById('deleteModal').classList.remove('active');
        this.loadItems();

        // Atualizar outras páginas
        Dashboard.render();
        Relatorios.render();
    },

    // Cancelar exclusão
    cancelDelete() {
        this.deleteTargetId = null;
        document.getElementById('deleteModal').classList.remove('active');
    },

    // Bind events
    bindEvents() {
        const searchInput = document.getElementById('estoqueSearch');
        searchInput.addEventListener('input', debounce(() => {
            this.currentPage = 1;
            this.loadItems();
        }, 300));

        document.getElementById('estoqueFiltroCategoria').addEventListener('change', () => {
            this.currentPage = 1;
            this.loadItems();
        });

        document.getElementById('estoqueFiltroClasse').addEventListener('change', () => {
            this.currentPage = 1;
            this.loadItems();
        });

        document.getElementById('estoqueFiltroRaridade').addEventListener('change', () => {
            this.currentPage = 1;
            this.loadItems();
        });

        document.getElementById('estoqueFiltroFavoritos').addEventListener('change', () => {
            this.currentPage = 1;
            this.loadItems();
        });

        document.getElementById('estoqueOrdenacao').addEventListener('change', () => {
            this.loadItems();
        });

        // Modal de exclusão
        document.getElementById('btnConfirmDelete').addEventListener('click', () => this.deleteItem());
        document.getElementById('btnCancelDelete').addEventListener('click', () => this.cancelDelete());

        // Fechar modais ao clicar fora
        document.getElementById('deleteModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('deleteModal')) {
                this.cancelDelete();
            }
        });

        document.getElementById('viewModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('viewModal')) {
                document.getElementById('viewModal').classList.remove('active');
            }
        });

        document.getElementById('modalClose').addEventListener('click', () => {
            document.getElementById('viewModal').classList.remove('active');
        });

        document.getElementById('editModalClose').addEventListener('click', () => {
            document.getElementById('editModal').classList.remove('active');
        });

        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('editModal')) {
                document.getElementById('editModal').classList.remove('active');
            }
        });

        // Formulário de edição
        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('editId').value);
            const data = {
                name: document.getElementById('editName').value,
                imagem: document.getElementById('editImagem').value || generateItemImage(document.getElementById('editName').value, document.getElementById('editRaridade').value),
                categoria: document.getElementById('editCategoria').value,
                classe: document.getElementById('editClasse').value,
                raridade: document.getElementById('editRaridade').value,
                preco: parseFloat(document.getElementById('editPreco').value),
                quantidade: parseInt(document.getElementById('editQuantidade').value),
                peso: parseFloat(document.getElementById('editPeso').value),
                descricao: document.getElementById('editDescricao').value,
                fornecedor: document.getElementById('editFornecedor').value
            };

            Database.update(id, data);
            showNotification('✏️ Item atualizado com sucesso!', 'success');
            document.getElementById('editModal').classList.remove('active');
            this.loadItems();
            Dashboard.render();
            Relatorios.render();
        });
    }
};
