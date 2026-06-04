const API_URL = "TU_URL_DE_APPS_SCRIPT_AQUÍ";

async function init() {
    const response = await fetch('data.json');
    const content = await response.json();
    const votes = await fetch(API_URL).then(r => r.json());
    
    // Convertir votos en un mapa fácil de buscar
    const voteMap = new Map();
    votes.slice(1).forEach(row => voteMap.set(row[0], row[1]));

    const app = document.getElementById('app');
    content.sections.forEach(sec => {
        // Renderizado... (Lógica del loop de la respuesta anterior)
        // Usa voteMap.get(mod.id) para mostrar el número real de votos
    });
}
init();
