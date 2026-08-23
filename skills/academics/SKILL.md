---
name: academics
description: "12-agent academic paper writing pipeline. Use this skill whenever the user wants to write, plan, outline, revise, or format an academic paper, thesis chapter, journal article, conference paper, or any scholarly work. Also triggers for: parsing reviewer comments, checking citations, writing abstracts, converting to LaTeX/DOCX, generating AI disclosure statements, or getting guided step-by-step help planning a paper. Handles 6 paper types (IMRaD, Literature Review, Theoretical, Case Study, Policy Brief, Conference), 5 citation formats (APA 7, Chicago, MLA, IEEE, Vancouver), bilingual abstracts (EN + Traditional Chinese), and outputs in LaTeX/DOCX/PDF/Markdown. Trigger keywords: write paper, academic paper, paper outline, guide my paper, revise paper, parse reviews, check citations, write abstract, convert to LaTeX, literature review, conference paper, journal article, thesis, manuscript, 寫論文, 學術論文, 論文大綱."
metadata:
  version: "1.0.0"
  source: "academic-paper v3.1.1"
  agents: 12
---

# Academics — Academic Paper Writing Pipeline

A 12-agent pipeline for writing, planning, reviewing, and formatting academic papers across all disciplines.

## Quick Start

Just tell me what you need:
- `"Write a paper on [topic]"` → full pipeline
- `"Guide my paper on [topic]"` → step-by-step Socratic planning
- `"I got reviewer comments — help me revise"` → revision coach
- `"Write an abstract for this draft"` → abstract only
- `"Check citations in my paper"` → citation audit

---

## 10 Operational Modes

| Mode | Trigger | What You Get |
|------|---------|--------------|
| `full` | "Write a paper" | Complete draft through peer review |
| `plan` | "Guide my paper" / "Help me plan" | Socratic chapter-by-chapter planning |
| `outline-only` | "Paper outline" | Detailed outline + evidence map |
| `revision` | "Revise this paper" | Revised draft with tracked changes |
| `revision-coach` | "Parse my reviews" / "I got reviewer comments" | Structured Revision Roadmap |
| `abstract-only` | "Write an abstract" | Bilingual EN + zh-TW abstract |
| `lit-review` | "Literature review" | Annotated bibliography + synthesis |
| `format-convert` | "Convert to LaTeX" / "Convert citations" | Formatted output / citation conversion |
| `citation-check` | "Check citations" | Citation audit report |
| `disclosure` | "AI disclosure statement" | Venue-specific AI usage statement |

**Not sure?** Start with `plan` — it guides you step by step.

---

## 8-Phase Pipeline (Full Mode)

```
Phase 0: CONFIG        → intake_agent           → Paper Configuration Record
Phase 1: RESEARCH      → literature_strategist   → Search Strategy + Sources
Phase 2: ARCHITECTURE  → structure_architect     → Outline + Word Count Plan
Phase 3: ARGUMENTATION → argument_builder        → Argument Blueprint
Phase 4: DRAFTING      → draft_writer            → Complete Draft
Phase 5a: CITATIONS    → citation_compliance ──┐ → Citation Audit
Phase 5b: ABSTRACT     → abstract_bilingual  ──┘ → Bilingual Abstract (parallel)
Phase 6: PEER REVIEW   → peer_reviewer           → Review Report (max 2 rounds)
Phase 7: FORMAT        → formatter               → Final Output Package
```

**Checkpoint rules:**
- ⚠️ User must confirm Paper Configuration Record before Phase 1 starts
- User approves outline before Phase 3
- ⚠️ Max 2 revision rounds; unresolved items → "Acknowledged Limitations"

---

## 12 Agents

| Agent | Role | Phase |
|-------|------|-------|
| `intake_agent` | Configuration interview; detects handoff from deep-research | Phase 0 |
| `literature_strategist_agent` | Search strategy, source screening, annotated bibliography, literature matrix | Phase 1 |
| `structure_architect_agent` | Structure selection, detailed outline, word count allocation, evidence mapping | Phase 2 |
| `argument_builder_agent` | Thesis, sub-arguments, CER chains, counter-arguments | Phase 3 |
| `draft_writer_agent` | Section-by-section drafting, register adjustment, word count tracking | Phase 4 |
| `citation_compliance_agent` | Citation format verification, DOI checking, auto-correction | Phase 5a |
| `abstract_bilingual_agent` | Independent EN + zh-TW abstracts, 5-7 keywords each | Phase 5b |
| `peer_reviewer_agent` | 5-dimension simulated review, revision suggestions | Phase 6 |
| `formatter_agent` | LaTeX/DOCX/PDF/Markdown output, journal formatting, cover letter | Phase 7 |
| `socratic_mentor_agent` | Plan mode: chapter-by-chapter Socratic guidance | Plan Steps 0–3 |
| `visualization_agent` | Publication-quality figures (Python matplotlib / R ggplot2) | Phase 4/7 |
| `revision_coach_agent` | Parse unstructured reviewer comments into Revision Roadmap | Revision-Coach |

