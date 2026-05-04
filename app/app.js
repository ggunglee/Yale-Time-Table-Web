const STORAGE_KEY = "yale-semester-planner:v1";
const DATA_STORAGE_KEY = "yale-semester-planner:data:v1";
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
  document.title = "Yale Planner";
  if (els.refreshCoursesBtn) {
    els.refreshCoursesBtn.textContent = "Refresh Courses";
  }
  if (els.refreshPwgBtn) {
    els.refreshPwgBtn.textContent = "Refresh PWG";
  }
}

function renderMeta() {
  const courseMeta = state.data.courses?.metadata;
  const pwgMeta = state.data.pwg?.metadata;
  const calendarMeta = state.data.calendar?.metadata;

  els.courseCacheMeta.textContent = courseMeta
    ? `${courseMeta.itemCount} cached • ${formatTimestamp(courseMeta.lastUpdated)}`
    : "No cache";
  els.pwgCacheMeta.textContent = pwgMeta
    ? `${pwgMeta.currentTerm || "Seed"} • ${formatTimestamp(pwgMeta.lastUpdated)}`
    : "No cache";
  els.calendarMeta.textContent = calendarMeta
    ? `${calendarMeta.eventCount} events • ${formatTimestamp(calendarMeta.lastUpdated)}`
    : "No calendar";
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
    els.planSummary.textContent = "Each launch starts from Plan A. Use this menu or Load JSON if you want to bring in an older plan.";
    return;
  }
  els.planSummary.textContent = `${currentPlan.items.length} items saved in this candidate schedule.`;
}

