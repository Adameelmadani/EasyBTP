// Utilitaires de traitement d'image côté client :
// on redimensionne et on compresse les photos avant l'upload afin de limiter
// leur poids et leur résolution (évite d'afficher des images beaucoup plus
// grandes que nécessaire dans l'application).

export const MAX_UPLOAD_MB = 15; // taille maximale acceptée pour le fichier source
export const MAX_IMAGE_DIM = 1920; // dimension max (largeur/hauteur) après redimensionnement
const JPEG_QUALITY = 0.85;

const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/**
 * Redimensionne une image si elle dépasse `maxDim` et la recompresse.
 * Les GIF (animés) et SVG sont renvoyés tels quels. En cas d'erreur, on
 * renvoie le fichier d'origine pour ne jamais bloquer l'upload.
 */
export async function resizeImage(file, { maxDim = MAX_IMAGE_DIM, quality = JPEG_QUALITY } = {}) {
  if (!file || !file.type?.startsWith("image/")) return file;
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;

  try {
    const dataUrl = await readAsDataURL(file);
    const img = await loadImage(dataUrl);
    const { width, height } = img;

    // Déjà assez petite : on ne ré-échantillonne pas (pas d'agrandissement).
    if (width <= maxDim && height <= maxDim) return file;

    const scale = Math.min(maxDim / width, maxDim / height);
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);

    // On garde le PNG en PNG (transparence), sinon on sort en JPEG.
    const type = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
    if (!blob) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + (type === "image/png" ? ".png" : ".jpg");
    return new File([blob], name, { type, lastModified: Date.now() });
  } catch {
    return file;
  }
}
