# Default portfolio — design references

Direction: black ground, white type, small red signals; projects before biography.
The existing Archive theme remains a separately selectable theme.

Reference review, 2026-11-17:

- [Awwwards](https://www.awwwards.com/) and its current portfolio listing supplied the live sites below.
- [Tom de Koning](https://www.tomdekoning.work/), [Awwwards entry](https://www.awwwards.com/sites/tomdekoning-work/): oversized personal typography and a compact, project-led narrative. At a 1440px viewport the name is approximately 194px and the Work title is 461px. The original uses a portrait, a project slider and GSAP. The default portfolio uses its own name composition, source images and native CSS/React interactions.
- [Matthis Garnier](https://www.matthisgarnier.com/), [Awwwards entry](https://www.awwwards.com/sites/mg-museum-of-curiosities): an interactive object is a way to explore actual work. The portfolio applies this principle to an inspectable pixel portrait and a working cellular automaton; it does not reproduce the desktop UI or widgets.
- [Sadok Cervantes](https://sadok.mx/), [Awwwards entry](https://www.awwwards.com/sites/sadok-cervantes-portfolio): a playable interface has a keyboard-accessible content path. This portfolio's experiment starts paused and every action has an explicit button.
- [Preymaker](https://preymaker.com/), [Awwwards entry](https://www.awwwards.com/sites/preymaker): full-size work and an exceptionally small UI palette. The portfolio adapts its hierarchy to original project illustrations.

These were references for hierarchy and interaction, not sources of artwork or fonts.
The first three are nominees at the time of this review; Preymaker is the November 14, 2026 Site of the Day.

Rendering: semantic DOM + CSS, original-derived WebP portrait layers, Canvas 2D for
Conway's Game of Life. No animation or 3D framework is required. The portrait has
an explicit touch/keyboard toggle. The automaton is paused by default, stops when
off-screen/hidden, and only runs after a user action. Reduced-motion retains the
finished layout and explicit controls.

Type: self-hosted Space Grotesk + IBM Plex Mono + Noto Sans SC, all SIL OFL 1.1.
See `app/fonts/README.md` and the included license files.

ExMachina uses an original conceptual illustration based only on its public
description: Rust, collective intelligence and multi-agent collaboration. No
application screenshots, conversations or session data are included in the site.
The DSH-Creator exhibit is a typographic visualization of the
existing project's declared 12 methodology skills, 6 writing styles, 1 plugin and
7 tools. Project Space's live exhibit is a small standalone Conway simulation.
