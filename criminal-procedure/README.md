# Criminal procedure

Finnish criminal procedure for the work of legal counsel: pre-trial investigation and coercive
measures, prosecution and defence, and the position of the injured party, including civil claims.

> **Outputs support counsel's work – they are neither legal advice nor instructions for conducting
> a defence without counsel.** The presumption of innocence and the privilege against
> self-incrimination govern everything; no assistance is given with destroying evidence or
> influencing witnesses in any form. See [`AGENTS.md`](AGENTS.md).

## Skills

| Skill | What it does |
|---|---|
| **pre-trial-investigation-and-coercive-measures** | Pre-trial investigation under the Pre-trial Investigation Act (esitutkintalaki 805/2011): the position of the suspect and injured party, preparation for questioning, restriction of the pre-trial investigation and the final statement (loppulausunto). Coercive measures under the Coercive Measures Act (pakkokeinolaki 806/2011): apprehension, arrest and detention, searches and seizure, and covert coercive measures – assessment of the conditions and legal remedies. Includes the criminal procedure fundamentals reference. |
| **charges-and-response** | Consideration of charges and the application for a summons under the Act on Criminal Procedure (laki oikeudenkäynnistä rikosasioissa 689/1997, "ROL"), structuring the defendant's response and defence strategy, evidence (OK Chapter 17), the proposed judgment procedure under Chapter 5b ROL, the main hearing and appeal. |
| **injured-party-rights** | Rights of the injured party (asianomistaja): civil claims in criminal proceedings, damages under the Tort Liability Act (vahingonkorvauslaki 412/1974) and compensation under the Crime Damage Act (rikosvahinkolaki 1204/2005), the secondary right to prosecute, counsel and a support person, and a restraining order under the Act on Restraining Orders (laki lähestymiskiellosta 898/1998). |

## Verified underlying statutes

Verified at source (Finlex): **Act on Criminal Procedure (laki oikeudenkäynnistä
rikosasioissa 689/1997, "ROL")**, including the proposed judgment procedure in Chapter 5b;
**Pre-trial Investigation Act (esitutkintalaki 805/2011)**; **Coercive Measures Act
(pakkokeinolaki 806/2011)**; **Criminal Code (rikoslaki 39/1889)**; **Legal Aid Act
(oikeusapulaki 257/2002)**; **Tort Liability Act (vahingonkorvauslaki 412/1974)**;
**Crime Damage Act (rikosvahinkolaki 1204/2005)**; and **Act on Restraining Orders
(laki lähestymiskiellosta 898/1998)**. Always use the `legal-core:legal-research` skill
to verify the elements of an offence, sentencing ranges, limitation periods and the conditions
for coercive measures at the time of use.

## Related domains

- **`legal-core` domain** – `legal-research` (KKO precedents), `engagement-intake`
  (disqualification and deadline scan) and `document-review`.
- **`dispute-resolution` domain** – general principles of evidence under Chapter 17 OK and
  the mechanics of appealing a judgment.
- **`data-protection` domain** – processing and anonymising personal data relating to criminal
  convictions and offences.
- **`insolvency` domain** – debtor offences in financial-crime matters.

## Installation

```
/plugin marketplace add ragmha/agent-skills-for-finnish-law
/plugin install criminal-procedure@agent-skills-for-finnish-law
```

For the oik.ai connector, see the root [QUICKSTART.md](../QUICKSTART.md).
