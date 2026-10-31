const TASKS = [
  { id: "MVP-01", phase: "MVP", title: "Talablar va xavfsizlik senariylari", description: "Bog‘cha rahbari bilan zonalar, rollar, alert darajalari va qabul mezonlarini tasdiqlash.", category: "Product", priority: "critical", dependency: "Yo‘q", effort: "2 kun", status: "doing" },
  { id: "MVP-02", phase: "MVP", title: "16 kamera auditi", description: "Kamera modeli, aniqlik, FPS, tungi rejim, ko‘rish burchagi va tarmoq holatini inventarizatsiya qilish.", category: "Cameras", priority: "critical", dependency: "MVP-01", effort: "2 kun", status: "todo" },
  { id: "MVP-03", phase: "MVP", title: "RTSP / NVR oqimlarini ulash", description: "16 oqim uchun reconnect, timeout, health-check va oqim navbatini barqaror sozlash.", category: "Cameras", priority: "critical", dependency: "MVP-02", effort: "4 kun", status: "todo" },
  { id: "MVP-04", phase: "MVP", title: "Edge AI serverni tayyorlash", description: "GPU, drayver, Docker, saqlash hajmi va 16 oqim uchun performance baseline o‘rnatish.", category: "Infrastructure", priority: "critical", dependency: "MVP-02", effort: "3 kun", status: "todo" },
  { id: "MVP-05", phase: "MVP", title: "Kadrlarni qayta ishlash pipeline’i", description: "Decoder, frame sampling, batching va overload paytida backpressure mexanizmini yaratish.", category: "Infrastructure", priority: "high", dependency: "MVP-03, MVP-04", effort: "5 kun", status: "todo" },
  { id: "MVP-06", phase: "MVP", title: "YOLO odam aniqlash modeli", description: "Adult va child klasslari uchun boshlang‘ich detection, confidence va NMS parametrlarini sozlash.", category: "AI / Detection", priority: "critical", dependency: "MVP-05", effort: "5 kun", status: "todo" },
  { id: "MVP-07", phase: "MVP", title: "Bog‘cha datasetini yig‘ish", description: "Rozilik asosida turli xona, yorug‘lik va rakurslardan anonimlashtirilgan namunalar tayyorlash.", category: "AI / Data", priority: "high", dependency: "MVP-01, MVP-02", effort: "7 kun", status: "todo" },
  { id: "MVP-08", phase: "MVP", title: "Modelni fine-tune va baholash", description: "Precision, recall, mAP va child/adult xatolarini pilot ma’lumotida o‘lchash.", category: "AI / Detection", priority: "high", dependency: "MVP-06, MVP-07", effort: "6 kun", status: "todo" },
  { id: "MVP-09", phase: "MVP", title: "ByteTrack kuzatuvini qo‘shish", description: "Har bir kamera ichida odam ID sini barqaror saqlash va track yo‘qolishini kamaytirish.", category: "AI / Tracking", priority: "critical", dependency: "MVP-06", effort: "4 kun", status: "todo" },
  { id: "MVP-10", phase: "MVP", title: "Xona va taqiqlangan zonalar", description: "Har kamera uchun polygon zonalar: xona, eshik, xavfli hudud va chiqish chizig‘ini belgilash.", category: "Rules Engine", priority: "high", dependency: "MVP-02", effort: "3 kun", status: "todo" },
  { id: "MVP-11", phase: "MVP", title: "Event va Rules Engine yadrosi", description: "Detection natijalarini vaqt, zona va rol qoidalari orqali tekshiradigan event oqimini qurish.", category: "Rules Engine", priority: "critical", dependency: "MVP-09, MVP-10", effort: "6 kun", status: "todo" },
  { id: "MVP-12", phase: "MVP", title: "Tarbiyachi mavjudligi qoidasi", description: "Bolalar xonada qolib, tasdiqlangan katta odam chiqib ketsa kechikish bilan alert yaratish.", category: "Safety Events", priority: "critical", dependency: "MVP-11", effort: "4 kun", status: "todo" },
  { id: "MVP-13", phase: "MVP", title: "Begona odamni aniqlash — bazaviy", description: "Ruxsat etilgan vaqt va zonadan tashqari adult paydo bo‘lsa admin uchun hodisa ochish.", category: "Safety Events", priority: "critical", dependency: "MVP-11", effort: "4 kun", status: "todo" },
  { id: "MVP-14", phase: "MVP", title: "FastAPI backend skeleti", description: "Kameralar, tasklar, hodisalar, foydalanuvchilar va health endpointlari uchun API yaratish.", category: "Backend / API", priority: "critical", dependency: "MVP-01", effort: "5 kun", status: "todo" },
  { id: "MVP-15", phase: "MVP", title: "PostgreSQL ma’lumotlar bazasi", description: "Camera, zone, track, event, alert, user va audit log jadvallarini migratsiyalar bilan yaratish.", category: "Database", priority: "critical", dependency: "MVP-14", effort: "4 kun", status: "todo" },
  { id: "MVP-16", phase: "MVP", title: "Admin dashboard — live holat", description: "16 kamera health statusi, faol alertlar, zona sozlamalari va hodisa timeline’ini ko‘rsatish.", category: "Admin Dashboard", priority: "high", dependency: "MVP-14, MVP-15", effort: "8 kun", status: "todo" },
  { id: "MVP-17", phase: "MVP", title: "Telegram va push alertlar", description: "Kritik hodisani kamera, vaqt, zona va qisqa snapshot bilan navbatchi adminga yuborish.", category: "Notifications", priority: "high", dependency: "MVP-11, MVP-14", effort: "3 kun", status: "todo" },
  { id: "MVP-18", phase: "MVP", title: "Role-based access control", description: "Superadmin, bog‘cha admini, tarbiyachi va kuzatuvchi uchun minimal ruxsatlarni belgilash.", category: "Privacy / Security", priority: "critical", dependency: "MVP-14, MVP-15", effort: "4 kun", status: "todo" },
  { id: "MVP-19", phase: "MVP", title: "Video maxfiyligi va retention", description: "Shifrlash, 7/30 kunlik saqlash siyosati, yuzni maskalash va eksport nazoratini joriy etish.", category: "Privacy / Security", priority: "critical", dependency: "MVP-15, MVP-18", effort: "5 kun", status: "todo" },
  { id: "MVP-20", phase: "MVP", title: "Audit log va rozilik jarayoni", description: "Kim qachon video yoki hodisani ko‘rganini yozish, ota-ona roziligi va bekor qilish oqimini yaratish.", category: "Privacy / Security", priority: "high", dependency: "MVP-18, MVP-19", effort: "4 kun", status: "todo" },
  { id: "MVP-21", phase: "MVP", title: "Unit va integration testlar", description: "API, rules engine, database va alert oqimi uchun avtomatik testlar hamda mock RTSP manbalar.", category: "Testing", priority: "high", dependency: "MVP-11, MVP-15, MVP-17", effort: "6 kun", status: "todo" },
  { id: "MVP-22", phase: "MVP", title: "16 kamera load testi", description: "GPU/CPU, latency, dropped frames va 24 soatlik stability ko‘rsatkichlarini o‘lchash.", category: "Testing", priority: "critical", dependency: "MVP-08, MVP-09, MVP-21", effort: "4 kun", status: "todo" },
  { id: "MVP-23", phase: "MVP", title: "Pilot deploy va rollback", description: "Bog‘cha edge serveriga versiyalash, monitoring, backup va xavfsiz rollback bilan chiqarish.", category: "Deployment", priority: "critical", dependency: "MVP-16, MVP-20, MVP-22", effort: "4 kun", status: "todo" },
  { id: "MVP-24", phase: "MVP", title: "2 haftalik pilot qabul testi", description: "False alert, javob vaqti, uptime va foydalanuvchi fikri asosida MVP qabul hisobotini yopish.", category: "Testing", priority: "high", dependency: "MVP-23", effort: "10 kun", status: "todo" },

  { id: "V2-01", phase: "V2", title: "Pose estimation pipeline’i", description: "Yiqilish va janjal uchun tana nuqtalarini real vaqtda chiqarish va track ID bilan bog‘lash.", category: "AI / Action", priority: "critical", dependency: "MVP-09, MVP-24", effort: "6 kun", status: "todo" },
  { id: "V2-02", phase: "V2", title: "Yiqilishni aniqlash", description: "Pose, tezlik va vaqt oynasi orqali haqiqiy yiqilishni o‘tirish yoki o‘ynashdan ajratish.", category: "Safety Events", priority: "critical", dependency: "V2-01", effort: "7 kun", status: "todo" },
  { id: "V2-03", phase: "V2", title: "Janjal / urush detection", description: "Video action model orqali agressiv harakatni oddiy o‘yin va quchoqlashdan farqlash.", category: "AI / Action", priority: "critical", dependency: "V2-01", effort: "10 kun", status: "todo" },
  { id: "V2-04", phase: "V2", title: "Action dataset va labeling", description: "Yiqilish, itarish, urish va normal o‘yin kliplarini privacy-safe tarzda belgilash.", category: "AI / Data", priority: "high", dependency: "MVP-20, MVP-24", effort: "12 kun", status: "todo" },
  { id: "V2-05", phase: "V2", title: "Identity registry", description: "Bola, tarbiyachi va ruxsatli mehmon profillarini minimal biometrik shablon bilan boshqarish.", category: "Identity / ReID", priority: "critical", dependency: "MVP-20, MVP-24", effort: "7 kun", status: "todo" },
  { id: "V2-06", phase: "V2", title: "Multi-camera ReID", description: "Kameralar orasida kiyim va appearance embedding orqali shaxs trackini davom ettirish.", category: "Identity / ReID", priority: "critical", dependency: "V2-05, MVP-09", effort: "12 kun", status: "todo" },
  { id: "V2-07", phase: "V2", title: "Bola lokatsiyasi servisi", description: "Oxirgi ko‘rilgan xona, vaqt va ishonch darajasini ota-ona uchun xavfsiz API’da berish.", category: "Backend / API", priority: "critical", dependency: "V2-06", effort: "6 kun", status: "todo" },
  { id: "V2-08", phase: "V2", title: "Stranger detection — identity", description: "Ro‘yxatdan o‘tmagan adult child-zone’ga kirganda ReID va jadval asosida tasdiqlangan alert yaratish.", category: "Safety Events", priority: "critical", dependency: "V2-05, V2-06", effort: "6 kun", status: "todo" },
  { id: "V2-09", phase: "V2", title: "Parent app backend", description: "Farzandga bog‘langan ruxsat, lokatsiya, xabarnoma va cheklangan live-view endpointlarini yaratish.", category: "Parent App", priority: "critical", dependency: "V2-07, MVP-18", effort: "8 kun", status: "todo" },
  { id: "V2-10", phase: "V2", title: "Parent PWA interfeysi", description: "Mobil qurilmada farzand holati, oxirgi zona va muhim xabarnomalarni sodda ko‘rsatish.", category: "Parent App", priority: "high", dependency: "V2-09", effort: "10 kun", status: "todo" },
  { id: "V2-11", phase: "V2", title: "Parent uchun video privacy gate", description: "Faqat o‘z farzandi ko‘rinadigan maskalangan stream, vaqt limiti va watermark qo‘llash.", category: "Privacy / Security", priority: "critical", dependency: "V2-09, V2-10", effort: "8 kun", status: "todo" },
  { id: "V2-12", phase: "V2", title: "Alert tasdiqlash workflow’i", description: "Tarbiyachi qabul qildi, tekshirdi, eskalatsiya qildi va yopdi holatlarini SLA bilan yuritish.", category: "Admin Dashboard", priority: "high", dependency: "MVP-17, V2-02, V2-03", effort: "5 kun", status: "todo" },
  { id: "V2-13", phase: "V2", title: "Model monitoring va drift", description: "Confidence, false positive, kamera kesimi va dataset drift metrikalarini kuzatish.", category: "MLOps", priority: "high", dependency: "V2-02, V2-03, V2-08", effort: "6 kun", status: "todo" },
  { id: "V2-14", phase: "V2", title: "V2 xavfsizlik pentesti", description: "API, token, IDOR, stream URL, storage va admin panel hujum sirtini tekshirish.", category: "Privacy / Security", priority: "critical", dependency: "V2-11, V2-12", effort: "5 kun", status: "todo" },
  { id: "V2-15", phase: "V2", title: "V2 pilot va A/B threshold", description: "Hodisa modellarini real sharoitda shadow mode bilan sinab, thresholdlarni xavfsiz chiqarish.", category: "Deployment", priority: "high", dependency: "V2-04, V2-13, V2-14", effort: "10 kun", status: "todo" },

  { id: "V3-01", phase: "V3", title: "Multi-tenant arxitektura", description: "Har bog‘cha, maktab va universitet ma’lumotini izolyatsiya qiladigan tenant modelini qurish.", category: "Platform", priority: "critical", dependency: "V2-15", effort: "10 kun", status: "todo" },
  { id: "V3-02", phase: "V3", title: "Tashkilot onboarding portali", description: "Kamera, zona, rol, retention va alert siyosatini bosqichma-bosqich sozlash ustasi.", category: "Platform", priority: "high", dependency: "V3-01", effort: "8 kun", status: "todo" },
  { id: "V3-03", phase: "V3", title: "Kubernetes va GPU autoscaling", description: "Markaziy inference uchun GPU workload, queue depth va health asosida masshtablash.", category: "Infrastructure", priority: "high", dependency: "V3-01", effort: "12 kun", status: "todo" },
  { id: "V3-04", phase: "V3", title: "Edge fleet management", description: "Ko‘p obyektlardagi edge serverlar health, model versiyasi va masofaviy yangilanishini boshqarish.", category: "MLOps", priority: "critical", dependency: "V3-03", effort: "10 kun", status: "todo" },
  { id: "V3-05", phase: "V3", title: "Maktab senariylari paketi", description: "Yo‘lak zichligi, taqiqlangan zona, dars vaqtidagi harakat va evakuatsiya qoidalari.", category: "Safety Events", priority: "high", dependency: "V3-01, MVP-11", effort: "10 kun", status: "todo" },
  { id: "V3-06", phase: "V3", title: "Universitet senariylari paketi", description: "Kampus kirishi, katta auditoriya, laboratoriya va ish vaqtidan tashqari monitoring qoidalari.", category: "Safety Events", priority: "medium", dependency: "V3-01, MVP-11", effort: "10 kun", status: "todo" },
  { id: "V3-07", phase: "V3", title: "Mobil ilovalar", description: "Admin va ota-ona uchun iOS/Android push, biometrik kirish va offline holat ekranlari.", category: "Parent App", priority: "high", dependency: "V2-10, V3-01", effort: "20 kun", status: "todo" },
  { id: "V3-08", phase: "V3", title: "Analitika va xavfsizlik hisobotlari", description: "Trend, zona heatmap, alert javob vaqti va rahbariyat uchun anonim KPI dashboard.", category: "Admin Dashboard", priority: "medium", dependency: "V3-01, V2-12", effort: "10 kun", status: "todo" },
  { id: "V3-09", phase: "V3", title: "SSO va enterprise access", description: "SAML/OIDC, SCIM, tashkilot rollari va majburiy MFA siyosatini qo‘shish.", category: "Privacy / Security", priority: "high", dependency: "V3-01", effort: "8 kun", status: "todo" },
  { id: "V3-10", phase: "V3", title: "Disaster recovery", description: "Region backup, RPO/RTO, edge offline rejimi va yiliga ikki marta tiklash mashqi.", category: "Infrastructure", priority: "critical", dependency: "V3-03, V3-04", effort: "7 kun", status: "todo" },
  { id: "V3-11", phase: "V3", title: "Compliance va DPIA paketi", description: "Biometrik ma’lumot, bolalar maxfiyligi, vendor risk va incident response hujjatlarini yakunlash.", category: "Privacy / Security", priority: "critical", dependency: "V3-01, V3-09, V3-10", effort: "12 kun", status: "todo" },
  { id: "V3-12", phase: "V3", title: "Scale va chaos testlari", description: "100+ kamera, tarmoq uzilishi, GPU nosozligi va event burst holatlarini avtomatik tekshirish.", category: "Testing", priority: "critical", dependency: "V3-03, V3-04, V3-10", effort: "8 kun", status: "todo" },
  { id: "V3-13", phase: "V3", title: "Production release pipeline", description: "Canary deploy, signed artifact, approval gate va barcha tenantlar uchun audit qilinadigan release oqimi.", category: "Deployment", priority: "critical", dependency: "V3-11, V3-12", effort: "7 kun", status: "todo" }
];

