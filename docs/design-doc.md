# Zo Future of Collaboration Design Doc

## Status

Draft for planning. Core planning decisions from the May 27 discussion are now locked as working assumptions; remaining uncertainties are called out as design questions.

## One-Line Concept

A standalone live event app where every Zo user claims a numbered tile, builds or submits a Zo-powered collaboration artifact, and helps generate a collective gradient artwork that can be explored during the event and exported afterward.

## Goals

- Make the event feel like a working demo of Zo, not a slide deck about Zo.
- Keep the full attendee journey on one primary landing page.
- Let participants see the grid populate in real time across Toronto and New York.
- Make each tile meaningful as an individual contribution and useful as part of the final artwork.
- Support a merch workflow where attendees can choose printable hits and optionally route files to the print operator.
- Pressure-test the system with synthetic Zo-agent submissions before the live event.
- Keep claim friction low enough that attendees claim a tile early, even before they finish their Zo Space/project.

## Non-Goals

- Do not make the final artifact primarily a Pegasus/logo mosaic.
- Do not require attendees to understand GitHub, deployment, or implementation details to participate.
- Do not overbuild a generalized event platform before proving this event flow.
- Do not split the core experience across many pages unless a specific step requires it.
- Do not make merch selection part of the core web app for v1.

## Audience

- Primary: event attendees in Toronto and New York.
- Secondary: Zo team members monitoring and facilitating the event.
- Tertiary: people who later see screenshots, exported artwork, recap posts, or merch.

## Experience Narrative

1. Attendee lands on one event page.
2. They claim an available numbered tile as a Zo user.
3. The tile is assigned a deterministic color from the event gradient.
4. They create or link their contribution: name, project title, and project link are the required public fields.
5. The grid updates live.
6. Idle state and populated resting state show the composed monochrome gradient artwork.
7. Hover/focus state transitions the tile from monochromatic color treatment to the original polychromatic project preview.
8. End state produces a downloadable visual artifact plus a browsable archive of contributions.

## Core Product Surfaces

### Single Landing Page

The landing page should include:

- Live grid/artwork as the dominant visual object.
- Claim flow for available tiles.
- Current participation count and event status.
- Lightweight resource area: how to Zo, examples, prompts, and partner links.
- Link or callout to the separate merch/print-station workflow.
- Archive/export controls for organizers.

### Tile Grid

Locked working model:

- Capacity target: dynamic, with default grid size set to 100 tiles for the first prototype.
- Layout: rectangular grid first; exact aspect ratio can respond to viewport and capacity.
- Tile identity: one tile represents one Zo user.
- Assignment: a central SQLite or DuckDB-backed allocator assigns tiles to Zo users.
- Onboarding source: the user is onboarded or associated by running a Skill in their Zo, so the user's Zo username is known and can be associated with records in the central service.
- Skill payload: the attendee-run Skill sends username, signed/Zo API-backed identity context, and project metadata. Users can later modify or undo submissions if they made a mistake.
- Tile record: each tile has a number, color, Zo username, name, project title, project link, original preview source, status, and moderation state.
- Claim timing: claim-first is encouraged; a user can reserve their tile before finishing their Space/project.
- Project links may point to any URL, not only `zo.space`, because Zo supports custom domains.
- Idle state: tile appears as its assigned pure gradient color.
- Populated resting state: tile still appears monochromatic using the same assigned color.
- Hover/focus state: tile transitions from monochromatic to polychromatic original preview.
- Click state: opens tile detail or linked Zo Space.
- Tile number: small visible number in the bottom-right corner at rest.
- Accessibility: keyboard focus must expose the same details as hover.

### Visual Direction

Current preferred direction:

- Smooth gradient field inspired by the supplied reference: warm light at one end, passing through reddish/violet mid-tones into blue/teal.
- Each tile samples its color from its grid position relative to that master gradient.
- Idle and populated tiles remain monochrome until hover/focus, then transition to the original polychromatic preview.
- White or light pixel gutters remain plausible if needed for print clarity.
- Avoid chaotic random colors.
- Avoid a corporate-logo output as the final composition.
- The final output should feel like printable fine-art/event artifact, not a sponsor stamp.

Open visual variants:

- Pure flat color tile per participant.
- Subtle texture/noise over the monochrome tile, if pure flat color feels too sterile.
- Color tile with pixel/noise texture.
- Striped gradient groups rather than strict left-to-right tile order.
- Browser preview-in-tile should use a portal-style embedded preview for arbitrary URLs where possible. The product requirement is the monochrome-to-polychrome transition; the portal implementation needs browser-support validation.

### Merch Workflow

Separate workflow, not part of the primary event app for v1:

1. Attendee chooses a blank tote or shirt.
2. They pick a limited number of printable hits.
3. They choose placement or provide placement instructions.
4. Their Zo sends an email or form submission to the print operator.
5. Print operator receives name, selected hits, placement notes, and print-ready files.
6. Attendee gives their name at the print station and receives the customized artifact.

Likely hit categories:

- Cursor/glitch marks.
- Toronto/New York event stamp.
- `I'm not a wrapper` / wrapper-tool joke if brand-safe.
- Pixel eye / sigil.
- Hands holding cloud.
- Code-computer image.
- Reflective Pegasus neck/back hit.
- Numbered edition tag.

## Engineering Architecture

### Initial Recommendation

