#!/usr/bin/env node
/**
 * Translation Audit Script v2 - Robust extraction from TypeScript source
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Read the raw translations file
const raw = fs.readFileSync(path.join(ROOT, "lib/i18n/translations.ts"), "utf-8");

// Extract just the dictionary objects using regex on the raw source
// We look for "kn: {" and "en: {" blocks
function extractDictBlock(content, langMarker) {
  const marker = `"${langMarker}": {` // or 'kn': {
  const markerAlt = `'${langMarker}': {`;
  const markerBare = `${langMarker}: {`;
  
  let startIdx = content.indexOf(marker);
  if (startIdx === -1) startIdx = content.indexOf(markerAlt);
  if (startIdx === -1) startIdx = content.indexOf(markerBare);
  if (startIdx === -1) {
    console.error(`Could not find ${langMarker} dictionary block`);
    return {};
  }
  
  // Find the opening brace
  const braceStart = content.indexOf("{", startIdx);
  if (braceStart === -1) return {};
  
  // Count braces to find matching close
  let depth = 0;
  let i = braceStart;
  for (; i < content.length; i++) {
    if (content[i] === "{") depth++;
    else if (content[i] === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  
  const block = content.substring(braceStart, i + 1);
  
  // Replace TypeScript object syntax to valid JSON-like JS
  // Remove trailing commas
  let cleaned = block.replace(/,(\s*[}\]])/g, "$1");
  // Remove comments
  cleaned = cleaned.replace(/\/\/.*$/gm, "");
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, "");
  
  try {
    // Use Function constructor instead of eval
    const fn = new Function("return " + cleaned);
    return fn();
  } catch (e) {
    console.error(`Failed to parse ${langMarker} dictionary:`, e.message);
    // Try to debug
    const lines = cleaned.split("\n");
    console.error(`Block has ${lines.length} lines`);
    return {};
  }
}

console.log("╔══════════════════════════════════════════════════════════╗");
console.log("║         COMPREHENSIVE TRANSLATION AUDIT                ║");
console.log("╚══════════════════════════════════════════════════════════╝\n");

const knDict = extractDictBlock(raw, "kn");
const enDict = extractDictBlock(raw, "en");

if (!knDict.nav || !enDict.nav) {
  console.error("Failed to extract dictionaries properly");
  console.log("KN dict keys:", Object.keys(knDict));
  console.log("EN dict keys:", Object.keys(enDict));
  process.exit(1);
}

console.log(`✅ Kannada dictionary loaded (top-level namespaces: ${Object.keys(knDict).length})`);
console.log(`✅ English dictionary loaded (top-level namespaces: ${Object.keys(enDict).length})`);

// Flatten dict keys
function flattenKeys(obj, prefix = "") {
  const result = new Set();
  if (typeof obj !== "object" || obj === null) return result;
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      for (const k of flattenKeys(val, fullKey)) result.add(k);
    } else {
      result.add(fullKey);
    }
  }
  return result;
}

function getValue(obj, dottedKey) {
  const parts = dottedKey.split(".");
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}

const knFlat = flattenKeys(knDict);
const enFlat = flattenKeys(enDict);

console.log(`\nKannada leaf keys: ${knFlat.size}`);
console.log(`English leaf keys: ${enFlat.size}`);

// 2. Scan ALL source files for t() calls
function getAllFiles(dir) {
  const results = [];
  const skip = ["node_modules", ".next", ".git", ".freebuff", ".codegraph", ".serena", "scripts"];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (skip.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath));
    } else if ((entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) && !entry.name.endsWith(".d.ts")) {
      results.push(fullPath);
    }
  }
  return results;
}

const sourceFiles = getAllFiles(ROOT);
console.log(`\nScanning ${sourceFiles.length} source files for t() calls...`);

const usedKeys = new Map(); // key -> [{file, line, snippet}]

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf-8");
  const lines = content.split("\n");
  const relPath = path.relative(ROOT, file);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match t("dotted.key") or t('dotted.key')
    const regex = /\bt\(\s*["']([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)+)["']\s*\)/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
      const key = match[1];
      if (!usedKeys.has(key)) usedKeys.set(key, []);
      usedKeys.get(key).push({ file: relPath, line: i + 1, snippet: line.trim().substring(0, 120) });
    }
    
    // Match t(`namespace.${var}`) - dynamic template literal
    const regex2 = /\bt\(\s*`([a-zA-Z][a-zA-Z0-9]*)\.\$\{/g;
    while ((match = regex2.exec(line)) !== null) {
      const key = match[1] + ".*DYNAMIC*";
      if (!usedKeys.has(key)) usedKeys.set(key, []);
      usedKeys.get(key).push({ file: relPath, line: i + 1, snippet: line.trim().substring(0, 120) });
    }
  }
}

console.log(`Found ${usedKeys.size} unique key references\n`);

// 3. Categorize
const staticUsed = new Map();
const dynamicUsed = new Map();

for (const [key, locs] of usedKeys) {
  if (key.includes("*DYNAMIC*")) {
    dynamicUsed.set(key, locs);
  } else {
    staticUsed.set(key, locs);
  }
}

const missingKn = [];
const missingEn = [];
const typeIssues = [];

for (const [key, locs] of staticUsed) {
  const knVal = getValue(knDict, key);
  const enVal = getValue(enDict, key);
  
  if (knVal === undefined) {
    missingKn.push({ key, locs });
  } else if (typeof knVal !== "string") {
    typeIssues.push({ key, type: typeof knVal, lang: "kn", locs });
  }
  
  if (enVal === undefined) {
    missingEn.push({ key, locs });
  } else if (typeof enVal !== "string") {
    typeIssues.push({ key, type: typeof enVal, lang: "en", locs });
  }
}

// 4. Find hardcoded English strings in user-facing code
console.log("\n--- Scanning for hardcoded UI strings ---");
const hardcodedPatterns = [];
for (const file of sourceFiles) {
  const relPath = path.relative(ROOT, file);
  if (relPath.startsWith("app/admin") || relPath.startsWith("scripts")) continue;
  
  const content = fs.readFileSync(file, "utf-8");
  const lines = content.split("\n");
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Common hardcoded strings to look for (skip if inside t() call or className)
    const hardcoded = [
      "Book Now", "Add to Cart", "Checkout", "Submit", "Cancel", "Loading...",
      "No results", "Something went wrong", "Error", "Success", "Back",
      "View All", "Learn More", "Read More", "Close", "Search",
      "Required", "Invalid", "Please enter", "Please select",
      "Book Seva", "Pay Now", "Confirm", "Next", "Previous",
      "Download Receipt", "Share", "Print", "Book Another",
    ];
    
    for (const str of hardcoded) {
      // Check if the string appears in a JSX context or string literal (not in className)
      if (line.includes(`"${str}"`) || line.includes(`'${str}'`)) {
        // Skip if it's inside a className, or import, or type definition
        if (line.includes("className") || line.includes("import") || line.includes("type ") || line.includes("interface ")) continue;
        if (line.includes("//")) {
          const commentIdx = line.indexOf("//");
          const strIdx = line.indexOf(str);
          if (strIdx > commentIdx) continue;
        }
        hardcodedPatterns.push({ file: relPath, line: i + 1, string: str, snippet: line.trim().substring(0, 120) });
      }
    }
  }
}

// 5. Report
console.log("\n" + "═".repeat(60));
console.log(" TRANSLATION AUDIT RESULTS");
console.log("═".repeat(60));

console.log(`\n📊 STATISTICS:`);
console.log(`   Source files scanned: ${sourceFiles.length}`);
console.log(`   Static keys used: ${staticUsed.size}`);
console.log(`   Dynamic patterns: ${dynamicUsed.size}`);
console.log(`   Kannada dictionary keys: ${knFlat.size}`);
console.log(`   English dictionary keys: ${enFlat.size}`);

if (missingKn.length > 0) {
  console.log(`\n❌ MISSING IN KANNADA (${missingKn.length}):`);
  for (const { key, locs } of missingKn.sort((a, b) => a.key.localeCompare(b.key))) {
    console.log(`\n   ${key}`);
    for (const loc of locs.slice(0, 3)) {
      console.log(`     → ${loc.file}:${loc.line}`);
    }
  }
} else {
  console.log("\n✅ All static keys present in Kannada");
}

if (missingEn.length > 0) {
  console.log(`\n❌ MISSING IN ENGLISH (${missingEn.length}):`);
  for (const { key, locs } of missingEn.sort((a, b) => a.key.localeCompare(b.key))) {
    console.log(`\n   ${key}`);
    for (const loc of locs.slice(0, 3)) {
      console.log(`     → ${loc.file}:${loc.line}`);
    }
  }
} else {
  console.log("\n✅ All static keys present in English");
}

if (typeIssues.length > 0) {
  console.log(`\n⚠️  KEYS RETURNING NON-STRING (${typeIssues.length}):`);
  for (const { key, type, lang, locs } of typeIssues) {
    console.log(`   ${key} → ${type} (${lang})`);
    for (const loc of locs.slice(0, 1)) {
      console.log(`     → ${loc.file}:${loc.line}`);
    }
  }
}

if (dynamicUsed.size > 0) {
  console.log(`\n📋 DYNAMIC KEY PATTERNS (${dynamicUsed.size}):`);
  for (const [key, locs] of dynamicUsed) {
    console.log(`\n   ${key}`);
    for (const loc of locs.slice(0, 2)) {
      console.log(`     → ${loc.file}:${loc.line}`);
    }
  }
}

if (hardcodedPatterns.length > 0) {
  console.log(`\n📝 HARDCODED UI STRINGS (${hardcodedPatterns.length}):`);
  for (const { file, line, string, snippet } of hardcodedPatterns.slice(0, 30)) {
    console.log(`\n   "${string}" at ${file}:${line}`);
  }
  if (hardcodedPatterns.length > 30) {
    console.log(`\n   ... and ${hardcodedPatterns.length - 30} more`);
  }
}

console.log("\n" + "═".repeat(60));
console.log(" FINAL SUMMARY");
console.log("═".repeat(60));
console.log(`   Missing in Kannada: ${missingKn.length} ${missingKn.length === 0 ? "✅" : "❌"}`);
console.log(`   Missing in English: ${missingEn.length} ${missingEn.length === 0 ? "✅" : "❌"}`);
console.log(`   Non-string returns: ${typeIssues.length} ${typeIssues.length === 0 ? "✅" : "⚠️"}`);
console.log(`   Dynamic patterns: ${dynamicUsed.size}`);
console.log(`   Hardcoded strings: ${hardcodedPatterns.length}`);
console.log(`   Kannada-only keys: ${[...knFlat].filter(k => !enFlat.has(k)).length}`);
console.log(`   English-only keys: ${[...enFlat].filter(k => !knFlat.has(k)).length}`);

// Save report
const report = {
  summary: {
    filesScanned: sourceFiles.length,
    staticKeysUsed: staticUsed.size,
    dynamicPatterns: dynamicUsed.size,
    missingInKannada: missingKn.length,
    missingInEnglish: missingEn.length,
    typeIssues: typeIssues.length,
    hardcodedStrings: hardcodedPatterns.length,
    kannadaDictKeys: knFlat.size,
    englishDictKeys: enFlat.size,
  },
  missingInKannada: missingKn.map(m => m.key).sort(),
  missingInEnglish: missingEn.map(m => m.key).sort(),
  typeIssues: typeIssues.map(t => ({ key: t.key, type: t.type, lang: t.lang })),
  dynamicPatterns: [...dynamicUsed.entries()].map(([key, locs]) => ({
    pattern: key,
    locations: locs.map(l => `${l.file}:${l.line}`),
  })),
  hardcodedStrings: hardcodedPatterns.map(h => ({ file: h.file, line: h.line, string: h.string })),
};

fs.writeFileSync(path.join(ROOT, "translation-audit-report.json"), JSON.stringify(report, null, 2));
console.log("\n✅ Full report saved to translation-audit-report.json");
