# Visual thesis — The migration console

## Direction

Bookmark Import Audit is a **mid-century instrument panel**: a calm, purpose-built
bench tool for inspecting a valuable archive before it crosses systems. The
reference is 1950s–60s laboratory equipment—warm enamel, phenolic knobs, engraved
labels, graph paper, and one precise signal lamp—not nostalgia as decoration.
Hierarchy comes from instrument grouping and confident typography, while the
bookmark tree remains the thing being measured.

The product intentionally uses a single warm-light treatment. An explicit deep
navy page surround frames an ivory work surface, as physical equipment would;
this avoids a theme toggle changing the perceived severity of audit states.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#172B33` | Primary text / deep panel |
| `--paper` | `#F4EBD5` | Main enamel face |
| `--surface` | `#FFF9E9` | Raised reading surface |
| `--muted` | `#52646A` | Secondary text (7:1 on paper) |
| `--line` | `#9A927E` | Instrument rules and inactive tracks |
| `--signal` | `#D45532` | Primary action / alert lamp |
| `--signal-dark` | `#8F2F1A` | Hover and compact warning text |
| `--teal` | `#14756E` | Safe / ready state |
| `--amber` | `#9B5B08` | Review-required state |
| `--danger` | `#A62E2E` | Parse failures / destructive risk |
| `--focus` | `#116EA0` | 3px keyboard focus ring |

Color never stands alone: every status includes a label, count, or symbol. All
body and control combinations target WCAG AA contrast (4.5:1 or better).

## Type and spacing

- **Display / labels:** `Arial Narrow`, `Aptos Narrow`, `Roboto Condensed`, system
  sans. Condensed uppercase is reserved for engraved panel labels and large
  numbers, never paragraphs.
- **Reading / controls:** `Georgia`, `Charter`, serif for calm legibility and a
  period-manual character; UI fallbacks are entirely local system fonts. No font
  download is needed, keeping first load private and fast.
- Scale: 13px label, 16px body, 20px section, 30–46px display. Body remains at
  least 16px; leading 1.5; prose measure 68ch.
- Spacing uses an 8px base with 4px optical adjustments: 4, 8, 12, 16, 24, 32,
  48, 64. Controls are at least 44px tall and neighboring targets have 8px gaps.

## Interaction grammar

- **Load** is the only orange control before an audit; the file well is a broad,
  keyboard-addressable intake tray.
- **Measure** becomes a horizontal rail of four counters. Findings are grouped
  like gauge readouts with large tabular numerals and plain-language diagnoses.
- **Trace** uses an indented path tree and hairline leaders, making duplicate
  context visible instead of flattening it into cards.
- **Repair** is explicit and conservative. Collision labels are disambiguated in
  exported HTML; URLs are never silently removed. A before/after naming ledger
  makes the mutation inspectable.
- **Export** controls are placed together at the end of the audit and say exactly
  what they produce.
- **Destination profile** is a compact engraved control beside the gauges. Its
  plain label and dated fixture note make the change in guidance inspectable.
- **Demo first view** removes the landing illustration and opens on a dense
  instrument readout: file, gauges, four categories, and exports. This keeps the
  established console identity while making the one-click result immediate.

The responsive phone version drops the decorative dial legend, stacks gauges in
two columns, changes tables into labelled records, and keeps the audit actions in
document flow rather than fixing them over content.

## Depth and motion

Surfaces use 1–2px borders, small offset shadows, and inset highlights to evoke
painted metal and paper—not glass effects. On file load, the measurement needle
settles once (220ms transform) and result sections reveal from their source
(180ms opacity/translate). Buttons depress by 1px. Nothing loops.

With `prefers-reduced-motion: reduce`, all transforms, smooth scrolling, and
transitions are disabled; state changes remain legible through labels, counts,
and borders.

## Asset plan and provenance

### Hero illustration: `migration-console`

- Subject: an overhead three-quarter view of a compact analog inspection console
  mapping a branching bookmark filing tree from an input tray to a clean output
  tray; abstract paper tabs only, no readable text.
- World/materials: 1960s laboratory bench, powder-coated ivory steel, deep navy
  faceplate, red-orange signal lamp, teal indicator, brass fasteners, graph-paper
  path diagram.
- Light/lens: soft north-window studio light, 50mm product photography, crisp
  shallow relief but all controls coherent.
- Palette words: warm ivory enamel, petrol navy, burnt orange, oxidized teal,
  graphite.
- Negative list: people, hands, browsers, brand logos, readable text, watermark,
  neon gradient, glossy SaaS mockup, impossible wiring, duplicated knobs.
- Prompt: “Original editorial product illustration, overhead three-quarter view
  of a compact 1960s laboratory inspection console that maps a branching paper
  filing tree from a left input tray to a tidy right output tray, warm ivory
  powder-coated steel, petrol navy faceplate, one burnt-orange signal lamp and
  one oxidized-teal status lamp, brass fasteners, subtle graph-paper path marks,
  soft north-window studio light, 50mm product photography, coherent physical
  controls, reserved negative space, no people, no hands, no browser screenshot,
  no brands, no readable text, no watermark, no logos, no neon gradient, no
  glossy SaaS style.”

Generated with the factory Azure image model (`factory-image`) on 2026-08-28.
Original asset generated for this product; no third-party source material. The
final crop is reviewed for text artifacts, brands, seams, and unintended symbols,
then exported as WebP (and PNG fallback) within the 300 KB hero budget. Hand-made
SVG app icons use the same input-tree/output-tray motif and are MIT-licensed with
the repository.

### Social preview

`public/assets/social-preview.jpg` is a 1200 × 630 crop composed from the
reviewed `migration-console` original on 2026-08-28. It contains no added text,
brands, or third-party material and is used only for Open Graph and Twitter
previews.

`public/icons/apple-touch-icon.png` is a 180 × 180 resize of the hand-made app
icon. It was exported locally with ImageMagick on 2026-08-29.
