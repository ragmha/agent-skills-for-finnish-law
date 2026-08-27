---
name: procurement-planning
description: >
  Planning a public procurement and selecting the procedure under the Act on
  Public Procurement and Concession Contracts (hankintalaki 1397/2016). Use
  this skill when a contracting authority plans a competitive tendering
  exercise: whether the Act applies, the estimated value and whether a
  national or EU threshold is exceeded, which procedure to select (open,
  restricted, negotiated procedure, framework agreement, dynamic purchasing
  system), whether grounds exist for a direct award, and how to conduct market
  consultation and publish a contract notice in Hilma. Also use it when a
  tenderer assesses whether the procurement was competed correctly. Triggers:
  competitive tendering, procurement act, threshold, estimated value,
  procurement procedure, direct award, framework agreement, market
  consultation, Hilma, contract notice, low-value procurement, artificial
  division.
---

# Procurement planning — scope, value and procedure

This skill structures decisions at the procurement-planning stage under the
Act on Public Procurement and Concession Contracts (hankintalaki 1397/2016).
For the fundamentals, procedure map and principles, read
`references/procurement-fundamentals.md` at the start of the task.

> **Disclaimer:** plans and drafts are for review — not legal advice. Award
> decisions (hankintapäätökset) are made by the competent authority. See
> `public-procurement/AGENTS.md`.

## Output language — filing requirement

A draft may be produced in **English** for review, but the version actually
filed with the court or authority **must be in Finnish or Swedish** under the
Language Act (kielilaki 423/2003) and, for Market Court (markkinaoikeus)
filings, the applicable court rules. An English filing is not admissible.
Always offer to produce the Finnish version and state plainly that the English
text is a working translation only.

Keep the Finnish term alongside the English one for legally operative concepts
on first use, for example `contract notice (hankintailmoitus)`.

## Check the Act and thresholds against a source

Retrieve the provisions of the Act on Public Procurement and Concession
Contracts with the **`legal-core:legal-research` skill**, and retrieve the
**current thresholds from a source** (Finlex, Hilma, Ministry of Economic
Affairs and Employment) — EU values are revised every two years. In the
special sectors (water, energy, transport and postal services), first check
whether the Act on Procurement and Concession Contracts of Entities Operating
in the Water, Energy, Transport and Postal Services Sectors (erityisalojen
hankintalaki 1398/2016) applies.

## Stage 1: Does the Act apply?

- **Is the purchaser a contracting authority (hankintayksikkö)?** Check
  borderline cases (body governed by public law, subsidised contract, in-house
  entity and horizontal co-operation) against a source — the requirements for
  in-house status and limits on external sales have changed.
- **Is this a public contract (hankintasopimus)?** A contract for pecuniary
  interest concerning goods, services or works, as opposed to a grant, lease
  or in-house provision.
- Retrieve **exclusions** from scope (including certain services) from a
  source.

## Stage 2: Estimated value and thresholds

1. Calculate the **estimated value (ennakoitu arvo)**: the entire contract
   term, including options and extensions, excluding value added tax; for a
   framework agreement, the value of all planned procurements.
2. Compare it with the **national and EU thresholds** `[check current values —
   Hilma/Ministry of Economic Affairs and Employment]` — the level determines
   which procedural rules apply.
3. **Prohibition on artificial division (pilkkomiskielto)**: dividing a
   contract into lots or selecting a calculation method to avoid the law is
   prohibited. Give reasons for and document the distinction between separate
   procurements and a single whole.
4. Below the threshold, it is a **low-value procurement (pienhankinta)**: the
   Act's procedural rules do not apply, but the principles and the
   organisation's procurement guidelines do.

## Stage 3: Market consultation

Before competitive tendering, the authority may — and often should — explore
the market and conduct technical dialogue. Limits: participation in the
dialogue must not give a supplier an advantage in the competitive tendering
exercise (equal treatment), and the use of information obtained must be
documented. Produce a market-consultation plan: questions, participants, a
request for information (RFI) and its publication in Hilma.

## Stage 4: Choice of procedure

Review the procedure map (`references/procurement-fundamentals.md`) according
to the nature of the procurement and give reasons for the choice:

- **Open or restricted procedure (avoin tai rajoitettu menettely)** — clear,
  definable procurements.
- **Negotiated procedures (neuvottelumenettelyt)** — check the conditions for
  use (customisation, design, a prior unsuccessful competition and so forth)
  against a source and document them.
- **Framework agreement or dynamic purchasing system (puitejärjestely tai
  dynaaminen hankintajärjestelmä)** — recurring procurements; retrieve duration
  and use limits from a source.
- **Direct award (suorahankinta)** — the grounds are narrow and exhaustive
  (including only one possible supplier, or extreme urgency not caused by the
  contracting authority itself). Check the ground against a source, document
  it and explain the risk of remedies; consider a voluntary direct-award
  notice, which starts the appeal period.

## Stage 5: Timetable and publication

- **Contract notice in Hilma (hankintailmoitus)** (and TED for EU
  procurements) — failure to publish a notice is one of the most serious
  procurement errors.
- Minimum time limits for tenders and requests to participate by procedure
  `[check against a source]`; allow genuine time for questions and answers.
- Plan the entire path backwards from the target date for the contract:
  comparison, decision, standstill period and any appeal.

## What this skill does NOT do

- **It does not confirm thresholds, deadlines or percentages from memory** —
  use a source or `[check]`.
- **It does not make an award decision or publish notices** — drafts go to the
  competent decision-maker.
- **It does not tailor a procurement to one supplier** or help divide a
  procurement to avoid the law — refuse and explain the risk.
- **It does not assess the content of tenders** — that belongs to the
  comparison stage (→ tender-documents-and-bids skill).
- **It does not replace the organisation's procurement guidelines and rules
  on authority** — check them in the practice profile or ask.

## Continue from here

- Draft an invitation to tender for the selected procedure → /public-procurement:tender-documents-and-bids
- Decision, standstill period and appeal risk → /public-procurement:award-decision-and-remedies
- Verify a provision or MAO case law → /legal-core:legal-research
- Procurement-contract clauses → /contracts:contract-drafting
- Special requirements for procuring an AI system → /ai-regulation:ai-obligations