function renderCalendar() {
  const items = (state.data.calendar?.highlights || [])
    .slice()
    .sort((a, b) => `${a.date || ""}`.localeCompare(`${b.date || ""}`));
  els.calendarHighlights.innerHTML = "";
  if (!items.length) {
    els.calendarHighlights.appendChild(emptyState("Academic calendar will appear here once events are available."));
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
  switch (value) {
    case "available":
      return "있음";
    case "missing":
      return "없음";
    default:
      return "확인 필요";
  }
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

function renderCourseFetchMoreAction(label = "Can't find it?") {
  if (!hasMeaningfulCourseQuery()) {
    return "";
  }

  return `
    <div class="result-action-row">
      <span class="card-note">${escapeHtml(label)}</span>
      <button class="small-button primary" data-action="fetch-more-courses" type="button">Find More</button>
    </div>
  `;
}

function renderCourseResults() {
  const results = state.search.courseResults;
  const groups = groupCourseResults(results);
  if (!groups.length) {
    els.courseResults.innerHTML = "";
    els.courseResults.appendChild(emptyState("No course matches found. If needed, use Refresh Courses first."));
    if (hasMeaningfulCourseQuery()) {
      els.courseResults.insertAdjacentHTML("beforeend", renderCourseFetchMoreAction("Still missing a course?"));
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
                <div class="card-note">${escapeHtml(item.instructor || "Staff")} • syllabus ${escapeHtml(syllabusLabelText(item.syllabusLabel))}</div>
              </div>
              <div class="card-actions">
                <button class="small-button primary" data-action="add-course" data-preview-kind="course" data-id="${item.id}">Add</button>
                <button class="small-button" data-action="detail-course" data-id="${item.id}">Details</button>
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
    els.pwgResults.appendChild(emptyState("No PWG classes match the filters."));
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
          <button class="small-button pwg" data-action="add-pwg" data-preview-kind="pwg" data-id="${item.id}">Add to plan</button>
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
      button.textContent = isSelected ? "Remove" : "Add";
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
      button.textContent = isSelected ? "Remove" : "Add to plan";
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
    <span class="summary-pill">${stats.total} selected items</span>
    <span class="summary-pill">${stats.scheduledBlocks} scheduled blocks</span>
    <span class="summary-pill ${stats.conflicts ? "conflict" : ""}">${stats.conflicts} conflicts</span>
    <span class="summary-pill">Earliest ${stats.earliest}</span>
    <span class="summary-pill">Latest ${stats.latest}</span>
  `;
}

function renderSelectedItems() {
  const items = currentPlanItems();
  els.selectionCount.textContent = `${items.length} items`;
  if (!items.length) {
    els.selectedItems.innerHTML = "";
    els.selectedItems.appendChild(emptyState("Start adding Yale courses and PWG classes."));
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
          ${item.kind === "course" ? `<button class="small-button" data-action="detail-course" data-id="${item.id}">Details</button>` : ""}
          <button class="small-button danger" data-action="remove-plan-item" data-kind="${item.kind}" data-id="${item.id}">Remove</button>
        </div>
      </article>
    `)
    .join("");
}

function renderComparison() {
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
  renderComparison();
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
    "This course is not in the current local cache.\n\nWould you like to fetch it now from Yale Course Search?",
  );

  if (!shouldFetch) {
    return;
  }

  setButtonBusy(els.refreshCoursesBtn, true, "Fetching...");
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
      alert("No matching courses were found in Yale Course Search for this query.");
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
    alert("Add at least one class or PWG item before exporting.");
    return;
  }

  const eventLines = items.flatMap((item) => (
    buildIcsSchedulesForItem(item).flatMap((schedule) => buildIcsEventLines(item, schedule))
  ));

  if (!eventLines.length) {
    alert("This plan does not contain any exportable scheduled meetings yet.");
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
    throw new Error("Imported file does not contain any plans.");
  }
  const importedPlans = parsed.plans.map((plan, index) => normalizePlan(plan, `Imported Plan ${index + 1}`));
  const existingPlans = state.plans.filter((plan) => !plan.isStartupDraft);
  state.plans = [createStartupPlan(), ...existingPlans, ...importedPlans];
  state.currentPlanId = importedPlans[0].id;
  persistLocalState();
  renderWorkspace();
}

async function openCourseDetail(id) {
  els.detailKicker.textContent = "Yale Course Detail";
  els.detailTitle.textContent = "Loading...";
  els.detailBody.innerHTML = `<div class="status-line">Fetching cached detail and syllabus status...</div>`;
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
      ? `<p><a class="small-button primary" href="${detail.syllabusUrl}" target="_blank" rel="noreferrer">Open syllabus</a></p>`
      : `<div class="status-line">Syllabus status: ${escapeHtml(syllabusLabelText(detail.syllabusLabel))}</div>`;

    const linkedSections = detail.linkedSections?.length
      ? `
        <h4>Linked / alternate sections</h4>
        <ul>
          ${detail.linkedSections.map((section) => `
            <li>${escapeHtml(section.section)} • ${escapeHtml(section.scheduleType)} • ${escapeHtml(section.meetingSummary)}</li>
          `).join("")}
        </ul>
      `
      : "";

    els.detailBody.innerHTML = `
      <div class="status-line">School: ${escapeHtml(detail.school)} • ${escapeHtml(detail.termLabel)} • ${escapeHtml(detail.scheduleType)}</div>
      <div class="status-line">Meeting: ${escapeHtml(detail.meetingSummary)} • Instructor: ${escapeHtml(detail.instructor)}</div>
      ${syllabusBlock}
      <h4>Description</h4>
      <p>${escapeHtml(detail.descriptionText || "No description available.")}</p>
      ${linkedSections}
      ${detail.finalExam ? `<h4>Final Exam</h4><p>${escapeHtml(detail.finalExam)}</p>` : ""}
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
    els.detailTitle.textContent = "Detail unavailable";
    els.detailBody.innerHTML = `<div class="status-line alert">${escapeHtml(error.message)}</div>`;
  }
}

async function refreshCourseCache() {
  setButtonBusy(els.refreshCoursesBtn, true, "Checking Yale Courses...");
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
        ? `Course cache updated for ${result.query}. ${result.fetchedItemCount} item(s) fetched.`
        : `No cache changes were detected for ${result.query}.`,
    );
  } catch (error) {
    alert(`Course refresh failed: ${error.message}`);
  } finally {
    setButtonBusy(els.refreshCoursesBtn, false);
  }
}

async function refreshPwgCache() {
  setButtonBusy(els.refreshPwgBtn, true, "Checking PWG...");
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
    alert(`PWG refresh failed: ${error.message}`);
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
      alert("Plans imported successfully.");
    } catch (error) {
      alert(`Import failed: ${error.message}`);
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
