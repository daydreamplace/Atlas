# Atlas · bin(ary)room

An interactive, microbe-inspired web portfolio exploring form, motion, and spatial depth.

## The experience

- A Canvas microbe field with cursor repulsion, a movable light, and a magnifying lens.
- Depth-dependent movement, size, sharpness, and contrast, with stationary typography.
- The original ten-section homepage composition, with Atlas-themed copy and replacement illustrations.
- Linked map-to-field transitions, viewfinder sequences, and artwork focus tours, preserving the original scroll interactions.
- Responsive navigation and locally hosted fonts and images.

This is a visual design and frontend study. It does not present scientific experiments, validation, research findings, or institutional affiliations as the author's work.

## Development

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. The base path is `/Atlas/`.

```sh
npm run build
npm run lint
npm run preview
```

## Credits and license

This project adapts frontend patterns and original microbe artwork from the [2026 PSI Korea iGEM wiki](https://gitlab.igem.org/2026/psi-korea), including its source template. The original institution's experimental narrative, contact details, and team roster are not part of this portfolio. The interface and portfolio framing have been modified for Atlas by bin(ary)room; original materials retain their authorship and attribution. AI-assisted implementation was used during development.

The original and adapted content is distributed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/); see `LICENSE`. Font licenses and source notes are included alongside their files in `public/fonts/`.
