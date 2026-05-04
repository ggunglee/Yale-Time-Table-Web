const STORAGE_KEY = "yale-semester-planner:v1";
const DATA_STORAGE_KEY = "yale-semester-planner:data:v1";
const TRANSLATIONS = {
  en: {
    appTitle: "Yale Planner",
    eyebrow: "Academic Schedule Builder",
    subtitle: "Courses, PWG classes, and weekly schedule planning in one place.",
    refreshCourses: "Fetch course info",
    refreshPwg: "Fetch PWG info",
    courseSearch: "Course Search",
    pwgSearch: "PWG Course Search",
    plans: "Plans",
    year: "Year",
    semester: "Semester",
    school: "School / division",
    subject: "Subject",
    keyword: "Keyword",
    keywordClass: "Keyword / class name",
    day: "Day",
    earliestStart: "Earliest start",
    latestEnd: "Latest end",
    search: "Search",
    new: "New",
    duplicate: "Duplicate",
    delete: "Delete",
    downloadCalendar: "Download calendar file (.ics)",
    calendarHelp: "Import this file into Google Calendar, Apple Calendar, or Outlook.",
    advancedBackup: "Advanced backup",
    downloadBackup: "Download plan backup",
    restoreBackup: "Restore plan backup",
    currentPlan: "Current plan / load saved plan",
    planName: "Plan name",
    selectedItems: "Selected Items",
    weeklySchedule: "Weekly Schedule",
    academicCalendar: "Academic Calendar",
    course: "Course",
    pwg: "PWG",
    conflict: "Conflict",
    noResults: "No results yet.",
    noCache: "No cache",
    noCalendar: "No calendar",
    cached: "cached",
    events: "events",
    startupSummary: "Each launch starts from Plan A. Saved plans stay in this browser.",
    savedSummary: "{count} items saved in this candidate schedule.",
    noCalendarItems: "Academic calendar will appear here once events are available.",
    noCourses: "No course matches found. If needed, use Fetch course info first.",
    noPwg: "No PWG classes match the filters.",
    stillMissing: "Still missing a course?",
    cantFind: "Can't find it?",
    findMore: "Find More",
    add: "Add",
    addToPlan: "Add to plan",
    remove: "Remove",
    details: "Details",
    syllabus: "syllabus",
    syllabusAvailable: "available",
    syllabusMissing: "missing",
    syllabusUnknown: "needs checking",
    checkingCourses: "Checking Yale Courses...",
    checkingPwg: "Checking PWG...",
    fetching: "Fetching...",
    courseUpdated: "Course cache updated for {query}. {count} item(s) fetched.",
    noCacheChanges: "No cache changes were detected for {query}.",
    courseRefreshFailed: "Course refresh failed: {message}",
    pwgRefreshFailed: "PWG refresh failed: {message}",
    noCourseRemote: "No matching courses were found in Yale Course Search for this query.",
    addBeforeExport: "Add at least one class or PWG item before exporting.",
    noExportMeetings: "This plan does not contain any exportable scheduled meetings yet.",
    backupImported: "Plans imported successfully.",
    importFailed: "Import failed: {message}",
    importMissingPlans: "Imported file does not contain any plans.",
    detailKicker: "Yale Course Detail",
    loading: "Loading...",
    fetchingDetail: "Fetching cached detail and syllabus status...",
    detailUnavailable: "Detail unavailable",
    openSyllabus: "Open syllabus",
    syllabusStatus: "Syllabus status: {status}",
    linkedSections: "Linked / alternate sections",
    description: "Description",
    noDescription: "No description available.",
    finalExam: "Final Exam",
    schoolDetail: "School: {school} • {term} • {type}",
    meetingDetail: "Meeting: {meeting} • Instructor: {instructor}",
    staff: "Staff",
    current: "Current",
    saved: "Saved",
    earliest: "Earliest",
    latest: "Latest",
    scheduledBlocks: "scheduled blocks",
    selectedItemCount: "selected items",
  },
  ko: {
    appTitle: "예일대 에브리타임",
    eyebrow: "학업 시간표 만들기",
    subtitle: "강의, PWG 강의, 주간 시간표를 한곳에서 관리하세요.",
    refreshCourses: "강의 정보 가져오기",
    refreshPwg: "PWG 정보 가져오기",
    courseSearch: "강의 검색",
    pwgSearch: "PWG 강의 검색",
    plans: "계획표",
    year: "연도",
    semester: "학기",
    school: "학교 / 구분",
    subject: "과목 코드",
    keyword: "키워드",
    keywordClass: "키워드 / 강의명",
    day: "요일",
    earliestStart: "가장 이른 시작",
    latestEnd: "가장 늦은 종료",
    search: "검색",
    new: "새 계획표",
    duplicate: "복제",
    delete: "삭제",
    downloadCalendar: "캘린더 파일(.ics) 다운로드",
    calendarHelp: "Google Calendar, Apple Calendar, Outlook에 가져올 수 있습니다.",
    advancedBackup: "고급 백업",
    downloadBackup: "계획표 백업 다운로드",
    restoreBackup: "계획표 백업 불러오기",
    currentPlan: "현재 계획표 / 저장된 계획표",
    planName: "계획표 이름",
    selectedItems: "선택한 항목",
    weeklySchedule: "주간 시간표",
    academicCalendar: "학사 일정",
    course: "강의",
    pwg: "PWG",
    conflict: "겹침",
    noResults: "아직 결과가 없습니다.",
    noCache: "저장된 정보 없음",
    noCalendar: "일정 없음",
    cached: "개 저장됨",
    events: "개 일정",
    startupSummary: "처음에는 Plan A로 시작합니다. 저장한 계획표는 이 브라우저에 남습니다.",
    savedSummary: "{count}개 항목이 이 계획표에 저장되었습니다.",
    noCalendarItems: "학사 일정이 준비되면 여기에 표시됩니다.",
    noCourses: "일치하는 강의가 없습니다. 필요하면 강의 정보 가져오기를 눌러주세요.",
    noPwg: "조건에 맞는 PWG 강의가 없습니다.",
    stillMissing: "아직 강의가 안 보이나요?",
    cantFind: "찾는 강의가 없나요?",
    findMore: "더 찾아보기",
    add: "추가",
    addToPlan: "계획표에 추가",
    remove: "삭제",
    details: "상세",
    syllabus: "실라버스",
    syllabusAvailable: "있음",
    syllabusMissing: "없음",
    syllabusUnknown: "확인 필요",
    checkingCourses: "예일 강의 정보를 확인하는 중...",
    checkingPwg: "PWG 정보를 확인하는 중...",
    fetching: "가져오는 중...",
    courseUpdated: "{query} 강의 정보를 업데이트했습니다. {count}개를 가져왔습니다.",
    noCacheChanges: "{query}에 대한 변경 사항이 없습니다.",
    courseRefreshFailed: "강의 정보 가져오기 실패: {message}",
    pwgRefreshFailed: "PWG 정보 가져오기 실패: {message}",
    noCourseRemote: "이 검색 조건에 맞는 강의를 Yale Course Search에서 찾지 못했습니다.",
    addBeforeExport: "내보내기 전에 강의나 PWG 항목을 하나 이상 추가해주세요.",
    noExportMeetings: "이 계획표에는 캘린더로 내보낼 수 있는 시간이 없습니다.",
    backupImported: "계획표를 불러왔습니다.",
    importFailed: "불러오기 실패: {message}",
    importMissingPlans: "불러온 파일에 계획표가 없습니다.",
    detailKicker: "예일 강의 상세",
    loading: "불러오는 중...",
    fetchingDetail: "저장된 상세 정보와 실라버스 상태를 확인하는 중...",
    detailUnavailable: "상세 정보를 볼 수 없습니다",
    openSyllabus: "실라버스 열기",
    syllabusStatus: "실라버스 상태: {status}",
    linkedSections: "연결 / 대체 섹션",
    description: "설명",
    noDescription: "등록된 설명이 없습니다.",
    finalExam: "기말 시험",
    schoolDetail: "구분: {school} • {term} • {type}",
    meetingDetail: "시간: {meeting} • 교수: {instructor}",
    staff: "미정",
    current: "현재",
    saved: "저장됨",
    earliest: "가장 빠름",
    latest: "가장 늦음",
    scheduledBlocks: "개 시간 블록",
    selectedItemCount: "개 선택",
  },
  ja: { appTitle: "イェール時間割", courseSearch: "授業検索", pwgSearch: "PWG授業検索", plans: "計画表", refreshCourses: "授業情報を取得", refreshPwg: "PWG情報を取得", search: "検索", add: "追加", addToPlan: "計画表に追加", remove: "削除", details: "詳細", syllabusUnknown: "確認が必要" },
  zh: { appTitle: "耶鲁课表", courseSearch: "课程搜索", pwgSearch: "PWG课程搜索", plans: "计划表", refreshCourses: "获取课程信息", refreshPwg: "获取PWG信息", search: "搜索", add: "添加", addToPlan: "添加到计划", remove: "删除", details: "详情", syllabusUnknown: "需要确认" },
  hi: { appTitle: "येल प्लानर", courseSearch: "कोर्स खोज", pwgSearch: "PWG क्लास खोज", plans: "योजनाएं", refreshCourses: "कोर्स जानकारी लाएं", refreshPwg: "PWG जानकारी लाएं", search: "खोजें", add: "जोड़ें", addToPlan: "योजना में जोड़ें", remove: "हटाएं", details: "विवरण", syllabusUnknown: "जांच आवश्यक" },
  ur: { appTitle: "ییل پلانر", courseSearch: "کورس تلاش", pwgSearch: "PWG کلاس تلاش", plans: "منصوبے", refreshCourses: "کورس معلومات لائیں", refreshPwg: "PWG معلومات لائیں", search: "تلاش", add: "شامل کریں", addToPlan: "منصوبے میں شامل کریں", remove: "ہٹائیں", details: "تفصیل", syllabusUnknown: "تصدیق ضروری" },
  ar: { appTitle: "مخطط ييل", courseSearch: "بحث المقررات", pwgSearch: "بحث صفوف PWG", plans: "الخطط", refreshCourses: "جلب معلومات المقررات", refreshPwg: "جلب معلومات PWG", search: "بحث", add: "إضافة", addToPlan: "إضافة إلى الخطة", remove: "إزالة", details: "التفاصيل", syllabusUnknown: "يحتاج إلى تحقق" },
  fr: { appTitle: "Planificateur Yale", courseSearch: "Recherche de cours", pwgSearch: "Recherche de cours PWG", plans: "Plannings", refreshCourses: "Récupérer les cours", refreshPwg: "Récupérer PWG", search: "Rechercher", add: "Ajouter", addToPlan: "Ajouter au planning", remove: "Supprimer", details: "Détails", syllabusUnknown: "à vérifier" },
  es: { appTitle: "Planificador Yale", courseSearch: "Buscar cursos", pwgSearch: "Buscar clases PWG", plans: "Planes", refreshCourses: "Obtener cursos", refreshPwg: "Obtener PWG", search: "Buscar", add: "Añadir", addToPlan: "Añadir al plan", remove: "Quitar", details: "Detalles", syllabusUnknown: "requiere revisión" },
};
const SUPPORTED_LOCALES = Object.keys(TRANSLATIONS);
const CURRENT_LOCALE = resolveLocale();
const PX_PER_MINUTE = 2;
const DAY_KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_START_MINUTES = 7 * 60;
const DEFAULT_DAY_END_MINUTES = 18 * 60;
const UI_STATE = {
  panels: {
    course: false,
    pwg: false,
    selected: false,
  },
  expandedCourseGroups: new Set(),
  hoverPreview: null,
};

