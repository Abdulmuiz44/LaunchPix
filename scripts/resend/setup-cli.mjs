import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { loadLocalEnv } from "./load-env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

loadLocalEnv();

function normalizeOrigin(value) {
  if (!value) return "";
  const candidate = value.startsWith("http") ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    return url.origin;
  } catch {
    return "";
  }
}

function normalizeDomain(value) {
  if (!value) return "";
  const candidate = value.startsWith("http") ? value : `https://${value}`;
  try {
    return new URL(candidate).hostname;
  } catch {
    return value.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}

const domain = normalizeDomain(process.env.RESEND_DOMAIN) || "launchpix.app";
const configuredOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL || process.env.URL);
const appUrl =
  configuredOrigin && !configuredOrigin.includes("localhost")
    ? configuredOrigin
    : `https://${domain}`;
const webhookUrl = `${appUrl}/api/webhooks/resend`;
const resendCli = resolve(__dirname, "../../node_modules/resend-cli/dist/cli.cjs");

function run(args) {
  console.log(`\n> resend ${args.join(" ")}`);
  execFileSync(process.execPath, [resendCli, ...args], { stdio: "inherit" });
}

function readJson(args) {
  const output = execFileSync(process.execPath, [resendCli, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  return JSON.parse(output);
}

function runOptional(args) {
  try {
    run(args);
  } catch (error) {
    console.warn(`Command failed, continuing: resend ${args.join(" ")}`);
  }
}

function sameEvents(left, right) {
  return [...left].sort().join(",") === [...right].sort().join(",");
}

console.log("Resend CLI setup for LaunchPix");
console.log(`Domain: ${domain}`);
console.log(`Webhook: ${webhookUrl}`);

const events = JSON.parse(readFileSync(resolve(__dirname, "../../resend/events.json"), "utf8"));
const existingEvents = new Set((readJson(["events", "list"]).data || []).map((event) => event.name));
const existingDomains = new Set((readJson(["domains", "list"]).data || []).map((item) => item.name));
const webhookEvents = ["email.sent", "email.delivered", "email.bounced", "email.complained", "email.failed", "email.clicked"];
const existingWebhook = (readJson(["webhooks", "list"]).data || []).find(
  (webhook) => webhook.endpoint === webhookUrl && sameEvents(webhook.events || [], webhookEvents)
);

for (const event of events) {
  if (existingEvents.has(event.name)) {
    console.log(`\n- Event already exists: ${event.name}`);
    continue;
  }

  const args = ["events", "create", "--name", event.name];
  if (event.schema) args.push("--schema", JSON.stringify(event.schema));
  runOptional(args);
}

if (existingDomains.has(domain)) {
  console.log(`\n- Domain already exists: ${domain}`);
} else {
  runOptional(["domains", "create", "--name", domain]);
}

if (existingWebhook) {
  console.log(`\n- Webhook already exists: ${webhookUrl}`);
} else {
  runOptional(["webhooks", "create", "--endpoint", webhookUrl, "--events", webhookEvents.join(",")]);
}

console.log("\nNext steps:");
console.log("1. Add the DNS records printed by Resend to your domain provider.");
console.log("2. Run: npx resend domains list");
console.log("3. Run: npx resend domains verify <domain_id>");
console.log("4. Set RESEND_WEBHOOK_SECRET from the created webhook in Netlify.");
