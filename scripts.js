const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('search');
let database = [];
let currentFilter = 'all';
let currentSubject = 'all';

// --- ЛОГИКА СКИНОВ ---
function toggleMenu() {
    const menu = document.getElementById('color-menu');
    menu.style.display = menu.style.display === 'grid' ? 'none' : 'grid';
}

function setTheme(color) {
    document.documentElement.style.setProperty('--neon-color', color);
    localStorage.setItem('user-neon', color);
    document.getElementById('color-menu').style.display = 'none';
    const btn = document.getElementById('main-theme-btn');
    btn.style.borderColor = color;
    btn.style.boxShadow = `0 0 15px ${color}`;
}

// Загрузка темы при старте
const savedColor = localStorage.getItem('user-neon') || '#ffffff';
setTheme(savedColor);

// --- ЗАГРУЗКА ДАННЫХ ---
fetch('data.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        updateStats(data);
        render(data);
        searchInput.oninput = () => applyFilters();
    });

function updateStats(data) {
    document.getElementById('count-total').innerText = data.length;
    document.getElementById('count-pract').innerText = data.filter(i => i.type.toLowerCase() === 'практика').length;
    document.getElementById('count-lect').innerText = data.filter(i => i.type.toLowerCase() === 'лекция').length;
    document.getElementById('count-subj').innerText = [...new Set(data.map(i => i.subject))].length;
}

function filterByType(type) {
    currentFilter = type;
    document.querySelectorAll('.stat-card').forEach(el => el.classList.remove('stat-active'));
    const idMap = { 'all': 'stat-all', 'практика': 'stat-pract', 'лекция': 'stat-lect' };
    if (idMap[type]) document.getElementById(idMap[type]).classList.add('stat-active');
    applyFilters();
}

function filterBySubject(subject) {
    currentSubject = subject;
    document.querySelectorAll('.subj-btn').forEach(btn => {
        btn.classList.remove('active-subj');
        if(btn.innerText.toLowerCase().includes(subject.toLowerCase()) || (subject === 'all' && btn.innerText === 'ВСЕ')) {
            btn.classList.add('active-subj');
        }
    });
    applyFilters();
}

function applyFilters() {
    const query = searchInput.value.toLowerCase();
    let filtered = database;
    if (currentFilter !== 'all') filtered = filtered.filter(i => i.type.toLowerCase() === currentFilter);
    if (currentSubject !== 'all') filtered = filtered.filter(i => i.subject.toLowerCase().includes(currentSubject.toLowerCase()));
    
    filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(query) || i.subject.toLowerCase().includes(query)
    );
    render(filtered);
}

function render(items) {
    if (items.length === 0) {
        contentDiv.innerHTML = '<p class="text-gray-600 text-center col-span-full py-20 font-black uppercase tracking-widest opacity-20">Архив пуст</p>';
        return;
    }
    contentDiv.innerHTML = items.map((item, idx) => `
        <div class="glass-card p-8 rounded-[2.5rem] transition-all animate__animated animate__fadeInUp" style="animation-delay: ${idx * 0.05}s">
            <div class="flex justify-between items-start mb-6 text-[9px] font-black uppercase tracking-widest">
                <span class="neon-text">${item.subject}</span>
                <span class="opacity-30">${item.type}</span>
            </div>
            <h3 class="text-xl font-bold mb-8 leading-tight h-14 overflow-hidden">${item.title}</h3>
            <a href="${item.link}" target="_blank" class="btn-open block w-full py-4 rounded-2xl font-black text-[10px] uppercase text-center tracking-widest transition-all active:scale-95">
                Открыть доступ
            </a>
        </div>
    `).join('');
}