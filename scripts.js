const contentDiv = document.getElementById('content');
const searchInput = document.getElementById('search');
const counters = {
    total: document.getElementById('count-total'),
    pract: document.getElementById('count-pract'),
    lect: document.getElementById('count-lect'),
    subj: document.getElementById('count-subj')
};

let database = [];
let currentFilter = 'all';

fetch('data.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        updateStats(data);
        render(data);

        searchInput.oninput = () => {
            applyFilters();
        };
    })
    .catch(err => contentDiv.innerHTML = `<p class="text-red-400 text-center col-span-full">Ошибка: ${err.message}</p>`);

function updateStats(data) {
    counters.total.innerText = data.length;
    counters.pract.innerText = data.filter(i => i.type.toLowerCase() === 'практика').length;
    counters.lect.innerText = data.filter(i => i.type.toLowerCase() === 'лекция').length;
    counters.subj.innerText = [...new Set(data.map(i => i.subject))].length;
}

function filterByType(type) {
    currentFilter = type;
    // Визуальное переключение активной карточки статистики
    document.querySelectorAll('.stat-card').forEach(el => el.classList.remove('stat-active'));
    if(type === 'all') document.getElementById('stat-all').classList.add('stat-active');
    if(type === 'практика') document.getElementById('stat-pract').classList.add('stat-active');
    if(type === 'лекция') document.getElementById('stat-lect').classList.add('stat-active');
    
    applyFilters();
}

function applyFilters() {
    const query = searchInput.value.toLowerCase();
    let filtered = database;

    if (currentFilter !== 'all') {
        filtered = filtered.filter(i => i.type.toLowerCase() === currentFilter);
    }

    filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(query) || i.subject.toLowerCase().includes(query)
    );

    render(filtered);
}

function render(items) {
    if (items.length === 0) {
        contentDiv.innerHTML = '<p class="text-slate-500 text-center col-span-full py-20">Список пуст или ничего не найдено</p>';
        return;
    }

    contentDiv.innerHTML = items.map((item, idx) => `
        <div class="glass p-6 rounded-3xl card-hover transition-all duration-300 animate__animated animate__fadeInUp" style="animation-delay: ${idx * 0.05}s">
            <div class="flex justify-between items-start mb-4">
                <span class="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                    ${item.subject}
                </span>
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${item.type}</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-6 leading-tight h-14 overflow-hidden line-clamp-2">${item.title}</h3>
            <div class="flex items-center justify-between mt-auto">
                <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 border border-slate-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <a href="${item.link}" target="_blank" 
                   class="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/40 active:scale-95">
                    ОТКРЫТЬ
                </a>
            </div>
        </div>
    `).join('');
}