// SCMS — проигрыватель демонстрации.
//
// Поднимает Docker-стек (профиль full), открывает ОБЫЧНЫЙ (видимый) браузер и неспешно
// прогоняет сквозной сценарий UC-01…UC-05 для двух ролей (клиент Meth и персонал),
// показывая баннер с текущим шагом. Это не автотест, а «просмотр» демо.
//
// Запуск:
//   bun install
//   bun run demo            # сбросить БД (down -v), поднять стек, играть в браузере
//   bun run demo:fast       # быстрее
//   bun run demo:slow       # медленнее
//   node demo.mjs --no-reset   # не удалять volume БД
//   node demo.mjs --no-docker  # стек уже запущен, только играть
//   node demo.mjs --headless   # без окна (для проверки в CI)
//
// Флаги: --no-reset, --no-build, --no-docker, --headless, --speed=fast|normal|slow

import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOFTWARE_DIR = path.resolve(__dirname, "..");
const COMPOSE = ["compose", "-f", "infra/compose.yaml", "--profile", "full"];

const CLIENT = "http://localhost:3000";
const INTERNAL = "http://localhost:3002";
const BACKEND_DOCS = "http://localhost:3001/api/v3/api-docs";

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const HEADLESS = has("--headless");
const NO_DOCKER = has("--no-docker");
const NO_RESET = has("--no-reset");
const NO_BUILD = has("--no-build");
const speedArg = (args.find((a) => a.startsWith("--speed=")) || "--speed=normal").split("=")[1];
const BEAT = { fast: 350, normal: 1200, slow: 2500 }[speedArg] ?? 1200;
const SLOWMO = { fast: 150, normal: 500, slow: 900 }[speedArg] ?? 500;

const SHOTS = path.join(__dirname, "screenshots");
fs.mkdirSync(SHOTS, { recursive: true });

const log = (m) => console.log(`\x1b[35m[demo]\x1b[0m ${m}`);

function sh(cmd, cmdArgs, opts = {}) {
  log(`$ ${cmd} ${cmdArgs.join(" ")}`);
  const r = spawnSync(cmd, cmdArgs, { stdio: "inherit", shell: process.platform === "win32", ...opts });
  if (r.status !== 0) throw new Error(`Команда завершилась с кодом ${r.status}: ${cmd}`);
}

async function waitBackend(timeoutMs = 300000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(BACKEND_DOCS);
      if (res.ok) return;
    } catch {
      /* ещё не поднялся */
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error("Backend не поднялся за отведённое время");
}

async function banner(page, text) {
  await page
    .evaluate((t) => {
      let el = document.getElementById("__demo_banner");
      if (!el) {
        el = document.createElement("div");
        el.id = "__demo_banner";
        Object.assign(el.style, {
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          zIndex: "99999",
          background: "linear-gradient(90deg,#722ed1,#b37feb)",
          color: "#fff",
          padding: "10px 16px",
          font: "600 15px -apple-system,Segoe UI,Roboto,sans-serif",
          textAlign: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,.25)",
          pointerEvents: "none",
        });
        document.body.appendChild(el);
      }
      el.textContent = t;
    }, text)
    .catch(() => {});
}

