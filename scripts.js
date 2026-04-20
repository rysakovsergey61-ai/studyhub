const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('search');
let database = [];
let currentSection = 'практика';

function toggleMenu() {
    const menu = document.getElementById('color-menu');
    menu.style.display = (menu.style.display === 'grid') ? 'none' : 'grid';
}

function setTheme(color) {
    document.documentElement.style.setProperty('--neon-color', color);
    localStorage.setItem('user-neon', color);
    document.getElementById('color-menu').style.display = 'none';
    document.getElementById('main-theme-btn').style.borderColor = color;
}

function setSection(section) {
    currentSection = section;
    document.getElementById('tab-pract').classList.toggle('active', section === 'практика');
    document.getElementById('tab-lect').classList.toggle('active', section === 'лекция');
    applyFilters();
}

const savedColor = localStorage.getItem('user-neon') || '#bc13fe';
setTheme(savedColor);

fetch('data.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        applyFilters();
        searchInput.oninput = () => applyFilters();
    });

function applyFilters() {
    const query = searchInput.value.toLowerCase();
    
    let filtered = database.filter(item => {
        // Учитываем опечатку "пратика" в JSON
        const type = item.type.toLowerCase().replace('пратика', 'практика');
        return type === currentSection && item.subject.toLowerCase().includes(query);
    });
    
    render(filtered);
}

function render(items) {
    if (items.length === 0) {
        contentDiv.innerHTML = '<div class="col-span-full py-20 text-center opacity-20 font-black italic">ПУСТО</div>';
        return;
    }

    contentDiv.innerHTML = items.map(item => `
        <div class="glass-card animate__animated animate__fadeInUp">
            <div class="subject-name">${item.subject}</div>
            <a href="${item.link}" target="_blank" class="btn-open">Открыть материал</a>
        </div>
    `).join('');
}