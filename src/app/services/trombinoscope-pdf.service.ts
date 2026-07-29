import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ContentService } from './content.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/* Palette du document */
const COLORS = {
  pageBg: '#eef3fa',      // fond bleu très clair des pages
  coverDark: '#3d4f63',   // bandeau sombre de la couverture
  coverAccent: '#5b9bd5', // bleu accent
  cardBg: '#ffffff',
  cardBorder: '#c9d6e8',
  name: '#1f3a5f',
  contact: '#2f6db3',
  text: '#3c4858',
  muted: '#8492a6',
  sermentMuted: '#aab4c2', // serment : gris clair discret
};

const COLUMNS_PER_ROW = 3;

/* ── Géométrie de la page ──
 * Les largeurs de colonnes sont FIXES et calculées depuis la page :
 * avec des largeurs '*', pdfmake élargit les colonnes jusqu'à la largeur
 * minimale de leur contenu (mot insécable le plus long, ex. un email),
 * ce qui fait déborder la 3e colonne hors de la feuille. */
const PAGE_WIDTH = 595.28; // A4 portrait (pt)
const PAGE_MARGIN_X = 28;  // ~1 cm : compatible marges matérielles d'imprimante
const GRID_PADDING = 4;    // écart entre fiches (layout du tableau externe)
const CARD_WIDTH = Math.floor(
  (PAGE_WIDTH - 2 * PAGE_MARGIN_X - 2 * COLUMNS_PER_ROW * GRID_PADDING) /
    COLUMNS_PER_ROW
);

/* Hauteur fixe d'une fiche (pt). Calée sur le pire cas — toutes les
   informations présentes — pour que toutes les cases aient la même taille,
   même quand un avocat a moins de renseignements. */
const CARD_HEIGHT = 112;

/** Insère des césures invisibles dans les mots longs (emails, urls...)
 *  pour qu'ils reviennent à la ligne dans la fiche au lieu de déborder. */
function breakable(text: any): string {
  if (!text) return text;
  return String(text)
    .replace(/([@./_-])/g, '$1\u200b')
    .replace(/([^\s\u200b]{14})(?=[^\s\u200b])/g, '$1\u200b');
}

@Injectable({ providedIn: 'root' })
export class TrombinoscopePdfService {
  /** Cache des images déjà converties en base64 */
  private imageCache = new Map<string, string>();

  constructor(private contentService: ContentService) {}

