export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-nbfcs-can-reduce-loan-tat-automated-underwriting",
    title: "How NBFCs Can Reduce Loan TAT with Automated Underwriting",
    date: "2025-05-01",
    excerpt: "Manual underwriting is the #1 reason NBFCs lose borrowers to fintechs. Here's how automated underwriting infrastructure cuts loan TAT from days to seconds.",
    author: "Arera",
    tags: ["underwriting", "NBFC", "loan TAT", "credit decisioning", "automation"],
    content: `
Loan turnaround time (TAT) is the single most visible metric in the NBFC lending experience. A borrower who waits 4 days for a credit decision has already applied elsewhere. In a market where fintech lenders promise approvals in minutes, manual underwriting is not just inefficient — it is a direct revenue leak.

This post breaks down exactly where TAT gets lost, and how automated underwriting infrastructure fixes it.

## Where Does Loan TAT Actually Get Lost?

Most NBFCs assume their TAT problem is a staffing problem. It isn't. It's a process problem.

Here's a typical manual underwriting timeline for a ₹5–25 lakh MSME loan:

| Stage | Typical Time |
| --- | --- |
| Document collection | 4–8 hours |
| Bank statement parsing | 2–4 hours |
| Credit bureau pull | 30–60 minutes |
| Underwriter analysis | 3–6 hours |
| Credit committee review | 12–24 hours |
| Offer generation | 1–2 hours |
| **Total** | **~2–3 days** |

The bottleneck isn't the credit committee. It's the 6–12 hours spent on tasks that are entirely automatable: parsing bank statements, extracting cash flow patterns, and mapping them against policy rules.

## What Automated Underwriting Infrastructure Does

Automated underwriting doesn't replace the credit officer. It removes everything that shouldn't require a credit officer in the first place.

A rules-based underwriting engine handles:

**1. Bank Statement Analysis**
Ingests 6–12 months of bank statements and automatically extracts:
- Average monthly balance (AMB)
- Inward and outward transaction patterns
- Salary/business credit regularity
- Bounce frequency and overdraft usage
- EMI obligations already running

What takes a human analyst 3–4 hours takes an automated system under 10 seconds.

**2. Policy Rule Execution**
Every NBFC has a credit policy — minimum FOIR, sectoral caps, derogatory triggers. Automated underwriting maps the extracted financials against your exact policy rules deterministically. Same inputs always produce the same output. No discretion, no variance.

**3. Scorecard Generation**
Outputs a structured credit note with a recommendation (approve / refer / decline) and the exact variables that drove the decision. Explainable by design — critical for RBI audit readiness.

## The TAT Impact: Before vs After

| Stage | Manual | Automated |
| --- | --- | --- |
| Bank statement parsing | 3–4 hours | < 30 seconds |
| Policy rule check | 2–3 hours | < 5 seconds |
| Credit note generation | 1–2 hours | Instant |
| Underwriter review | 3–6 hours | 15–30 min (exception only) |
| **Total TAT** | **2–3 days** | **Under 2 hours** |

The credit officer now spends time on referral cases — the complex 20% — instead of the routine 80%.

## Why Rules-Based Is Better Than Black-Box AI for NBFCs

A common mistake is adopting ML-based underwriting models that can't explain their decisions. For NBFCs, this creates two problems:
- **Regulatory risk.** The RBI expects lenders to be able to explain every credit decision to a borrower. A black-box model that outputs a score without reasoning fails this test.
- **Operational risk.** When a model behaves unexpectedly in a new economic environment, you have no visibility into why. Rules-based systems are auditable at every step.

Deterministic, rules-based underwriting gives you the speed of automation with the explainability of a human credit officer — without the human hours.

## What to Look for in an Underwriting Infrastructure Partner

If you're evaluating underwriting automation for your NBFC, look for:
- **Deterministic output** — same input always gives same decision
- **RBI-compliant audit trails** — full decision log exportable for regulatory review
- **Bank statement parsing built-in** — not a separate vendor
- **Configurable policy rules** — your credit policy, not a generic template
- **Fast integration** — API-first, not a 6-month implementation project

## The Bottom Line

Loan TAT is a product problem, not just an ops problem. Borrowers today benchmark their lending experience against the fastest option available to them — not against other NBFCs.

Automated underwriting infrastructure closes that gap. The NBFCs winning market share in 2025 are not the ones with the most underwriters. They're the ones with the best infrastructure.

*Arera builds deterministic, rules-based underwriting infrastructure for NBFCs. From bank statement to credit decision in seconds. [See how it works](/sandbox)*
    `
  },
  {
    slug: "rbi-compliant-underwriting-nbfcs-2025",
    title: "RBI-Compliant Underwriting: What NBFCs Need to Know in 2025",
    date: "2025-05-08",
    excerpt: "As RBI tightens oversight on NBFC credit practices, explainability and audit readiness are no longer optional. Here's what compliant underwriting infrastructure looks like.",
    author: "Arera",
    tags: ["RBI compliance", "NBFC", "underwriting", "audit", "credit policy"],
    content: `
The RBI's focus on NBFC credit practices has intensified significantly. From the Scale Based Regulation (SBR) framework to the increased scrutiny on fair lending practices, regulators are no longer just asking what decision was made — they're asking why.

For NBFCs that still rely on manual or opaque underwriting processes, this is a compliance gap that carries real regulatory risk.

This post explains what RBI-compliant underwriting actually requires, and what infrastructure NBFCs need to meet that bar.

## What the RBI Expects from NBFC Underwriting

The RBI's guidance across multiple circulars converges on a few clear themes for NBFC credit underwriting:

**1. Explainability**
Every credit decision — approval, decline, or modification — must be explainable to the borrower and to a regulator. The factors that drove the decision must be documentable. "Our model said no" is not an acceptable explanation.

**2. Consistency**
Credit decisions must be applied consistently across similar borrower profiles. Inconsistent decisioning across geographies, branches, or underwriters opens an NBFC to fair lending scrutiny.

**3. Audit Readiness**
NBFCs must maintain records of the inputs, policy rules applied, and outputs for every credit decision. These records must be retrievable on demand — not reconstructed after the fact.

**4. Board-Approved Credit Policy**
The RBI requires NBFCs to operate under a board-approved credit policy. Underwriting decisions must demonstrably map to that policy. Ad-hoc or discretionary overrides that aren't documented create compliance risk.

## Where Most NBFCs Fall Short

Most NBFC underwriting processes were designed for a pre-digital era. The compliance gaps tend to cluster in three areas:

**Decision documentation**
In manual underwriting environments, the credit note is often a summary written after the decision was already made mentally. The reasoning is reconstructed, not recorded. This doesn't hold up to regulatory scrutiny.

**Policy drift**
Credit policies get updated at the board level but the changes don't always propagate uniformly to field underwriters. Over time, actual underwriting practice diverges from stated policy — creating a discrepancy that regulators can flag.

**Inconsistency across teams**
Two underwriters assessing the same borrower profile may reach different decisions based on personal judgment, risk appetite, or familiarity with the segment. This is not just an ops problem — it's a fair lending problem.

## What RBI-Compliant Underwriting Infrastructure Looks Like

Compliant underwriting infrastructure addresses each of these gaps systematically.

**Deterministic rule execution**
A rules-based engine applies your exact credit policy to every application. The same inputs always produce the same output. There is no room for personal discretion in the core decision — only in the human review of flagged edge cases.

**Immutable decision logs**
Every decision is logged with the full input set, the policy rules evaluated, the output at each rule, and the final recommendation. This log is immutable — it cannot be edited after the fact. This is the audit trail the RBI expects.

**Policy-as-code**
Your board-approved credit policy is encoded directly into the underwriting engine. When the policy changes, the engine is updated. There is no gap between written policy and applied policy.

**Explainable outputs**
Every credit decision comes with a structured explanation: which factors were evaluated, which rules triggered, and how the final recommendation was reached. This explanation can be shared with the borrower or presented to a regulator without additional work.

## The Regulatory Tailwind for Automated Underwriting

It's worth noting that the RBI's direction is not just about risk — it's also an implicit endorsement of systematic underwriting over discretionary underwriting.

The Fair Practices Code for NBFCs, the SBR framework, and the RBI's guidance on digital lending all point in the same direction: credit decisions should be transparent, consistent, and documentable.

Automated, rules-based underwriting infrastructure is the most direct path to meeting that standard — and it delivers the operational benefits of speed and scale as a side effect.

## A Compliance Checklist for NBFC Underwriting

Use this to assess your current underwriting process:

- [ ] Every credit decision has a documented audit trail with inputs and rule outputs
- [ ] Credit decisions can be explained to a borrower or regulator on demand
- [ ] Underwriting decisions consistently reflect the board-approved credit policy
- [ ] Policy updates propagate immediately to all underwriting decisions
- [ ] Inconsistency across underwriters or branches is measurable and manageable
- [ ] Decision records are stored and retrievable for the required retention period

If more than two of these are unchecked, your underwriting process has compliance exposure.

## The Bottom Line

RBI compliance in underwriting is not a one-time audit exercise. It's an ongoing operational requirement that your infrastructure either supports or undermines.

Deterministic, rules-based underwriting infrastructure makes compliance the default — not a manual overlay on top of a discretionary process.

*Arera builds RBI-compliant, explainable underwriting infrastructure for NBFCs. Audit-ready by design. [Learn more](/sandbox)*
    `
  }
];
