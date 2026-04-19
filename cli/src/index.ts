export function main(): void {
  console.log("polsci cli (placeholder)");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