const state = {
  data: {
    calendar: null,
    pwg: null,
    courses: null,
  },
  localData: {
    pwg: null,
    courses: null,
  },
  search: {
    courseResults: [],
    pwgResults: [],
  },
  plans: [],
  currentPlanId: null,
};

const els = {
  refreshCoursesBtn: document.getElementById("refresh-courses-btn"),
  refreshPwgBtn: document.getElementById("refresh-pwg-btn"),
  planSelect: document.getElementById("plan-select"),
  planNameInput: document.getElementById("plan-name-input"),
  planSummary: document.getElementById("plan-summary"),
  newPlanBtn: document.getElementById("new-plan-btn"),
  duplicatePlanBtn: document.getElementById("duplicate-plan-btn"),
  exportPlansBtn: document.getElementById("export-plans-btn"),
  exportJsonBtn: document.getElementById("export-json-btn"),
  importPlansBtn: document.getElementById("import-plans-btn"),
  importPlansInput: document.getElementById("import-plans-input"),
  deletePlanBtn: document.getElementById("delete-plan-btn"),
  courseCacheMeta: document.getElementById("course-cache-meta"),
  pwgCacheMeta: document.getElementById("pwg-cache-meta"),
  calendarMeta: document.getElementById("calendar-meta"),
  coursePanelToggle: document.getElementById("course-panel-toggle"),
  coursePanelBody: document.getElementById("course-panel-body"),
  pwgPanelToggle: document.getElementById("pwg-panel-toggle"),
  pwgPanelBody: document.getElementById("pwg-panel-body"),
  selectedPanelToggle: document.getElementById("selected-panel-toggle"),
  selectedPanelBody: document.getElementById("selected-panel-body"),
  courseYear: document.getElementById("course-year"),
  courseSemester: document.getElementById("course-semester"),
  courseSchool: document.getElementById("course-school"),
  courseSubject: document.getElementById("course-subject"),
  courseKeyword: document.getElementById("course-keyword"),
  courseSearchBtn: document.getElementById("course-search-btn"),
  courseResults: document.getElementById("course-results"),
  pwgKeyword: document.getElementById("pwg-keyword"),
  pwgDay: document.getElementById("pwg-day"),
  pwgStart: document.getElementById("pwg-start"),
  pwgEnd: document.getElementById("pwg-end"),
  pwgSearchBtn: document.getElementById("pwg-search-btn"),
  pwgResults: document.getElementById("pwg-results"),
  calendarHighlights: document.getElementById("calendar-highlights"),
  timeAxis: document.getElementById("time-axis"),
  weekGrid: document.getElementById("week-grid"),
  timetableSummary: document.getElementById("timetable-summary"),
  selectedItems: document.getElementById("selected-items"),
  selectionCount: document.getElementById("selection-count"),
  detailModal: document.getElementById("detail-modal"),
  detailKicker: document.getElementById("detail-kicker"),
  detailTitle: document.getElementById("detail-title"),
  detailBody: document.getElementById("detail-body"),
  detailCloseBtn: document.getElementById("detail-close-btn"),
  emptyStateTemplate: document.getElementById("empty-state-template"),
};

function resolveLocale() {
  const candidates = [navigator.language, ...(navigator.languages || [])]
    .filter(Boolean)
    .map((value) => value.toLowerCase());
  for (const candidate of candidates) {
    if (candidate.startsWith("zh")) return "zh";
    if (candidate.startsWith("ur")) return "ur";
    const base = candidate.split("-")[0];
    if (SUPPORTED_LOCALES.includes(base)) return base;
  }
  return "en";
}

function t(key, values = {}) {
  const template = TRANSLATIONS[CURRENT_LOCALE]?.[key] || TRANSLATIONS.en[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => `${values[name] ?? ""}`);
}

function setText(selector, key) {
  const node = document.querySelector(selector);
  if (node) node.textContent = t(key);
}

function defaultPlan(name = "New Plan", options = {}) {
  return {
    id: crypto.randomUUID(),
    name,
    items: [],
    createdAt: new Date().toISOString(),
    isStartupDraft: Boolean(options.isStartupDraft),
  };
}

function normalizePlan(plan, fallbackName = "Imported Plan") {
  return {
    id: plan?.id || crypto.randomUUID(),
    name: `${plan?.name || fallbackName}`.trim() || fallbackName,
    items: Array.isArray(plan?.items)
      ? plan.items
          .filter((item) => item && item.kind && item.id !== undefined && item.id !== null)
          .map((item) => ({ kind: item.kind, id: `${item.id}` }))
      : [],
    createdAt: plan?.createdAt || new Date().toISOString(),
    isStartupDraft: Boolean(plan?.isStartupDraft),
  };
}

function isTemporaryBlankPlan(plan) {
  return Boolean(plan?.isStartupDraft) && !(plan?.items?.length);
}

function createStartupPlan() {
  return defaultPlan("Plan A", { isStartupDraft: true });
}

function applyTimeGridMetrics(dayEndMinutes = DEFAULT_DAY_END_MINUTES) {
  const height = (dayEndMinutes - DAY_START_MINUTES) * PX_PER_MINUTE;
  document.documentElement.style.setProperty("--day-start-minutes", `${DAY_START_MINUTES}`);
  document.documentElement.style.setProperty("--day-height", `${height}px`);
}

