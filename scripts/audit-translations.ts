#!/usr/bin/env npx tsx
/**
 * Translation Audit Script
 * Extracts all t("...") keys from source code and compares against actual dictionaries.
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

// Dynamically import translations
// eslint-disable-next-line @typescript-eslint/no-require-imports
const translationsModule = require(path.join(ROOT, "lib/i18n/translations.ts"));
const translations = translationsModule.default || translationsModule.translations || translationsModule;

// 1. Extract all t() keys from source files
function extractTKeys(dir: string): Map<string, string[]> {
  const keys = new Map<string, string[]>(); // key -> list of file locations
  const files = getAllTsxTsFiles(dir);
  
  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n");
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Match patterns like:
      // t("key")
      // t(`template.${var}`)
      // t('key')
      // t("key.key2")
      const patterns = [
        /\bt\(\s*["']([^"']+)["']\s*\)/g,
        /\bt\(\s*`([^`]+)`\s*\)/g,
        /\bt\(\s*\(\s*["']([^"']+)["']\s*\+\s*\w+/g,
      ];
      
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const key = match[1];
          const relPath = path.relative(ROOT, file);
          if (!keys.has(key)) {
            keys.set(key, []);
          }
          keys.get(key)!.push(`${relPath}:${i + 1}`);
        }
      }
    }
  }
  
  return keys;
}

function getAllTsxTsFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllTsxTsFiles(fullPath));
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      if (entry.name.endsWith(".d.ts")) continue;
      results.push(fullPath);
    }
  }
  
  return results;
}

// 2. Get all keys from a translation object recursively
function getKeys(obj: Record<string, any>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// 3. Main audit
function main() {
  console.log("=== TRANSLATION AUDIT ===\n");
  
  // Get translation keys
  const knKeys = getKeys(translations.kn);
  const enKeys = getKeys(translations.en);
  
  console.log(`Kannada dictionary keys: ${knKeys.length}`);
  console.log(`English dictionary keys: ${enKeys.length}`);
  
  // Get used keys from source
  const usedKeys = extractTKeys(ROOT);
  
  console.log(`\nTranslation keys used in code: ${usedKeys.size}`);
  
  // Categorize
  const dynamicKeys: string[] = [];
  const staticKeys: string[] = [];
  const missingInKn: string[] = [];
  const missingInEn: string[] = [];
  const unusedInKn: string[] = [];
  const unusedInEn: string[] = [];
  const dynamicPatterns: Map<string, string[]> = new Map();
  
  for (const [key, locations] of usedKeys) {
    if (key.includes("${") || key.includes("${")) {
      dynamicKeys.push(key);
      dynamicPatterns.set(key, locations);
    } else {
      staticKeys.push(key);
    }
    
    if (!knKeys.includes(key)) {
      missingInKn.push(key);
    }
    if (!enKeys.includes(key)) {
      missingInEn.push(key);
    }
  }
  
  // Keys in dictionary but not used
  const usedSet = new Set(staticKeys);
  for (const key of knKeys) {
    if (!usedSet.has(key)) unusedInKn.push(key);
  }
  for (const key of enKeys) {
    if (!usedSet.has(key)) unusedInEn.push(key);
  }
  
  // Report
  console.log("\n--- STATIC KEYS USED ---");
  console.log(`Total static keys: ${staticKeys.length}`);
  console.log(`Dynamic key patterns: ${dynamicKeys.length}`);
  
  if (missingInKn.length > 0) {
    console.log(`\n--- MISSING IN KANNADA (${missingInKn.length}) ---`);
    for (const key of missingInKn) {
      const locs = usedKeys.get(key)!;
      console.log(`  MISSING: ${key}`);
      for (const loc of locs.slice(0, 3)) {
        console.log(`    used at: ${loc}`);
      }
    }
  } else {
    console.log("\n✅ All static keys present in Kannada");
  }
  
  if (missingInEn.length > 0) {
    console.log(`\n--- MISSING IN ENGLISH (${missingInEn.length}) ---`);
    for (const key of missingInEn) {
      const locs = usedKeys.get(key)!;
      console.log(`  MISSING: ${key}`);
      for (const loc of locs.slice(0, 3)) {
        console.log(`    used at: ${loc}`);
      }
    }
  } else {
    console.log("\n✅ All static keys present in English");
  }
  
  if (dynamicKeys.length > 0) {
    console.log(`\n--- DYNAMIC KEY PATTERNS (${dynamicKeys.length}) ---`);
    for (const key of dynamicKeys) {
      const locs = dynamicPatterns.get(key)!;
      console.log(`  PATTERN: ${key}`);
      for (const loc of locs.slice(0, 3)) {
        console.log(`    used at: ${loc}`);
      }
    }
  }
  
  if (unusedInKn.length > 0) {
    console.log(`\n--- UNUSED IN KANNADA (${unusedInKn.length}) ---`);
    // Only show first 20
    for (const key of unusedInKn.slice(0, 30)) {
      console.log(`  UNUSED: ${key}`);
    }
    if (unusedInKn.length > 30) {
      console.log(`  ... and ${unusedInKn.length - 30} more`);
    }
  }
  
  // Check for namespace-level keys that might be used as objects
  console.log("\n--- KEY NAMESPACE ANALYSIS ---");
  const namespaces = new Set<string>();
  for (const key of staticKeys) {
    const ns = key.split(".")[0];
    namespaces.add(ns);
  }
  const dictNamespaces = new Set([...Object.keys(translations.kn), ...Object.keys(translations.en)]);
  
  for (const ns of namespaces) {
    if (!dictNamespaces.has(ns)) {
      console.log(`  ⚠️  Namespace "${ns}" used in code but not in dictionary`);
    }
  }
  
  // Report value types - check for keys that might return objects
  console.log("\n--- TYPE CHECKS (keys that might return objects instead of strings) ---");
  for (const key of staticKeys) {
    const parts = key.split(".");
    let val: any = translations.kn;
    for (const p of parts) {
      if (val && typeof val === "object") {
        val = val[p];
      } else {
        val = undefined;
        break;
      }
    }
    if (val !== undefined && typeof val !== "string") {
      console.log(`  ⚠️  ${key} returns ${typeof val} (expected string)`);
    }
  }
  
  // Summary
  console.log("\n=== SUMMARY ===");
  console.log(`Static keys used: ${staticKeys.length}`);
  console.log(`Dynamic patterns: ${dynamicKeys.length}`);
  console.log(`Missing in Kannada: ${missingInKn.length}`);
  console.log(`Missing in English: ${missingInEn.length}`);
  console.log(`Keys in Kannada dict: ${knKeys.length}`);
  console.log(`Keys in English dict: ${enKeys.length}`);
  
  // Write JSON report
  const report = {
    summary: {
      staticKeysUsed: staticKeys.length,
      dynamicPatterns: dynamicKeys.length,
      missingInKannada: missingInKn.length,
      missingInEnglish: missingInEn.length,
      kannadaDictKeys: knKeys.length,
      englishDictKeys: enKeys.length,
    },
    missingInKannada: missingInKn.map(key => ({
      key,
      locations: usedKeys.get(key) || [],
    })),
    missingInEnglish: missingInEn.map(key => ({
      key,
      locations: usedKeys.get(key) || [],
    })),
    dynamicPatterns: dynamicKeys.map(key => ({
      pattern: key,
      locations: dynamicPatterns.get(key) || [],
    })),
    allUsedKeys: staticKeys.sort(),
  };
  
  fs.writeFileSync(
    path.join(ROOT, "translation-audit-report.json"),
    JSON.stringify(report, null, 2)
  );
  console.log("\n✅ Detailed report saved to translation-audit-report.json");
}

main();
