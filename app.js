async function caricaFumetti() {
    const response = await fetch('albi.json');
    const albi = await response.json();
    const griglia = document.getElementById('griglia-albi');

    albi.forEach(albo => {
        const posseduto = localStorage.getItem(albo.id) === 'true';
        const card = document.createElement('div');
        card.className = `p-4 border rounded-lg shadow-sm transition-colors ${posseduto ? 'bg-green-100' : 'bg-white'}`;
        
        card.innerHTML = `
            <img src="${albo.immagine}" alt="${albo.titolo}" class="w-full h-auto mb-2 rounded" loading="lazy">
            <h3 class="font-bold text-sm">#${albo.numero} - ${albo.titolo}</h3>
            <p class="text-xs text-gray-500">${albo.editore}</p>
            <p class="text-xs text-gray-400 mb-3">${albo.data}</p>
            <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" ${posseduto ? 'checked' : ''} 
                    onchange="togglePossesso('${albo.id}', this)" 
                    class="form-checkbox h-5 w-5 text-red-600">
                <span class="text-sm">Ce l'ho!</span>
            </label>
        `;
        griglia.appendChild(card);
    });
    aggiornaStats();
}

function togglePossesso(id, checkbox) {
    localStorage.setItem(id, checkbox.checked);
    const card = checkbox.closest('div');
    
    if (checkbox.checked) {
        card.classList.replace('bg-white', 'bg-green-100');
    } else {
        card.classList.replace('bg-green-100', 'bg-white');
    }
    
    aggiornaStats();
}

function aggiornaStats() {
    const totale = document.querySelectorAll('input[type="checkbox"]').length;
    const posseduti = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const elPunti = document.getElementById('statistiche');
    if (elPunti) {
        elPunti.innerText = `${posseduti} / ${totale}`;
    }
}

caricaFumetti();