---
name: academic-paper-strategist
description: Plan an academic paper in three gated phases — target venue + style guide, theoretical framework + evidence-based gap analysis, then a reviewer-scored outline (7 dimensions / 35 pts, ≥28 to proceed). Port of lishix520/academic-paper-skills (strategist).
---

Ported from https://github.com/lishix520/academic-paper-skills (MIT, Li Shixiong). Original targets Claude Code; this version runs in Word/Cowork. The repo's Python helpers (`evaluate_samples.py`, `gap_analysis.py`) are replaced by the manual checklists below.

## When to use
The user wants to *plan* a paper: "plan a paper on X", "help me pick a venue", "build me an outline", "find the research gap", "is my outline good enough to start writing". For actually drafting prose from an approved outline, use `academic-paper-composer`.

Never skip a gate. Each phase ends with an explicit checkpoint the user must pass before the next phase starts.

## Phase 1 — Platform analysis → target venue + style guide
1. Ask for (or confirm) the target venue. Preprint servers supported by the original: PhilArchive, arXiv, PhilSci-Archive, PsyArXiv; journals also fine.
2. Collect 8–10 sample papers from that venue (user-supplied PDFs, or search). If fewer exist (niche venue), collect what exists and **record the sample-size limitation** in the style guide.
3. Extract from the samples, as a written style guide: typical length, section architecture, argumentative voice (first person? signposting?), citation format and density, how much formalism, abstract shape, keyword conventions.
- **Done when:** a `Style Guide` block exists listing venue, sample count (and any limitation), and the 7 extracted conventions above.

**Gate 1:** show the style guide and the venue rationale. Ask the user to confirm the venue before any literature work.

## Phase 2 — Theoretical framework → literature + gap analysis
1. Map the live positions in the field: who argues what, and the current consensus.
2. State the candidate research gap in one sentence.
3. **Evidence requirement (hard rule from the original): every claimed gap must be backed by 3–5 real citations** that together show the gap is genuine — e.g. papers that raise the problem but do not solve it, or that solve an adjacent case. No fabricated citations, ever. If you cannot find 3 supporting citations, the gap is not established — say so and reformulate.
4. State the paper's contribution as a claim the reviewer could disagree with, not a topic.
- **Done when:** gap sentence + 3–5 verified citations + one-sentence contribution claim are written out.

**Gate 2:** present the gap with its citations. Do not proceed until the user accepts the gap.

## Phase 3 — Outline optimization → reviewer-assessed outline
1. Draft a section-by-section outline. Per section: heading, the assertion it establishes, the evidence/argument used, and approximate word budget summing to the venue's typical length.
2. Run the reviewer simulation and report a table (7 dimensions × 5 pts = 35):
   - Originality — novel contribution to field
   - Argumentation — logical coherence, evidence support
   - Literature — comprehensive, current coverage
   - Methodology — appropriate, rigorous approach
   - Clarity — accessible, well-structured writing
   - Impact — potential influence on field
   - Technical — accuracy, proper citations
3. **Threshold: ≥28/35 to proceed to writing.** Below 28, name the lowest-scoring dimensions, revise the outline, and re-score. Report both scores.
- **Done when:** the outline scores ≥28/35 and the score table is shown to the user.

**Gate 3:** hand off. Say explicitly: outline approved at N/35 — ready for `academic-paper-composer`.

## Writing into the document
When the user wants the outline in Word, write it with the document's existing house styles (see `<doc_state>` custom styles; e.g. `para.style = "iThesis_Style_Normal"`), never hardcoded fonts. Headings via real heading styles, never typed numbers. Keep the reviewer score table in chat unless asked to insert it.