const STATUS_LABELS = { todo: "Rejada", doing: "Jarayonda", done: "Bajarildi" };
const PRIORITY_LABELS = { critical: "Kritik", high: "Yuqori", medium: "O‘rta", low: "Past" };
const PRIORITY_COLORS = { critical: "#da5b4d", high: "#dc8b23", medium: "#7358c8", low: "#a7b4af" };
const STORAGE_KEY = "safesight-roadmap-status-v1";

const state = {
  phase: "all",
  category: "all",
  status: "all",
  priority: "all",
  search: "",
  view: localStorage.getItem("safesight-view") || "grid",
  statuses: readJSON(STORAGE_KEY, {})
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}

function currentStatus(task) { return state.statuses[task.id] || task.status; }

function init() {
  populateCategories();
  bindEvents();
  restoreTheme();
  setView(state.view);
  updateAll();
}

function populateCategories() {
  const categories = [...new Set(TASKS.map(task => task.category))].sort((a, b) => a.localeCompare(b));
  $("#categoryFilter").insertAdjacentHTML("beforeend", categories.map(category => `<option value="${category}">${category}</option>`).join(""));
}

function bindEvents() {
  $$(".phase-tabs button").forEach(button => button.addEventListener("click", () => setPhase(button.dataset.phase)));
  $$("[data-phase-jump], [data-phase-card]").forEach(button => button.addEventListener("click", () => {
    setPhase(button.dataset.phaseJump || button.dataset.phaseCard);
    $("#tasks").scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  }));
  $("#searchInput").addEventListener("input", event => { state.search = event.target.value.trim().toLowerCase(); renderTasks(); });
  $("#categoryFilter").addEventListener("change", event => { state.category = event.target.value; renderTasks(); });
  $("#statusFilter").addEventListener("change", event => { state.status = event.target.value; renderTasks(); });
  $("#priorityFilter").addEventListener("change", event => { state.priority = event.target.value; renderTasks(); });
  $("#resetFilters").addEventListener("click", resetFilters);
  $("#emptyReset").addEventListener("click", resetFilters);
  $("#resetProgress").addEventListener("click", resetProgress);
  $$(".view-toggle button").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
  $("#taskGrid").addEventListener("change", handleStatusChange);
  $("#themeToggle").addEventListener("click", toggleTheme);
  $("#exportButton").addEventListener("click", exportReport);
  $("#menuButton").addEventListener("click", toggleMenu);
  $("#mobileOverlay").addEventListener("click", closeMenu);
  $$(".side-nav a").forEach(link => link.addEventListener("click", closeMenu));
}

