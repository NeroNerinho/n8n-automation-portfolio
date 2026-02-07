/**
 * OpusMultipla Checking System
 * Core Logic and API Integration
 */

// --- CONFIGURATION ---
const API_ENDPOINT = 'https://n8n.grupoom.com.br/webhook/CheckingCentral';

// Complete Media Type Configuration
const MEDIA_TYPE_CONFIG = {
    "AT": { label: "Ativação", fields: 1 },
    "BD": { label: "Busdoor/Taxidoor", fields: 1, aliases: ['BP'] },
    "CI": { label: "Cinema", fields: 1, aliases: ['CN', 'CP'] },
    "DO": { label: "Digital Out of Home", fields: 3, hasInsertions: true, aliases: ['PH'] },
    "FL": { label: "Frontlight", fields: 1, aliases: ['PF'] },
    "IN": { label: "Internet", fields: 1, aliases: ['PN', 'PW'] },
    "JO": { label: "Jornal", fields: 1, aliases: ['JN', 'PJ'] },
    "MO": { label: "Metrô", fields: 2, hasMarking: true, aliases: ['MT', 'PM'] },
    "ME": { label: "Mídia Externa", fields: 2, hasMarking: true, aliases: ['EP'] },
    "MI": { label: "Mídia Interna", fields: 1, aliases: ['PI', 'MN'] },
    "OD": { label: "Outdoor", fields: 1, aliases: ['PO'] },
    "TP": { label: "Patrocínios", fields: 1 },
    "RD": { label: "Rádio", fields: 1, aliases: ['PD', 'RA', 'RF'] },
    "RV": { label: "Revista", fields: 1, aliases: ['RE', 'PS'] },
    "TV": { label: "TV", fields: 1, aliases: ['PT', 'PV', 'TA'] }
};

// --- STATE ---
let searchMode = 'pi'; // 'pi' or 'cnpj'
let debounceTimer = null;
let currentPIStatus = { can_submit: true, is_complement: false, enderecos: [], total_enderecos: 0 };

// --- DOM ELEMENTS ---
const form = document.getElementById('checkingForm');
const searchInput = document.getElementById('search-input');
const searchLabel = document.getElementById('search-label');
const searchStatus = document.getElementById('searchStatus');
const piResultsArea = document.getElementById('pi-results-area');
const piResultsList = document.getElementById('pi-results-list');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressContainer = document.getElementById('progressContainer');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

const btnModePi = document.getElementById('btn-mode-pi');
const btnModeCnpj = document.getElementById('btn-mode-cnpj');

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    // Mode Toggle
    btnModePi.addEventListener('click', () => setSearchMode('pi'));
    btnModeCnpj.addEventListener('click', () => setSearchMode('cnpj'));

    // Search Input
    searchInput.addEventListener('input', handleSearchInput);

    // Manual Meio Selection Change
    const meioSelect = document.getElementById('meio');
    if (meioSelect) {
        meioSelect.addEventListener('change', (e) => {
            if (e.target.value) generateUploadFields(e.target.value);
        });
    }

    // Form Submit
    form.addEventListener('submit', handleFormSubmit);
});

// --- FUNCTIONS ---

function setSearchMode(mode) {
    searchMode = mode;

    // Reset UI
    searchInput.value = '';
    searchStatus.innerText = '';
    piResultsArea.style.display = 'none';
    clearFormFields();
    hideUploadGroups();

    // Reset button state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }

    if (mode === 'pi') {
        btnModePi.classList.add('active');
        btnModeCnpj.classList.remove('active');
        searchLabel.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            Número da PI *
        `;
        searchInput.placeholder = 'Digite o número da PI (ex: 12345/24)';
        searchInput.name = 'n_pi';
    } else {
        btnModeCnpj.classList.add('active');
        btnModePi.classList.remove('active');
        searchLabel.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            CNPJ do Veículo *
        `;
        searchInput.placeholder = '00.000.000/0000-00';
        searchInput.name = 'cnpj';
    }
}