  /**
   * Génère et ouvre le PDF du trombinoscope.
   * @param lawyers tableau { type, value } issu de la BDD
   * @param year année/millésime affiché sur la couverture
   */
  /**
   * Génère et ouvre le PDF du trombinoscope.
   * @param lawyers tableau { type, value } issu de la BDD
   * @param year année/millésime affiché sur la couverture
   * @param onProgress callback appelé avec un pourcentage (0-100) et un libellé d'étape
   */
  async generate(
    lawyers: any[],
    year: string | number,
    onProgress?: (percent: number, label: string) => void
  ): Promise<void> {
    const report = (p: number, label: string) =>
      onProgress?.(Math.max(0, Math.min(100, Math.round(p))), label);

    report(0, 'Préparation…');

    const sorted = [...lawyers].sort((a, b) =>
      (a.value?.nom ?? '').localeCompare(b.value?.nom ?? '', 'fr', {
        sensitivity: 'base',
      })
    );

    /* 1. Chargement des photos par lots (progression + serveur ménagé).
     *    Le chargement des images représente ~90% du temps total ; on le
     *    mappe donc sur la plage 0-90% de la barre. */
    const total = sorted.length || 1;
    const BATCH_SIZE = 12;
    const images: string[] = new Array(total);
    let done = 0;

    for (let start = 0; start < total; start += BATCH_SIZE) {
      const batch = sorted.slice(start, start + BATCH_SIZE);
      const loaded = await Promise.all(
        batch.map((l) => this.loadLawyerImage(l.value))
      );
      loaded.forEach((img, i) => (images[start + i] = img));
      done += batch.length;
      report((done / total) * 90, `Chargement des photos (${done}/${total})`);
    }

    /* 2. Construction des fiches */
    report(92, 'Mise en page des fiches…');
    const cards = sorted.map((l, i) => this.buildCard(l.value, images[i]));

    /* 3. Regroupement en lignes de 3 */
    const body: any[][] = [];
    for (let i = 0; i < cards.length; i += COLUMNS_PER_ROW) {
      const row = cards.slice(i, i + COLUMNS_PER_ROW);
      while (row.length < COLUMNS_PER_ROW) {
        row.push({ text: '', border: [false, false, false, false] });
      }
      body.push(row);
    }

    const doc: any = {
      pageSize: 'A4',
      pageMargins: [PAGE_MARGIN_X, 40, PAGE_MARGIN_X, 34],
      background: (currentPage: number, pageSize: any) => ({
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: pageSize.width,
            h: pageSize.height,
            color: currentPage === 1 ? COLORS.pageBg : COLORS.pageBg,
          },
        ],
      }),
      header: (currentPage: number) =>
        currentPage === 1
          ? null
          : {
              text: `TROMBINOSCOPE ${year} — ORDRE DES AVOCATS — BARREAU DE TOURS`,
              alignment: 'center',
              fontSize: 7,
              characterSpacing: 1,
              color: COLORS.muted,
              margin: [0, 16, 0, 0],
            },
      footer: (currentPage: number, pageCount: number) =>
        currentPage === 1
          ? null
          : {
              text: `${currentPage - 1} / ${pageCount - 1}`,
              alignment: 'center',
              fontSize: 8,
              color: COLORS.muted,
              margin: [0, 8, 0, 0],
            },
      content: [
        ...this.buildCover(year),
        {
          table: {
            widths: [CARD_WIDTH, CARD_WIDTH, CARD_WIDTH],
            body,
            dontBreakRows: true,
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => GRID_PADDING,
            paddingRight: () => GRID_PADDING,
            paddingTop: () => GRID_PADDING,
            paddingBottom: () => GRID_PADDING,
          },
        },
      ],
      defaultStyle: { fontSize: 8, color: COLORS.text },
      info: {
        title: `Trombinoscope ${year} - Barreau de Tours`,
        author: 'Ordre des Avocats - Barreau de Tours',
      },
    };

    report(96, 'Génération du PDF…');
    await new Promise<void>((resolve) => {
      pdfMake.createPdf(doc).getBlob((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Trombinoscope_${year}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        report(100, 'Terminé');
        resolve();
      });
    });
  }

  /* ─────────────────────── Couverture ─────────────────────── */

  private buildCover(year: string | number): any[] {
    const logo = this.contentService.logoBase64;
    return [
      {
        canvas: [
          // bandeau sombre principal
          { type: 'rect', x: -PAGE_MARGIN_X, y: -16, w: PAGE_WIDTH, h: 560, color: COLORS.coverDark },
          // pastille année
          { type: 'rect', x: 447, y: 4, w: 92, h: 40, color: COLORS.coverAccent },
          // liseré accent en bas du bandeau
          { type: 'rect', x: -PAGE_MARGIN_X, y: 544, w: PAGE_WIDTH, h: 5, color: COLORS.coverAccent },
        ],
      },
      {
        text: `${year}`,
        absolutePosition: { x: 447, y: 16 },
        width: 92,
        alignment: 'center',
        color: '#ffffff',
        bold: true,
        fontSize: 20,
      },
      { image: logo, width: 110, absolutePosition: { x: 60, y: 90 } },
      {
        text: 'TROMBINOSCOPE',
        absolutePosition: { x: 60, y: 400 },
        color: '#ffffff',
        fontSize: 42,
        bold: true,
        characterSpacing: 2,
      },
      {
        text: 'Ordre des Avocats — Barreau de Tours',
        absolutePosition: { x: 62, y: 455 },
        color: '#c9d6e8',
        fontSize: 14,
      },
      {
        absolutePosition: { x: 62, y: 640 },
        stack: [
          { text: 'ORDRE DES AVOCATS', style: 'coverInfo', bold: true },
          { text: 'BARREAU DE TOURS', style: 'coverInfo', bold: true },
          { text: 'SITE : barreaudetours.fr', style: 'coverInfo' },
          { text: 'MAIL : ordre@barreaudetours.fr', style: 'coverInfo' },
        ],
      },
      { text: '', pageBreak: 'after' },
      /* styles utilisés uniquement par la couverture */
    ].map((el: any) => {
      if (el.stack) {
        el.stack = el.stack.map((s: any) => ({
          ...s,
          fontSize: 12,
          color: COLORS.coverAccent,
          margin: [0, 2, 0, 2],
        }));
      }
      return el;
    });
  }

  /* ─────────────────────── Fiche avocat ─────────────────────── */

  /* Taille de police du nom, réduite pour les noms très longs afin qu'ils
     tiennent dans la hauteur fixe de la fiche sans la faire déborder. */
  private nameFontSize(nomComplet: string): number {
    const l = nomComplet.length;
    if (l > 40) return 6.6;
    if (l > 32) return 7.4;
    if (l > 24) return 8.4;
    return 9.5;
  }

  /* Taille de police du cabinet, réduite si le libellé est long. */
  private cabinetFontSize(cabinet: string): number {
    return cabinet.length > 30 ? 5.6 : 6.3;
  }

  private buildCard(v: any, image: string): any {
    const nomComplet = `${v?.prenom ?? ''} ${(v?.nom ?? '').toUpperCase()}`.trim();

    const infos: any[] = [
      {
        text: nomComplet,
        bold: true,
        fontSize: this.nameFontSize(nomComplet),
        color: COLORS.name,
      },
    ];

    if (v?.cabinet) {
      infos.push({
        text: breakable(v.cabinet),
        fontSize: this.cabinetFontSize(v.cabinet),
        italics: true,
        color: COLORS.muted,
        margin: [0, 1, 0, 0],
      });
    }
    if (v?.titre) {
      infos.push({
        text: v.titre,
        fontSize: 6.3,
        bold: true,
        color: COLORS.text,
      });
    }

    if (v?.tel) {
      infos.push({
        text: v.tel,
        fontSize: 8,
        bold: true,
        color: COLORS.contact,
        margin: [0, 3, 0, 0],
      });
    }
    if (v?.email) {
      infos.push({
        text: breakable(v.email),
        fontSize: 6.8,
        color: COLORS.contact,
      });
    }

    const adresse: string[] = [];
    if (v?.adresse) adresse.push(v.adresse);
    const cpVille = [v?.cp, v?.ville].filter(Boolean).join(' ');
    if (cpVille) adresse.push(cpVille);
    if (v?.case) adresse.push(`Case n°${v.case}`);
    if (adresse.length) {
      infos.push({
        text: breakable(adresse.join('\n')),
        fontSize: 7,
        color: COLORS.text,
        margin: [0, 3, 0, 0],
      });
    }

    if (v?.serment) {
      infos.push({
        text: `Prestation de serment : ${v.serment}`,
        fontSize: 5.5,
        color: COLORS.sermentMuted,
        margin: [0, 3, 0, 0],
      });
    }

    /* La fiche est une table à une cellule pour disposer d'un cadre + fond */
    return {
      table: {
        widths: ['*'],
        heights: [CARD_HEIGHT],
        body: [
          [
            {
              fillColor: COLORS.cardBg,
              margin: [4, 4, 4, 4],
              columns: [
                { image, width: 46, height: 58 },
                { width: '*', stack: infos, margin: [6, 0, 0, 0] },
              ],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0.7,
        vLineWidth: () => 0.7,
        hLineColor: () => COLORS.cardBorder,
        vLineColor: () => COLORS.cardBorder,
      },
    };
  }

  /* ─────────────────────── Images ─────────────────────── */

  private async loadLawyerImage(v: any): Promise<string> {
    const key = `${v?.nom ?? ''}_${v?.prenom ?? ''}`;
    if (this.imageCache.has(key)) return this.imageCache.get(key)!;

    const candidates = [
      `assets/img/avocats/webp/${v?.nom}_${v?.prenom}.webp`,
      `assets/img/avocats/${v?.nom}_${v?.prenom}.png`,
      v?.imageUrl,
    ].filter(Boolean);

    for (const url of candidates) {
      try {
        const base64 = await this.urlToBase64(url);
        this.imageCache.set(key, base64);
        return base64;
      } catch {
        /* on essaie le candidat suivant */
      }
    }

    const placeholder = this.buildPlaceholder(v?.prenom, v?.nom);
    this.imageCache.set(key, placeholder);
    return placeholder;
  }

  private urlToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          /* Photo redimensionnée en 3:4 pour homogénéiser la grille */
          const w = 138;
          const h = 174;
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d')!;
          const ratio = Math.max(w / img.width, h / img.height);
          const dw = img.width * ratio;
          const dh = img.height * ratio;
          ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  /** Vignette de repli : initiales sur fond coloré */
  private buildPlaceholder(prenom = '', nom = ''): string {
    const canvas = document.createElement('canvas');
    canvas.width = 138;
    canvas.height = 174;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#dfe7f2';
    ctx.fillRect(0, 0, 138, 174);
    ctx.fillStyle = '#8fa3bd';
    ctx.font = 'bold 52px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const initials = `${(prenom[0] ?? '').toUpperCase()}${(
      nom[0] ?? ''
    ).toUpperCase()}`;
    ctx.fillText(initials || '?', 69, 90);
    return canvas.toDataURL('image/png');
  }
}