function setPhase(phase) {
  state.phase = phase;
  $$(".phase-tabs button").forEach(button => button.classList.toggle("active", button.dataset.phase === phase));
  $$(".phase-summary").forEach(card => card.classList.toggle("active", card.dataset.phaseCard === phase));
  renderTasks();
}

function filteredTasks() {
  return TASKS.filter(task => {
    const status = currentStatus(task);
    const haystack = `${task.id} ${task.title} ${task.description} ${task.category} ${task.dependency}`.toLowerCase();
    return (state.phase === "all" || task.phase === state.phase)
      && (state.category === "all" || task.category === state.category)
      && (state.status === "all" || status === state.status)
      && (state.priority === "all" || task.priority === state.priority)
      && (!state.search || haystack.includes(state.search));
  });
}

function renderTasks() {
  const tasks = filteredTasks();
  const grid = $("#taskGrid");
  grid.innerHTML = tasks.map(taskCard).join("");
  $("#resultCount").textContent = `${tasks.length} ta task ko‘rsatildi`;
  $("#emptyState").hidden = tasks.length !== 0;
  grid.hidden = tasks.length === 0;
}

function taskCard(task) {
  const status = currentStatus(task);
  return `<article class="task-card ${status === "done" ? "done" : ""}" style="--priority-color:${PRIORITY_COLORS[task.priority]}">
    <div class="card-top">
      <div class="card-labels"><span class="task-phase ${task.phase.toLowerCase()}">${task.phase}</span><span class="priority ${task.priority}">${PRIORITY_LABELS[task.priority]}</span></div>
      <span class="card-id">${task.id}</span>
    </div>
    <h3>${task.title}</h3>
    <p class="task-description">${task.description}</p>
    <div class="task-meta"><span>${task.category}</span></div>
    <div class="dependency"><span>↳</span><span>Bog‘liqlik: <b>${task.dependency}</b></span></div>
    <div class="card-footer">
      <select class="status-select" data-task-id="${task.id}" aria-label="${task.title} holati">
        ${Object.entries(STATUS_LABELS).map(([value, label]) => `<option value="${value}" ${status === value ? "selected" : ""}>${label}</option>`).join("")}
      </select>
      <span class="effort">Taxmin: <b>${task.effort}</b></span>
    </div>
  </article>`;
}