function handleSearchInput(e) {
    let val = e.target.value;

    // Apply CNPJ mask
    if (searchMode === 'cnpj') {
        val = maskCNPJ(val);
        e.target.value = val;
    }

    // Debounce search
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (val.length >= 3) {
            performSearch(val);
        } else {
            searchStatus.innerText = '';
            piResultsArea.style.display = 'none';
            hideUploadGroups();
        }
    }, 500);
}

function maskCNPJ(val) {
    return val.replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

async function performSearch(query) {
    searchStatus.innerText = 'Buscando...';
    searchStatus.style.color = '#64748b';

    const cleanQuery = searchMode === 'cnpj' ? query.replace(/\D/g, '') : query.trim();

    try {
        const payload = {
            action: searchMode === 'cnpj' ? 'buscar_pis_cnpj' : 'buscar_pi',
            [searchMode === 'cnpj' ? 'cnpj' : 'n_pi']: cleanQuery
        };

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Network error');
        const data = await response.json();

        if (searchMode === 'cnpj' && data.success && data.pis) {
            // CNPJ returns a list of PIs in data.pis
            renderPIList(data.pis, query);
            searchStatus.innerText = `${data.pis.length} PI(s) encontrada(s).`;
            searchStatus.style.color = '#1a1a1a';
        } else if (data.success && data.n_pi) {
            // Single PI result
            searchStatus.innerText = 'PI Encontrada!';
            searchStatus.style.color = '#10b981';

            // Track status
            currentPIStatus = {
                can_submit: data.can_submit !== false,
                is_complement: data.is_complement === true,
                enderecos: [],
                total_enderecos: 0
            };

            // NEW: Store addresses if OOH meio
            if (data.requer_enderecos && data.enderecos && data.enderecos.length > 0) {
                currentPIStatus.enderecos = data.enderecos;
                currentPIStatus.total_enderecos = data.total_enderecos || data.enderecos.length;
            }

            if (!currentPIStatus.can_submit) {
                searchStatus.innerText = data.message || 'Limite de checkings atingido.';
                searchStatus.style.color = '#ef4444';
                form.querySelector('button[type="submit"]').disabled = true;
                form.querySelector('button[type="submit"]').style.opacity = '0.5';
            } else {
                form.querySelector('button[type="submit"]').disabled = false;
                form.querySelector('button[type="submit"]').style.opacity = '1';
                if (currentPIStatus.is_complement) {
                    searchStatus.innerText = 'Proximo envio sera COMPLEMENTO.';
                    searchStatus.style.color = '#d97706';
                }
            }

            fillFormFields(data);
            generateUploadFields(data.meio || 'DEFAULT', data.enderecos);
        } else {
            throw new Error(data.message || 'Not found');
        }

    } catch (error) {
        console.error('Submission Error:', error);
        searchStatus.innerText = 'Erro na conexao com o servidor.';
        searchStatus.style.color = '#ef4444';
        clearFormFields();
        hideUploadGroups();
    }
}

function renderPIList(list, cnpjSearched = null) {
    piResultsList.innerHTML = '';

    list.forEach(item => {
        const piNum = item.n_pi || item.id;
        const cnpjDisplay = cnpjSearched ? `<span class="pi-card-subtitle">CNPJ: <span class="chrome-shimmer">${cnpjSearched}</span></span>` : '';
        const canSubmit = item.can_submit !== false;
        const isComplement = item.is_complement === true;

        const card = document.createElement('div');
        card.className = `pi-card ${!canSubmit ? 'blocked' : ''}`;
        card.style.opacity = !canSubmit ? '0.6' : '1';
        card.style.cursor = !canSubmit ? 'not-allowed' : 'pointer';

        card.innerHTML = `
            <div class="pi-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" width="24" height="24"><path d="M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm56-64V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V48A16,16,0,0,1,56,32H92.26a47.92,47.92,0,0,1,71.48,0H200A16,16,0,0,1,216,48ZM96,64h64a32,32,0,0,0-64,0ZM200,48H173.25A47.93,47.93,0,0,1,176,64v8a8,8,0,0,1-8,8H88a8,8,0,0,1-8-8V64a47.93,47.93,0,0,1,2.75-16H56V216H200Z"/></svg>
            </div>
            <div class="pi-card-content">
                <span class="pi-card-title">PI: <span class="pi-number chrome-shimmer">${piNum}</span></span>
                ${cnpjDisplay}
                <span class="pi-card-subtitle">${item.campanha || 'Campanha'} • ${item.cliente || 'Cliente'}</span>
                ${!canSubmit ? '<span class="pi-status-tag error">X Limite Atingido</span>' : isComplement ? '<span class="pi-status-tag warning">! Complemento</span>' : ''}
            </div>
            <span class="pi-meio-badge">${item.meio}</span>
        `;
        if (canSubmit) {
            card.addEventListener('click', () => selectPI(item));
        }
        piResultsList.appendChild(card);
    });

    piResultsArea.style.display = 'block';
}

function selectPI(data) {
    piResultsArea.style.display = 'none';
    searchInput.value = data.n_pi;

    // Status tracking from the list item
    currentPIStatus = {
        can_submit: data.can_submit !== false,
        is_complement: data.is_complement === true,
        enderecos: [],
        total_enderecos: 0
    };

    // NEW: Store addresses from selected PI
    if (data.enderecos && data.enderecos.length > 0) {
        currentPIStatus.enderecos = data.enderecos;
        currentPIStatus.total_enderecos = data.total_enderecos || data.enderecos.length;
    }

    if (!currentPIStatus.can_submit) {
        searchStatus.innerText = data.status_message || 'Limite de checkings atingido.';
        searchStatus.style.color = '#ef4444';
        form.querySelector('button[type="submit"]').disabled = true;
        form.querySelector('button[type="submit"]').style.opacity = '0.5';
    } else {
        searchStatus.innerText = currentPIStatus.is_complement ? 'PI Selecionada (Complemento)!' : 'PI Selecionada!';
        searchStatus.style.color = currentPIStatus.is_complement ? '#d97706' : '#10b981';
        form.querySelector('button[type="submit"]').disabled = false;
        form.querySelector('button[type="submit"]').style.opacity = '1';
    }

    fillFormFields(data);
    generateUploadFields(data.meio || 'DEFAULT', data.enderecos);
}

function fillFormFields(data) {
    document.getElementById('cliente').value = data.cliente || '';
    document.getElementById('campanha').value = data.campanha || '';
    document.getElementById('produto').value = data.produto || '';
    document.getElementById('periodo').value = data.periodo || '';
    document.getElementById('veiculo').value = data.veiculo || '';

    const meioSelect = document.getElementById('meio');
    if (data.meio && MEDIA_TYPE_CONFIG[data.meio]) {
        meioSelect.value = data.meio;
    } else {
        meioSelect.value = '';
    }
}

function clearFormFields() {
    ['cliente', 'campanha', 'produto', 'periodo', 'veiculo'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('meio').value = '';
}

function hideUploadGroups() {
    document.querySelectorAll('.upload-group').forEach(el => {
        el.style.display = 'none';
        el.querySelectorAll('input').forEach(inp => inp.required = false);
    });
    uploadPlaceholder.style.display = 'block';

    // Hide extra fields
    document.querySelectorAll('.extra-field').forEach(el => el.style.display = 'none');

    // NEW: Clear and hide OOH container
    const oohContainer = document.getElementById('ooh-addresses-container');
    if (oohContainer) {
        oohContainer.innerHTML = '';
        oohContainer.style.display = 'none';
    }
}

function generateUploadFields(meioCode, enderecos = null) {
    hideUploadGroups();

    // NEW: Handle OOH media types with addresses
    // Safeguard: Only for UNINTER client
    const cliente = document.getElementById('cliente').value || '';
    const isUninter = cliente.toUpperCase().includes('UNINTER');

    if (['OD', 'FL'].includes(meioCode) && isUninter && enderecos && enderecos.length > 0) {
        generateOOHAddressFields(enderecos, meioCode);
        uploadPlaceholder.style.display = 'none';
        return;
    }

    let found = false;
    const groups = document.querySelectorAll('.upload-group');

    groups.forEach(group => {
        const targets = group.dataset.meio.split(' ');
        if (targets.includes(meioCode)) {
            group.style.display = 'block';
            group.querySelectorAll('input[type="file"]').forEach(inp => inp.required = true);
            found = true;
        }
    });

    // Fallback to DEFAULT
    if (!found) {
        const defaultGroup = document.querySelector('.upload-group[data-meio="DEFAULT"]');
        if (defaultGroup) {
            defaultGroup.style.display = 'block';
            defaultGroup.querySelectorAll('input').forEach(i => i.required = true);
        }
    }

    uploadPlaceholder.style.display = 'none';

    // Show specific extra fields
    const config = MEDIA_TYPE_CONFIG[meioCode];
    if (config) {
        if (config.hasInsertions) {
            const field = document.getElementById('field-ins-total');
            if (field) field.style.display = 'block';
        }
        if (config.hasMarking) {
            const field = document.getElementById('field-marc-veiculo');
            if (field) field.style.display = 'block';
        }
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Enviando...';

    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    progressContainer.style.display = 'block';
    progressContainer.classList.add('active');

    const formData = new FormData(form);
    formData.append('action', 'enviar_checking');
    formData.append('is_complemento', currentPIStatus.is_complement);

    // NEW: Include OOH address metadata
    if (currentPIStatus.enderecos && currentPIStatus.enderecos.length > 0) {
        formData.append('enderecos_metadata', JSON.stringify(currentPIStatus.enderecos));
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_ENDPOINT, true);

    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            progressBar.style.width = percentComplete + '%';
            progressText.innerText = percentComplete + '%';
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            const resp = JSON.parse(xhr.responseText);
            successMessage.innerText = resp.message || 'Checking enviado com sucesso!';
            successMessage.style.display = 'block';
            form.reset();
            clearFormFields();
            hideUploadGroups();
            setSearchMode('pi'); // Reset mode
            currentPIStatus = { can_submit: true, is_complement: false, enderecos: [], total_enderecos: 0 }; // Reset status
            setTimeout(() => {
                progressContainer.style.display = 'none';
                successMessage.style.display = 'none';
            }, 5000);
        } else {
            errorMessage.innerText = 'Erro ao enviar. Tente novamente.';
            errorMessage.style.display = 'block';
        }
        submitBtn.disabled = false;
        submitBtn.innerText = 'Enviar Checking';
    };

    xhr.onerror = function () {
        errorMessage.innerText = 'Erro de conexão/rede.';
        errorMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerText = 'Enviar Checking';
    };

    xhr.send(formData);
}

// === OOH DYNAMIC ADDRESS FIELDS ===

function generateOOHAddressFields(enderecos, meioCode) {
    const container = document.getElementById('ooh-addresses-container');
    if (!container) return;

    container.innerHTML = '';
    container.style.display = 'block';

    // Header with count
    const header = document.createElement('div');
    header.className = 'ooh-header';
    header.innerHTML = `
        <div class="ooh-header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
        </div>
        <div class="ooh-header-text">
            <span class="ooh-title">${meioCode === 'OD' ? 'Outdoor' : 'Frontlight'} - Endereços para Checking</span>
            <span class="ooh-subtitle">${enderecos.length} endereço(s) encontrado(s) - Envie 1 foto de perto e 1 de longe para cada</span>
        </div>
    `;
    container.appendChild(header);

    // Address cards
    enderecos.forEach((end, index) => {
        const card = createAddressCard(end, index);
        container.appendChild(card);
    });

    // Add event listeners for file preview
    container.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', handleOOHFileChange);
    });
}

