---
name: pre-trial-investigation-and-coercive-measures
description: >
  Pre-trial investigation and coercive measures in Finnish criminal
  procedure under the Pre-trial Investigation Act (esitutkintalaki
  805/2011) and Coercive Measures Act (pakkokeinolaki 806/2011), from
  counsel's perspective. Use this skill when the client has received a
  summons for questioning or notice of a criminal suspicion; when preparing
  for questioning; when assessing the conditions for arrest or a detention
  request, or the lawfulness of a search or seizure; when drafting a final
  statement; or when requesting investigative measures or restriction of
  the investigation. Also use it to assist the injured party during the
  pre-trial investigation. Triggers: pre-trial investigation, questioning,
  criminal suspicion, suspect, apprehension, arrest, detention, search,
  seizure, travel ban, covert coercive measure, final statement, lead
  investigator.
---

# Pre-trial investigation and coercive measures — counsel's tool

This skill structures the pre-trial investigation stage and situations involving coercive
measures from counsel's perspective. Read the fundamentals, procedural path and map of coercive
measures at the start of the task:
`references/criminal-procedure-fundamentals.md`.

> **Disclaimer:** outputs support counsel's work — they are not instructions for conducting a
> defence without counsel. If the user is personally a suspect without counsel, **the first advice
> is to obtain counsel before questioning** (legal aid under the Legal Aid Act (oikeusapulaki
> 257/2002); appointment of defence counsel under ROL). See `criminal-procedure/AGENTS.md`,
> especially the negative boundary and privilege against self-incrimination.

## Output language — filing requirement

Drafts may be produced in **English for review**, but the version actually filed with the court or
authority **must be in Finnish or Swedish** under the Language Act (kielilaki 423/2003) and the Code
of Judicial Procedure (oikeudenkäymiskaari), as applicable. An English filing is not admissible.
Always offer to produce the Finnish version and state plainly that the English text is a working
translation only.

Keep the Finnish term alongside the English one for legally operative concepts on first use, for
example `final statement (loppulausunto)`.

## Check the law at source

Retrieve the ETL and PKL provisions on questioning procedure, conditions for coercive measures and
deadlines with the **`legal-core:legal-research` skill**. Retrieve the elements and sentencing
range of the suspected offence from the Criminal Code (rikoslaki 39/1889) at source — the range
affects whether coercive measures are available.

## Stage 1: Establish the situation immediately

- **What is suspected?** The offence, time and description of the act; the person's status
  (suspect / witness / injured party — status may change, and a person heard as a witness does not
  have the same rights).
- **What stage has the investigation reached?** Is deprivation of liberty ongoing? Is a detention
  hearing (vangitsemiskäsittely) imminent `[times — check at source]`?
- **Deadlines and urgency** → `legal-core:engagement-intake` (deadline scan and disqualification
  checklist — representing several suspects requires a conflict-of-interest assessment).

## Stage 2: Preparation for questioning

Structure the following for counsel; do not construct an account on the client's behalf:

- **Make the rights clear:** counsel during questioning, privilege against self-incrimination
  (itsekriminointisuoja) and the right to remain silent, the right to be informed of the substance
  of the suspicion, and interpretation.
- **The client and counsel choose the position** — an account, silence or a partial statement. List
  the legal consequences of each, including the effect of a confession; see proposed judgment
  (tuomioesitys) →
  `charges-and-response`).
- **What NOT to do:** align accounts with others, interfere with evidence or contact witnesses —
  refuse to assist and explain the criminal-law risk.
- Review and correct the record of questioning (kuulustelupöytäkirja) before signature.

## Stage 3: Situations involving coercive measures

When a coercive measure has been used or is threatened:

1. **Identify the measure and decision-maker** (see the map of coercive measures in the reference).
2. **Assess the conditions:** strength of the criminal suspicion, sentencing-range threshold
   `[check at source]`, specific conditions (risk of interference, absconding or continued
   offending), **proportionality and the principle of least harm**.
3. **Legal remedies:** hearing and rehearing of detention, complaint, referral of a search for
   court review, and request to revoke a seizure — retrieve the remedies and deadlines at source.
4. **Prepare for the detention hearing:** present alternatives such as a travel ban
   (matkustuskielto), challenge the suspicion and specific conditions, and address reasonableness.

## Stage 4: Active defence during the pre-trial investigation

- **Requests for investigative measures (tutkintapyynnöt):** the suspect may request measures that
  could support their position under ETL's principle of impartiality — draft a specific request.
- **Restriction or termination of the pre-trial investigation:** structure the grounds (no
  offence, no evidence or costs — retrieve the conditions at source) as a submission to the lead
  investigator or prosecutor.
- **Final statement (loppulausunto):** the most effective opportunity for written influence before
  consideration of charges — structure gaps in the evidence, alternative sequences of events,
  failure to satisfy the elements, procedural errors and their effect on admissibility, and matters
  affecting consideration of charges. Tie every assertion to a passage in the pre-trial material.

## Assisting the injured party during the pre-trial investigation

- Supplement and specify the criminal complaint (rikosilmoitus); prepare the injured party for
  questioning.
- **Record claims early:** grounds for compensation claims and a request that the prosecutor pursue
  the claim → `injured-party-rights`.
- Retrieve at source the conditions for appointing counsel and a support person.

## What this skill does NOT do

- **It does not replace defence counsel or give instructions for conducting a defence without
  counsel** — it supports counsel's work.
- **It does not construct accounts, explanations or alibis** — it structures rights, procedure and
  material.
- **It does not assist with destroying evidence, influencing witnesses or evading the
  authorities** — refuse absolutely (CLAUDE.md).
- **It does not confirm sentencing ranges, thresholds or deadlines from memory** — use a source or
  mark them `[check]`.
- **It does not assess guilt** — it assesses evidence, procedure and conditions on the basis of the
  presumption of innocence.

## Continue from here

- After consideration of charges: response and main hearing → `charges-and-response`
- Injured party's claims → `injured-party-rights`
- Verifying offence elements or a coercive-measures provision → `legal-core:legal-research`
- Starting the engagement and disqualification → `legal-core:engagement-intake`
- Language and structure of the final statement → `legal-core:document-review`
