---
name: academic-paper-composer
description: Write a full paper from an approved outline in three phases — style-guide foundation + chapter plan, systematic drafting with per-chapter quality checks, then polish and submission prep with a final 35-point evaluation. Port of lishix520/academic-paper-skills (composer).
---

Ported from https://github.com/lishix520/academic-paper-skills (MIT, Li Shixiong). Original targets Claude Code; this version runs in Word/Cowork. The repo's Python helpers (`chapter_quality_check.py`, `final_evaluation.py`) are replaced by the manual checklists below.

## When to use
The user has an outline (from `academic-paper-strategist` or their own) and wants prose: "write the paper from this outline", "draft section 3", "polish this chapter", "get this ready to submit". For venue selection, gap analysis, or outline scoring, use `academic-paper-strategist` first.

## Phase 1 — Foundation
1. Load or rebuild the style guide: target venue, total word budget, citation format, voice, section architecture. If no style guide exists, ask for the venue and derive one before writing a word.
2. Turn the outline into a chapter plan: per section — assertion, evidence, word budget, citation slots.
3. Post the chapter plan in chat as a numbered ledger before drafting.
- **Done when:** the numbered chapter ledger and word budgets are visible to the user.

## Phase 2 — Systematic writing
Draft **one section per turn / per `execute_office_js` call**, in outline order. Never generate the whole paper in one call.

Before each new section, read back the headings already in the document and compare against the ledger — if a section is duplicated or out of order, reconcile before appending.

After each section, run the per-chapter quality check and report pass/fail per item:
- Assertion in the section's opening sentence, not buried
- Every empirical or attributive claim carries a citation; **no invented citations, ever** — if a source can't be verified, flag it rather than filling it in
- Within ±15% of its word budget
- Terminology consistent with earlier sections (same term for the same concept)
- No unsupported hedging, no filler transitions ("It is important to note that")
- Connects explicitly to the paper's central contribution claim
- **Done when:** each drafted section has a reported checklist result and any FAIL is fixed before moving on.

## Phase 3 — Polish + submission prep
1. Full-manuscript evaluation using the same 7-dimension / 35-point rubric as the strategist (Originality, Argumentation, Literature, Methodology, Clarity, Impact, Technical). Report the table and the total.
2. Below 28/35: name the weakest dimensions, revise, re-score, report both.
3. Submission pass: abstract and keywords match venue conventions; reference list complete and format-consistent; heading levels uniform; figure/table captions numbered and cross-referenced; total length within venue limits.
- **Done when:** total ≥28/35 and every submission-pass item is confirmed.

## Writing into the document
- Insert with the document's existing house styles (see `<doc_state>` custom styles, e.g. `para.style = "iThesis_Style_Normal"`), not `styleBuiltIn = "Normal"` and not hardcoded fonts.
- Headings via real heading styles; never type section numbers — Word generates them.
- Thai or Thai/English-mixed body text: check the `thai-docx` skill for line-breaking handling.
- If the document is a thesis template with content controls, fill the controls; never delete the control container.
- Read back text + style after every insertion and report what landed.