Build as a standalone web app in this repo, not directly on `etok.zo.space`. The event may need custom dependencies, live updates, load testing, export tooling, and deployment control. A standalone app also avoids risking existing `etok.zo.space` routes.

### Persistence

Use a single central SQLite or DuckDB database for tile assignment and event state. SQLite is the default recommendation for transactional tile claims because it has straightforward uniqueness constraints and write semantics. DuckDB is useful for analysis/export, but if it becomes the primary store we must prove safe concurrent claim behavior before relying on it live.

### Data Model

Minimum tile record:

```ts
type Tile = {
  id: number;
  color: string;
  zoUsername: string;
  claimedAt?: string;
  ownerName?: string;
  projectTitle?: string;
  projectUrl?: string;
  previewUrl?: string;
  moderationStatus: "live" | "flagged" | "hidden";
  moderationReason?: string;
};
```

Minimum claim input:

- Name.
- Project title.
- Project link.
- Zo username, associated by the user's Skill-run onboarding flow.

The Skill should send all claim metadata in one payload, and the central service should allow the owning Zo user to edit or undo their own submission.

### Live Update Options

- Server-Sent Events: simplest real-time broadcast if users only submit and watch.
- WebSockets: useful if tile interactions become collaborative or bidirectional.
- Polling fallback: reliable backup for weak venue Wi-Fi.

### Claiming Requirements

- Tile claims must be atomic: two attendees cannot get the same tile.
- The allocator assigns the next available tile to the Zo user; attendees do not manually choose tiles in v1.
- Each Zo username gets at most one active tile unless an organizer overrides it.
- Username spoofing is prevented by making the Zo API / Skill execution context the identity boundary rather than trusting user-entered usernames.
- Organizers need a reset/unclaim tool for mistakes.
- The system needs a manual override in case someone cannot complete the form.

### Moderation Requirements

- Use an honesty policy by default: submissions go live immediately after a Zo-authenticated Skill submission.
- AI reviews submitted names, project titles, and links asynchronously.
- AI surfaces likely issues to organizers, but does not block normal submissions from appearing live.
- Organizers can hide, edit, reset, or unclaim problematic tiles if needed.
- Moderation states must support `live`, `flagged`, and `hidden`.
- The live display should prioritize momentum over pre-approval. The risk of a bad tile is lower than the risk of creating a cumbersome queue that kills the event flow.

### Export Requirements

- Export final grid as high-resolution PNG/SVG if feasible.
- Export contribution archive as JSON/CSV.
- Export moderation queue and final approved contribution list.
- Preserve enough metadata for a recap page after the event.

## Event Ops Plan

### Before Event

- Lock grid size and color palette.
- Run internal dry run with the Zo team.
- Generate 100+ synthetic tile submissions with agents.
- Test on venue-like Wi-Fi and mobile devices.
- Prepare demo mode as the worst-case fallback.
- Confirm print operator file requirements and turnaround time.

### During Event

- Show the live grid on a large display.
- Keep one facilitator watching claim failures and duplicates.
- Keep one print-station operator workflow owner.
- Keep one engineer with logs, admin controls, AI moderation alerts, and demo-mode switch.
- Avoid long intros; move people into the demo quickly.

### After Event

- Freeze final artwork.
- Publish/export recap archive.
- Package the grid as a downloadable image.
- Collect failure notes while fresh.

## Risks

- Venue Wi-Fi collapses under simultaneous usage.
- Users do not understand what to submit.
- Tile claiming creates duplicates or stuck claims.
- Live grid feels visually underwhelming until enough people join.
- AI moderation either flags too much or misses obviously bad content.
- Honesty-policy moderation could allow a bad submission to appear briefly before cleanup.
- Merch workflow overwhelms print operator.
- Toronto and New York drift out of sync operationally.
- The experience becomes a form-fill instead of a memorable collaborative act.

## Critical Decisions To Make Next

1. Should a facilitator be able to create/attach a tile for someone who cannot run the Skill?
2. What is the exact portal implementation path and browser-support fallback for arbitrary URLs?
3. What is the exact visual gradient: image-sampled reference, hand-picked stops, or generated palette?
4. What does demo mode need to simulate: 100 populated tiles, live arrivals, hover details, moderation flags, or all of the above?
5. Who gets admin access, and what can they edit/reset/hide during the event?
6. What must be ready for the next Zo team pressure test?

## Draft Milestones

### Milestone 0: Decision Lock

- Lock attendee journey.
- Lock grid size and visual mode.
- Lock data fields.
- Lock merch handoff strategy.
- Lock moderation policy and fallback/demo-mode behavior.

### Milestone 1: Prototype

- Static grid with deterministic palette.
- Claim form with mock data.
- Hover/focus monochrome-to-polychrome transition.
- Export screenshot/proof of final artwork direction.
- Demo mode with 100 seeded users/projects.

### Milestone 2: Live System

- Backend persistence.
- Atomic tile claims.
- Real-time updates with polling fallback.
- Admin reset/export controls.
- AI moderation alerts with organizer cleanup controls.

### Milestone 3: Event Readiness

- Agent load test with 100+ submissions.
- Mobile QA.
- Print-station rehearsal.
- Toronto/New York synchronized run-of-show.

## Working Position

The product should bias toward controlled simplicity. A beautiful, reliable grid with a tight claim flow beats a complex 3D experience that risks choking on venue hardware or confusing attendees. If Three.js is used, it should enhance the visual moment without becoming the core dependency for basic participation.
