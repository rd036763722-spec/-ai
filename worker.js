var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
// worker.js
var worker_default = {
async fetch(request, env, ctx) {
const GROQ_KEY = env.GROQ_KEY || "";
const YEMOT_TOKEN = env.YEMOT_TOKEN || "";
const url = new URL(request.url);
const params = Object.fromEntries(url.searchParams.entries());
console.log([${(/* @__PURE__ */ new Date()).toISOString()}] Request: ${request.url});
if (env.USER_MEMORY) {
try {
const logEntry = JSON.stringify({ ts: (/* @__PURE__ / new Date()).toISOString(), url: request.url, method: request.method, params });
await env.USER_MEMORY.put("last_request", logEntry, { expirationTtl: 3600 });
} catch (_) {
}
}
if (params.debug === "last") {
if (env.USER_MEMORY) {
const lastReq = await env.USER_MEMORY.get("last_request");
return new Response(lastReq || "no request logged yet", { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } });
}
return new Response("KV not available", { status: 200 });
}
if (params.hangup === "yes") {
return new Response("ok", { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
const callerPhone = params.ApiPhone || params.phone || params.Phone || "";
if (callerPhone && env.USER_MEMORY) {
try {
const reminderKey = reminder_${callerPhone};
const reminderRaw = await env.USER_MEMORY.get(reminderKey);
if (reminderRaw) {
const reminder = JSON.parse(reminderRaw);
const now = / @__PURE__ / new Date();
const reminderTime = new Date(reminder.fireAt);
if (now >= reminderTime) {
await env.USER_MEMORY.delete(reminderKey);
const msg = encodeURIComponent(reminder.message || "\u05E9\u05DC\u05D5\u05DD! \u05D6\u05D5\u05D4\u05D9 \u05EA\u05D6\u05DB\u05D5\u05E8\u05EA \u05E9\u05D1\u05D9\u05E7\u05E9\u05EA");
await fetch(https://www.call2all.co.il/ym/api/SendTTS?token=${YEMOT_TOKEN}&phones=${callerPhone}&message=${msg}, { headers: { "User-Agent": "Mozilla/5.0" } });
}
}
} catch () {
}
}
let rawPath = params.link || params.file_path || params.RecordingPath || params.val || params["000"] || params["api_000"] || "";
if (!rawPath) {
for (const [k, v] of Object.entries(params)) {
if (typeof v === "string" && (v.includes(".wav") || v.includes(".opus"))) {
rawPath = v;
break;
}
}
}
if (!rawPath || !rawPath.trim()) {
return textResponse("id_list_message=t-\u05D0\u05E0\u05D0 \u05D0\u05DE\u05D5\u05E8 \u05D0\u05EA \u05D4\u05E9\u05D0\u05DC\u05D4 \u05D1\u05E7\u05D5\u05DC \u05E8\u05DD");
}
try {
let p = rawPath.trim();
while (p.startsWith("ivr2:") || p.startsWith("/")) {
if (p.startsWith("ivr2:")) p = p.substring(5);
if (p.startsWith("/")) p = p.substring(1);
}
const downloadUrl = https://www.call2all.co.il/ym/api/DownloadFile?token=${YEMOT_TOKEN}&path=ivr2:${p};
console.log([${(/* @__PURE__ */ new Date()).toISOString()}] Yemot Download: ${downloadUrl});
const audioRes = await fetch(downloadUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
if (!audioRes.ok) return textResponse("id_list_message=t-\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D4\u05D5\u05E8\u05D3\u05EA \u05D4\u05D4\u05E7\u05DC\u05D8\u05D4");
const audioBlob = await audioRes.blob();
console.log([${(/* @__PURE__ */ new Date()).toISOString()}] Audio: ${audioBlob.size} bytes, type: ${audioBlob.type});
const formData = new FormData();
formData.append("file", audioBlob, "recording.wav");
formData.append("model", "whisper-large-v3-turbo");
formData.append("language", "he");
formData.append("temperature", "0");
formData.append("prompt", "\u05E9\u05D9\u05D7\u05D4 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA. \u05D4\u05DE\u05E9\u05EA\u05DE\u05E9 \u05E9\u05D5\u05D0\u05DC \u05E9\u05D0\u05DC\u05D5\u05EA \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA. \u05DE\u05D9\u05DC\u05D9\u05DD \u05E0\u05E4\u05D5\u05E6\u05D5\u05EA: \u05DE\u05D4 \u05D4\u05E9\u05E2\u05D4, \u05DE\u05D4 \u05D4\u05EA\u05D0\u05E8\u05D9\u05DA, \u05DE\u05D6\u05D2 \u05D0\u05D5\u05D5\u05D9\u05E8, \u05D7\u05D3\u05E9\u05D5\u05EA, \u05D4\u05DC\u05DB\u05D4, \u05E9\u05D5\u05DC\u05D7\u05DF \u05E2\u05E8\u05D5\u05DA, \u05E8\u05DE\u05D1\u05DD, \u05E9\u05E7\u05D9\u05E2\u05D4, \u05D6\u05E8\u05D9\u05D7\u05D4, \u05E7\u05E8\u05D9\u05D0\u05EA \u05E9\u05DE\u05E2, \u05DE\u05E0\u05D7\u05D4, \u05E2\u05E8\u05D1\u05D9\u05EA, \u05D6\u05DE\u05E0\u05D9\u05DD, \u05DE\u05E1\u05E4\u05E8 \u05E8\u05DB\u05D1, \u05E2\u05D9\u05E7\u05D5\u05DC, \u05E9\u05E2\u05D1\u05D5\u05D3, \u05D2\u05E0\u05D5\u05D1, \u05EA\u05D7\u05E0\u05EA \u05D3\u05DC\u05E7, \u05D1\u05E0\u05D6\u05D9\u05DF, \u05E8\u05DB\u05D1\u05EA \u05D9\u05E9\u05E8\u05D0\u05DC, \u05D0\u05D5\u05D8\u05D5\u05D1\u05D5\u05E1, \u05E7\u05D5, \u05EA\u05D7\u05E0\u05D4, \u05E4\u05D9\u05E7\u05D5\u05D3 \u05D4\u05E2\u05D5\u05E8\u05E3, \u05E6\u05D1\u05E2 \u05D0\u05D3\u05D5\u05DD, \u05D4\u05EA\u05E8\u05E2\u05D4, \u05E9\u05E2\u05E8\u05D9 \u05DE\u05D8\u05D1\u05E2\u05D5\u05EA, \u05D3\u05D5\u05DC\u05E8, \u05D0\u05D9\u05E8\u05D5, \u05D7\u05E9\u05D1\u05D5\u05DF, \u05DB\u05E4\u05D5\u05DC, \u05D0\u05D7\u05D5\u05D6, \u05D8\u05DC\u05E4\u05D5\u05DF, \u05EA\u05D6\u05DB\u05D9\u05E8 \u05DC\u05D9, 32397, 32427, \u05D1\u05D9\u05EA\u05E8 \u05E2\u05D9\u05DC\u05D9\u05EA, \u05D1\u05E0\u05D9 \u05D1\u05E8\u05E7, \u05D7\u05D9\u05E4\u05D4, \u05D9\u05E8\u05D5\u05E9\u05DC\u05D9\u05DD, \u05EA\u05DC \u05D0\u05D1\u05D9\u05D1");
const whisperRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
method: "POST",
headers: { "Authorization": Bearer ${GROQ_KEY} },
body: formData
});
if (!whisperRes.ok) {
console.log([${(/* @__PURE__ */ new Date()).toISOString()}] Whisper error: ${await whisperRes.text()});
return textResponse("id_list_message=t-\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05EA\u05DE\u05DC\u05D5\u05DC \u05D4\u05E9\u05D0\u05DC\u05D4");
}
const transcribedText = (await whisperRes.json()).text?.trim() || "";
console.log([${(/* @__PURE__ */ new Date()).toISOString()}] Transcribed: "${transcribedText}");
if (!transcribedText) return textResponse("id_list_message=t-\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05E9\u05DE\u05D5\u05E2, \u05D0\u05E0\u05D0 \u05D3\u05D1\u05E8 \u05D1\u05E8\u05D5\u05E8 \u05D9\u05D5\u05EA\u05E8");
let callerMemory = null;
let callerName = "";
if (callerPhone && env.USER_MEMORY) {
try {
const stored = await env.USER_MEMORY.get(mem_${callerPhone});
if (stored) {
callerMemory = JSON.parse(stored);
callerName = callerMemory.name || "";
}
} catch () {
}
}
const now = / @__PURE__ / new Date();
const currentTimeIsrael = now.toLocaleTimeString("he-IL", { timeZone: "Asia/Jerusalem", hour: "2-digit", minute: "2-digit", hour12: false });
const currentDateIsrael = now.toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem", weekday: "long", year: "numeric", month: "long", day: "numeric" });
let hebrewDateStr = "", parashaStr = "", usdRateStr = "", liveContext = "";
try {
const hebcalRes = await fetch(https://www.hebcal.com/converter?cfg=json&gy=${now.getFullYear()}&gm=${now.getMonth() + 1}&gd=${now.getDate()}&g2h=1, { headers: { "User-Agent": "Mozilla/5.0" } });
if (hebcalRes.ok) {
const hd = await hebcalRes.json();
hebrewDateStr = hd.hebrew || "";
if (hd.events?.length) parashaStr = hd.events.join(", ");
}
const rateRes = await fetch("https://open.er-api.com/v6/latest/ILS", { headers: { "User-Agent": "Mozilla/5.0" } });
if (rateRes.ok) {
const rd = await rateRes.json();
const usd = rd.rates?.USD ? (1 / rd.rates.USD).toFixed(2) : "3.06";
const eur = rd.rates?.EUR ? (1 / rd.rates.EUR).toFixed(2) : "3.32";
const gbp = rd.rates?.GBP ? (1 / rd.rates.GBP).toFixed(2) : "3.85";
const cad = rd.rates?.CAD ? (1 / rd.rates.CAD).toFixed(2) : "2.24";
usdRateStr = \u05D3\u05D5\u05DC\u05E8: ${usd} \u20AA, \u05D0\u05D9\u05E8\u05D5: ${eur} \u20AA, \u05DC\u05D9\u05E9"\u05D8: ${gbp} \u20AA, \u05D3\u05D5\u05DC\u05E8 \u05E7\u05E0\u05D3\u05D9: ${cad} \u20AA;
}
const isReminder = transcribedText.includes("\u05EA\u05D6\u05DB\u05D9\u05E8") || transcribedText.includes("\u05EA\u05D6\u05DB\u05E8") || transcribedText.includes("\u05EA\u05D6\u05DB\u05D9\u05E8\u05D9");
if (isReminder && callerPhone && env.USER_MEMORY) {
const hourMatch = transcribedText.match(/(\d{1,2})(?::(\d{2}))?/);
const hour = hourMatch ? parseInt(hourMatch[1]) : 8;
const minute = hourMatch?.[2] ? parseInt(hourMatch[2]) : 0;
const isTomorrow = transcribedText.includes("\u05DE\u05D7\u05E8");
const fireDate = / @__PURE__ */ new Date();
if (isTomorrow) fireDate.setDate(fireDate.getDate() + 1);
fireDate.setHours(hour, minute, 0, 0);
const message = transcribedText.replace(/תזכיר(י)? לי (מחר )?(ב-?\d{1,2}(:\d{2})?)?/g, "").trim() || "\u05EA\u05D6\u05DB\u05D5\u05E8\u05EA \u05DE\u05DE\u05E2\u05E8\u05DB\u05EA \u05D4-AI";
await env.USER_MEMORY.put(reminder_${callerPhone}, JSON.stringify({ fireAt: fireDate.toISOString(), message }), { expirationTtl: 86400 });
liveContext = \u05E0\u05E9\u05DE\u05E8\u05D4 \u05EA\u05D6\u05DB\u05D5\u05E8\u05EA \u05E7\u05D5\u05DC\u05D9\u05EA \u05D0\u05D9\u05E9\u05D9\u05EA \u05E2\u05D1\u05D5\u05E8 \u05D4\u05DE\u05EA\u05E7\u05E9\u05E8 ${callerPhone} \u05D1\u05E9\u05E2\u05D4 ${hour}:${minute < 10 ? "0" + minute : minute}${isTomorrow ? " \u05DE\u05D7\u05E8" : " \u05D4\u05D9\u05D5\u05DD"}: "${message}";
}
const nameMatch = transcribedText.match(/(?:שמי|קוראים לי|אני)\s+([\u0590-\u05FF]+)/);
if (nameMatch && callerPhone && env.USER_MEMORY) {
const newName = nameMatch[1];
const mem = callerMemory || {};
mem.name = newName;
mem.phone = callerPhone;
mem.lastSeen = now.toISOString();
await env.USER_MEMORY.put(mem_${callerPhone}, JSON.stringify(mem), { expirationTtl: 2592e3 });
liveContext = \u05E9\u05DE\u05E8\u05EA\u05D9 \u05D0\u05EA \u05E9\u05DE\u05DA \u05D1\u05DE\u05E2\u05E8\u05DB\u05EA: ${newName}. \u05D1\u05E4\u05E2\u05DD \u05D4\u05D1\u05D0\u05D4 \u05E9\u05EA\u05EA\u05E7\u05E9\u05E8, \u05D0\u05D3\u05E2 \u05E9\u05D0\u05EA\u05D4 ${newName}!;
}
if (!liveContext && (transcribedText.includes("\u05D6\u05DE\u05E0\u05D9") || transcribedText.includes("\u05E9\u05E7\u05D9\u05E2\u05D4") || transcribedText.includes("\u05D6\u05E8\u05D9\u05D7\u05D4") || transcribedText.includes("\u05E9\u05D7\u05E8\u05D9\u05EA") || transcribedText.includes("\u05E7\u05E8\u05D9\u05D0\u05EA \u05E9\u05DE\u05E2") || transcribedText.includes("\u05DE\u05E0\u05D7\u05D4") || transcribedText.includes("\u05E2\u05E8\u05D1\u05D9\u05EA"))) {
const cityCode = transcribedText.includes("\u05D7\u05D9\u05E4\u05D4") ? "IL-Haifa" : transcribedText.includes("\u05EA\u05DC \u05D0\u05D1\u05D9\u05D1") ? "IL-TelAviv" : transcribedText.includes("\u05D1\u05D9\u05EA\u05E8") ? "IL-BeitarIllit" : transcribedText.includes("\u05D1\u05E0\u05D9 \u05D1\u05E8\u05E7") ? "IL-BneiBrak" : transcribedText.includes("\u05D0\u05E9\u05D3\u05D5\u05D3") ? "IL-Ashdod" : transcribedText.includes("\u05D1\u05D0\u05E8 \u05E9\u05D1\u05E2") ? "IL-Beersheba" : "IL-Jerusalem";
const zRes = await fetch(https://www.hebcal.com/zmanim?cfg=json&city=${cityCode}, { headers: { "User-Agent": "Mozilla/5.0" } });
if (zRes.ok) {
const zm = (await zRes.json()).times;
liveContext = \u05D6\u05DE\u05E0\u05D9 \u05D4\u05D9\u05D5\u05DD \u05D1\u05D4\u05DC\u05DB\u05D4: \u05E2\u05DC\u05D5\u05EA \u05D4\u05E9\u05D7\u05E8 ${zm.alotHaShachar?.substring(11, 16)}, \u05D6\u05E8\u05D9\u05D7\u05D4 ${zm.sunrise?.substring(11, 16)}, \u05E1\u05D5\u05E3 \u05E7\u05E8\u05D9\u05D0\u05EA \u05E9\u05DE\u05E2 ${zm.sofZmanShma?.substring(11, 16)}, \u05D7\u05E6\u05D5\u05EA \u05D4\u05D9\u05D5\u05DD ${zm.chatzot?.substring(11, 16)}, \u05DE\u05E0\u05D7\u05D4 \u05D2\u05D3\u05D5\u05DC\u05D4 ${zm.minchaGedola?.substring(11, 16)}, \u05E9\u05E7\u05D9\u05E2\u05D4 ${zm.sunset?.substring(11, 16)};
}
}
} catch () {
}
const systemPrompt = \u05D0\u05EA\u05D4 \u05E2\u05D5\u05D6\u05E8 \u05E7\u05D5\u05DC\u05D9 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05D1\u05D8\u05DC\u05E4\u05D5\u05DF. \u05E2\u05D5\u05E0\u05D4 \u05E7\u05E6\u05E8, \u05D1\u05E8\u05D5\u05E8 \u05D5\u05EA\u05DE\u05E6\u05D9\u05EA\u05D9. \u05EA\u05E9\u05D5\u05D1\u05D4 \u05DE\u05E7\u05E1\u05D9\u05DE\u05DC\u05D9\u05EA 3 \u05DE\u05E9\u05E4\u05D8\u05D9\u05DD. \u05D0\u05DC \u05EA\u05D0\u05E8\u05D9\u05DA. \u05D0\u05DC \u05EA\u05E1\u05D1\u05D9\u05E8 \u05DE\u05D4 \u05D0\u05EA\u05D4 \u05E2\u05D5\u05E9\u05D4, \u05E8\u05E7 \u05E2\u05E0\u05D4 \u05D9\u05E9\u05D9\u05E8\u05D5\u05EA. \u05D0\u05DD \u05E9\u05D5\u05D0\u05DC\u05D9\u05DD \u05DE\u05D9 \u05D0\u05EA\u05D4, \u05E2\u05E0\u05D4: \u05D0\u05E0\u05D9 \u05D4\u05E2\u05D5\u05D6\u05E8 \u05D4\u05D7\u05DB\u05DD \u05E9\u05DC\u05DA. \u05E2\u05E0\u05D4 \u05EA\u05DE\u05D9\u05D3 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05E4\u05E9\u05D5\u05D8\u05D4 \u05D5\u05D1\u05E8\u05D5\u05E8\u05D4. \u05D0\u05DC \u05EA\u05E9\u05EA\u05DE\u05E9 \u05D1\u05D0\u05E0\u05D2\u05DC\u05D9\u05EA. \u05D4\u05E9\u05E2\u05D4 \u05E2\u05DB\u05E9\u05D9\u05D5 ${currentTimeIsrael}, \u05D4\u05EA\u05D0\u05E8\u05D9\u05DA ${currentDateIsrael}${hebrewDateStr ? ", " + hebrewDateStr : ""}${parashaStr ? ", " + parashaStr : ""}${usdRateStr ? ". \u05E9\u05E2\u05E8\u05D9 \u05D7\u05DC\u05D9\u05E4\u05D9\u05DF: " + usdRateStr : ""}${callerName ? ". \u05D4\u05DE\u05EA\u05E7\u05E9\u05E8 \u05E0\u05E7\u05E8\u05D0 " + callerName : ""}${liveContext ? ". \u05DE\u05D9\u05D3\u05E2 \u05E0\u05D5\u05E1\u05E3: " + liveContext : ""};
const models = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];
let chatRes = null;
let aiAnswer = "";
for (const mdl of models) {
try {
chatRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
method: "POST",
headers: { "Authorization": Bearer ${GROQ_KEY}, "Content-Type": "application/json" },
body: JSON.stringify({
model: mdl,
temperature: 0,
max_tokens: 300,
reasoning_effort: "low",
messages: [{ role: "system", content: systemPrompt }, { role: "user", content: transcribedText }]
})
});
if (chatRes.ok) {
aiAnswer = (await chatRes.json()).choices[0].message.content || "";
if (aiAnswer.trim()) {
console.log([${(/* @__PURE__ */ new Date()).toISOString()}] AI (${mdl}): "${aiAnswer}");
break;
}
}
console.log([${(/* @__PURE__ */ new Date()).toISOString()}] Model ${mdl} failed: ${chatRes.status});
} catch (e) {
console.log([${(/* @__PURE__ */ new Date()).toISOString()}] Model ${mdl} error: ${e.message});
}
}
if (!aiAnswer.trim()) return textResponse("id_list_message=t-\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05E7\u05D1\u05DC\u05EA \u05EA\u05E9\u05D5\u05D1\u05EA AI, \u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1");
console.log([${(/* @__PURE__ */ new Date()).toISOString()}] AI Answer: "${aiAnswer}");
if (callerPhone && env.USER_MEMORY) {
try {
const mem = callerMemory || {};
mem.phone = callerPhone;
mem.lastQuery = transcribedText;
mem.lastSeen = now.toISOString();
await env.USER_MEMORY.put(mem_${callerPhone}, JSON.stringify(mem), { expirationTtl: 2592e3 });
} catch () {
}
}
const cleanAnswer = aiAnswer.replace(/</?think>/gi, "").replace(/[\r\n]+/g, " ").replace(/[.\u2024\u2026]+/g, ", ").replace(/[-\u2010-\u2015]+/g, " ").replace(/[&=#%+]/g, " ").replace(/[^a-zA-Z0-9\u0590-\u05FF\s,?!;:]/g, "").replace(/\s+/g, " ").replace(/,+/g, ",").substring(0, 450).trim().replace(/^[,;:!?\s]+|[,;:\s]+$/g, "");
if (!cleanAnswer) return textResponse("id_list_message=t-\u05DC\u05D0 \u05D4\u05EA\u05E7\u05D1\u05DC\u05D4 \u05EA\u05E9\u05D5\u05D1\u05D4 \u05EA\u05E7\u05D9\u05E0\u05D4, \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1");
return textResponse(id_list_message=t-${cleanAnswer});
} catch (err) {
console.log([${(/* @__PURE__ */ new Date()).toISOString()}] SYSTEM ERROR: ${err.message});
return textResponse("id_list_message=t-\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05DE\u05E2\u05E8\u05DB\u05EA");
}
}
};
function textResponse(text) {
return new Response(text, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
__name(textResponse, "textResponse");
export {
worker_default as default
};
//# sourceMappingURL=worker.js.map