const shot = (page, name) => page.screenshot({ path: path.join(SHOTS, name + ".png"), fullPage: true }).catch(() => {});
const rows = (page) => page.locator("table tbody tr.ant-table-row");
const waitRows = (page) => rows(page).first().waitFor({ state: "visible", timeout: 20000 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let caseCode = "";
let certCode = "";

async function scene(page, title, fn) {
  if (page) {
    await page.bringToFront().catch(() => {});
    await banner(page, title);
  }
  log(title);
  await sleep(BEAT);
  try {
    const info = await fn();
    if (info) log(`  → ${info}`);
  } catch (e) {
    log(`  ⚠ ${String(e.message).split("\n")[0]}`);
    if (page) await shot(page, "error-" + Date.now());
  }
}

async function main() {
  if (!HEADLESS && !NO_DOCKER) {
    if (!NO_RESET) {
      log("Сброс БД к исходным сидам (docker compose down -v)…");
      sh("docker", [...COMPOSE, "down", "-v"], { cwd: SOFTWARE_DIR });
    }
    const upArgs = ["up", "-d", ...(NO_BUILD ? [] : ["--build"])];
    log(`Поднимаю стек в Docker (docker compose --profile full ${upArgs.join(" ")})…`);
    sh("docker", [...COMPOSE, ...upArgs], { cwd: SOFTWARE_DIR });
    log("Жду готовности backend (Liquibase накатывает схему и сиды)…");
    await waitBackend();
  }

  const browser = await chromium.launch({ headless: HEADLESS || undefined, slowMo: HEADLESS ? 0 : SLOWMO });
  const clientCtx = await browser.newContext({ viewport: { width: 1360, height: 900 } });
  const internalCtx = await browser.newContext({ viewport: { width: 1360, height: 900 } });
  const cp = await clientCtx.newPage();
  const ip = await internalCtx.newPage();

  // ---------------- UC-05: клиент входит ----------------
  await scene(cp, "UC-05 · Клиент: вход (демо-вход M. Kovacs)", async () => {
    await cp.goto(CLIENT + "/login", { waitUntil: "networkidle" });
    await sleep(BEAT);
    await cp.getByRole("button", { name: "Демо-вход (M. Kovacs)" }).click();
    await cp.waitForURL("**/cabinet", { timeout: 20000 });
    await sleep(BEAT);
    await shot(cp, "01-client-cabinet");
    return "открыт личный кабинет клиента";
  });

  // ---------------- UC-01 клиент: заказ тела ----------------
  await scene(cp, "UC-01 · Клиент: каталог тел и заказ", async () => {
    await cp.getByRole("menuitem", { name: "Каталог тел" }).click();
    await cp.waitForURL("**/cabinet/catalog");
    await waitRows(cp);
    const headers = (await cp.locator("table thead th").allInnerTexts()).filter(Boolean).join(", ");
    await sleep(BEAT);
    await cp.getByRole("button", { name: "Заказать" }).first().click();
    await cp.waitForURL("**/cabinet/orders", { timeout: 20000 });
    await sleep(BEAT);
    await shot(cp, "02-client-orders");
    return `колонки: ${headers}; заказ создан`;
  });

  // ---------------- Персонал: вход ----------------
  await scene(ip, "Персонал · Вход (dev-login)", async () => {
    await ip.goto(INTERNAL + "/login", { waitUntil: "networkidle" });
    await ip.locator("input").first().fill("Demo Staff", { delay: 60 });
    await sleep(400);
    await ip.getByRole("button", { name: "Войти как сотрудник" }).click();
    await ip.waitForURL("**/dashboard", { timeout: 20000 });
    await sleep(BEAT);
    await shot(ip, "03-internal-dashboard");
    return "открыт дашборд персонала";
  });

  await scene(ip, "RBAC · Меню зависит от роли", async () => {
    const items = await ip.getByRole("menuitem").allInnerTexts();
    await sleep(BEAT);
    return "пункты меню: " + items.join(", ");
  });

  await scene(ip, "RBAC · Смена роли на «Администратор» (Настройки)", async () => {
    await ip.getByRole("menuitem", { name: "Настройки" }).click();
    await ip.waitForURL("**/settings");
    await ip.locator(".ant-select").first().click();
    await sleep(500);
    await ip.locator(".ant-select-item-option", { hasText: "Администратор" }).first().click();
    await sleep(400);
    await ip.getByRole("button", { name: "Сохранить" }).click();
    await sleep(BEAT + 500);
    await shot(ip, "04-internal-settings-admin");
    return "меню расширилось до всех разделов";
  });

  // ---------------- UC-01 брокер: подтверждение ----------------
  await scene(ip, "UC-01 · Sleeve Broker: подтвердить заказ клиента", async () => {
    await ip.getByRole("menuitem", { name: "Заказы" }).click();
    await ip.waitForURL("**/orders");
    await waitRows(ip);
    await sleep(BEAT);
    const row = ip.locator("tr.ant-table-row", { hasText: "Новый" }).first();
    await row.getByRole("button", { name: "Подтвердить" }).click();
    await sleep(600);
    await ip.locator(".ant-modal").getByRole("button", { name: "Подтвердить" }).click();
    await sleep(BEAT);
    await shot(ip, "05-internal-orders-confirmed");
    return "заказ подтверждён, создан кейс";
  });

  // ---------------- UC-03 Needlecaster ----------------
  await scene(ip, "UC-03 · Needlecaster: перенос сознания", async () => {
    await ip.getByRole("menuitem", { name: "Needlecast" }).click();
    await ip.waitForURL("**/needlecast");
    await waitRows(ip);
    await sleep(BEAT);
    const row = ip.locator("tr.ant-table-row", { hasText: "M. Kovacs" }).filter({ hasText: "Ожидает" }).first();
    await row.getByRole("button", { name: "Открыть" }).click();
    await ip.waitForURL("**/needlecast/**", { timeout: 20000 });
    await ip.waitForSelector("text=Начать перенос", { timeout: 20000 });
    await sleep(BEAT);
    caseCode = (await ip.locator("h3").first().innerText()).replace(/\D/g, "");
    await shot(ip, "06-needlecast-start");
    await ip.getByRole("button", { name: "Начать перенос" }).click();
    await ip.waitForSelector("text=Отметить результат", { timeout: 20000 });
    await sleep(BEAT);
    await ip.getByRole("button", { name: "Отметить результат: Успешно" }).click();
    await sleep(BEAT + 500);
    await shot(ip, "07-needlecast-done");
    return "кейс CS-" + caseCode + " завершён";
  });

  // ---------------- UC-04 Psychosurgeon ----------------
  await scene(ip, "UC-04 · Psychosurgeon: осмотр и сертификация", async () => {
    await ip.getByRole("menuitem", { name: "Валидация" }).click();
    await ip.waitForURL("**/validation");
    await waitRows(ip);
    await sleep(BEAT);
    const row = ip.locator("tr.ant-table-row", { hasText: "CS-" + caseCode }).first();
    await row.getByRole("button", { name: "Осмотр" }).click();
    await ip.waitForURL("**/validation/**", { timeout: 20000 });
    await ip.waitForSelector("text=Чек-лист осмотра", { timeout: 20000 });
    await sleep(BEAT);
    await shot(ip, "08-validation-checklist");
    for (let i = 0; i < 12; i++) {
      const unchecked = ip.locator(
        ".ant-radio-button-wrapper:not(.ant-radio-button-wrapper-checked)",
        { hasText: "Пройден" },
      );
      if ((await unchecked.count()) === 0) break;
      await unchecked.first().click();
      await sleep(350);
    }
    await sleep(BEAT);
    await ip.getByRole("button", { name: "Подтвердить и выдать сертификат" }).click();
    await sleep(BEAT + 800);
    await shot(ip, "09-validation-certificate");
    const text = await ip.locator("body").innerText();
    const m = text.match(/Сертификат (CERT-[A-Z0-9-]+)/);
    if (m) certCode = m[1];
    return certCode ? "выдан " + certCode : "сертификат выдан";
  });

  // ---------------- Клиент видит сертификат ----------------
  await scene(cp, "UC-04 · Клиент: сертификат в кабинете", async () => {
    await cp.getByRole("menuitem", { name: "Сертификаты" }).click();
    await cp.waitForURL("**/cabinet/certificates");
    await sleep(BEAT);
    await shot(cp, "10-client-certificates");
    const text = await cp.locator("body").innerText();
    return certCode && text.includes(certCode) ? "клиент видит " + certCode : "сертификат доступен клиенту";
  });

  // ---------------- UC-02 резерв ----------------
  await scene(ip, "UC-02 · Sleeve Broker: резерв тел", async () => {
    await ip.getByRole("menuitem", { name: "Каталог тел" }).click();
    await ip.waitForURL("**/sleeves");
    await waitRows(ip);
    await sleep(BEAT);
    await shot(ip, "11-internal-sleeves");
    const text = await ip.locator("body").innerText();
    const statuses = ["Доступно", "В культивации", "В приёмке", "Зарезервировано", "Используется", "Списано"].filter(
      (s) => text.includes(s),
    );
    return "статусы на экране: " + statuses.join(", ");
  });

  // ---------------- Аудит ----------------
  await scene(ip, "Аудит · Журнал операций", async () => {
    await ip.getByRole("menuitem", { name: "Аудит" }).click();
    await ip.waitForURL("**/audit");
    await waitRows(ip);
    await sleep(BEAT);
    await shot(ip, "12-internal-audit");
    return "записей в журнале: " + (await rows(ip).count());
  });

  await banner(ip, "✅ Демонстрация завершена — можно кликать дальше");
  await banner(cp, "✅ Клиент: сертификат доступен в разделе «Сертификаты»");
  log("Демонстрация завершена. Браузер оставлен открытым — закрой окно, когда посмотришь.");
  log("Скриншоты: " + SHOTS);

  if (HEADLESS) {
    await browser.close();
    return;
  }
  // Оставляем окно открытым, пока пользователь не закроет браузер.
  await new Promise((resolve) => browser.on("disconnected", resolve));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
