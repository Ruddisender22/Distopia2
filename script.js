// REEMPLAZA ESTO POR TU URL REAL
const SHEET_URL = "AKfycbyTn0kvhWm6Jk-qQAHg__HSaZ8D5C5cb_EFEcUjWLXH3EafZGxz7ymrxgYCZBupkP_8";

async function init() {
    try {
        const [dataRes, votesRes] = await Promise.all([
            fetch('data.json'),
            fetch(SHEET_URL)
        ]);
        const data = await dataRes.json();
        const votes = await votesRes.json();
        
        const app = document.getElementById('app');
        app.innerHTML = ""; // Limpiar carga...

        data.sections.forEach(section => {
            app.innerHTML += `<h2>${section.name}</h2><div class="mod-grid" id="${section.name}"></div>`;
            const container = document.getElementById(section.name);
            
            section.mods.forEach(mod => {
                const count = votes[mod.id] || 0;
                container.innerHTML += `
                    <div class="mod-card">
                        <h3>${mod.name}</h3>
                        ${mod.images.map(img => `<img src="${img}" class="mod-img">`).join('')}
                        ${mod.paragraphs.map(p => `<p>${p}</p>`).join('')}
                        <div class="voting">
                            <span>Votos: <b>${count}</b></span>
                            <button onclick="vote('${mod.id}', 1)">👍</button>
                        </div>
                    </div>`;
            });
        });
    } catch (err) {
        document.getElementById('app').innerHTML = "Error al cargar. Revisa la consola F12.";
        console.error(err);
    }
}

async function vote(id, change) {
    await fetch(SHEET_URL, {
        method: 'POST',
        body: JSON.stringify({id, change})
    });
    location.reload(); // Recargar para ver el cambio
}

init();
