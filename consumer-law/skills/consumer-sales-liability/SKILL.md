---
name: consumer-sales-liability
description: >
  Consumer rights when goods or services are defective under the Consumer
  Protection Act (kuluttajansuojalaki 38/1978). Use this skill when a consumer
  complains about defective goods or services, you assess whether there is a
  defect, select a remedy (repair, replacement, price reduction, termination of
  the sale or damages), draft or respond to a complaint notice, or assess the
  relationship between a guarantee and statutory liability for defects.
  Triggers include: complaint notice, defective goods, defective service,
  faulty product, guarantee, price reduction, termination of sale, liability
  for defects, remedy, consumer rights, compensation, replacement, repair.
---

# Consumer sales liability — defects, remedies and complaint notices

This skill structures the consumer's rights when purchased goods or services are
defective. Read the consumer-law map and concepts at
`references/consumer-law-fundamentals.md` at the start of the task.

> **Disclaimer:** drafts are for review — not legal advice. The Consumer
> Protection Act is mandatory in favour of the consumer; verify deadlines and
> guarantee duration at source. See `consumer-law/AGENTS.md`.

## Output language

Drafts are produced in **English by default**. If the user asks for Finnish, produce Finnish.

Keep the Finnish term alongside the English one for legally operative concepts on first use, for
example `complaint notice (reklamaatio)`.

## Check legislation and decisions at source

Use the **`legal-core:legal-research` skill** to retrieve the defect and remedy
provisions from the correct chapter of the Consumer Protection Act
(kuluttajansuojalaki 38/1978). The chapter structure has changed following EU
reforms concerning the sale of goods, digital content and services, so verify
the current chapter. Obtain comparable Consumer Disputes Board decisions from
source.

## Step 0: Is this a consumer transaction?

Check that the seller is a trader and the buyer is a consumer (B2C). If the
transaction is between private individuals or is B2B, the Sale of Goods Act and
general contract law apply → `contracts`.

> **Template:** [`templates/complaint-notice.md`](../../templates/complaint-notice.md) — structural outline for a complaint notice.

## Step 1: Is there a defect?

1. **Meaning of defect**: the goods or service do not correspond to what was
   agreed, the statutory requirements, or what the consumer may reasonably
   expect (quality, characteristics, information and fitness for purpose).
2. **Information and marketing**: incomplete or misleading information and
   marketing claims may also constitute a defect.
3. **Installation and instructions**: defective installation or operating
   instructions.
4. **Digital content and services**: subject to their own rules (including
   updates and interoperability) — verify the applicable chapter at source.
5. **Passing of risk** and whether the defect existed on delivery; verify at
   source any presumptions concerning defects appearing within a specified
   period.

## Step 2: Complain in time

- The consumer must notify the seller of the defect **within a reasonable
  period** after discovering it or when they ought to have discovered it —
  `[check the minimum period and long-stop limit at source]`. A late complaint
  may result in loss of rights.
- Draft the complaint notice: identify the goods or service, describe the
  defect and remedy sought, set a deadline for a response, and list attachments
  (receipt and photographs).

## Step 3: Apply remedies in the correct order

1. **Primarily repair or delivery of conforming goods** (the seller may choose
   within certain limits; no unreasonable cost or inconvenience to the consumer).
2. **Secondarily a price reduction or termination of the sale**, if the remedy
   fails, is unreasonably delayed, or the defect is material (termination).
3. **Damages** for loss caused by the defect, subject to their separate conditions.
4. **Right to withhold payment** to the extent corresponding to the defect.

Present the remedies in order and mark which conditions require verification at
source.

## Step 4: Guarantee versus statutory liability for defects

- **A guarantee (takuu) is a voluntary additional commitment** and does not
  restrict statutory liability for defects. Statutory liability applies
  independently of the guarantee.
- The guarantor is liable under the guarantee terms; the consumer may always
  rely on legislation as well. Do not present the guarantee as the consumer's
  only remedy.

## Step 5: If the seller disputes the claim

- Direct the consumer to free advice from Consumer Advisory Services at KKV and,
  where necessary, to the Consumer Disputes Board →
  `consumer-disputes-and-collection`.
- When drafting a trader's response, assess the allegation of a defect honestly;
  a contractual term cannot exclude mandatory rights.

## What this skill does NOT do

- **It does not state complaint periods, guarantee duration or other deadlines
  from memory** — obtain them from legislation or use `[check]`.
- **It does not apply the Consumer Protection Act to B2B transactions or private
  sales** → `contracts`.
- **It does not draft terms that weaken consumer rights** — they are void.
- **It does not issue a Consumer Disputes Board recommendation** — that is for
  the Board.

## Continue from here

- Distance selling, off-premises selling and the right of withdrawal → `distance-selling-and-withdrawal`
- Taking a dispute to the Board and debt collection → `consumer-disputes-and-collection`
- Defects in B2B transactions or private sales under the Sale of Goods Act → `contracts:contract-review`
- Verifying a provision or decisions → `legal-core:legal-research`
