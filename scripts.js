let database = [];
let currentSection = 'практика';
const contentDiv = document.getElementById('content');

const colors = [
    '#bc13fe', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff',
    '#ff00ff', '#ffa500', '#ffc0cb', '#ffffff'
];

function initTheme() {
    const menu = document.getElementById('color-menu');
    if (menu) {
        menu.innerHTML = colors.map(c => `
            <div class="color-dot" style="background: ${c}" onclick="setTheme('${c}')"></div>
        `).join('');
    }
    const saved = localStorage.getItem('user-neon') || '#bc13fe';
    setTheme(saved);
}

window.toggleMenu = function() {
    const m = document.getElementById('color-menu');
    m.style.display = (m.style.display === 'grid') ? 'none' : 'grid';
}

window.setTheme = function(color) {
    document.documentElement.style.setProperty('--neon-color', color);
    localStorage.setItem('user-neon', color);
    // Обновляем цвет рекламной кнопки вручную, если нужно
    const heroBtn = document.querySelector('.hero-section a');
    if (heroBtn) heroBtn.style.backgroundColor = color;
}

window.setSection = function(section) {
    currentSection = section;
    document.getElementById('tab-pract').classList.toggle('active', section === 'практика');
    document.getElementById('tab-lect').classList.toggle('active', section === 'лекция');
    render();
}

fetch('data.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        render();
    });

function render() {
    if (!contentDiv) return;
    
    const filtered = database.filter(i => {
        const type = i.type.toLowerCase().replace('пратика', 'практика');
        return type === currentSection;
    });

    // Получаем уникальные предметы и сортируем в алфавитном порядке
    const unique = [...new Set(filtered.map(i => i.subject))].sort();

    contentDiv.innerHTML = unique.map(subject => `
        <div class="glass-card animate__animated animate__fadeInUp">
            <div class="text-xl font-black uppercase mb-4" style="line-height: 1.1;">${subject}</div>
            <button class="btn-open" onclick="window.location.href='subject.html?name=${encodeURIComponent(subject)}&type=${encodeURIComponent(currentSection)}'">Открыть темы</button>
        </div>
    `).join('');
}