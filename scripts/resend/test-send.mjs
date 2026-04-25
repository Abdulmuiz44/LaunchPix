import { Resend } from "resend";
import { loadLocalEnv } from "./load-env.mjs";

loadLocalEnv();

const apiKey = process.env.RESEND_API_KEY;
const to = process.argv[2];

if (!apiKey) {
  console.error("Missing RESEND_API_KEY.");
  process.exit(1);
}

if (!to) {
  console.error("Usage: npm run resend:test -- you@example.com");
  process.exit(1);
}

const resend = new Resend(apiKey);
const from = process.env.RESEND_FROM_EMAIL || "LaunchPix <onboarding@resend.dev>";

const result = await resend.emails.send({
  from,
  to,
  subject: "LaunchPix Resend test",
  html: "<p>LaunchPix email delivery is connected.</p>",
  tags: [
    { name: "app", value: "launchpix" },
    { name: "template", value: "test" }
  ]
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

console.log(result.data);