> Agent details: see `agents/` directory. Each agent has its own file with full instructions, algorithms, quality gates, and collaboration rules.

---

## Paper Types & Citation Formats

**6 Paper Types**: IMRaD · Literature Review · Theoretical · Case Study · Policy Brief · Conference Paper

**5 Citation Formats**: APA 7th (default) · Chicago 17th · MLA 9th · IEEE · Vancouver

**Output Formats**: Markdown · LaTeX (.tex + .bib) · DOCX (via Pandoc) · PDF · Combined

---

## Configuration Parameters (Phase 0)

The intake_agent collects:

| Parameter | Options |
|-----------|---------|
| Paper Type | IMRaD / Literature Review / Theoretical / Case Study / Policy Brief / Conference |
| Discipline | Any field; affects register, databases, citation style |
| Target Journal | Specific journal or "General" |
| Citation Format | APA 7 / Chicago / MLA / IEEE / Vancouver |
| Output Format | Markdown / LaTeX / DOCX / PDF / Combined |
| Body Language | EN / zh-TW / Bilingual |
| Abstract | Bilingual / EN-only / zh-TW-only |
| Word Count | Auto-suggested by type; user can override |
| Existing Materials | Literature, data, drafts, reviewer feedback |
| Co-Authors | Single-author or multi-author + CRediT roles |
| Funding | Funder names, grant numbers, or "no funding" |
| Style Profile | Optional: provide 3+ past papers to calibrate voice |

---

## Quality Standards

### Writing
- Every claim has a citation or is supported by original data
- Zero citation orphans (in-text ↔ reference list perfectly matched)
- Consistent academic register throughout
- Word count within ±10% of target

### Citations
- ⚠️ **IRON RULE**: Every citation verified via DOI or web search — no fabricated references
- 100% format compliance with selected style
- All available DOIs included
- Self-citation ratio flagged if >15%

### Peer Review (5 Dimensions)
- Originality (20%) · Methodological Rigor (25%) · Evidence Sufficiency (25%) · Argument Coherence (15%) · Writing Quality (15%)
- Every criticism includes a specific suggested fix
- Max 2 revision rounds

### Mandatory Paper Elements
⚠️ **IRON RULE**: Every paper must include:
- Data Availability Statement
- Ethics Declaration
- Author Contributions (CRediT taxonomy)
- Conflict of Interest Statement
- Funding Acknowledgment
- AI Usage Disclosure Statement
- Limitations Section

---

## Anti-Patterns (Never Do These)

| Anti-Pattern | Correct Behavior |
|-------------|-----------------|
| AI-typical terms: "delve into", "crucial", "it is important to note" | Use discipline-specific vocabulary |
| Em dash overuse (>2 per page) | Use commas, parentheses, or restructure |
| Throat-clearing openers: "In this section, we will discuss..." | Start with the claim directly |
| Uniform paragraph lengths | Vary naturally (2–8 sentences) |
| ⚠️ Fabricated citations | Every citation must be verified |
| Accepting all reviewer feedback sycophantically | Use REVIEWER_DISAGREE when justified |

---

## Deep Research Handoff

If you have materials from `deep-research` (RQ Brief, Bibliography, Synthesis, INSIGHT Collection), the intake_agent auto-detects and imports them — skipping redundant steps. Just share what you have.

---

## Agent Files

Read the relevant agent file when activating that phase:

- `agents/intake_agent.md` — Phase 0 interview protocol
- `agents/literature_strategist_agent.md` — Phase 1 search strategy
- `agents/structure_architect_agent.md` — Phase 2 outline design
- `agents/argument_builder_agent.md` — Phase 3 argument construction
- `agents/draft_writer_agent.md` — Phase 4 drafting
- `agents/citation_compliance_agent.md` — Phase 5a citation audit
- `agents/abstract_bilingual_agent.md` — Phase 5b bilingual abstract
- `agents/peer_reviewer_agent.md` — Phase 6 peer review
- `agents/formatter_agent.md` — Phase 7 output formatting
- `agents/socratic_mentor_agent.md` — Plan mode guidance
- `agents/visualization_agent.md` — Figure generation
- `agents/revision_coach_agent.md` — Revision roadmap
