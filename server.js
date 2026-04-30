import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8420);
const app = express();

const appDir = path.join(__dirname, "app");
const storageDir = path.join(__dirname, "storage");
const calendarSourcePath = path.join(__dirname, "YALE CALENDAR.txt");
const pwgSourcePath = path.join(__dirname, "SPRING 2026 PWG.txt");
const calendarStorePath = path.join(storageDir, "academic-calendar.json");
const pwgStorePath = path.join(storageDir, "pwg.json");
const courseStorePath = path.join(storageDir, "courses.json");
const courseDetailStorePath = path.join(storageDir, "course-details.json");

const termConfigs = [];
for (let year = 2024; year <= 2028; year += 1) {
  termConfigs.push({ code: `${year}01`, label: `Spring ${year}`, semester: "Spring", year });
  termConfigs.push({ code: `${year}03`, label: `Fall ${year}`, semester: "Fall", year });
}

function ensureDirectory(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function loadJsonFile(targetPath, fallback) {
  if (!fs.existsSync(targetPath)) return fallback;
  const raw = fs.readFileSync(targetPath, "utf8").replace(/^\uFEFF/, "");
  if (!raw.trim()) return fallback;
  return JSON.parse(raw);
}

function saveJsonFile(targetPath, value) {
  fs.writeFileSync(targetPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function isoTimestamp() {
  return new Date().toISOString();
}

function decodeHtml(value = "") {
  return `${value}`
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function normalizeWhitespace(value = "") {
  return decodeHtml(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function dayLabel(label = "") {
  const value = label.trim();
  if (/^Mon/i.test(value)) return "Mon";
  if (/^Tue/i.test(value)) return "Tue";
  if (/^Wed/i.test(value)) return "Wed";
  if (/^Thu/i.test(value)) return "Thu";
  if (/^Fri/i.test(value)) return "Fri";
  if (/^Sat/i.test(value)) return "Sat";
  if (/^Sun/i.test(value)) return "Sun";
  return value;
}

function dayOrder(day) {
  const index = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(day);
  return index === -1 ? 99 : index;
}

function timeTextToMinutes(value = "") {
  const clean = `${value}`.toLowerCase().trim().replace(/\s+/g, "");
  if (!clean) return null;
  let match = clean.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/);
  if (match) {
    let hour = Number(match[1]);
    const minute = match[2] ? Number(match[2]) : 0;
    if (match[3] === "am" && hour === 12) hour = 0;
    if (match[3] === "pm" && hour < 12) hour += 12;
    return hour * 60 + minute;
  }
  match = clean.match(/^(\d{1,2})(\d{2})$/);
  if (match) return Number(match[1]) * 60 + Number(match[2]);
  return null;
}

function minutesToLabel(minutes) {
  if (minutes === null || minutes === undefined) return "";
  const total = Number(minutes);
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function parseTimeRange(value = "") {
  const normalized = normalizeWhitespace(value);
  const match = normalized.match(/(.+?)\s*-\s*(.+)/);
  if (!match) return null;
  let startRaw = match[1].trim();
  const endRaw = match[2].trim();
  const meridiem = endRaw.match(/(am|pm)$/i)?.[1] || "";
  if (!/(am|pm)$/i.test(startRaw) && meridiem) startRaw = `${startRaw}${meridiem}`;
  const start = timeTextToMinutes(startRaw);
  const end = timeTextToMinutes(endRaw);
  if (start === null || end === null) return null;
  return { start, end, startLabel: minutesToLabel(start), endLabel: minutesToLabel(end) };
}

function semesterYearFromLabel(termLabel = "") {
  const match = `${termLabel}`.match(/(Fall|Spring|Summer)\s+(\d{4})/);
  return {
    semester: match?.[1] || null,
    year: match ? Number(match[2]) : null,
  };
}

function courseSchoolName(schoolCode = "", subject = "") {
  const map = {
    GB: "Jackson School of Global Affairs",
    GS: "Graduate School of Arts and Sciences",
    YC: "Yale College",
    MG: "Yale School of Management",
    LW: "Yale Law School",
  };
  if (map[schoolCode]) return map[schoolCode];
  if (subject === "GLBL") return "Jackson School of Global Affairs";
  return schoolCode || "Unknown";
}

function courseSearchFilters({ school = "", subject = "", keyword = "" }) {
  let resolvedSubject = `${subject || ""}`.trim().toUpperCase();
  const resolvedKeyword = `${keyword || ""}`.trim();
  const resolvedSchool = `${school || ""}`.trim();

  if (!resolvedSubject && !resolvedKeyword && resolvedSchool) {
    const schoolLower = resolvedSchool.toLowerCase();
    if (schoolLower.includes("jackson") || schoolLower.includes("global")) resolvedSubject = "GLBL";
    else if (resolvedSchool === "MG") resolvedSubject = "MGT";
  }
  if (!resolvedSubject && !resolvedKeyword && !resolvedSchool) resolvedSubject = "GLBL";
  return { school: resolvedSchool, subject: resolvedSubject, keyword: resolvedKeyword };
}

function scheduleTypeLabel(code = "") {
  return {
    H: "Lecture",
    L: "Seminar",
    DS: "Discussion/Lab",
    S: "Standard",
    F: "Independent Study",
  }[code] || code;
}

function categorizeCalendarEvent(description = "") {
  const value = description.toLowerCase();
  if (/classes begin/.test(value)) return "classes_begin";
  if (/classes end/.test(value)) return "classes_end";
  if (/final examinations begin|final examinations end|reading period/.test(value)) return "finals_period";
  if (/recess/.test(value)) return "recess";
  if (/labor day|martin luther king|holiday|classes do not meet/.test(value)) return "holiday";
  if (/monday classes meet instead|friday classes do not meet/.test(value)) return "special_schedule_day";
  if (/registration|add\/drop/.test(value)) return "registration";
  return "academic_deadline";
}

function parseCalendarDate(monthDay, year) {
  const parsed = new Date(`${monthDay.replace(".", "")} ${year} 00:00:00 UTC`);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}

function parseAcademicCalendarSource() {
  const raw = fs.readFileSync(calendarSourcePath, "utf8");
  const events = [];
  let term = "";

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^(FALL|SPRING|SUMMER)\s+\d{4}$/.test(trimmed)) {
      term = trimmed;
      continue;
    }
    if (/^(Date|Term Calendar)/.test(trimmed)) continue;

    const match = trimmed.match(/^([A-Z][a-z]{2,}\.?\s+\d{1,2})\s+([A-Za-z]{1,2})\s+(.+)$/);
    if (!match) continue;
    const termMeta = semesterYearFromLabel(term);
    const date = termMeta.year ? parseCalendarDate(match[1], termMeta.year) : "";
    const description = match[3].trim();
    events.push({
      id: date ? `${term}|${date}|${events.length}` : `${term}|${events.length}`,
      term,
      date,
      dateLabel: match[1],
      dayCode: match[2],
      description,
      category: categorizeCalendarEvent(description),
    });
  }

  const highlightCategories = new Set(["classes_begin", "classes_end", "finals_period", "holiday", "recess", "special_schedule_day"]);
  return {
    metadata: {
      source: "YALE CALENDAR.txt",
      seedType: "local_text_seed",
      lastUpdated: isoTimestamp(),
      eventCount: events.length,
    },
    highlights: events.filter((event) => highlightCategories.has(event.category)),
    items: events,
  };
}

function parsePwgSeedSource() {
  const lines = fs.readFileSync(pwgSourcePath, "utf8").split(/\r?\n/);
  const items = [];
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "Day\tTime\tClass\tInstructor\tPass Eligibility") continue;
    if (/^(Mondays|Tuesdays|Wednesdays|Thursdays|Fridays|Saturdays|Sundays)\s+/.test(trimmed)) {
      const parts = trimmed.split("\t");
      if (parts.length < 5) continue;
      const time = parseTimeRange(parts[1]);
      if (!time) continue;
      const title = parts[2].replace("(Link is external)", "").trim();
      const passEligibility = parts.slice(4).join(" ").replace(/\s+/g, " ").trim();
      current = {
        id: `pwg-seed-${items.length}`,
        sourceId: `local-seed-${items.length}`,
        term: "Spring 2026",
        day: dayLabel(parts[0]),
        dayOrder: dayOrder(dayLabel(parts[0])),
        title,
        instructor: parts[3].trim(),
        startTime: time.startLabel,
        endTime: time.endLabel,
        startMinutes: time.start,
        endMinutes: time.end,
        passEligibility,
        passEligibilityParts: passEligibility.split(",").map((part) => part.trim()).filter(Boolean),
        keywordBlob: `${title} ${parts[3]} ${passEligibility}`.replace(/\s+/g, " ").trim(),
        externalUrl: null,
      };
      items.push(current);
    } else if (current) {
      current.passEligibility = `${current.passEligibility} ${trimmed}`.replace(/\s+/g, " ").trim();
      current.passEligibilityParts = current.passEligibility.split(",").map((part) => part.trim()).filter(Boolean);
      current.keywordBlob = `${current.title} ${current.instructor} ${current.passEligibility}`.replace(/\s+/g, " ").trim();
    }
  }

  return {
    metadata: {
      source: "SPRING 2026 PWG.txt",
      seedType: "local_text_seed",
      currentTerm: "Spring 2026",
      lastUpdated: isoTimestamp(),
      itemCount: items.length,
    },
    items,
  };
}

function parsePwgTableFromHtml(html, currentTerm) {
  const decoded = decodeHtml(html);
  const rows = decoded.matchAll(/<tr>\s*<th>(?<day>[^<]+)<\/th>\s*<th>(?<time>[\s\S]*?)<\/th>\s*<td><a href="(?<href>[^"]+)">(?<title>[^<]+)<\/a><\/td>\s*<td>(?<instructor>[\s\S]*?)<\/td>\s*<td>(?<pass>[\s\S]*?)<\/td>\s*<\/tr>/gi);
  const items = [];
  for (const row of rows) {
    const time = parseTimeRange(row.groups.time);
    if (!time) continue;
    const title = normalizeWhitespace(row.groups.title);
    const instructor = normalizeWhitespace(row.groups.instructor);
    const passEligibility = normalizeWhitespace(row.groups.pass);
    const day = dayLabel(row.groups.day);
    items.push({
      id: `pwg-remote-${items.length}`,
      sourceId: `remote-${items.length}`,
      term: currentTerm,
      day,
      dayOrder: dayOrder(day),
      title,
      instructor,
      startTime: time.startLabel,
      endTime: time.endLabel,
      startMinutes: time.start,
      endMinutes: time.end,
      passEligibility,
      passEligibilityParts: passEligibility.split(",").map((part) => part.trim()).filter(Boolean),
      keywordBlob: `${title} ${instructor} ${passEligibility}`.replace(/\s+/g, " ").trim(),
      externalUrl: normalizeWhitespace(row.groups.href),
    });
  }
  return items;
}

function ensureStorage() {
  ensureDirectory(storageDir);
  if (!fs.existsSync(calendarStorePath)) saveJsonFile(calendarStorePath, parseAcademicCalendarSource());
  if (!fs.existsSync(pwgStorePath)) saveJsonFile(pwgStorePath, parsePwgSeedSource());
  if (!fs.existsSync(courseStorePath)) {
    saveJsonFile(courseStorePath, {
      metadata: {
        source: "Yale Course Search",
        scope: "Jackson School of Global Affairs (GLBL)",
        lastUpdated: null,
        status: "bootstrap_pending",
        termLabels: [],
        itemCount: 0,
        notes: ["Initial local cache has not been created yet."],
      },
      items: [],
    });
  }
  if (!fs.existsSync(courseDetailStorePath)) saveJsonFile(courseDetailStorePath, { items: [] });
}

async function yaleCourseApi(route, body, query = {}) {
  const url = new URL("https://courses.yale.edu/api/");
  url.searchParams.set("page", "fose");
  url.searchParams.set("route", route);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Yale-Time-Table/1.0",
      "Referer": "https://courses.yale.edu/",
    },
    body: encodeURIComponent(JSON.stringify(body)),
  });
  if (!response.ok) throw new Error(`Yale Course API failed: ${response.status}`);
  const text = await response.text();
  if (!text.trim()) {
    throw new Error(`Yale Course API returned an empty response for ${route}. Try again later or use cached data.`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Yale Course API returned non-JSON data for ${route}: ${text.slice(0, 120)}`);
  }
}

async function searchYaleCourses(termCode, school, subject, keyword) {
  const criteria = [];
  const query = { srcdb: termCode };
  if (school) {
    criteria.push({ field: "col", value: school });
    query.col = school;
  }
  if (subject) {
    criteria.push({ field: "subject", value: subject });
    query.subject = subject;
  }
  if (keyword) {
    criteria.push({ field: "keyword", value: keyword });
    query.keyword = keyword;
  }
  if (!criteria.length) return [];
  const parsed = await yaleCourseApi("search", { criteria, other: { srcdb: termCode } }, query);
  return Array.isArray(parsed.results) ? parsed.results : [];
}

function meetingDay(dayValue) {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][Number(dayValue)] || null;
}

function parseCourseCode(code = "") {
  const match = `${code}`.match(/^([A-Z&]+)\s+(.+)$/);
  return { subject: match?.[1] || "", number: match?.[2] || "" };
}

function normalizeCourseResult(result, termLabel) {
  const termMeta = semesterYearFromLabel(termLabel);
  const codeParts = parseCourseCode(result.code);
  let meetingTimes = [];
  try {
    meetingTimes = result.meetingTimes ? JSON.parse(result.meetingTimes) : [];
  } catch {
    meetingTimes = [];
  }
  const meetingBlocks = meetingTimes
    .map((meeting) => {
      const day = meetingDay(meeting.meet_day);
      const start = timeTextToMinutes(meeting.start_time);
      const end = timeTextToMinutes(meeting.end_time);
      if (!day || start === null || end === null) return null;
      return {
        day,
        dayOrder: dayOrder(day),
        startMinutes: start,
        endMinutes: end,
        startTime: minutesToLabel(start),
        endTime: minutesToLabel(end),
      };
    })
    .filter(Boolean);
  const school = courseSchoolName(result.col, codeParts.subject);
  return {
    id: `${result.srcdb}|${result.crn}`,
    crn: `${result.crn}`,
    key: `${result.key}`,
    courseCode: `${result.code}`,
    subject: codeParts.subject,
    department: codeParts.subject,
    catalogNumber: codeParts.number,
    title: `${result.title}`,
    section: `${result.no}`,
    scheduleTypeCode: `${result.schd}`,
    scheduleType: scheduleTypeLabel(result.schd),
    schoolCode: `${result.col}`,
    school,
    termCode: `${result.srcdb}`,
    termLabel,
    semester: termMeta.semester,
    year: termMeta.year,
    instructor: `${result.instr}`,
    meetingSummary: `${result.meets}`,
    meetingBlocks,
    startDate: `${result.start_date}`,
    endDate: `${result.end_date}`,
    linkedCrns: `${result.linked_crns || ""}`.split(",").map((item) => item.trim()).filter(Boolean),
    changeHash: `${result.changehash}`,
    status: { A: "open", F: "full", C: "cancelled" }[result.stat] || "unknown",
    statusCode: `${result.stat}`,
    syllabusStatus: "unknown",
    syllabusUrl: null,
    syllabusLabel: "unknown",
    location: null,
    source: "yale_course_search",
    detailFetched: false,
    keywordBlob: `${result.code} ${result.title} ${result.instr} ${termLabel} ${school}`.replace(/\s+/g, " ").trim(),
  };
}

function getTermLabelFromCode(code) {
  return termConfigs.find((term) => term.code === code)?.label || code;
}

function repairCourseTermMetadata(course) {
  if (!course) return course;
  course.termLabel ||= getTermLabelFromCode(`${course.termCode}`);
  const termMeta = semesterYearFromLabel(course.termLabel);
  course.semester ||= termMeta.semester;
  course.year ||= termMeta.year;
  course.school ||= courseSchoolName(`${course.schoolCode}`, `${course.subject}`);
  course.keywordBlob ||= [course.courseCode, course.title, course.instructor, course.termLabel, course.school].join(" ").replace(/\s+/g, " ").trim();
  return course;
}

function selectTermConfigs({ term, year, semester }) {
  let matches = [...termConfigs];
  if (term) matches = matches.filter((item) => item.code === term || item.label === term);
  if (year) matches = matches.filter((item) => `${item.year}` === `${year}`);
  if (semester) matches = matches.filter((item) => item.semester === semester);
  return matches.length ? matches : termConfigs;
}

function getCourseStore() {
  return loadJsonFile(courseStorePath, { metadata: {}, items: [] });
}

function getCourseDetailStore() {
  const store = loadJsonFile(courseDetailStorePath, { items: [] });
  if (!Array.isArray(store.items)) store.items = Object.values(store.items || {});
  return store;
}

function objectHash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value ?? null)).digest("hex");
}

async function updateCourseCache({ term, year, semester, school, subject, keyword }) {
  const existingStore = getCourseStore();
  const filters = courseSearchFilters({ school, subject, keyword });
  const matchingTerms = selectTermConfigs({ term, year, semester });
  const fetchedItems = [];

  for (const termConfig of matchingTerms) {
    const results = await searchYaleCourses(termConfig.code, filters.school, filters.subject, filters.keyword);
    for (const item of results) fetchedItems.push(normalizeCourseResult(item, termConfig.label));
  }

  const mergedById = new Map((existingStore.items || []).map((item) => [item.id, item]));
  for (const item of fetchedItems) mergedById.set(item.id, item);
  const mergedItems = [...mergedById.values()].sort((a, b) => (
    `${a.year}|${a.termCode}|${a.subject}|${a.catalogNumber}|${a.section}`.localeCompare(`${b.year}|${b.termCode}|${b.subject}|${b.catalogNumber}|${b.section}`)
  ));
  const status = objectHash(mergedItems) === objectHash(existingStore.items) && fetchedItems.length > 0 ? "no_changes" : "updated";
  const querySummary = [];
  if (filters.subject) querySummary.push(`subject:${filters.subject}`);
  if (filters.keyword) querySummary.push(`keyword:${filters.keyword}`);
  if (filters.school) querySummary.push(`school:${filters.school}`);
  if (year) querySummary.push(`year:${year}`);
  if (semester) querySummary.push(`semester:${semester}`);
  if (!querySummary.length) querySummary.push("subject:GLBL");
  const notes = [
    "Course cache grows only when you press the update button.",
    "Use the current search fields before refresh to cache subjects like PLSC or HIST.",
    "Syllabus status is fetched lazily when a course is opened.",
  ];
  const store = {
    metadata: {
      source: "Yale Course Search",
      scope: "Manual cached Yale Course Search results",
      lastUpdated: isoTimestamp(),
      status,
      termLabels: matchingTerms.map((item) => item.label),
      itemCount: mergedItems.length,
      lastQuery: querySummary.join(", "),
      cachedSubjects: [...new Set(mergedItems.map((item) => item.subject))].sort(),
      notes,
    },
    items: mergedItems,
  };
  saveJsonFile(courseStorePath, store);
  return {
    status,
    updated: status === "updated",
    fetchedItemCount: fetchedItems.length,
    totalItemCount: mergedItems.length,
    lastUpdated: store.metadata.lastUpdated,
    query: store.metadata.lastQuery,
    notes,
  };
}

function searchCourses(query) {
  const store = getCourseStore();
  let items = (store.items || []).map(repairCourseTermMetadata);
  if (query.term) items = items.filter((item) => `${item.termCode}` === `${query.term}` || `${item.termLabel}` === `${query.term}`);
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
  items.sort((a, b) => `${a.year}|${a.termCode}|${a.subject}|${a.catalogNumber}|${a.section}|${a.meetingBlocks?.[0]?.dayOrder ?? 99}`.localeCompare(`${b.year}|${b.termCode}|${b.subject}|${b.catalogNumber}|${b.section}|${b.meetingBlocks?.[0]?.dayOrder ?? 99}`));
  return { metadata: store.metadata, count: items.length, items };
}

function searchPwg(query) {
  const store = loadJsonFile(pwgStorePath, { metadata: {}, items: [] });
  let items = store.items || [];
  if (query.keyword) {
    const value = `${query.keyword}`.toLowerCase();
    items = items.filter((item) => `${item.keywordBlob}`.toLowerCase().includes(value));
  }
  if (query.day) items = items.filter((item) => item.day === query.day);
  if (query.startMinutes) items = items.filter((item) => item.endMinutes >= Number(query.startMinutes));
  if (query.endMinutes) items = items.filter((item) => item.startMinutes <= Number(query.endMinutes));
  items = [...items].sort((a, b) => `${a.dayOrder}|${a.startMinutes}|${a.title}`.localeCompare(`${b.dayOrder}|${b.startMinutes}|${b.title}`));
  return { metadata: store.metadata, count: items.length, items };
}

async function updatePwgCache() {
  const response = await fetch("https://recreation.yale.edu/fitness-wellness-programs/group-fitness-classes");
  if (!response.ok) throw new Error(`PWG page failed: ${response.status}`);
  const html = await response.text();
  const remoteTerm = html.match(/Group Fitness Classes:\s*((?:Spring|Fall)\s+20\d{2})/i)?.[1];
  if (!remoteTerm) {
    return { status: "failed", message: "Could not detect the PWG group fitness term." };
  }
  if (remoteTerm !== "Fall 2026") {
    return {
      status: "no_update",
      currentRemoteTerm: remoteTerm,
      message: "Fall 2026 has not been published yet. Spring 2026 seed data remains active.",
    };
  }
  const items = parsePwgTableFromHtml(html, remoteTerm);
  const store = {
    metadata: {
      source: "Yale Campus Recreation",
      seedType: "remote_refresh",
      currentTerm: remoteTerm,
      lastUpdated: isoTimestamp(),
      itemCount: items.length,
    },
    items,
  };
  saveJsonFile(pwgStorePath, store);
  return {
    status: "updated",
    currentRemoteTerm: remoteTerm,
    itemCount: items.length,
    lastUpdated: store.metadata.lastUpdated,
    message: "Fall 2026 PWG schedule was found and stored locally.",
  };
}

function extractSyllabusInfo(resourcesHtml = "") {
  const decoded = decodeHtml(resourcesHtml);
  const match = decoded.match(/href="(?<url>[^"]+)"[^>]*>\s*SYLLABUS\s*</i);
  if (match) return { status: "available", label: "available", url: match.groups.url };
  return { status: "missing", label: "missing", url: null };
}

async function getCourseDetail(id) {
  const detailStore = getCourseDetailStore();
  const existing = detailStore.items.find((item) => item.id === id);
  if (existing) return existing;

  const courseStore = getCourseStore();
  const course = (courseStore.items || []).find((item) => item.id === id);
  if (!course) {
    const error = new Error(`Course not found: ${id}`);
    error.status = 404;
    throw error;
  }

  const detailResponse = await yaleCourseApi("details", {
    group: `code:${course.courseCode}`,
    key: `crn:${course.crn}`,
    matched: `crn:${course.crn}`,
    srcdb: course.termCode,
  });
  const syllabus = extractSyllabusInfo(detailResponse.resources);
  const linkedSections = (detailResponse.allInGroup || []).map((section) => ({
    crn: `${section.crn}`,
    section: `${section.no}`,
    title: `${section.title}`,
    scheduleType: scheduleTypeLabel(section.schd),
    meetingSummary: `${section.meets}`,
  }));
  const detail = {
    id,
    courseCode: course.courseCode,
    title: course.title,
    section: course.section,
    meetingSummary: course.meetingSummary,
    scheduleType: course.scheduleType,
    instructor: course.instructor,
    school: course.school,
    termLabel: course.termLabel,
    descriptionHtml: detailResponse.description,
    descriptionText: normalizeWhitespace(detailResponse.description),
    attributesHtml: detailResponse.ci_attrs,
    instructorHtml: detailResponse.instructordetail_html,
    meetingHtml: detailResponse.meeting_html,
    syllabusStatus: syllabus.status,
    syllabusLabel: syllabus.label,
    syllabusUrl: syllabus.url,
    finalExam: normalizeWhitespace(detailResponse.final_exam),
    linkedSections,
    updatedAt: isoTimestamp(),
  };
  detailStore.items = detailStore.items.filter((item) => item.id !== id).concat(detail);
  saveJsonFile(courseDetailStorePath, detailStore);

  for (const item of courseStore.items || []) {
    if (item.id === id) {
      item.syllabusStatus = detail.syllabusStatus;
      item.syllabusLabel = detail.syllabusLabel;
      item.syllabusUrl = detail.syllabusUrl;
      item.detailFetched = true;
    }
  }
  saveJsonFile(courseStorePath, courseStore);
  return detail;
}

ensureStorage();

app.use(express.json({ limit: "1mb" }));
app.use(express.static(appDir));
app.use("/app", express.static(appDir));

app.get("/api/bootstrap", (_req, res) => {
  res.json({
    calendar: loadJsonFile(calendarStorePath, null),
    pwg: loadJsonFile(pwgStorePath, null),
    courses: getCourseStore(),
  });
});

app.get("/api/search/courses", (req, res) => {
  res.json(searchCourses(req.query));
});

app.get("/api/search/pwg", (req, res) => {
  res.json(searchPwg(req.query));
});

app.post("/api/update/pwg", async (_req, res, next) => {
  try {
    res.json(await updatePwgCache());
  } catch (error) {
    next(error);
  }
});

app.post("/api/update/courses", async (req, res, next) => {
  try {
    res.json(await updateCourseCache(req.body || {}));
  } catch (error) {
    next(error);
  }
});

app.get("/api/course/details", async (req, res, next) => {
  try {
    if (!req.query.id) return res.status(400).json({ error: "Missing course id." });
    return res.json(await getCourseDetail(`${req.query.id}`));
  } catch (error) {
    return next(error);
  }
});

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  return res.sendFile(path.join(appDir, "index.html"));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: "Server error",
    type: error.name,
    message: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`Yale Time Table web server is running on port ${PORT}`);
});
