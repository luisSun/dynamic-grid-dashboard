// ----------------- Seleções de elementos -----------------
const grid = document.getElementById('harem-grid');
const addSpaceButton = document.getElementById('add-space');
const container = document.getElementById('container');
const headerButtons = document.querySelector('.header-buttons');

// ----------------- Modal de upload -----------------
const modal = document.getElementById('upload-modal');
const modalInput = document.getElementById('modal-file-input');
const previewImage = document.getElementById('preview-image');
const confirmBtn = document.getElementById('confirm-upload');
const cancelBtn = document.getElementById('cancel-upload');

let currentSlot = null; // slot que receberá a imagem

function openUploadModal(slot) {
    currentSlot = slot;
    modal.style.display = 'flex';
    previewImage.src = '';
    modalInput.value = '';
}

// Preview da imagem ao selecionar arquivo
modalInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        previewImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Confirmar upload
confirmBtn.addEventListener('click', () => {
    if (!previewImage.src) return;
    fillSlotWithImage(currentSlot, previewImage.src);
    modal.style.display = 'none';
    currentSlot = null;
});

// Cancelar upload
cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    currentSlot = null;
});

// ----------------- Função para preencher slot -----------------
function fillSlotWithImage(slot, imageUrl) {
    // Remove imagens antigas
    const oldImg = slot.querySelector('img.slot-img');
    if (oldImg) oldImg.remove();

    // Cria a imagem
    const imgTag = document.createElement('img');
    imgTag.src = imageUrl;
    imgTag.classList.add('slot-img');
    imgTag.style.width = '100%';
    imgTag.style.height = '100%';
    imgTag.style.objectFit = 'cover';
    imgTag.style.position = 'absolute';
    imgTag.style.top = '0';
    imgTag.style.left = '0';
    imgTag.style.zIndex = '0';

    slot.appendChild(imgTag);

    // Esconde botão + se existir
    const addBtn = slot.querySelector('.add-char-btn');
    if (addBtn) addBtn.style.display = 'none';

    // Botão remover
    let removeBtn = slot.querySelector('.remove-btn');
    if (!removeBtn) {
        removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remover';
        removeBtn.classList.add('remove-btn');
        removeBtn.style.zIndex = '10';
        removeBtn.style.position = 'absolute';
        removeBtn.style.top = '5px';
        removeBtn.style.right = '5px';
        removeBtn.addEventListener('click', () => {
            imgTag.remove();
            if (addBtn) addBtn.style.display = 'flex';
            removeBtn.remove();
        });
        slot.appendChild(removeBtn);
    }
}

// ----------------- Criar novos slots -----------------
function createNewSlot() {
    const slot = document.createElement('div');
    slot.classList.add('harem-slot');

    const addBtn = document.createElement('button');
    addBtn.classList.add('add-char-btn');
    addBtn.textContent = '+';
    addBtn.addEventListener('click', () => openUploadModal(slot));

    slot.appendChild(addBtn);
    grid.appendChild(slot);
}

// Inicializa os slots existentes
document.querySelectorAll('.harem-slot .add-char-btn').forEach(btn => {
    const slot = btn.parentElement;
    btn.addEventListener('click', () => openUploadModal(slot));
});

// Botão Adicionar slot
addSpaceButton.addEventListener('click', createNewSlot);


// ----------------- Dark / Light Mode -----------------

const toggleThemeButton = document.getElementById('toggle-theme'); // botão existente

toggleThemeButton.textContent = 'Dark Mode';
toggleThemeButton.style.margin = '10px';
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleThemeButton.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

addSpaceButton.addEventListener('click', createNewSlot);

// ----------------- Reset chart -----------------
const resetButton = document.getElementById('reset-chart'); // botão existente


resetButton.style.margin = '10px';
resetButton.addEventListener('click', () => {
    document.querySelectorAll('.harem-slot').forEach(slot => {
        slot.querySelectorAll('img.slot-img').forEach(img => img.remove());
        slot.querySelectorAll('.remove-btn').forEach(btn => btn.remove());
        slot.querySelectorAll('.add-char-btn').forEach(btn => btn.style.display = 'flex');
    });
});

headerButtons.prepend(resetButton);


// ----------------- Salvar como PNG -----------------
const saveButton = document.getElementById('save-chart');
const containerBox = document.querySelector('.container-box');

saveButton.addEventListener('click', () => {
    const elemsToHide = containerBox.querySelectorAll('button');
    elemsToHide.forEach(el => el.style.visibility = 'hidden');

    console.log('apertado votao')

    html2canvas(containerBox, {
        scale: 2   // Aumenta a resolução (1 = padrão / 2 = HD / 3 = muito nítido)
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'my-anime-harem.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        elemsToHide.forEach(el => el.style.visibility = 'visible');
    });
});

// mover o botão para o topo (agora funciona)
headerButtons.prepend(saveButton);
