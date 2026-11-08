# Tax scenarios

A single-file 2026 household tax planning portal. Open `index.html` directly or serve it with `python3 -m http.server 8765`.

- Federal income tax, approximate state income tax, payroll/self-employment taxes and take-home income.
- Single, married joint and married separate scenarios; age-based employee 401(k) limits and mandatory Roth catch-up handling.
- Side businesses, bank interest, medical insurance and child/dependent credits.
- Annual/monthly results and up to six in-memory scenario snapshots. No account, backend, tracking or financial data uploads. Saved scenarios clear on refresh.
- All calculation code, styles and state data are embedded in `index.html`. Google Fonts is optional; system fallbacks work offline.

## Validation

Run `node scripts/test.mjs`. Tests cover federal tax examples, payroll, child credit ages, medical treatment, retirement limits/Roth catch-up and all 51 jurisdictions across filing combinations.

## Scope

Planning estimate, not filing software. Uses 2026 IRS brackets and standard deductions. State calculations use the Tax Foundation's January 2026 baseline tables and simplified deductions/exemptions; state-specific conformity and later changes may differ. Local taxes require a manual rate. See the portal's expandable assumptions for omitted credits, itemizing, AMT, community property and high-income business rules.

W-2 inputs are gross wages **before** employee 401(k) and pre-tax medical deductions, not already-reduced Box 1 wages. Medical premiums are household totals. Separate filing estimates both spouses, assigns children to the first spouse, and uses half of the joint state schedules. Federal tax shown excludes payroll taxes, which are separately displayed and deducted from net income. Results are annual liability before withholding, not refund/balance due.

Sources and review date are linked inside the portal. Reviewed November 8, 2026.

GitHub Pages deploys the repository root from `main`; no build is required.