function handleStatusChange(event) {
  if (!event.target.matches(".status-select")) return;
  const id = event.target.dataset.taskId;
  state.statuses[id] = event.target.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.statuses));
  updateAll();
  showToast(`${id} — ${STATUS_LABELS[event.target.value]}`);
}

function updateAll() {
  updateMetrics();
  updateCounts();
  renderTasks();
}

function updateMetrics() {
  const done = TASKS.filter(task => currentStatus(task) === "done").length;
  const doing = TASKS.filter(task => currentStatus(task) === "doing").length;
  const critical = TASKS.filter(task => task.priority === "critical" && currentStatus(task) !== "done").length;
  const progress = Math.round((done / TASKS.length) * 100);
  $("#totalProgress").textContent = `${progress}%`;
  $("#totalProgressBar").style.width = `${progress}%`;
  $("#doneCount").textContent = done;
  $("#totalCount").textContent = TASKS.length;
  $("#doingCount").textContent = doing;
  $("#criticalCount").textContent = critical;

  ["MVP", "V2", "V3"].forEach(phase => {
    const phaseTasks = TASKS.filter(task => task.phase === phase);
    const phaseDone = phaseTasks.filter(task => currentStatus(task) === "done").length;
    const phaseProgress = Math.round((phaseDone / phaseTasks.length) * 100);
    const prefix = phase.toLowerCase();
    $(`#${prefix}Progress`).textContent = `${phaseProgress}%`;
    $(`#${prefix}Bar`).style.width = `${phaseProgress}%`;
  });

  const focus = TASKS.find(task => currentStatus(task) === "doing") || TASKS.find(task => currentStatus(task) === "todo");
  if (focus) {
    $("#currentFocus").textContent = `${focus.phase} · ${focus.category}`;
    $("#focusText").textContent = focus.title;
  } else {
    $("#currentFocus").textContent = "Roadmap yakunlandi";
    $("#focusText").textContent = "Barcha tasklar bajarildi";
  }
}