function createAddressCard(endereco, index) {
    const card = document.createElement('div');
    card.className = 'address-card';
    card.dataset.enderecoId = endereco.id;

    const pertoFieldName = endereco.campos_upload?.foto_perto?.field_name || `foto_perto_${endereco.id}`;
    const longeFieldName = endereco.campos_upload?.foto_longe?.field_name || `foto_longe_${endereco.id}`;

    card.innerHTML = `
        <div class="address-header">
            <div class="address-number">${index + 1}</div>
            <div class="address-text">${escapeHtml(endereco.endereco)}</div>
        </div>
        <div class="upload-pair">
            <div class="upload-field-ooh">
                <label for="${pertoFieldName}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Foto de Perto *
                </label>
                <input 
                    type="file" 
                    id="${pertoFieldName}"
                    name="${pertoFieldName}"
                    accept="image/jpeg,image/png,image/heic,.jpg,.jpeg,.png,.heic"
                    required
                    data-endereco-id="${endereco.id}"
                    data-tipo="perto"
                />
                <span class="file-info" id="info-${pertoFieldName}"></span>
            </div>
            <div class="upload-field-ooh">
                <label for="${longeFieldName}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    Foto de Longe *
                </label>
                <input 
                    type="file" 
                    id="${longeFieldName}"
                    name="${longeFieldName}"
                    accept="image/jpeg,image/png,image/heic,.jpg,.jpeg,.png,.heic"
                    required
                    data-endereco-id="${endereco.id}"
                    data-tipo="longe"
                />
                <span class="file-info" id="info-${longeFieldName}"></span>
            </div>
        </div>
    `;

    return card;
}

