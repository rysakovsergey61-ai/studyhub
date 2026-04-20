const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('search');
let database = [];
let currentSection = 'практика';

// Полный список твоих предметов
const allSubjects = [
    "Иностранный язык", "Математика", "История", "Литература", 
    "Физика", "Биология", "Информатика", "Русский Язык", 
    "Индивидуальный проект", "Химия", "География", "Обществознание"
];

function toggleMenu() {
    const menu = document.getElementById('color-menu');
    menu.style.display = menu.style.display === 'grid' ? 'none' : 'grid';
}

function setTheme(color) {
    document.documentElement.style.setProperty('--neon-color', color);
    localStorage.setItem('user-neon', color);
    document.getElementById('color-menu').style.display = 'none';
    const mainBtn = document.getElementById('main-theme-btn');
    mainBtn.style.borderColor = color;
    mainBtn.style.boxShadow = `0 0 15px ${color}`;
}

function setSection(section) {
    currentSection = section;
    document.getElementById('tab-pract').classList.toggle('active', section === 'практика');
    document.getElementById('tab-lect').classList.toggle('active', section === 'лекция');
    applyFilters();
}

const savedColor = localStorage.getItem('user-neon') || '#ffffff';
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
    let filtered = database.filter(i => i.type.toLowerCase() === currentSection);
    
    if (query) {
        filtered = filtered.filter(i => 
            i.title.toLowerCase().includes(query) || i.subject.toLowerCase().includes(query)
        );
    }
    
    renderGrouped(filtered);
}

function renderGrouped(items) {
    if (items.length === 0) {
        contentDiv.innerHTML = '<div class="py-20 text-center opacity-20 font-black uppercase italic tracking-widest">Ничего не найдено</div>';
        return;
    }

    // Группировка данных по предметам
    let html = '';
    
    allSubjects.forEach(subject => {
        const subjectItems = items.filter(i => i.subject.toLowerCase() === subject.toLowerCase());
        
        if (subjectItems.length > 0) {
            html += `
                <div class="animate__animated animate__fadeIn">
                    <h2 class="subject-group-title neon-text">${subject}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${subjectItems.map(item => `
                            <div class="glass-card p-6 rounded-[2rem]">
                                <div class="text-[9px] uppercase tracking-widest opacity-40 mb-3">${item.type}</div>
                                <h3 class="text-lg font-bold mb-6 leading-tight">${item.title}</h3>
                                <a href="${item.link}" target="_blank" class="btn-open">Открыть</a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    });

    contentDiv.innerHTML = html || '<div class="py-20 text-center opacity-20 font-black uppercase italic tracking-widest">В этом разделе нет материалов по предметам</div>';
}