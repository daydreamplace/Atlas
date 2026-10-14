const ORIGINAL_ASSET_BASE =
  "https://static.igem.wiki/teams/6479/wiki/main-page";
const ATLAS_ART: Record<string, string> = {
  "counterfeit/product-samples.webp": "samples.svg",
  "counterfeit/research-paper.webp": "tile.svg",
  "k-beauty/skincare-collection.webp": "organisms.svg",
  "k-beauty/seoul-origin.webp": "colony.svg",
  "authentication/qr-paper-v2.webp": "frame.svg",
  "authentication/hologram-security-flat-v3.webp": "light.svg",
  "authentication/hologram-security-peeled-v3.webp": "light.svg",
  "authentication/serial-paper-v2.webp": "index.svg",
  "authentication/nfc-paper-blank-v3.webp": "tile.svg",
  "authentication/product-jar-pencil-v2.webp": "field.svg",
  "authentication/open-carton-pencil-v2.webp": "surface.svg",
  "limitations/legal-pad-paper-v1.webp": "tile.svg",
};
export function getMainPageAssetUrl(assetPath: string): string {
  const path = assetPath.replace(/^\/+/, "");
  return ATLAS_ART[path]
    ? `${import.meta.env.BASE_URL}images/atlas/${ATLAS_ART[path]}`
    : `${ORIGINAL_ASSET_BASE}/${path}`;
}