function updateCounts() {
  $("#allTabCount").textContent = TASKS.length;
  ["MVP", "V2", "V3"].forEach(phase => {
    $(`#${phase.toLowerCase()}TabCount`).textContent = TASKS.filter(task => task.phase === phase).length;
  });
}

function resetFilters() {
  state.phase = "all"; state.category = "all"; state.status = "all"; state.priority = "all"; state.search = "";
  $("#searchInput").value = "";
  $("#categoryFilter").value = "all";
  $("#statusFilter").value = "all";
  $("#priorityFilter").value = "all";
  $$(".phase-tabs button").forEach(button => button.classList.toggle("active", button.dataset.phase === "all"));
  $$(".phase-summary").forEach(card => card.classList.toggle("active", card.dataset.phaseCard === "MVP"));
  renderTasks();
}

function resetProgress() {
  if (!window.confirm("Barcha task holatlarini boshlang‘ich holatga qaytarishni xohlaysizmi?")) return;
  state.statuses = {};
  localStorage.removeItem(STORAGE_KEY);
  updateAll();
  showToast("Progress boshlang‘ich holatga qaytarildi");
}

function setView(view) {
  state.view = view;
  localStorage.setItem("safesight-view", view);
  $("#taskGrid").classList.toggle("list-view", view === "list");
  $$(".view-toggle button").forEach(button => button.classList.toggle("active", button.dataset.view === view));
}

function restoreTheme() {
  const saved = localStorage.getItem("safesight-theme");
  if (saved) document.documentElement.dataset.theme = saved;
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("safesight-theme", next);
}

function exportReport() {
  const header = ["ID", "Bosqich", "Task", "Kategoriya", "Prioritet", "Holat", "Bog‘liqlik", "Taxmin"];
  const rows = TASKS.map(task => [task.id, task.phase, task.title, task.category, PRIORITY_LABELS[task.priority], STATUS_LABELS[currentStatus(task)], task.dependency, task.effort]);
  const csv = [header, ...rows].map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `safesight-roadmap-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  showToast("Roadmap hisoboti CSV formatida yuklandi");
}

function toggleMenu() {
  const open = $("#sidebar").classList.toggle("open");
  $("#mobileOverlay").classList.toggle("show", open);
  $("#menuButton").setAttribute("aria-expanded", String(open));
}

function closeMenu() {
  $("#sidebar").classList.remove("open");
  $("#mobileOverlay").classList.remove("show");
  $("#menuButton").setAttribute("aria-expanded", "false");
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

init();
