---
name: charges-and-response
description: >
  The court stage of a criminal case in Finland under the Act on Criminal
  Procedure (laki oikeudenkäynnistä rikosasioissa 689/1997): consideration
  of charges, application for a summons, the defendant's response and
  structuring the defence, evidence, the proposed judgment procedure and
  the main hearing. Use this skill when charges have been brought or a
  summons received and you need to draft a response, structure the defence
  or evidence, assess the conditions for a proposed judgment (plea
  bargaining), prepare for the main hearing or assess an appeal against a
  criminal judgment. Also use it to assess a decision not to prosecute.
  Triggers: charge, criminal application for a summons, response to charges,
  defence, written procedure, proposed judgment, plea bargaining, main
  hearing, request for punishment, decision not to prosecute, criminal
  judgment, appeal to the Court of Appeal.
---

# Charges and response — structuring the court stage

This skill structures a criminal case from the bringing of charges through judgment under the Act
on Criminal Procedure (laki oikeudenkäynnistä rikosasioissa 689/1997, "ROL"). For the fundamentals
and procedural path, see:
`../pre-trial-investigation-and-coercive-measures/references/criminal-procedure-fundamentals.md`.

> **Disclaimer:** outputs support counsel's work — they are neither instructions for conducting a
> defence without counsel nor a prediction of the outcome. See `criminal-procedure/AGENTS.md`
> (presumption of innocence and negative boundary).

## Output language — filing requirement

Drafts may be produced in **English for review**, but the version actually filed with the court or
authority **must be in Finnish or Swedish** under the Language Act (kielilaki 423/2003) and the Code
of Judicial Procedure (oikeudenkäymiskaari), as applicable. An English filing is not admissible.
Always offer to produce the Finnish version and state plainly that the English text is a working
translation only.

Keep the Finnish term alongside the English one for legally operative concepts on first use, for
example `application for a summons (haastehakemus)`.

## Check the law at source

Retrieve the ROL provisions, the **elements and sentencing range under the Criminal Code** for the
offence specified in the charge, and KKO precedents on the standard of proof and sentencing with
the **`legal-core:legal-research` skill**. Verify the limitation of the right to prosecute under the
Criminal Code at source — it is an absolute procedural requirement.

## Outcomes of consideration of charges

Identify the prosecutor's conclusion and its consequences:

- **Charges** — an application for a summons (haastehakemus) to the court.
- **Decision not to prosecute (syyttämättäjättäminen)** — procedural (insufficient evidence or no
  right to prosecute) or discretionary (minor nature, reasonableness and so on — retrieve the
  grounds at source). The injured party's remedies are a request for reconsideration
  (muutosharkintapyyntö) to the Prosecutor General and the **secondary right to prosecute
  (toissijainen syyteoikeus)** →
  `injured-party-rights`.
- **Proposed judgment (tuomioesitys; ROL Chapter 5b, existence verified)** — a hearing on a plea of
  guilty (tunnustamisoikeudenkäynti): a confession and a reduced sentencing range. Retrieve the
  scope, conditions and need for the injured party's consent at source. Structure the balance for
  the client: reduction and speed against the finality of the confession — **the decision always
  belongs to the client**.

## Analysis of the application for a summons (for defence counsel)

Break the charge into parts before responding:

1. **Description of the act (teonkuvaus)** — precisely what is alleged: the act, time, place and
   intent or negligence. The court is bound by the description of the act (**principle of
   correspondence between the charge and the judgment (syytesidonnaisuus)**) — build the defence
   against that description, not the heading.
2. **Elements of the offence (tunnusmerkistö)** — does each element of the description correspond
   to the elements retrieved at source? What remains unproved?
3. **Evidence** — the prosecutor's evidence and evidential themes; gaps and alternative
   explanations; procedural errors in the pre-trial investigation and exclusion of evidence
   (hyödyntämiskielto), with the conditions retrieved at source.
4. **Claims and requests** — the request for punishment, forfeiture, business prohibition, driving
   ban and other ancillary consequences, and the injured party's civil claims — address each
   separately.

## Structure of the response

Draft the response in the form requested by the court:

- **Position on the charge:** whether it is denied or admitted, and **to what extent** — tie the
  position precisely to each part of the description of the act (for example, admit the act but
  deny intent; or request classification as a less serious offence).
- **Grounds for denial** — set out the facts and legal grounds separately.
- **Position on civil claims** — address the basis and amount separately (the amount may be admitted
  as reasonable even if the basis is denied).
- **Defence evidence** — identify the evidence and evidential themes, and what each item proves.
- **Procedural positions** — written procedure (conditions retrieved at source), arrangements for
  the main hearing and confidentiality requests.

## Evidence (OK Chapter 17)

For general principles, use `dispute-resolution:evidence` (burden of proof, standard of proof and
exclusion of evidence). Criminal-specific points are the prosecutor's burden of proof and **in
dubio pro reo**, the defendant's right not to contribute to establishing guilt, a close relative's
right to remain silent, anonymous testimony, and the limits on using a pre-trial statement in the
main hearing (retrieve the conditions at source).

## Main hearing and sentence

- Cover the course of the main hearing and the principle of concentration; prepare themes for
  questioning, not scripts.
- **Sentencing:** choice of type and measurement of sentence (retrieve the general RL provisions at
  source), mitigating and aggravating grounds, previous offending and grounds for adjustment —
  structure a sentencing submission with comparative practice retrieved from KKO at source.
- State an alternative position on the consequence ("if the charge is proved") — this does not
  weaken the denial.

## Appeal

Give notice of dissatisfaction (tyytymättömyyden ilmoitus) and appeal within the deadlines
`[check at source]`; determine whether leave for continued consideration
(jatkokäsittelylupa) is needed in the Court of Appeal (retrieve the scope at source) and whether
leave to appeal to KKO is required. For the mechanics, use
`dispute-resolution:appeal-against-judgment`. Verify at source the criminal-case differences,
including the prohibition of reformatio in pejus where the prosecutor accepts the judgment.

## What this skill does NOT do

- **It does not decide the position** (denial, admission or proposed judgment) — the decision
  belongs to the client and counsel.
- **It does not predict a judgment or sentence** — a sentencing assessment is always
  `[confirm — requires a criminal lawyer's assessment]` and tied to practice retrieved at source.
- **It does not construct false accounts** or align evidence — refuse absolutely.
- **It does not confirm sentencing ranges or limitation or appeal periods from memory** — use a
  source or mark them `[check]`.
- **It does not handle the injured party's claims when acting for the defendant** — this is a
  conflict of interest; see `injured-party-rights` and CLAUDE.md.

## Continue from here

- Pre-trial investigation material and the final statement → `pre-trial-investigation-and-coercive-measures`
- Handling the injured party's claims → `injured-party-rights`
- Verifying offence elements, a sentencing range or KKO practice → `legal-core:legal-research`
- General principles of evidence → `dispute-resolution:evidence`
- Language and structure of the response → `legal-core:document-review`
