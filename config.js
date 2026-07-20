/* ============================================
   Companhia Dragão Avarento - Config Module
   Configurações do sistema
   ============================================ */

   const Config = {
    // Inicializar
    init() {
        this.loadConfig();
        this.bindEvents();
    },

    // Carregar configurações
    loadConfig() {
        const config = Database.getConfig();
        document.getElementById('configCompanyName').value = config.companyName;

        // Atualizar nome da empresa na UI
        this.updateCompanyName(config.companyName);

        // Mostrar logo se existir
        if (config.logo) {
            const preview = document.getElementById('configLogoPreview');
            preview.src = config.logo;
            preview.style.display = 'block';
        }
    },

    // Atualizar nome da empresa
    updateCompanyName(name) {
        const nameEl = document.querySelector('.company-name');
        if (nameEl && name) {
            nameEl.innerHTML = name.replace(' ', '<br>');
        }
    },

    // Bind de eventos
    bindEvents() {
        // Alternar tema
        document.getElementById('configThemeToggle').addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            this.toggleTheme(newTheme);
        });

        // Upload de logo
        document.getElementById('configLogoUpload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const logoData = ev.target.result;
                    Database.saveConfig({ logo: logoData });
                    const preview = document.getElementById('configLogoPreview');
                    preview.src = logoData;
                    preview.style.display = 'block';
                    showNotification('🖼️ Logo atualizado com sucesso!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });

        // Salvar nome da empresa
        document.getElementById('configSaveName').addEventListener('click', () => {
            const name = document.getElementById('configCompanyName').value.trim();
            if (!name) {
                showNotification('❌ O nome não pode ser vazio!', 'error');
                return;
            }
            Database.saveConfig({ companyName: name });
            this.updateCompanyName(name);
            showNotification('✅ Nome da empresa atualizado!', 'success');
        });

        // Limpar banco de dados
        document.getElementById('configClearDB').addEventListener('click', () => {
            if (confirm('⚠️ ATENÇÃO: Esta ação removerá TODOS os itens do estoque. Deseja continuar?')) {
                if (confirm('Tem CERTEZA? Esta ação é IRREVERSÍVEL!')) {
                    Database.clearAll();
                    showNotification('🗑️ Banco de dados limpo com sucesso!', 'success');
                    this.refreshAll();
                }
            }
        });

        // Restaurar dados iniciais
        document.getElementById('configRestoreDB').addEventListener('click', () => {
            if (confirm('Deseja restaurar os 30 itens iniciais do sistema? Os dados atuais serão substituídos.')) {
                Database.restore();
                showNotification('🔄 Dados iniciais restaurados com sucesso!', 'success');
                this.refreshAll();
            }
        });
    },

    // Alternar tema
    toggleTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        Database.saveConfig({ theme });
        showNotification(`🎨 Tema ${theme === 'dark' ? 'escuro' : 'claro'} ativado!`, 'success');
    },

    // Atualizar todas as páginas
    refreshAll() {
        Dashboard.render();
        Estoque.loadItems();
        Pesquisa.performSearch();
        Relatorios.render();
        Categorias.render();
    }
};
