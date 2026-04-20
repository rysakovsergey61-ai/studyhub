let database = [];
let currentSection = 'практика';

const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('search');

// Загрузка данных
fetch('data.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        document.getElementById('stat-count').innerText = data.length;
        render();
    })
    .catch(err => console.error("Ошибка базы данных:", err));

function setSection(section) {
    currentSection = section;
    document.getElementById('tab-pract').classList.toggle('active', section === 'практика');
    document.getElementById('tab-lect').classList.toggle('active', section === 'лекция');
    render();
}

function render() {
    const query = searchInput.value.toLowerCase();
    
    // Фильтр по типу (Лекция/Практика)
    const filteredBySection = database.filter(item => {
        const type = item.type.toLowerCase().replace('пратика', 'практика');
        return type === currentSection;
    });

    // Уникальные предметы для этого типа
    const uniqueSubjects = [...new Set(filteredBySection.map(i => i.subject))]
        .filter(s => s.toLowerCase().includes(query));

    if (uniqueSubjects.length === 0) {
        contentDiv.innerHTML = '<div class="col-span-full py-20 text-center opacity-20 font-black italic text-2xl">МАТЕРИАЛОВ НЕ НАЙДЕНО</div>';
        return;
    }

    contentDiv.innerHTML = uniqueSubjects.map(subject => `
        <div class="glass-card animate__animated animate__fadeInUp">
            <div class="subject-name">${subject}</div>
            <button onclick="goToSubject('${subject}')" style="border: 1px solid rgba(255,255,255,0.2); padding: 12px 30px; border-radius: 15px; font-weight: 800; font-size: 11px; text-transform: uppercase; cursor: pointer; transition: 0.3s; width: 100%;">
                Открыть темы
            </button>
        </div>
    `).join('');
}

function goToSubject(name) {
    window.location.href = `subject.html?name=${encodeURIComponent(name)}&type=${encodeURIComponent(currentSection)}`;
}

// Применение стиля неона
function applyStyle() {
    const savedColor = localStorage.getItem('user-neon') || '#bc13fe';
    document.documentElement.style.setProperty('--neon-color', savedColor);
    const btn = document.getElementById('main-theme-btn');
    if(btn) btn.style.borderColor = savedColor;
}

searchInput.oninput = render;
applyStyle();