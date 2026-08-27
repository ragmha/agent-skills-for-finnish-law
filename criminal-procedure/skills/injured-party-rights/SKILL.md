---
name: injured-party-rights
description: >
  The position and rights of the injured party (asianomistaja) in Finnish
  criminal proceedings: civil claims, damages and state compensation, the
  secondary right to prosecute, counsel and a support person, and restraining
  orders. Use this skill when assisting a victim of crime: drafting and
  substantiating compensation claims, requesting the prosecutor to pursue a
  claim, applying to Valtiokonttori for crime-damage compensation, responding
  to a decision not to prosecute or applying for a restraining order.
  Triggers: injured party, victim of crime, compensation claim in criminal
  proceedings, compensation for suffering, crime-damage compensation,
  Valtiokonttori, secondary right to prosecute, complainant offence, support
  person, restraining order.
---

# Position of the injured party — claims and rights

This skill structures the rights of the injured party (asianomistaja) and drafts claims. For the
fundamentals, see:
`../pre-trial-investigation-and-coercive-measures/references/criminal-procedure-fundamentals.md`.

> **Disclaimer:** drafts must be reviewed by counsel and the injured party — they are not legal
> advice. Substantiate compensation amounts from sources, not memory. See
> `criminal-procedure/AGENTS.md`.

## Output language — filing requirement

Drafts may be produced in **English for review**, but the version actually filed with the court or
authority **must be in Finnish or Swedish** under the Language Act (kielilaki 423/2003) and the Code
of Judicial Procedure (oikeudenkäymiskaari), as applicable. An English filing is not admissible.
Always offer to produce the Finnish version and state plainly that the English text is a working
translation only.

Keep the Finnish term alongside the English one for legally operative concepts on first use, for
example `injured party (asianomistaja)`.

## Check the law at source

Retrieve the ROL provisions on injured parties, the grounds for compensation under the Tort
Liability Act (vahingonkorvauslaki 412/1974), the conditions and deadlines under the Crime Damage
Act (rikosvahinkolaki 1204/2005), the recommendations of the Personal Injury Advisory Board
(Henkilövahinkoasiain neuvottelukunta), and KKO compensation practice with the
**`legal-core:legal-research` skill** and from official sources.

## Stage 1: Position and strategy

- **Complainant offence (asianomistajarikos) or an offence subject to public prosecution?** — for a
  complainant offence, the request for prosecution (syyttämispyyntö), and the consequences of
  withdrawing it, are decisive. Verify the right to prosecute the offence at source.
- **What does the injured party seek?** Compensation, punishment, safety through a restraining
  order (lähestymiskielto), or the lightest possible process — tailor the strategy and claims to
  that objective.
- **Counsel and a support person:** verify at source the conditions for appointing trial counsel
  and a support person, including the relevant types of offence, and legal aid under the Legal Aid
  Act (oikeusapulaki 257/2002); clarify liability for costs immediately.

## Stage 2: Civil claims

1. **Present claims in time** — specify them during the pre-trial investigation; ask the
   **prosecutor to pursue** a clear and simple claim (a request under ROL — retrieve the conditions
   at source; free of charge to the injured party). A complex or disputed claim generally requires
   separate counsel.
2. **Heads of compensation under 412/1974** — structure separately:
   - personal injury (medical care, loss of earnings, pain and suffering, permanent impairment),
   - **suffering (kärsimys)** caused by the violation — retrieve the conditions at source,
   - property damage and financial loss,
   - investigation costs and legal costs.
3. **Substantiate the amount** — use receipts, medical reports, recommendations of the Personal
   Injury Advisory Board and comparable decisions retrieved at source
   `[amount level — check at source]`; include interest in the claim under the Interest Act
   (korkolaki — check).
4. **A claim awarded in the judgment does not mean money in the account** — enforce the judgment
   through enforcement proceedings (ulosotto) (→ `insolvency:debt-collection`) and consider the
   next section.

## Stage 3: Compensation under the Crime Damage Act (1204/2005)

Valtiokonttori may pay compensation to a victim of crime from state funds:

- Retrieve at source the subsidiarity rules (insurance and compensation ordered by judgment first),
  heads and limitations of compensation, deductible, maximum amounts and **application period**
  `[check]`.
- Draft the application: attach the judgment or pre-trial investigation material and all
  documentation of loss at the same time.

## Stage 4: When the prosecutor does not prosecute

Respond to a decision not to prosecute (syyttämättäjättämispäätös):

1. **Request for reconsideration** to the Prosecutor General — free-form and reasoned; identify new
   evidence or an error of assessment.
2. **Secondary right to prosecute** — the injured party may bring charges personally (retrieve the
   ROL conditions at source). Explain the realities: burden of proof, cost risk and liability for
   the opposing party's costs if unsuccessful — `[confirm — requires a criminal lawyer's
   assessment]` before bringing charges.

## Protective measures

- **Restraining order under the Act on Restraining Orders (laki lähestymiskiellosta 898/1998)** —
  basic, extended and inside-the-family forms; retrieve at source the conditions, application to
  the police or district court (käräjäoikeus), and consequences of breach. Draft the application:
  concrete events in chronological order, evidence and the extent sought.
- Non-disclosure for personal safety (turvakielto) and protection of contact details during the
  proceedings; hearing behind a screen or by video (retrieve the conditions at source).

## What this skill does NOT do

- **It does not promise an amount of compensation** — retrieve the level from recommendations and
  practice at source; the court decides.
- **It does not act for both the defendant and injured party in the same case** — this is a
  conflict of interest (CLAUDE.md).
- **It does not confirm application or appeal periods from memory** — use a source or mark them
  `[check]`.
- **It does not pressure the injured party to settle or abandon claims** — the decisions belong to
  the injured party.
- **It does not replace victim support services** — refer the person to Victim Support Finland
  (Rikosuhripäivystys, riku.fi) and the legal aid office where necessary.

## Continue from here

- Assistance during the pre-trial investigation → `pre-trial-investigation-and-coercive-measures`
- Charges and the main hearing → `charges-and-response`
- Verifying the basis for compensation or compensation practice → `legal-core:legal-research`
- Collecting compensation awarded by judgment → `insolvency:debt-collection`
- Language of applications and claims → `legal-core:document-review`
