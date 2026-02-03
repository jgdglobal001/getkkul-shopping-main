const fs = require('fs');
const path = require('path');

function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
}

const localesDir = path.join(__dirname, 'src', 'locales');
const koPath = path.join(localesDir, 'ko.json');
const koExtendedPath = path.join(localesDir, 'ko-extended.json');

try {
    const ko = JSON.parse(fs.readFileSync(koPath, 'utf8').replace(/^\uFEFF/, ''));
    const koExtended = JSON.parse(fs.readFileSync(koExtendedPath, 'utf8').replace(/^\uFEFF/, ''));

    console.log('Merging ko-extended.json into ko.json...');
    const merged = deepMerge(ko, koExtended);

    // Sort keys for consistency
    const sortedMerged = {};
    Object.keys(merged).sort().forEach(key => {
        sortedMerged[key] = merged[key];
    });

    fs.writeFileSync(koPath, JSON.stringify(sortedMerged, null, 2), 'utf8');
    console.log('Successfully merged ko.json');

    // Also update en.json and zh.json with missing settings keys if they exist in ko-extended
    const enPath = path.join(localesDir, 'en.json');
    const zhPath = path.join(localesDir, 'zh.json');

    const en = JSON.parse(fs.readFileSync(enPath, 'utf8').replace(/^\uFEFF/, ''));
    const zh = JSON.parse(fs.readFileSync(zhPath, 'utf8').replace(/^\uFEFF/, ''));

    // We only want to add the structure, actual translations should be handled later or use defaults
    // For now, let's just make sure they have the same structure for settings to avoid UI bugs
    if (koExtended.settings) {
        if (!en.settings) en.settings = {};
        if (!zh.settings) zh.settings = {};

        for (const key in koExtended.settings) {
            if (!en.settings[key]) {
                // Approximate translation or just use English label for now to avoid key exposure
                en.settings[key] = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            }
            if (!zh.settings[key]) {
                zh.settings[key] = koExtended.settings[key]; // Fallback to Korean if needed or just label
            }
        }
    }

    fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
    fs.writeFileSync(zhPath, JSON.stringify(zh, null, 2), 'utf8');
    console.log('Updated en.json and zh.json structure');

} catch (err) {
    console.error('Error during merge:', err);
    process.exit(1);
}