function handleOOHFileChange(e) {
    const file = e.target.files[0];
    const infoSpan = document.getElementById(`info-${e.target.id}`);

    if (file && infoSpan) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const isValid = sizeMB <= 10;
        infoSpan.textContent = `${file.name} (${sizeMB} MB)`;
        infoSpan.className = `file-info ${isValid ? 'success' : 'error'}`;

        if (!isValid) {
            infoSpan.textContent += ' - Arquivo muito grande!';
        }
    } else if (infoSpan) {
        infoSpan.textContent = '';
        infoSpan.className = 'file-info';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// --- RECURSOS ADICIONAIS ---
let submitClickCount = 0;
let guideClickCount = 0;

function setupEasterEggs() {
    const mediaGuideSummary = document.querySelector('.media-guide summary');
    const modal = document.getElementById('easterEggModal');
    const closeBtn = document.getElementById('closeModal');
    const playerDiv = document.getElementById('player');

    if (mediaGuideSummary) {
        mediaGuideSummary.addEventListener('click', () => {
            guideClickCount++;
            if (guideClickCount > 4) {
                openEasterEgg('N47uBLxC3Kg');
                guideClickCount = 0;
            }
        });
    }

    closeBtn.addEventListener('click', closeEasterEgg);

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeEasterEgg();
    });

    window.openEasterEgg = (videoId) => {
        modal.classList.add('active');
        // Usando youtube-nocookie para evitar bloqueios de privacidade
        // Removido origin para maior compatibilidade com execução local (file://)
        playerDiv.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0" 
                frameborder="0" 
                allow="autoplay; encrypted-media; picture-in-picture" 
                allowfullscreen>
            </iframe>`;
        document.body.style.overflow = 'hidden';
    };

    function closeEasterEgg() {
        modal.classList.remove('active');
        playerDiv.innerHTML = '';
        document.body.style.overflow = '';
    }
}

// Update existing handleFormSubmit to include click tracking
const originalHandleFormSubmit = handleFormSubmit;
handleFormSubmit = async function (e) {
    submitClickCount++;
    if (submitClickCount > 3) {
        openEasterEgg('HB2bnfMb1tQ');
        submitClickCount = 0;
        e.preventDefault();
        return;
    }
    return originalHandleFormSubmit.apply(this, arguments);
};

// Start Easter Eggs
document.addEventListener('DOMContentLoaded', () => {
    // ... existing initialization ...
    setupEasterEggs();
});
