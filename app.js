import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCcdcsIWEZ1j6Vq0_ImyNRxna2bJyVYWL0",
    authDomain: "gt-database-fedcd.firebaseapp.com",
    projectId: "gt-database-fedcd",
    storageBucket: "gt-database-fedcd.firebasestorage.app",
    messagingSenderId: "542867018660",
    appId: "1:542867018660:web:dacf4c5243e37259d32731"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let datiAlbi = []; 

async function caricaFumetti() {
    const griglia = document.getElementById('griglia-albi');
    if (!griglia) return;

    try {
        const querySnapshot = await getDocs(collection(db, "albi-tex"));
        datiAlbi = [];
        griglia.innerHTML = "";

        querySnapshot.forEach((docSnap) => {
            datiAlbi.push(docSnap.data());
        });

        datiAlbi.sort((a, b) => a.numero - b.numero);

        datiAlbi.forEach((albo) => {
            const isPosseduto = localStorage.getItem(albo.id) === 'true';
            const card = document.createElement('div');
            card.className = `p-4 border rounded-lg shadow-sm transition-colors cursor-pointer ${isPosseduto ? 'bg-green-100 border-green-500' : 'bg-white'}`;
            
            card.onclick = (e) => {
                if (e.target.type !== 'checkbox') window.apriModal(albo.id);
            };

            card.innerHTML = `
                <img src="${albo.immagine}" class="w-full h-auto mb-2 rounded" loading="lazy">
                <h3 class="font-bold text-sm text-center">Numero ${albo.numero}</h3>
                <label class="flex items-center justify-center space-x-2 cursor-pointer mt-2">
                    <input type="checkbox" ${isPosseduto ? 'checked' : ''} 
                        onchange="togglePossesso('${albo.id}', this)" 
                        class="form-checkbox h-4 w-4 text-red-600">
                    <span class="text-xs uppercase font-semibold">In collezione</span>
                </label>
            `;
            griglia.appendChild(card);
        });
        aggiornaStats();
    } catch (e) {
        console.error("Errore nel caricamento:", e);
    }
}

window.apriModal = (id) => {
    const albo = datiAlbi.find(a => a.id === id);
    if (!albo) return;
    const modal = document.getElementById('modal-dettagli');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <img src="${albo.immagine}" class="w-full h-64 object-contain mb-4">
        <h2 class="text-2xl font-bold mb-1">Numero ${albo.numero} - ${albo.titolo}</h2>
        <p class="text-red-700 font-bold mb-4 italic">${albo.serie}</p>
        <div class="space-y-2 border-t pt-4 text-sm text-gray-700">
            <p><strong>Editore:</strong> ${albo.editore || 'Non specificato'}</p>
            <p><strong>Data uscita:</strong> ${albo.data || 'Non specificata'}</p>
        </div>
    `;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.chiudiModal = () => {
    const modal = document.getElementById('modal-dettagli');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

window.togglePossesso = (id, checkbox) => {
    localStorage.setItem(id, checkbox.checked);
    const card = checkbox.closest('div');
    if (checkbox.checked) {
        card.classList.replace('bg-white', 'bg-green-100');
        card.classList.add('border-green-500');
    } else {
        card.classList.replace('bg-green-100', 'bg-white');
        card.classList.remove('border-green-500');
    }
    aggiornaStats();
};

function aggiornaStats() {
    const totale = datiAlbi.length;
    const posseduti = Object.keys(localStorage).filter(key => 
        key.startsWith('tex-') && localStorage.getItem(key) === 'true'
    ).length;
    
    const elPunti = document.getElementById('statistiche');
    if (elPunti) elPunti.innerText = `${posseduti} / ${totale}`;
}

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") window.chiudiModal();
});

caricaFumetti();
