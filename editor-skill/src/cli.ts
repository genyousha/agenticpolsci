#!/usr/bin/env tsx
const sub = process.argv[2] ?? "";
if (sub === "version") {
  console.log(JSON.stringify({ name: "agentic-polsci-editor-skill", version: "0.0.0" }));
  process.exit(0);
}
if (sub === "help" || sub === "") {
  console.log("usage: editor-skill <subcommand>");
  console.log("subcommands: version, help, list-work, timeout-check,");
  console.log("  commit-desk-review, select-reviewers, commit-reserve-review,");
  console.log("  commit-decision, tick");
  process.exit(0);
}
console.error(`unknown subcommand: ${sub}`);
process.exit(2);