function loadLocalState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  let savedPlans = [];
  let savedCurrentPlanId = null;
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    savedPlans = Array.isArray(parsed?.plans)
      ? parsed.plans.map((plan) => normalizePlan(plan)).filter((plan) => !isTemporaryBlankPlan(plan))
      : [];
    savedCurrentPlanId = parsed?.currentPlanId || null;
  } catch {
    savedPlans = [];
  }

  if (savedPlans.length) {
    state.plans = savedPlans;
    state.currentPlanId = savedPlans.some((plan) => plan.id === savedCurrentPlanId)
      ? savedCurrentPlanId
      : savedPlans[0].id;
    return;
  }

  const startupPlan = createStartupPlan();
  state.plans = [startupPlan];
  state.currentPlanId = startupPlan.id;
}

function persistLocalState() {
  const persistedPlans = state.plans
    .map((plan) => normalizePlan(plan, "Plan"))
    .filter((plan) => !isTemporaryBlankPlan(plan));

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      plans: persistedPlans,
      currentPlanId: persistedPlans.some((plan) => plan.id === state.currentPlanId) ? state.currentPlanId : null,
    }),
  );
}

function mergeCourseStores(baseStore = { metadata: {}, items: [] }, updateStore = { metadata: {}, items: [] }) {
  const mergedById = new Map((baseStore.items || []).map((item) => [item.id, item]));
  for (const item of updateStore.items || []) mergedById.set(item.id, item);
  const items = [...mergedById.values()].sort((a, b) => (
    `${a.year}|${a.termCode}|${a.subject}|${a.catalogNumber}|${a.section}`.localeCompare(`${b.year}|${b.termCode}|${b.subject}|${b.catalogNumber}|${b.section}`)
  ));
  return {
    metadata: {
      ...(baseStore.metadata || {}),
      ...(updateStore.metadata || {}),
      itemCount: items.length,
      cachedSubjects: [...new Set(items.map((item) => item.subject).filter(Boolean))].sort(),
    },
    items,
  };
}

function loadLocalData() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DATA_STORAGE_KEY) || "{}");
    state.localData.courses = parsed?.courses?.items?.length ? parsed.courses : null;
    state.localData.pwg = parsed?.pwg?.items?.length ? parsed.pwg : null;
  } catch {
    state.localData.courses = null;
    state.localData.pwg = null;
  }
}

function persistLocalData() {
  localStorage.setItem(
    DATA_STORAGE_KEY,
    JSON.stringify({
      courses: state.localData.courses,
      pwg: state.localData.pwg,
    }),
  );
}

function applyBootstrapData(result) {
  state.data.calendar = result.calendar;
  state.data.courses = mergeCourseStores(result.courses || { metadata: {}, items: [] }, state.localData.courses || { metadata: {}, items: [] });
  state.data.pwg = state.localData.pwg || result.pwg;
}

function getCurrentPlan() {
  return state.plans.find((plan) => plan.id === state.currentPlanId) || state.plans[0];
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const payload = await response.json();
      if (payload?.message) message = payload.message;
      else if (payload?.error) message = payload.error;
    } catch {
      // Keep the generic HTTP message when the response body is not JSON.
    }
    throw new Error(message);
  }
  return response.json();
}

function formatTimestamp(value) {
  if (!value) {
    return "Not updated";
  }
  const date = new Date(value);
  return date.toLocaleString();
}

function setButtonBusy(button, isBusy, busyText) {
  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent;
  }
  button.disabled = isBusy;
  button.textContent = isBusy ? busyText : button.dataset.originalText;
}

function normalizeStaticCopy() {
  document.documentElement.lang = CURRENT_LOCALE;
  document.documentElement.dir = ["ar", "ur"].includes(CURRENT_LOCALE) ? "rtl" : "ltr";
  document.title = t("appTitle");
  setText(".eyebrow", "eyebrow");
  setText(".brand-mark h1", "appTitle");
  setText(".subtitle", "subtitle");
  setText("#refresh-courses-btn", "refreshCourses");
  setText("#refresh-pwg-btn", "refreshPwg");
  setText("#course-panel-toggle span", "courseSearch");
  setText("#pwg-panel-toggle span", "pwgSearch");
  setText(".sidebar .panel:nth-of-type(3) .panel-head h2", "plans");
  setText("label[for='course-year']", "year");
  setText("label[for='course-semester']", "semester");
  setText("label[for='course-school']", "school");
  setText("label[for='course-subject']", "subject");
  setText("label[for='course-keyword']", "keyword");
  setText("label[for='pwg-keyword']", "keywordClass");
  setText("label[for='pwg-day']", "day");
  setText("label[for='pwg-start']", "earliestStart");
  setText("label[for='pwg-end']", "latestEnd");
  setText("#course-search-btn", "search");
  setText("#pwg-search-btn", "search");
  setText("#new-plan-btn", "new");
  setText("#duplicate-plan-btn", "duplicate");
  setText("#delete-plan-btn", "delete");
  setText("#export-plans-btn", "downloadCalendar");
  setText(".helper-text", "calendarHelp");
  setText(".advanced-actions summary", "advancedBackup");
  setText("#export-json-btn", "downloadBackup");
  setText("#import-plans-btn", "restoreBackup");
  setText("label[for='plan-select']", "currentPlan");
  setText("label[for='plan-name-input']", "planName");
  setText("#selected-panel-toggle span", "selectedItems");
  setText(".timeline-panel .panel-head h2", "weeklySchedule");
  setText(".calendar-panel .panel-head h2", "academicCalendar");
  const legendLabels = document.querySelectorAll(".legend span");
  if (legendLabels[0]) legendLabels[0].lastChild.textContent = t("course");
  if (legendLabels[1]) legendLabels[1].lastChild.textContent = t("pwg");
  if (legendLabels[2]) legendLabels[2].lastChild.textContent = t("conflict");
  const emptyTemplateText = els.emptyStateTemplate?.content?.querySelector("p");
  if (emptyTemplateText) emptyTemplateText.textContent = t("noResults");
}

function renderMeta() {
  const courseMeta = state.data.courses?.metadata;
  const pwgMeta = state.data.pwg?.metadata;
  const calendarMeta = state.data.calendar?.metadata;

  els.courseCacheMeta.textContent = courseMeta
    ? `${courseMeta.itemCount} ${t("cached")} • ${formatTimestamp(courseMeta.lastUpdated)}`
    : t("noCache");
  els.pwgCacheMeta.textContent = pwgMeta
    ? `${pwgMeta.currentTerm || "Seed"} • ${formatTimestamp(pwgMeta.lastUpdated)}`
    : t("noCache");
  els.calendarMeta.textContent = calendarMeta
    ? `${calendarMeta.eventCount} ${t("events")} • ${formatTimestamp(calendarMeta.lastUpdated)}`
    : t("noCalendar");
}

function renderPlanControls() {
  const currentPlan = getCurrentPlan();
  els.planSelect.innerHTML = state.plans
    .map((plan) => `
      <option value="${plan.id}">
        ${escapeHtml(plan.name)}
      </option>
    `)
    .join("");
  els.planSelect.value = currentPlan.id;
  els.planNameInput.value = currentPlan.name;
  if (currentPlan.isStartupDraft) {
    els.planSummary.textContent = t("startupSummary");
    return;
  }
  els.planSummary.textContent = t("savedSummary", { count: currentPlan.items.length });
}

