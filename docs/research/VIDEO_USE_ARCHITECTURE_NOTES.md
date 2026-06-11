# Video-Use Architecture Notes

Research document for Talocode video generation/editing workflows.  
**Reference only:** [browser-use/video-use](https://github.com/browser-use/video-use)  
**Status:** Architecture planning — no production code copied or imported.

---

## What video-use is

**video-use** is a skill-based, coding-agent-driven video editing system. A developer drops raw footage into a folder, chats with an agent (Claude Code, Codex, etc.), and receives `final.mp4` in an `edit/` directory beside the sources.

It is **not** a traditional NLE. It is an agent workflow that converts video into structured context the LLM can reason over, then executes cuts through a deterministic render pipeline.

### Summary

| Capability | How it works |
|------------|--------------|
| **Coding-agent-driven editing** | Agent reads structured artifacts, proposes strategy, user confirms, agent writes EDL and calls helpers |
| **Raw footage in → final.mp4 out** | Sources stay untouched; all outputs land in `<videos_dir>/edit/` |
| **Transcript + on-demand visual timeline** | Layer 1: always-loaded `takes_packed.md` (~12KB). Layer 2: `timeline_view` PNG composites fetched only at decision points |
| **EDL render pipeline** | Agent produces `edl.json`; `render.py` extracts segments, grades, concats, overlays, burns subtitles |
| **Self-eval before final output** | After render, `timeline_view` at every cut boundary; fix and re-render up to 3 passes before showing user |

### Pipeline

```
Transcribe → Pack → LLM Reasons → EDL → Render → Self-Eval
                                                      │
                                                      └─ issue? fix + re-render (max 3)
```

### Token economics (core proof)

> Naive approach: 30,000 frames × 1,500 tokens = **45M tokens of noise**.  
> Video-use: **12KB text + a handful of PNGs**.

Same design move as browser-use: give the LLM a structured representation, not raw sensory input.

---

## Core insight

**Video should be converted into structured context before the LLM reasons over it.**

Do not dump frames into the model. The model reads:

1. **Word-level transcript** with timestamps, speaker labels, and audio events
2. **Packed phrase view** (`takes_packed.md`) — primary reading surface
3. **Timeline composites** — on-demand filmstrip + waveform + word labels for ambiguous decisions only

This is the Talocode principle applied to video: **structured perception layer for agents**.

---

## Architecture patterns to learn

### 1. Transcript-first perception

- ElevenLabs Scribe (word-level ASR) per source file
- Cached as `transcripts/<name>.json` — never re-transcribe unless source changed
- Packed into `takes_packed.md`: phrase-level lines with `[start-end]` ranges
- Phrases break on silence ≥ 0.5s or speaker change
- Editor reasons from text with sub-second precision at ~1/10 the tokens of raw JSON

### 2. Timeline view on demand

- `timeline_view.py <video> <start> <end>` → filmstrip + waveform + word labels PNG
- **Not a scan tool** — called at decision points: ambiguous pauses, retake comparisons, cut sanity checks
- After render: self-eval runs timeline_view on **output** at every cut boundary (±1.5s)

### 3. Edit decision list (EDL)

- `edl.json` is the contract between reasoning and rendering
- Segment entries: `source`, `start`, `end`, `beat`, `quote`, `reason`
- Cuts snap to word boundaries; padding 30–200ms absorbs ASR drift
- Agent sub-brief for multi-take selection outputs JSON array, no prose

### 4. Render pipeline

Deterministic helpers, not LLM improvisation at render time:

| Stage | Tool | Notes |
|-------|------|-------|
| Transcribe | `transcribe.py`, `transcribe_batch.py` | Parallel batch for multi-take |
| Pack | `pack_transcripts.py` | JSON → markdown reading view |
| Grade | `grade.py` | Per-segment during extract, not post-concat |
| Compose | `render.py` | Per-segment extract → lossless concat → overlays (PTS-shifted) → subtitles **last** |
| Subtitles | `master.srt` | Output-timeline offsets after concat |
| Animations | Parallel sub-agents | HyperFrames, Remotion, Manim, or PIL per slot |

**Hard production rules** (non-negotiable): subtitles last in filter chain, per-segment extract + copy concat, 30ms audio fades at boundaries, never cut inside a word, output-timeline SRT offsets.

### 5. Self-evaluation after render

Before showing preview to user:

- `timeline_view` on rendered output at every cut boundary
- Check: visual discontinuity, audio pop, subtitle hidden by overlay, overlay misalignment
- Sample first/last 2s and 2–3 mid-points for grade/subtitle coherence
- `ffprobe` duration vs EDL expectation
- Fix → re-render → re-eval; cap at 3 passes, then flag remaining issues

### 6. Skill / project memory

- Skill lives in `video-use/` (symlinked to agent skills dir)
- Session outputs in `<videos_dir>/edit/` — skill directory stays clean
- `project.md` appended each session: strategy, decisions, user preferences, open items
- Next session picks up from `project.md` without re-transcribing

### 7. Ask → confirm → execute loop

```
Inventory → Pre-scan → Converse → Propose strategy → WAIT FOR CONFIRMATION
  → Execute (EDL + animations + grade) → Preview → Self-eval → Iterate → Persist
```

Never touch the cut until user approves plain-English strategy. No fixed checklist — questions shaped by material.

### 8. Hard production rules + creative freedom

- **12 hard rules** for correctness (subtitles order, concat strategy, fades, PTS shift, word boundaries, cache, parallel animations, output dir, strategy gate)
- **Everything else is taste**: grade presets, subtitle style, pacing, archetype, animation palette
- Agent may invent techniques (PiP, speed ramps, match cuts) via ffmpeg/PIL — correctness rules are the floor

### Output directory layout (reference)

```
<videos_dir>/
├── <source files, untouched>
└── edit/
    ├── project.md
    ├── takes_packed.md
    ├── edl.json
    ├── transcripts/
    ├── animations/slot_<id>/
    ├── clips_graded/
    ├── master.srt
    ├── verify/
    ├── preview.mp4
    └── final.mp4
```

---

## ClipLoop adaptation

ClipLoop should **not** start as a heavy video editor. It should become a **short-form promo video engine for indie apps** — programmatic, API-first, with the video-use perception pattern adapted for *generation* not just *editing*.

### Product positioning

| Layer | Role |
|-------|------|
| **ClipLoop** | Recurring weekly promo workflow — ingest, plan, render, publish, learn |
| **LaunchPix** | API layer for launch assets (images now, video later) |
| **Codra** | Agent runtime consuming structured perception tools |

### Current ClipLoop baseline (existing)

ClipLoop already has pieces of this pipeline:

- Project memory snapshots + context assembly (`project_memory_snapshots`, `assembleProjectContext`)
- Weekly promo service: website scrape → product context → script → scene plan → HyperFrames render
- Job queue: `generate_weekly_strategy`, `render_content_item`, `publish_content_item`, metrics rollup
- Public API: `POST /api/public/weekly-promo`

What is **missing** relative to video-use patterns:

- Word-level transcript layer for demo clips / voiceover footage
- EDL as explicit intermediate artifact (scene plan exists but is render-specific, not a general edit contract)
- On-demand timeline composites for QA
- Post-render self-eval loop before user sees output
- Session memory file per generation run (project memory is project-level, not edit-session-level)
- Ask-confirm-execute gate in automated flows (API is fire-and-forget today)

### Proposed ClipLoop pipeline

```
Ingest → Analyze → Plan edit → Generate EDL/timeline → Render → Self-evaluate → Publish → Learn from metrics
```

#### Input

| Input | Source |
|-------|--------|
| Product URL | Website ingestion (existing) |
| Changelog / product update | User submit, GitHub release, or chat |
| Screenshots / demo clips | Upload or scrape |
| Brand profile | Project memory snapshot (existing) |
| Target audience | Project settings + strategy cycle |

#### Processing

| Step | Structured artifact | Notes |
|------|---------------------|-------|
| 1. Create promo brief | `promo_brief.json` | Angle, hook, CTA, must-include features, week theme |
| 2. Generate script | `weekly_promo_script.json` | Hook, body slides, caption, CTA (existing schema) |
| 3. Create scene plan | `scene_plan.json` | Scene blocks, timing, overlays (existing `SceneBlock[]`) |
| 4. Asset collection | `assets_manifest.json` | Screenshots, logo, optional demo clip refs |
| 5. Transcript pack (if footage) | `takes_packed.md` | Only when user supplies talking-head or demo video |
| 6. Generate EDL/timeline | `edl.json` | Unified cut/generation contract: segments, beats, durations, transitions |
| 7. Caption generation | `captions.srt` / `caption_chunks.json` | 2-word chunks or sentence mode per channel |
| 8. Render | `preview.mp4` → `final.mp4` | HyperFrames + FFmpeg stitch (existing adapters) |
| 9. Self-evaluate | `eval_report.json` | Cut boundaries, subtitle readability, duration, brand consistency |
| 10. Schedule/publish | `publish_job` | Existing publish queue |
| 11. Track metrics | `metrics_rollup` | Existing tracking domain |

#### Output

| Output | Delivery |
|--------|----------|
| Video file | Signed URL / storage |
| Captions | SRT + burned-in option |
| Thumbnail | Existing render output |
| Post copy | Caption + platform variants |
| Analytics record | Tracking slug + rollup |

### Structured context map (video-use → ClipLoop)

| video-use | ClipLoop equivalent |
|-----------|----------------------|
| `takes_packed.md` | `promo_context.md` — packed script + scene timing + optional transcript |
| `edl.json` | `edl.json` / `timeline.json` — scene segments with beats and asset refs |
| `timeline_view` PNG | `timeline_preview` — composite for QA and agent drill-down |
| `project.md` | `generation_session.md` + project memory snapshot |
| `edit/` folder | `renders/<content_item_id>/` or `jobs/<job_id>/` |

### ClipLoop vs video-use scope

| Dimension | video-use | ClipLoop |
|-----------|-----------|----------|
| Primary mode | Edit raw multi-take footage | Generate promo from product context |
| User interaction | Conversational, confirm each edit | API + dashboard; optional chat confirm |
| Content types | Any (talking head, montage, tutorial) | Indie app promo, vertical short-form |
| Transcript | Required (audio-first cuts) | Optional (only when demo/voice footage supplied) |
| Render | FFmpeg segment extract + concat | HyperFrames scene composition + FFmpeg |

---

## LaunchPix adaptation

LaunchPix is currently **image/API generation**. Video-use patterns suggest a future **LaunchPix Video** layer without building it now.

### Future API sketch

```http
POST /api/v1/projects/{projectId}/videos/generate
```

**Request body (conceptual):**

```json
{
  "prompt": "30s launch trailer for browser extension",
  "scenes": [{ "type": "hero", "duration": 5 }],
  "brandProfileId": "...",
  "sourceAssets": ["upload_id_1", "upload_id_2"]
}
```

**Response (async, mirrors image generation):**

```json
{
  "generationId": "...",
  "status": "queued",
  "poll": "/api/v1/projects/{projectId}/generations/{generationId}"
}
```

### How it builds on existing async infrastructure

LaunchPix already has the pattern (`docs/ASYNC_GENERATION.md`):

| Existing (images) | Future (video) |
|-------------------|----------------|
| `POST /api/v1/projects/{id}/generate` | `POST /api/v1/projects/{id}/videos/generate` |
| Generation row: `queued` → `analyzing` → `generating_copy` → `rendering_assets` → `completed` | Add phases: `planning_scenes` → `rendering_segments` → `stitching` → `self_eval` |
| `LAUNCHPIX_ASYNC_GENERATION=true` + worker cron | Same worker pool or dedicated video worker |
| `POST /api/internal/worker/generations/process` | Extend worker or add `videos/process` |
| Credit consume before claim | Higher credit cost for video |
| Poll `GET .../generations/{id}` | Same poll endpoint with `videoUrl`, `captionsUrl`, `thumbnailUrl` |

### Pipeline mapping

```
POST videos/generate
  → create generation row (queued)
  → plan scenes (LLM: structured scene plan from brand + screenshots)
  → render assets (per-scene: HyperFrames/Remotion segments)
  → stitch (FFmpeg concat + subtitles)
  → self-eval (timeline composites at boundaries)
  → persist to storage
  → return status/result via poll
```

### Product split

| Product | Scope |
|---------|-------|
| **LaunchPix Images** | Static launch assets — screenshots, tiles, banners (current MVP) |
| **LaunchPix Video** | Launch trailer / promo clip generation (future) |
| **ClipLoop** | Recurring weekly promo automation + publish loop |

LaunchPix = API layer. ClipLoop = product workflow on top of similar engine primitives.

---

## Shared Talocode concept: Structured perception layer for agents

**Definition:** Before an agent reasons or acts on rich media, convert that media into a compact, queryable, timestamped representation. Fetch heavier sensory data (screenshots, frame composites) only on demand.

| Project | Structured layer | On-demand sensory layer |
|---------|------------------|-------------------------|
| **Agent Browser** | DOM, console logs, network HAR, accessibility tree | Screenshots at decision points |
| **Video-use / ClipLoop** | Transcript, packed phrases, EDL, scene plan, timing map | Timeline composite PNGs, waveform |
| **LaunchPix** | Brand profile, asset plan, generation metadata, layout spec | Render previews, quality check frames |
| **Codra** | Agent runtime orchestrating the above tools | Tool-specific drill-down |

This is infrastructure, not just app features. The same pattern appears in browser automation, video editing, and visual generation.

---

## First implementation PR proposal

**Recommended safest first PR (ClipLoop):**

```
docs: add ClipLoop video pipeline architecture
```

Deliverables:

1. `docs/VIDEO_PIPELINE_ARCHITECTURE.md` in ClipLoop — pipeline, schemas-to-come, mapping from video-use
2. Cross-link from `docs/ARCHITECTURE.md` and `docs/PRODUCT_DIRECTION.md`
3. This research doc in LaunchPix `docs/research/`

**Validation:** Docs only. No production code changes. No video-use source import.

### Later implementation sequence

| PR | Scope |
|----|-------|
| PR 1 | ClipLoop architecture doc (this research pass) |
| PR 2 | Promo brief schema (`promo_brief.json`) |
| PR 3 | Scene plan / EDL schema (`edl.json`, unified with `SceneBlock`) |
| PR 4 | Render worker using FFmpeg/Remotion with EDL input |
| PR 5 | Self-eval checks (timeline composite + duration + subtitle QA) |
| PR 6 | Weekly schedule/publish loop integration |
| PR 7 | Metrics feedback loop into strategy generation |

---

## Sources read (reference only)

| Source | What was extracted |
|--------|-------------------|
| [video-use README](https://github.com/browser-use/video-use/blob/main/README.md) | Pipeline, two-layer perception, token economics |
| [video-use SKILL.md](https://github.com/browser-use/video-use/blob/main/SKILL.md) | Hard rules, directory layout, helpers, ask-confirm-execute, self-eval |
| ClipLoop `docs/ARCHITECTURE.md`, `ARCHITECTURE.md`, `docs/PRODUCT_DIRECTION.md` | Existing domains, job queue, weekly promo |
| ClipLoop `src/domains/weekly-promo/service.ts` | Current script → scene plan → render flow |
| LaunchPix `docs/ASYNC_GENERATION.md`, `lib/services/generations/runner.ts` | Async generation worker pattern |

**No video-use source code was copied into either repository.**