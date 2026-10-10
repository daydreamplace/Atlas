import "../../styles/nfc-paper-mark.css";

interface NfcPaperMarkProps {
  readonly className?: string;
}

const AUTHENTICATION_ASSET_PATH = "images/main-page/authentication";

function getBaseAwareImageUrl(fileName: string): string {
  const baseUrl = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  return `${baseUrl}${AUTHENTICATION_ASSET_PATH}/${fileName}`;
}

const nfcPaperMarkAssets = {
  paper: getBaseAwareImageUrl("nfc-paper-blank-v3.webp"),
  mark: getBaseAwareImageUrl("nfc-n-mark-handdrawn-v1.webp"),
} as const;

export function NfcPaperMark({ className = "" }: NfcPaperMarkProps) {
  return (
    <span
      className={`nfc-paper-mark ${className}`.trim()}
      data-art-piece="nfc-n-mark-illustration"
      aria-hidden="true"
    >
      <img
        className="nfc-paper-mark__paper"
        src={nfcPaperMarkAssets.paper}
        alt=""
        width="1254"
        height="1254"
        draggable="false"
        loading="lazy"
        decoding="async"
      />
      <img
        className="nfc-paper-mark__mark"
        src={nfcPaperMarkAssets.mark}
        alt=""
        width="1364"
        height="1153"
        draggable="false"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
