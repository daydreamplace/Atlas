const MAIN_PAGE_ASSET_BASE =
  "https://static.igem.wiki/teams/6479/wiki/main-page";

export function getMainPageAssetUrl(assetPath: string): string {
  return `${MAIN_PAGE_ASSET_BASE}/${assetPath.replace(/^\/+/, "")}`;
}
