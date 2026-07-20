/* ============================================
   Companhia Dragão Avarento - Cadastro Module
   Formulário de cadastro de itens
   ============================================ */

   const Cadastro = {
    // Inicializar
    init() {
        this.bindEvents();
        // Definir data atual no campo de data
        document.getElementById('itemData').value = new Date().toISOString().split('T')[0];
    },

    // Bind de eventos
    bindEvents() {
        document.getElementById('cadastroForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveItem();
        });

        // Upload de imagem por arquivo
        document.getElementById('itemImagemFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    document.getElementById('itemImagem').value = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    },

    // Salvar item
    saveItem() {
        const name = document.getElementById('itemName').value.trim();
        const imagem = document.getElementById('itemImagem').value.trim();
        const categoria = document.getElementById('itemCategoria').value;
        const classe = document.getElementById('itemClasse').value;
        const raridade = document.getElementById('itemRaridade').value;
        const preco = parseFloat(document.getElementById('itemPreco').value);
        const quantidade = parseInt(document.getElementById('itemQuantidade').value);
        const peso = parseFloat(document.getElementById('itemPeso').value);
        const descricao = document.getElementById('itemDescricao').value.trim();
        const fornecedor = document.getElementById('itemFornecedor').value.trim();
        const dataCadastro = document.getElementById('itemData').value;

        // Validação
        if (!name || !categoria || !classe || !raridade || isNaN(preco) || isNaN(quantidade) || isNaN(peso)) {
            showNotification('❌ Preencha todos os campos obrigatórios!', 'error');
            return;
        }

        const item = {
            name,
            imagem: imagem || generateItemImage(name, raridade),
            categoria,
            classe,
            raridade,
            preco,
            quantidade,
            peso,
            descricao,
            fornecedor,
            dataCadastro: dataCadastro || new Date().toISOString().split('T')[0],
            favorito: false
        };

        const saved = Database.add(item);

        if (saved) {
            showNotification(`✅ Item "${name}" cadastrado com sucesso!`, 'success');
            document.getElementById('cadastroForm').reset();
            document.getElementById('itemData').value = new Date().toISOString().split('T')[0];
        } else {
            showNotification('❌ Erro ao cadastrar item.', 'error');
        }
    }
};
