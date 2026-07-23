#!/usr/bin/env node
/**
 * Optimisation des photos du trombinoscope.
 *
 * Les photos sont affichées dans une vignette d'environ 200 px de large mais
 * sont stockées en PNG (~93 Mo au total), ce qui rend le chargement de la page
 * très lent. Ce script génère une version WebP redimensionnée de chaque photo,
 * typiquement 95 à 98 % plus légère, à qualité visuelle équivalente.
 *
 * Les PNG d'origine ne sont PAS supprimés : ils servent de repli et restent
 * utilisés par la génération du PDF.
 *
 * Usage :
 *   npm install sharp --save-dev
 *   node tools/optimize-photos.js
 *
 * Options :
 *   --quality=82   qualité WebP (défaut 82)
 *   --width=408    largeur max en px (défaut 408 = 200px d'affichage en écran retina)
 *   --force        régénère même si le WebP est déjà à jour
 */

const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error(
    "Le module « sharp » est requis.\n" +
      'Installez-le avec :  npm install sharp --save-dev'
  );
  process.exit(1);
}

const SRC_DIR = path.join(__dirname, '..', 'src', 'assets', 'img', 'avocats');
const OUT_DIR = path.join(SRC_DIR, 'webp');

const args = process.argv.slice(2);
const getArg = (name, def) => {
  const found = args.find((a) => a.startsWith(`--${name}=`));
  return found ? found.split('=')[1] : def;
};
const QUALITY = parseInt(getArg('quality', '82'), 10);
const MAX_WIDTH = parseInt(getArg('width', '408'), 10);
const FORCE = args.includes('--force');

async function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Dossier introuvable : ${SRC_DIR}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => /\.(png|jpe?g)$/i.test(f));

  if (!files.length) {
    console.log('Aucune photo à traiter.');
    return;
  }

  let originalBytes = 0;
  let outputBytes = 0;
  let processed = 0;
  let skipped = 0;

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const outName = file.replace(/\.(png|jpe?g)$/i, '.webp');
    const outPath = path.join(OUT_DIR, outName);

    const srcStat = fs.statSync(srcPath);
    originalBytes += srcStat.size;

    /* On saute les fichiers déjà convertis et plus récents que la source */
    if (!FORCE && fs.existsSync(outPath)) {
      const outStat = fs.statSync(outPath);
      if (outStat.mtimeMs >= srcStat.mtimeMs) {
        outputBytes += outStat.size;
        skipped++;
        continue;
      }
    }

    try {
      await sharp(srcPath)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(outPath);

      outputBytes += fs.statSync(outPath).size;
      processed++;
    } catch (e) {
      console.warn(`  Échec sur ${file} : ${e.message}`);
    }
  }

  const mb = (b) => (b / 1e6).toFixed(2) + ' Mo';
  const reduction = originalBytes
    ? Math.round(100 - (outputBytes / originalBytes) * 100)
    : 0;

  console.log('');
  console.log(`Photos traitées   : ${processed} (${skipped} déjà à jour)`);
  console.log(`Poids d'origine   : ${mb(originalBytes)}`);
  console.log(`Poids optimisé    : ${mb(outputBytes)}`);
  console.log(`Réduction         : ${reduction} %`);
  console.log(`Sortie            : ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
