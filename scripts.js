const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('search');
let database = [];
let currentSection = 'практика'; // По умолчанию открыты практики

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

// Переключение разделов
function setSection(section) {
    currentSection = section;
    
    // Визуальное переключение вкладок
    document.getElementById('tab-pract').classList.remove('active');
    document.getElementById('tab-lect').classList.remove('active');
    
    if(section === 'практика') {
        document.getElementById('tab-pract').classList.add('active');
    } else {
        document.getElementById('tab-lect').classList.add('active');
    }
    
    applyFilters();
}

const savedColor = localStorage.getItem('user-neon') || '#ffffff';
setTheme(savedColor);

fetch('data.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        render(data);
        searchInput.oninput = () => applyFilters();
    });

function applyFilters() {
    const query = searchInput.value.toLowerCase();
    
    // Сначала фильтруем по типу (лекция/практика)
    let filtered = database.filter(i => i.type.toLowerCase() === currentSection);
    
    // Потом по поиску
    filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(query) || i.subject.toLowerCase().includes(query)
    );
    
    render(filtered);
}

function render(items) {
    if (items.length === 0) {
        contentDiv.innerHTML = '<p class="text-gray-600 text-center col-span-full py-20 font-black uppercase opacity-20">В этом разделе пока ничего нет</p>';
        return;
    }
    
    contentDiv.innerHTML = items.map((item, idx) => `
        <div class="glass-card p-8 rounded-[2.5rem] animate__animated animate__fadeInUp" style="animation-delay: ${idx * 0.05}s">
            <div class="mb-4">
                <span class="neon-text text-[10px] font-black uppercase tracking-widest">${item.subject}</span>
            </div>
            <h3 class="text-xl font-bold mb-8 leading-tight h-14 overflow-hidden">${item.title}</h3>
            <a href="${item.link}" target="_blank" class="btn-open block w-full py-4 rounded-2xl font-black text-[10px] uppercase text-center transition-all">
                Открыть материал
            </a>
        </div>
    `).join('');
}