# Notes for AI assistants

Read **[README.md](README.md)** first — it covers the stack, where to edit
(`src/contents/*`, `src/pages.ts`), the `npm` commands, and the iGEM asset rules
(images via the uploads tool, videos from iGEM servers, no external CDNs).

## Responsible & honest use

@.claude/RESPONSIBLE_AI_USE.md

## Writing content pages

- Page text goes in `src/contents/*.tsx` as plain HTML (`<h2>`, `<p>`,
  `<figure>`, `<table>` …); `src/styles/typography.css` styles it. Use only
  the elements and classes shown on the `/style-guide` page
  (`src/contents/style-guide.tsx`) — no inline font sizes, colours or spacing.
- To change how text looks, change a `--type-*` token in `typography.css`,
  not individual pages.
- Paths are set in `src/pages.ts`; keep the standard URLs listed at the top
  of that file unchanged.

## Guardrails

- Don't change `LICENSE` or the `Footer` component's license notice + GitLab
  repository link (both required on every page for judging).
- `.gitlab-ci.yml` works as-is; change it only if you know what you're doing —
  any build/deploy issues that result are the team's responsibility.