function renderCalendar() {
  const items = (state.data.calendar?.highlights || [])
    .slice()
    .sort((a, b) => `${a.date || ""}`.localeCompare(`${b.date || ""}`));
  els.calendarHighlights.innerHTML = "";
  if (!items.length) {
    els.calendarHighlights.appendChild(emptyState(t("noCalendarItems")));
    return;
  }

  els.calendarHighlights.innerHTML = items
    .map((item) => {
      const weekday = item.date
        ? new Date(`${item.date}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" })
        : "";
      const dateLabel = [item.dateLabel || item.date || "", weekday].filter(Boolean).join(" • ");
      return `
        <article class="calendar-card">
          <div class="tag-row">
            <span class="tag">${escapeHtml(item.term)}</span>
            <span class="tag">${escapeHtml(item.category)}</span>
          </div>
          <strong>${escapeHtml(dateLabel)}</strong>
          <div class="card-note">${escapeHtml(item.description)}</div>
        </article>
      `;
    })
    .join("");
}

function escapeHtml(value) {
  return `${value ?? ""}`
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function emptyState(message) {
  const node = els.emptyStateTemplate.content.firstElementChild.cloneNode(true);
  node.querySelector("p").textContent = message;
  return node;
}

function syllabusLabelText(value) {
  if (value === "available") return t("syllabusAvailable");
  if (value === "missing") return t("syllabusMissing");
  return t("syllabusUnknown");
}

function groupCourseResults(results) {
  const groups = new Map();

  for (const item of results) {
    const key = [item.termLabel, item.courseCode, item.title, item.schoolCode].join("|");
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        termLabel: item.termLabel,
        courseCode: item.courseCode,
        title: item.title,
        school: item.school,
        sections: [],
      });
    }
    groups.get(key).sections.push(item);
  }

  return [...groups.values()].map((group) => ({
    ...group,
    sections: group.sections.sort((a, b) => {
      const typeDiff = (a.scheduleTypeCode === "DS" ? 1 : 0) - (b.scheduleTypeCode === "DS" ? 1 : 0);
      if (typeDiff !== 0) return typeDiff;
      return `${a.section}`.localeCompare(`${b.section}`);
    }),
  }));
}

function hasMeaningfulCourseQuery() {
  const values = [
    els.courseYear?.value,
    els.courseSemester?.value,
    els.courseSchool?.value,
    els.courseSubject?.value,
    els.courseKeyword?.value,
  ];
  return values.some((value) => `${value || ""}`.trim() !== "");
}

function renderCourseFetchMoreAction(label = t("cantFind")) {
  if (!hasMeaningfulCourseQuery()) {
    return "";
  }

  return `
    <div class="result-action-row">
      <span class="card-note">${escapeHtml(label)}</span>
      <button class="small-button primary" data-action="fetch-more-courses" type="button">${escapeHtml(t("findMore"))}</button>
    </div>
  `;
}

function renderCourseResults() {
  const results = state.search.courseResults;
  const groups = groupCourseResults(results);
  if (!groups.length) {
    els.courseResults.innerHTML = "";
    els.courseResults.appendChild(emptyState(t("noCourses")));
    if (hasMeaningfulCourseQuery()) {
      els.courseResults.insertAdjacentHTML("beforeend", renderCourseFetchMoreAction(t("stillMissing")));
    }
    return;
  }

  els.courseResults.innerHTML = groups
    .map((group) => `
      <article class="result-card course">
        <div class="card-title-row">
          <button class="card-title-button" type="button" data-action="toggle-course-group" data-group-key="${escapeHtml(group.key)}" aria-expanded="${UI_STATE.expandedCourseGroups.has(group.key)}">
            <div class="card-subtitle">${escapeHtml(group.courseCode)} • ${escapeHtml(group.termLabel)}</div>
            <h3>${escapeHtml(group.title)}</h3>
            <div class="card-note">${escapeHtml(group.school)} • ${group.sections.length} section(s)</div>
          </button>
          <span class="tag">${group.sections.length} sections</span>
        </div>
        <div class="section-list ${UI_STATE.expandedCourseGroups.has(group.key) ? "" : "is-collapsed"}">
          ${group.sections.map((item) => `
            <div class="section-row">
              <div class="section-row-compact">
                <div class="card-meta">${escapeHtml(item.section)} • ${escapeHtml(item.scheduleType)} • ${escapeHtml(item.meetingSummary || "TBA")}</div>
                <div class="card-note">${escapeHtml(item.instructor || t("staff"))} • ${escapeHtml(t("syllabus"))} ${escapeHtml(syllabusLabelText(item.syllabusLabel))}</div>
              </div>
              <div class="card-actions">
                <button class="small-button primary" data-action="add-course" data-preview-kind="course" data-id="${item.id}">${escapeHtml(t("add"))}</button>
                <button class="small-button" data-action="detail-course" data-id="${item.id}">${escapeHtml(t("details"))}</button>
              </div>
            </div>
          `).join("")}
        </div>
      </article>
    `)
    .join("");
  els.courseResults.insertAdjacentHTML("beforeend", renderCourseFetchMoreAction());
  syncResultActionStates();
}

function renderPwgResults() {
  const results = state.search.pwgResults;
  if (!results.length) {
    els.pwgResults.innerHTML = "";
    els.pwgResults.appendChild(emptyState(t("noPwg")));
    return;
  }

  els.pwgResults.innerHTML = results
    .map((item) => `
      <article class="result-card pwg">
        <div class="card-title-row">
          <div>
            <div class="card-subtitle">${escapeHtml(item.term)} • ${escapeHtml(item.day)}</div>
            <h3>${escapeHtml(item.title)}</h3>
            <div class="card-meta">${escapeHtml(item.startTime)} - ${escapeHtml(item.endTime)} • ${escapeHtml(item.instructor)}</div>
            <div class="card-note">${escapeHtml(item.passEligibility)}</div>
          </div>
          <span class="tag">PWG</span>
        </div>
        <div class="card-actions">
          <button class="small-button pwg" data-action="add-pwg" data-preview-kind="pwg" data-id="${item.id}">${escapeHtml(t("addToPlan"))}</button>
        </div>
      </article>
    `)
    .join("");
  syncResultActionStates();
}

function getAllItemsById() {
  const map = new Map();
  (state.data.courses?.items || []).forEach((item) => map.set(`course:${item.id}`, { ...item, kind: "course" }));
  (state.data.pwg?.items || []).forEach((item) => map.set(`pwg:${item.id}`, { ...item, kind: "pwg" }));
  return map;
}

function currentPlanItems() {
  const map = getAllItemsById();
  const plan = getCurrentPlan();
  return plan.items
    .map((ref) => map.get(`${ref.kind}:${ref.id}`))
    .filter(Boolean);
}

function isItemInCurrentPlan(kind, id) {
  const plan = getCurrentPlan();
  const normalizedId = `${id}`;
  return plan.items.some((item) => item.kind === kind && `${item.id}` === normalizedId);
}

function syncResultActionStates() {
  [...els.courseResults.querySelectorAll("button[data-id][data-preview-kind='course']")]
    .forEach((button) => {
      if (button.dataset.action !== "add-course" && button.dataset.action !== "remove-plan-item") {
        return;
      }
      const isSelected = isItemInCurrentPlan("course", button.dataset.id);
      button.dataset.action = isSelected ? "remove-plan-item" : "add-course";
      button.dataset.kind = "course";
      button.textContent = isSelected ? t("remove") : t("add");
      button.classList.toggle("primary", !isSelected);
      button.classList.toggle("danger", isSelected);
    });

  [...els.pwgResults.querySelectorAll("button[data-id][data-preview-kind='pwg']")]
    .forEach((button) => {
      if (button.dataset.action !== "add-pwg" && button.dataset.action !== "remove-plan-item") {
        return;
      }
      const isSelected = isItemInCurrentPlan("pwg", button.dataset.id);
      button.dataset.action = isSelected ? "remove-plan-item" : "add-pwg";
      button.dataset.kind = "pwg";
      button.textContent = isSelected ? t("remove") : t("addToPlan");
      button.classList.toggle("pwg", !isSelected);
      button.classList.toggle("danger", isSelected);
    });
}

function addItemToCurrentPlan(kind, id) {
  const plan = getCurrentPlan();
  const normalizedId = `${id}`;
  const exists = plan.items.some((item) => item.kind === kind && `${item.id}` === normalizedId);
  if (exists) return;
  plan.isStartupDraft = false;
  plan.items.push({ kind, id: normalizedId });
  persistLocalState();
  syncResultActionStates();
  renderWorkspace();
  focusSelectedPanel();
}

function removeItemFromCurrentPlan(kind, id) {
  const plan = getCurrentPlan();
  const normalizedId = `${id}`;
  plan.items = plan.items.filter((item) => !(item.kind === kind && `${item.id}` === normalizedId));
  persistLocalState();
  syncResultActionStates();
  renderWorkspace();
}

function getActiveDayEndMinutes(blocks = []) {
  const latestEnd = blocks.reduce(
    (max, block) => Math.max(max, Number.isFinite(block.endMinutes) ? block.endMinutes : DAY_START_MINUTES),
    DAY_START_MINUTES,
  );

  if (latestEnd <= DEFAULT_DAY_END_MINUTES) {
    return DEFAULT_DAY_END_MINUTES;
  }

  return Math.ceil(latestEnd / 60) * 60;
}

function createTimeAxis(dayEndMinutes = DEFAULT_DAY_END_MINUTES) {
  els.timeAxis.innerHTML = "";
  for (let hour = DAY_START_MINUTES / 60; hour <= dayEndMinutes / 60; hour += 1) {
    const label = document.createElement("div");
    label.className = "time-label";
    label.style.top = `${((hour * 60) - DAY_START_MINUTES) * PX_PER_MINUTE}px`;
    const suffix = hour >= 12 ? "PM" : "AM";
    const display = hour % 12 === 0 ? 12 : hour % 12;
    label.textContent = `${display} ${suffix}`;
    els.timeAxis.appendChild(label);
  }
}

function findItem(kind, id) {
  return getAllItemsById().get(`${kind}:${id}`) || null;
}

function buildPreviewBlocks(item, dayEndMinutes = DEFAULT_DAY_END_MINUTES) {
  if (!item) return [];
  const blocks = normalizeForGrid([{ ...item, kind: item.kind || "course" }]);
  return blocks
    .map((block) => {
      const startMinutes = Math.max(block.startMinutes, DAY_START_MINUTES);
      const endMinutes = Math.min(block.endMinutes, dayEndMinutes);
      if (endMinutes <= startMinutes) {
        return null;
      }
      return {
        ...block,
        startMinutes,
        endMinutes,
      };
    })
    .filter(Boolean);
}

function layoutDayBlocks(items) {
  const sorted = [...items].sort((a, b) => a.startMinutes - b.startMinutes || a.endMinutes - b.endMinutes);
  let currentCluster = [];
  const clusters = [];

  for (const item of sorted) {
    const clusterEnd = currentCluster.reduce((max, value) => Math.max(max, value.endMinutes), -Infinity);
    if (!currentCluster.length || item.startMinutes < clusterEnd) {
      currentCluster.push(item);
    } else {
      clusters.push(currentCluster);
      currentCluster = [item];
    }
  }
  if (currentCluster.length) clusters.push(currentCluster);

  return clusters.flatMap((cluster) => {
    const laneEnds = [];
    cluster.forEach((item) => {
      let lane = laneEnds.findIndex((end) => item.startMinutes >= end);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(item.endMinutes);
      } else {
        laneEnds[lane] = item.endMinutes;
      }
      item.lane = lane;
    });
    const laneCount = Math.max(1, laneEnds.length);
    return cluster.map((item) => ({
      ...item,
      laneCount,
      hasConflict: laneCount > 1,
    }));
  });
}

function normalizeForGrid(rawItems) {
  return rawItems.flatMap((item) => {
    if (item.kind === "course") {
      const blocks = item.meetingBlocks?.length ? item.meetingBlocks : [];
      return blocks.map((block) => ({
        ...item,
        day: block.day,
        dayOrder: block.dayOrder,
        startMinutes: block.startMinutes,
        endMinutes: block.endMinutes,
        startTime: block.startTime,
        endTime: block.endTime,
      }));
    }
    return [item];
  });
}

function computePlanStats(items) {
  const gridItems = normalizeForGrid(items);
  const layouts = DAY_KEYS.flatMap((day) => layoutDayBlocks(gridItems.filter((item) => item.day === day)));
  const conflicts = layouts.filter((item) => item.hasConflict).length;
  const starts = layouts.map((item) => item.startMinutes);
  const ends = layouts.map((item) => item.endMinutes);

  return {
    total: items.length,
    scheduledBlocks: layouts.length,
    conflicts,
    earliest: starts.length ? minutesToClock(Math.min(...starts)) : "None",
    latest: ends.length ? minutesToClock(Math.max(...ends)) : "None",
  };
}

function minutesToClock(minutes) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function renderTimetable() {
  const items = currentPlanItems();
  const blocks = normalizeForGrid(items);
  const rawPreviewBlocks = UI_STATE.hoverPreview
    ? normalizeForGrid([{ ...UI_STATE.hoverPreview, kind: UI_STATE.hoverPreview.kind || "course" }])
    : [];
  const dayEndMinutes = getActiveDayEndMinutes([...blocks, ...rawPreviewBlocks]);
  applyTimeGridMetrics(dayEndMinutes);
  createTimeAxis(dayEndMinutes);
  const previewBlocks = buildPreviewBlocks(UI_STATE.hoverPreview, dayEndMinutes);
  els.weekGrid.innerHTML = DAY_KEYS.map((day) => `<div class="day-column" data-day="${day}"></div>`).join("");
  const dayColumns = new Map([...els.weekGrid.querySelectorAll(".day-column")].map((node) => [node.dataset.day, node]));

  DAY_KEYS.forEach((day) => {
    const layouts = layoutDayBlocks(blocks.filter((item) => item.day === day));
    const column = dayColumns.get(day);
    layouts.forEach((block) => {
      const node = document.createElement("button");
      node.type = "button";
      node.className = `time-block ${block.kind} ${block.hasConflict ? "conflict" : ""}`;
      node.style.top = `${(block.startMinutes - DAY_START_MINUTES) * PX_PER_MINUTE}px`;
      node.style.height = `${Math.max(26, (block.endMinutes - block.startMinutes) * PX_PER_MINUTE)}px`;
      node.style.width = `calc(${100 / block.laneCount}% - 8px)`;
      node.style.left = `calc(${(100 / block.laneCount) * block.lane}% + 4px)`;
      node.dataset.kind = block.kind;
      node.dataset.id = block.id;
      node.innerHTML = `
        <div class="time-block-title">${escapeHtml(block.kind === "course" ? block.courseCode : block.title)}</div>
        <div>${escapeHtml(block.kind === "course" ? block.title : `${block.startTime} - ${block.endTime}`)}</div>
        <div>${escapeHtml(block.startTime)} - ${escapeHtml(block.endTime)}</div>
        <div>${escapeHtml(block.location || block.instructor || "")}</div>
      `;
      node.addEventListener("click", () => {
        if (block.kind === "course") {
          openCourseDetail(block.id);
        }
      });
      column.appendChild(node);
    });

    previewBlocks
      .filter((block) => block.day === day)
      .forEach((block) => {
        const node = document.createElement("div");
        node.className = `time-block ${block.kind} preview`;
        node.style.top = `${(block.startMinutes - DAY_START_MINUTES) * PX_PER_MINUTE}px`;
        node.style.height = `${Math.max(26, (block.endMinutes - block.startMinutes) * PX_PER_MINUTE)}px`;
        node.style.width = "calc(100% - 8px)";
        node.style.left = "4px";
        node.innerHTML = `
          <div class="time-block-title">${escapeHtml(block.kind === "course" ? block.courseCode : block.title)}</div>
          <div>${escapeHtml(block.startTime)} - ${escapeHtml(block.endTime)}</div>
        `;
        column.appendChild(node);
      });
  });

  const stats = computePlanStats(items);
  els.timetableSummary.innerHTML = `
    <span class="summary-pill">${stats.total} ${escapeHtml(t("selectedItemCount"))}</span>
    <span class="summary-pill">${stats.scheduledBlocks} ${escapeHtml(t("scheduledBlocks"))}</span>
    <span class="summary-pill ${stats.conflicts ? "conflict" : ""}">${stats.conflicts} ${escapeHtml(t("conflict"))}</span>
    <span class="summary-pill">${escapeHtml(t("earliest"))} ${stats.earliest}</span>
    <span class="summary-pill">${escapeHtml(t("latest"))} ${stats.latest}</span>
  `;
}

function renderSelectedItems() {
  const items = currentPlanItems();
  els.selectionCount.textContent = `${items.length} ${t("selectedItemCount")}`;
  if (!items.length) {
    els.selectedItems.innerHTML = "";
    els.selectedItems.appendChild(emptyState(t("noResults")));
    return;
  }

  els.selectedItems.innerHTML = items
    .map((item) => `
      <article class="selected-card">
        <div class="tag-row">
          <span class="tag">${escapeHtml(item.kind)}</span>
          <span class="tag">${escapeHtml(item.kind === "course" ? item.termLabel : item.term)}</span>
          ${item.linkedCrns?.length ? `<span class="tag">linked ${item.linkedCrns.length}</span>` : ""}
        </div>
        <strong>${escapeHtml(item.kind === "course" ? `${item.courseCode} ${item.section}` : item.title)}</strong>
        <div class="card-meta">${escapeHtml(item.kind === "course" ? item.title : item.instructor)}</div>
        <div class="card-note">${escapeHtml(item.meetingSummary || `${item.day} ${item.startTime} - ${item.endTime}`)}</div>
        <div class="card-actions">
          ${item.kind === "course" ? `<button class="small-button" data-action="detail-course" data-id="${item.id}">${escapeHtml(t("details"))}</button>` : ""}
          <button class="small-button danger" data-action="remove-plan-item" data-kind="${item.kind}" data-id="${item.id}">${escapeHtml(t("remove"))}</button>
        </div>
      </article>
    `)
    .join("");
}

function renderComparison() {
  if (!els.comparisonList) return;

  if (!state.plans.length) {
    els.comparisonList.innerHTML = "";
    els.comparisonList.appendChild(emptyState("No saved plans yet."));
    return;
  }

  els.comparisonList.innerHTML = state.plans
    .map((plan) => {
      const items = plan.items
        .map((ref) => getAllItemsById().get(`${ref.kind}:${ref.id}`))
        .filter(Boolean);
      const stats = computePlanStats(items);
      const isCurrent = plan.id === state.currentPlanId;
      return `
        <article class="comparison-card">
          <div class="tag-row">
            <span class="tag">${isCurrent ? "Current" : "Saved"}</span>
            <span class="tag ${stats.conflicts ? "conflict" : ""}">${stats.conflicts} conflicts</span>
          </div>
          <strong>${escapeHtml(plan.name)}</strong>
          <div class="card-note">${stats.total} items • earliest ${stats.earliest} • latest ${stats.latest}</div>
          <div class="card-actions">
            <button class="small-button primary" data-action="switch-plan" data-id="${plan.id}">Open</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderWorkspace() {
  renderPlanControls();
  renderTimetable();
  renderSelectedItems();
  syncResultActionStates();
}

function renderPanelState() {
  const mappings = [
    { key: "course", toggle: els.coursePanelToggle, body: els.coursePanelBody },
    { key: "pwg", toggle: els.pwgPanelToggle, body: els.pwgPanelBody },
    { key: "selected", toggle: els.selectedPanelToggle, body: els.selectedPanelBody },
  ];

  mappings.forEach(({ key, toggle, body }) => {
    const isOpen = UI_STATE.panels[key];
    if (!toggle || !body) return;
    toggle.setAttribute("aria-expanded", `${isOpen}`);
    body.classList.toggle("is-collapsed", !isOpen);
  });
}

function focusSelectedPanel() {
  UI_STATE.panels.course = false;
  UI_STATE.panels.pwg = false;
  UI_STATE.panels.selected = true;
  renderPanelState();
}

function togglePanel(key) {
  if (key === "course" || key === "pwg") {
    const nextValue = !UI_STATE.panels[key];
    UI_STATE.panels.course = false;
    UI_STATE.panels.pwg = false;
    UI_STATE.panels[key] = nextValue;
  } else {
    UI_STATE.panels[key] = !UI_STATE.panels[key];
  }
  renderPanelState();
}

function handleSearchFieldKeydown(event) {
  if (event.key !== "Enter") {
    return;
  }

  const target = event.currentTarget;
  if (target === els.courseKeyword || target === els.courseSubject) {
    event.preventDefault();
    runCourseSearch();
    return;
  }

  if (target === els.pwgKeyword) {
    event.preventDefault();
    runPwgSearch();
  }
}

function searchLocalCourses(query) {
  let items = [...(state.data.courses?.items || [])];
  if (query.year) items = items.filter((item) => `${item.year}` === `${query.year}`);
  if (query.semester) items = items.filter((item) => `${item.semester}` === `${query.semester}`);
  if (query.school) {
    const value = `${query.school}`.toLowerCase();
    items = items.filter((item) => `${item.school}`.toLowerCase().includes(value) || `${item.schoolCode}`.toLowerCase().includes(value));
  }
  if (query.subject) {
    const value = `${query.subject}`.toLowerCase();
    items = items.filter((item) => `${item.subject}`.toLowerCase().includes(value));
  }
  if (query.keyword) {
    const value = `${query.keyword}`.toLowerCase();
    items = items.filter((item) => `${item.keywordBlob}`.toLowerCase().includes(value));
  }
  return items.sort((a, b) => `${a.year}|${a.termCode}|${a.subject}|${a.catalogNumber}|${a.section}|${a.meetingBlocks?.[0]?.dayOrder ?? 99}`.localeCompare(`${b.year}|${b.termCode}|${b.subject}|${b.catalogNumber}|${b.section}|${b.meetingBlocks?.[0]?.dayOrder ?? 99}`));
}

function searchLocalPwg(query) {
  let items = [...(state.data.pwg?.items || [])];
  if (query.keyword) {
    const value = `${query.keyword}`.toLowerCase();
    items = items.filter((item) => `${item.keywordBlob}`.toLowerCase().includes(value));
  }
  if (query.day) items = items.filter((item) => item.day === query.day);
  if (query.startMinutes) items = items.filter((item) => item.endMinutes >= Number(query.startMinutes));
  if (query.endMinutes) items = items.filter((item) => item.startMinutes <= Number(query.endMinutes));
  return items.sort((a, b) => `${a.dayOrder}|${a.startMinutes}|${a.title}`.localeCompare(`${b.dayOrder}|${b.startMinutes}|${b.title}`));
}

async function runCourseSearch() {
  const payload = {
    year: els.courseYear.value,
    semester: els.courseSemester.value,
    school: els.courseSchool.value,
    subject: els.courseSubject.value,
    keyword: els.courseKeyword.value,
  };

  state.search.courseResults = searchLocalCourses(payload);
  renderCourseResults();

  const hasMeaningfulQuery = Object.values(payload).some((value) => `${value || ""}`.trim() !== "");
  if (state.search.courseResults.length || !hasMeaningfulQuery || runCourseSearch.skipAutoFetchOnce) {
    runCourseSearch.skipAutoFetchOnce = false;
    return;
  }

  const shouldFetch = window.confirm(
    `${t("noCourses")}\n\n${t("findMore")}?`,
  );

  if (!shouldFetch) {
    return;
  }

  setButtonBusy(els.refreshCoursesBtn, true, t("fetching"));
  try {
    const result = await fetchJson("/api/update/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const fetchedStore = result.fetchedStore || result.store;
    state.localData.courses = mergeCourseStores(state.localData.courses || { metadata: {}, items: [] }, fetchedStore);
    state.data.courses = mergeCourseStores(state.data.courses, fetchedStore);
    persistLocalData();
    renderMeta();
    runCourseSearch.skipAutoFetchOnce = true;
    await runCourseSearch();
    if (!state.search.courseResults.length) {
      alert(t("noCourseRemote"));
    }
  } finally {
    setButtonBusy(els.refreshCoursesBtn, false);
  }
}

async function runPwgSearch() {
  const query = {
    keyword: els.pwgKeyword.value,
    day: els.pwgDay.value,
    startMinutes: els.pwgStart.value ? timeInputToMinutes(els.pwgStart.value) : "",
    endMinutes: els.pwgEnd.value ? timeInputToMinutes(els.pwgEnd.value) : "",
  };
  state.search.pwgResults = searchLocalPwg(query);
  renderPwgResults();
}

function timeInputToMinutes(value) {
  const [hour, minute] = value.split(":").map(Number);
  return (hour * 60) + minute;
}

async function bootstrap() {
  loadLocalState();
  loadLocalData();
  normalizeStaticCopy();
  applyTimeGridMetrics();
  createTimeAxis();

  const result = await fetchJson("/api/bootstrap");
  applyBootstrapData(result);

  renderMeta();
  renderCalendar();
  renderPanelState();
  renderWorkspace();
  await runCourseSearch();
  await runPwgSearch();
}

function renameCurrentPlan(name) {
  const plan = getCurrentPlan();
  plan.name = name.trim() || plan.name;
  plan.isStartupDraft = false;
  persistLocalState();
  renderWorkspace();
}

function createPlan() {
  const savedPlanCount = state.plans.filter((plan) => !plan.isStartupDraft).length;
  const plan = defaultPlan(`Plan ${String.fromCharCode(65 + savedPlanCount)}`);
  state.plans.push(plan);
  state.currentPlanId = plan.id;
  persistLocalState();
  renderWorkspace();
}

function duplicatePlan() {
  const current = getCurrentPlan();
  const plan = {
    ...structuredClone(current),
    id: crypto.randomUUID(),
    name: `${current.name} Copy`,
    createdAt: new Date().toISOString(),
  };
  state.plans.push(plan);
  state.currentPlanId = plan.id;
  persistLocalState();
  renderWorkspace();
}

function deletePlan() {
  if (state.plans.length === 1) {
    return;
  }
  state.plans = state.plans.filter((plan) => plan.id !== state.currentPlanId);
  state.currentPlanId = state.plans[0].id;
  persistLocalState();
  renderWorkspace();
}

function downloadTextFile(contents, filename, type = "text/plain;charset=utf-8") {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function padIcsNumber(value) {
  return String(value).padStart(2, "0");
}

function sanitizeFileName(value) {
  return `${value || "yale-time-table"}`
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]+/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

function escapeIcsText(value) {
  return `${value || ""}`
    .replaceAll("\\", "\\\\")
    .replaceAll("\r\n", "\\n")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function formatIcsLocalDateTime(date) {
  return [
    date.getFullYear(),
    padIcsNumber(date.getMonth() + 1),
    padIcsNumber(date.getDate()),
    "T",
    padIcsNumber(date.getHours()),
    padIcsNumber(date.getMinutes()),
    padIcsNumber(date.getSeconds()),
  ].join("");
}

function formatIcsUtcTimestamp(date) {
  return `${date.getUTCFullYear()}${padIcsNumber(date.getUTCMonth() + 1)}${padIcsNumber(date.getUTCDate())}T${padIcsNumber(date.getUTCHours())}${padIcsNumber(date.getUTCMinutes())}${padIcsNumber(date.getUTCSeconds())}Z`;
}

function parseIsoDate(value) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function buildDateTimeOnDay(date, minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, mins, 0);
}

function getDateOnlyValue(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function getDayNumber(day) {
  return DAY_KEYS.indexOf(day);
}

function getIcsByDay(day) {
  const map = {
    Mon: "MO",
    Tue: "TU",
    Wed: "WE",
    Thu: "TH",
    Fri: "FR",
    Sat: "SA",
    Sun: "SU",
  };
  return map[day] || null;
}

function nextMatchingDay(startDate, targetDay) {
  const result = new Date(startDate.getTime());
  const offset = (targetDay - result.getDay() + 7) % 7;
  result.setDate(result.getDate() + offset);
  return result;
}

function inferTermRange(termLabel) {
  const normalized = `${termLabel || ""}`.trim();
  const exactCourseDates = (state.data.courses?.items || [])
    .filter((item) => item.termLabel === normalized && item.startDate && item.endDate)
    .map((item) => ({
      start: parseIsoDate(item.startDate),
      end: parseIsoDate(item.endDate),
    }))
    .filter((item) => item.start && item.end);

  if (exactCourseDates.length) {
    return {
      start: new Date(Math.min(...exactCourseDates.map((item) => item.start.getTime()))),
      end: new Date(Math.max(...exactCourseDates.map((item) => item.end.getTime()))),
    };
  }

  const match = /^(Spring|Fall)\s+(\d{4})$/i.exec(normalized);
  if (!match) {
    return null;
  }

  const year = Number(match[2]);
  if (match[1].toLowerCase() === "spring") {
    return { start: new Date(year, 0, 15), end: new Date(year, 4, 15) };
  }
  return { start: new Date(year, 8, 1), end: new Date(year, 11, 20) };
}

function foldIcsLine(line) {
  const maxLength = 75;
  if (line.length <= maxLength) {
    return line;
  }
  const chunks = [];
  let cursor = 0;
  while (cursor < line.length) {
    chunks.push(line.slice(cursor, cursor + maxLength));
    cursor += maxLength;
  }
  return chunks.join("\r\n ");
}

function buildIcsEventLines(item, schedule) {
  const summary = item.kind === "course"
    ? `${item.courseCode} ${item.section} - ${item.title}`
    : `${item.title} - PWG`;
  const descriptionParts = [];
  if (item.kind === "course") {
    descriptionParts.push(item.title);
    descriptionParts.push(`Instructor: ${item.instructor || "Staff"}`);
    descriptionParts.push(`Term: ${item.termLabel}`);
    if (item.meetingSummary) {
      descriptionParts.push(`Meeting: ${item.meetingSummary}`);
    }
  } else {
    descriptionParts.push(`Instructor: ${item.instructor || "Staff"}`);
    descriptionParts.push(`Term: ${item.term}`);
    if (item.passEligibility) {
      descriptionParts.push(`Pass: ${item.passEligibility}`);
    }
  }

  const uid = `${item.kind}-${item.id}-${schedule.day}-${schedule.startMinutes}@yale-time-table`;
  const lines = [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsUtcTimestamp(new Date())}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(descriptionParts.join("\n"))}`,
    `DTSTART;TZID=America/New_York:${formatIcsLocalDateTime(schedule.startDateTime)}`,
    `DTEND;TZID=America/New_York:${formatIcsLocalDateTime(schedule.endDateTime)}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${schedule.byDay};COUNT=${schedule.occurrenceCount}`,
  ];

  if (item.location) {
    lines.push(`LOCATION:${escapeIcsText(item.location)}`);
  }

  lines.push("END:VEVENT");
  return lines;
}

function buildIcsSchedulesForItem(item) {
  if (item.kind === "course") {
    const termStart = parseIsoDate(item.startDate);
    const termEnd = parseIsoDate(item.endDate);
    if (!termStart || !termEnd || !item.meetingBlocks?.length) {
      return [];
    }

    return item.meetingBlocks
      .map((block) => {
        const targetDay = getDayNumber(block.day);
        const byDay = getIcsByDay(block.day);
        if (targetDay === -1 || !byDay) {
          return null;
        }
        const firstDate = nextMatchingDay(termStart, targetDay === 6 ? 0 : targetDay + 1);
        if (firstDate > termEnd) {
          return null;
        }
        return {
          day: block.day,
          startMinutes: block.startMinutes,
          startDateTime: buildDateTimeOnDay(firstDate, block.startMinutes),
          endDateTime: buildDateTimeOnDay(firstDate, block.endMinutes),
          byDay,
          occurrenceCount: Math.floor((getDateOnlyValue(termEnd) - getDateOnlyValue(firstDate)) / (7 * 24 * 60 * 60 * 1000)) + 1,
        };
      })
      .filter((item) => item && item.occurrenceCount > 0);
  }

  const targetDay = getDayNumber(item.day);
  const byDay = getIcsByDay(item.day);
  const termRange = inferTermRange(item.term);
  if (targetDay === -1 || !byDay || !termRange) {
    return [];
  }

  const firstDate = nextMatchingDay(termRange.start, targetDay === 6 ? 0 : targetDay + 1);
  if (firstDate > termRange.end) {
    return [];
  }

  return [{
    day: item.day,
    startMinutes: item.startMinutes,
    startDateTime: buildDateTimeOnDay(firstDate, item.startMinutes),
    endDateTime: buildDateTimeOnDay(firstDate, item.endMinutes),
    byDay,
    occurrenceCount: Math.floor((getDateOnlyValue(termRange.end) - getDateOnlyValue(firstDate)) / (7 * 24 * 60 * 60 * 1000)) + 1,
  }];
}

function exportPlans() {
  const currentPlan = getCurrentPlan();
  const items = currentPlanItems();
  if (!items.length) {
    alert(t("addBeforeExport"));
    return;
  }

  const eventLines = items.flatMap((item) => (
    buildIcsSchedulesForItem(item).flatMap((schedule) => buildIcsEventLines(item, schedule))
  ));

  if (!eventLines.length) {
    alert(t("noExportMeetings"));
    return;
  }

  const contents = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Yale Time Table//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:America/New_York",
    "X-LIC-LOCATION:America/New_York",
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:-0500",
    "TZOFFSETTO:-0400",
    "TZNAME:EDT",
    "DTSTART:19700308T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:-0400",
    "TZOFFSETTO:-0500",
    "TZNAME:EST",
    "DTSTART:19701101T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
    "X-WR-CALNAME:" + escapeIcsText(currentPlan.name),
    ...eventLines,
    "END:VCALENDAR",
  ]
    .map(foldIcsLine)
    .join("\r\n");

  downloadTextFile(contents, `${sanitizeFileName(currentPlan.name)}.ics`, "text/calendar;charset=utf-8");
}

function exportPlansJson() {
  const payload = {
    exportedAt: new Date().toISOString(),
    plans: state.plans,
    currentPlanId: state.currentPlanId,
  };
  downloadTextFile(JSON.stringify(payload, null, 2), "yale-semester-plans.json", "application/json");
}

async function importPlans(file) {
  const raw = await file.text();
  const parsed = JSON.parse(raw);
  if (!parsed?.plans?.length) {
    throw new Error(t("importMissingPlans"));
  }
  const importedPlans = parsed.plans.map((plan, index) => normalizePlan(plan, `Imported Plan ${index + 1}`));
  const existingPlans = state.plans.filter((plan) => !plan.isStartupDraft);
  state.plans = [createStartupPlan(), ...existingPlans, ...importedPlans];
  state.currentPlanId = importedPlans[0].id;
  persistLocalState();
  renderWorkspace();
}

async function openCourseDetail(id) {
  els.detailKicker.textContent = t("detailKicker");
  els.detailTitle.textContent = t("loading");
  els.detailBody.innerHTML = `<div class="status-line">${escapeHtml(t("fetchingDetail"))}</div>`;
  els.detailModal.showModal();

  try {
    const course = state.data.courses?.items?.find((item) => item.id === id);
    const detail = await fetchJson("/api/course/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, course }),
    });
    els.detailTitle.textContent = `${detail.courseCode} • ${detail.title}`;

    const syllabusBlock = detail.syllabusUrl
      ? `<p><a class="small-button primary" href="${detail.syllabusUrl}" target="_blank" rel="noreferrer">${escapeHtml(t("openSyllabus"))}</a></p>`
      : `<div class="status-line">${escapeHtml(t("syllabusStatus", { status: syllabusLabelText(detail.syllabusLabel) }))}</div>`;

    const linkedSections = detail.linkedSections?.length
      ? `
        <h4>${escapeHtml(t("linkedSections"))}</h4>
        <ul>
          ${detail.linkedSections.map((section) => `
            <li>${escapeHtml(section.section)} • ${escapeHtml(section.scheduleType)} • ${escapeHtml(section.meetingSummary)}</li>
          `).join("")}
        </ul>
      `
      : "";

    els.detailBody.innerHTML = `
      <div class="status-line">${escapeHtml(t("schoolDetail", { school: detail.school, term: detail.termLabel, type: detail.scheduleType }))}</div>
      <div class="status-line">${escapeHtml(t("meetingDetail", { meeting: detail.meetingSummary, instructor: detail.instructor || t("staff") }))}</div>
      ${syllabusBlock}
      <h4>${escapeHtml(t("description"))}</h4>
      <p>${escapeHtml(detail.descriptionText || t("noDescription"))}</p>
      ${linkedSections}
      ${detail.finalExam ? `<h4>${escapeHtml(t("finalExam"))}</h4><p>${escapeHtml(detail.finalExam)}</p>` : ""}
    `;

    if (state.data.courses) {
      const target = state.data.courses.items.find((item) => item.id === id);
      if (target) {
        target.syllabusStatus = detail.syllabusStatus;
        target.syllabusLabel = detail.syllabusLabel;
        target.syllabusUrl = detail.syllabusUrl;
        target.detailFetched = true;
      }
      if (state.localData.courses) {
        const localTarget = state.localData.courses.items.find((item) => item.id === id);
        if (localTarget) {
          localTarget.syllabusStatus = detail.syllabusStatus;
          localTarget.syllabusLabel = detail.syllabusLabel;
          localTarget.syllabusUrl = detail.syllabusUrl;
          localTarget.detailFetched = true;
          persistLocalData();
        }
      }
      renderCourseResults();
      renderSelectedItems();
    }
  } catch (error) {
    els.detailTitle.textContent = t("detailUnavailable");
    els.detailBody.innerHTML = `<div class="status-line alert">${escapeHtml(error.message)}</div>`;
  }
}

async function refreshCourseCache() {
  setButtonBusy(els.refreshCoursesBtn, true, t("checkingCourses"));
  try {
    const payload = {
      year: els.courseYear.value,
      semester: els.courseSemester.value,
      school: els.courseSchool.value,
      subject: els.courseSubject.value,
      keyword: els.courseKeyword.value,
    };
    const result = await fetchJson("/api/update/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const fetchedStore = result.fetchedStore || result.store;
    state.localData.courses = mergeCourseStores(state.localData.courses || { metadata: {}, items: [] }, fetchedStore);
    state.data.courses = mergeCourseStores(state.data.courses, fetchedStore);
    persistLocalData();
    renderMeta();
    await runCourseSearch();
    renderWorkspace();
    alert(
      result.status === "updated"
        ? t("courseUpdated", { query: result.query, count: result.fetchedItemCount })
        : t("noCacheChanges", { query: result.query }),
    );
  } catch (error) {
    alert(t("courseRefreshFailed", { message: error.message }));
  } finally {
    setButtonBusy(els.refreshCoursesBtn, false);
  }
}

async function refreshPwgCache() {
  setButtonBusy(els.refreshPwgBtn, true, t("checkingPwg"));
  try {
    const result = await fetchJson("/api/update/pwg", { method: "POST" });
    if (result.status === "updated") {
      state.localData.pwg = result.store;
      state.data.pwg = result.store;
      persistLocalData();
      renderMeta();
      await runPwgSearch();
      renderWorkspace();
    }
    alert(result.message);
  } catch (error) {
    alert(t("pwgRefreshFailed", { message: error.message }));
  } finally {
    setButtonBusy(els.refreshPwgBtn, false);
  }
}

function bindEvents() {
  els.courseSearchBtn.addEventListener("click", runCourseSearch);
  els.pwgSearchBtn.addEventListener("click", runPwgSearch);
  els.refreshCoursesBtn.addEventListener("click", refreshCourseCache);
  els.refreshPwgBtn.addEventListener("click", refreshPwgCache);
  els.planSelect.addEventListener("change", (event) => {
    state.currentPlanId = event.target.value;
    persistLocalState();
    renderWorkspace();
  });
  els.planNameInput.addEventListener("change", (event) => renameCurrentPlan(event.target.value));
  els.newPlanBtn.addEventListener("click", createPlan);
  els.duplicatePlanBtn.addEventListener("click", duplicatePlan);
  els.exportPlansBtn.addEventListener("click", exportPlans);
  els.exportJsonBtn.addEventListener("click", exportPlansJson);
  els.importPlansBtn.addEventListener("click", () => els.importPlansInput.click());
  els.importPlansInput.addEventListener("change", async (event) => {
    const [file] = event.target.files || [];
    if (!file) return;
    try {
      await importPlans(file);
      alert(t("backupImported"));
    } catch (error) {
      alert(t("importFailed", { message: error.message }));
    } finally {
      event.target.value = "";
    }
  });
  els.deletePlanBtn.addEventListener("click", deletePlan);
  els.detailCloseBtn.addEventListener("click", () => els.detailModal.close());
  els.coursePanelToggle.addEventListener("click", () => togglePanel("course"));
  els.pwgPanelToggle.addEventListener("click", () => togglePanel("pwg"));
  els.selectedPanelToggle.addEventListener("click", () => togglePanel("selected"));
  els.courseKeyword.addEventListener("keydown", handleSearchFieldKeydown);
  els.courseSubject.addEventListener("keydown", handleSearchFieldKeydown);
  els.pwgKeyword.addEventListener("keydown", handleSearchFieldKeydown);
  els.courseResults.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    const action = button.dataset.action;
    if (action === "add-course") {
      addItemToCurrentPlan("course", button.dataset.id);
      return;
    }
    if (action === "remove-plan-item") {
      removeItemFromCurrentPlan(button.dataset.kind || "course", button.dataset.id);
      focusSelectedPanel();
      return;
    }
    if (action === "detail-course") {
      openCourseDetail(button.dataset.id);
      return;
    }
    if (action === "fetch-more-courses") {
      refreshCourseCache();
      return;
    }
    if (action === "toggle-course-group") {
      const key = button.dataset.groupKey;
      if (UI_STATE.expandedCourseGroups.has(key)) {
        UI_STATE.expandedCourseGroups.delete(key);
      } else {
        UI_STATE.expandedCourseGroups.add(key);
      }
      renderCourseResults();
    }
  });
  els.pwgResults.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    if (button.dataset.action === "add-pwg") {
      addItemToCurrentPlan("pwg", button.dataset.id);
      return;
    }
    if (button.dataset.action === "remove-plan-item") {
      removeItemFromCurrentPlan(button.dataset.kind || "pwg", button.dataset.id);
      focusSelectedPanel();
    }
  });

  document.body.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    if (action === "remove-plan-item") removeItemFromCurrentPlan(button.dataset.kind, button.dataset.id);
    if (action === "switch-plan") {
      state.currentPlanId = button.dataset.id;
      persistLocalState();
      renderWorkspace();
    }
  });

  document.body.addEventListener("mouseover", (event) => {
    const button = event.target.closest("button[data-preview-kind]");
    if (!button) return;
    const from = event.relatedTarget;
    if (from && button.contains(from)) {
      return;
    }
    UI_STATE.hoverPreview = findItem(button.dataset.previewKind, button.dataset.id);
    renderTimetable();
  });

  document.body.addEventListener("mouseout", (event) => {
    const button = event.target.closest("button[data-preview-kind]");
    if (!button) return;
    const nextTarget = event.relatedTarget;
    if (nextTarget && button.contains(nextTarget)) {
      return;
    }
    UI_STATE.hoverPreview = null;
    renderTimetable();
  });
}

bindEvents();
bootstrap().catch((error) => {
  console.error(error);
  alert(`Bootstrap failed: ${error.message}`);
});
