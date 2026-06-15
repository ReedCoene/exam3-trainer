/* ============================================================
   ACG2021 — Exam 3 Study Data
   Financial Accounting (Spiceland/Thomas/Herrmann, 6e)
   Units on exam: Appendix C (Time Value of Money),
   Ch 9 (Long-Term Liabilities), Ch 10 (Stockholders' Equity),
   Ch 11 (Statement of Cash Flows).
   Content grounded in the chapter reviews, lecture decks,
   Study-Edge session guides, and the textbook.
   ============================================================ */

const EXAM_DATE = "2026-06-16T19:00:00"; // Tuesday 7:00 PM

/* ---------- CHAPTER / UNIT LESSONS ---------- */
const CHAPTERS = [
  {
    id:"appc", num:"C", tab:"App C", seg:"Appendix C", title:"Time Value of Money",
    blurb:"Simple vs. compound interest, and the four building blocks: FV & PV of a single amount, FV & PV of an annuity. Everything in Ch 9 (notes, leases, bonds) is built on these.",
    sections:[
      { h:"Simple vs. Compound Interest", items:[
        "<b>Simple interest</b> = Principal × rate × time. Interest is earned <i>only on the original principal</i>. <span class='formula'>FV = P × (1 + r·t)</span>",
        "<b>Compound interest</b> = interest earns interest. Each period's interest is added to the balance, then the next period's interest is figured on the new, larger balance.",
        "Compound always grows faster than simple over more than one period.",
        "Example: $20,000 at 8% for 5 yrs. Simple = 20,000 + 20,000(.08)(5) = <b>$28,000</b>. Compound = 20,000(1.08)⁵ = <b>$29,387</b>."
      ]},
      { h:"Future Value of a Single Amount", items:[
        "You have money <i>now</i>; how much will it grow to <i>later</i>? <span class='formula'>FV = PV × (1 + i)ⁿ</span> = PV × FV-factor(i, n).",
        "<b>i</b> = interest rate <i>per period</i>, <b>n</b> = number of <i>compounding periods</i> — NOT necessarily years.",
        "If it compounds more often than annually, adjust BOTH: i = annual rate ÷ periods-per-year, n = years × periods-per-year.",
        "Quarterly → i = rate/4, n = years×4. Semiannual → i = rate/2, n = years×2. Monthly → i = rate/12, n = years×12."
      ]},
      { h:"Present Value of a Single Amount", items:[
        "You will get money <i>later</i>; what is it worth <i>today</i>? <span class='formula'>PV = FV ÷ (1 + i)ⁿ</span> = FV × PV-factor(i, n).",
        "PV is just FV in reverse — discounting instead of compounding.",
        "Higher rate or more periods → smaller PV (a dollar far in the future is worth less today).",
        "Used to value a single future lump sum: e.g., the maturity payment of a bond, or a note due in 3 years."
      ]},
      { h:"Future Value of an Annuity", items:[
        "<b>Annuity</b> = a series of <i>equal</i> payments at <i>equal</i> intervals. FV-annuity asks: if I save the same amount each period, how much do I pile up by the end?",
        "<span class='formula'>FV = Payment × FV-annuity-factor(i, n)</span>",
        "Ordinary annuity = payments at the END of each period (the default). Annuity due = payments at the BEGINNING.",
        "Example: deposit $2,500 every 6 months for 4 yrs at 10% comp. semiannually → i=5%, n=8."
      ]},
      { h:"Present Value of an Annuity", items:[
        "What is a stream of equal future payments worth <i>today</i>? <span class='formula'>PV = Payment × PV-annuity-factor(i, n)</span>",
        "This is THE workhorse for Ch 9: the recorded value of an installment note, a lease, and a bond's interest payments all come from PV-of-annuity.",
        "To <b>solve for the payment</b> (loan amortization): Payment = Loan amount ÷ PV-annuity-factor(i, n).",
        "Two-option / signing-bonus problems: discount each future payment to today (single amounts via PV, equal streams via PV-annuity), then add them up."
      ]},
      { h:"Reading the Factor Tables (exam mechanics)", items:[
        "Four tables: FV of $1, PV of $1, FV annuity of $1, PV annuity of $1. Pick the table, find the <b>i</b> column and the <b>n</b> row, read the factor, multiply.",
        "Always convert to <i>per-period</i> i and n FIRST, before looking up the factor.",
        "<b>Solve for n or i:</b> rearrange to get the factor (e.g., FV ÷ PV = factor), then scan the table for that factor to read off n or i.",
        "Rounding: the exam usually says round the final answer to the nearest dollar — keep factors at the table's full decimals until the end."
      ]}
    ],
    mnemonics:[
      "<b>Single vs. annuity:</b> one lump sum → 'single amount' tables; equal repeating payments → 'annuity' tables.",
      "<b>FV vs PV:</b> growing money forward = FV (×); pulling money back to today = PV (÷).",
      "<b>Non-annual compounding — always do BOTH:</b> i = rate ÷ m, n = years × m (m = 4 qtrly, 2 semi, 12 monthly).",
      "<b>Loan payment</b> = amount borrowed ÷ PV-annuity factor. <b>Recorded note/lease/bond</b> = PV of its cash flows."
    ]
  },

  {
    id:"ch9", num:"9", tab:"Ch 9", seg:"Chapter 9", title:"Long-Term Liabilities",
    blurb:"Financing with debt vs. equity, installment notes, leases, and (the big one) bonds: characteristics, issue price, issuance, interest with the effective-interest method, and retirement. Plus debt ratios.",
    sections:[
      { h:"Financing Alternatives: Debt vs. Equity", items:[
        "<b>Debt</b> (bonds/notes): you owe interest + principal, but interest is <b>tax-deductible</b> and you don't give up ownership. Creates <b>leverage</b>.",
        "<b>Equity</b> (issue stock): no repayment obligation, but you dilute ownership and EPS, and dividends are NOT tax-deductible.",
        "<b>Leverage works</b> when the company earns a return on the borrowed money <i>greater than</i> the interest rate paid — then debt raises EPS and ROE.",
        "EPS comparison: figure income before interest & taxes, subtract interest (debt plan only), apply tax, then divide by the share count under each plan."
      ]},
      { h:"Installment Notes Payable", items:[
        "Each <b>equal</b> payment is part interest, part principal. <b>Interest = beginning carrying value × rate × time;</b> the rest of the payment reduces principal.",
        "Over time the carrying value falls, so <b>interest portion DECREASES</b> and the <b>principal portion INCREASES</b> each period.",
        "Carrying value is <b>highest at the start</b> and falls with every payment (so the earliest date listed has the highest carrying value).",
        "Issuing a note to buy equipment: <b>increase assets, increase liabilities</b> (no effect on equity).",
        "Recorded amount of the asset/note = the <b>cash price</b>, or if non-interest-bearing, the <b>PV</b> of the future payment(s)."
      ]},
      { h:"Leases", items:[
        "A recorded (finance/right-of-use) lease puts an <b>asset AND a liability</b> on the books at the <b>present value of the lease payments</b>.",
        "So both total assets and total liabilities go UP by that PV at inception.",
        "If payments start <i>immediately</i> (beginning of period) it's an <b>annuity due</b>; if at period-end it's an ordinary annuity — that changes the factor.",
        "The 'amount to record' question is almost always: PV of the lease payments (they hand you the rate and term)."
      ]},
      { h:"Bonds — Characteristics & Pricing", items:[
        "<b>Face (par)</b> = amount repaid at maturity. <b>Stated rate</b> = printed rate that sets the <i>cash</i> interest. <b>Market (yield) rate</b> = investors' required return that sets the <i>price</i>.",
        "<b>Stated = Market → sells at par (100).</b> Stated < Market → <b>discount</b> (below par). Stated > Market → <b>premium</b> (above par).",
        "<b>Issue price = PV of face (single amount) + PV of interest payments (annuity)</b>, both discounted at the <b>market rate per period</b>.",
        "Semiannual bonds: cut the stated rate AND the market rate in half, and double the periods (n = years × 2).",
        "'Sold at 108' means 108% of face; '95' means 95% of face."
      ]},
      { h:"Bonds — Interest (Effective-Interest Method)", items:[
        "<b>Cash interest</b> = face × stated rate × period fraction (fixed every period).",
        "<b>Interest expense</b> = <b>beginning carrying value × market rate × period fraction</b> (changes every period).",
        "<b>Amortization</b> = the difference between interest expense and cash interest.",
        "<b>Discount:</b> interest expense > cash paid; carrying value <b>rises</b> toward face over time.",
        "<b>Premium:</b> interest expense < cash paid; carrying value <b>falls</b> toward face over time.",
        "Both a discount and a premium amortize TO the face amount by maturity."
      ]},
      { h:"Bonds — Retirement & Debt Ratios", items:[
        "Retire early: compare <b>cash paid to repurchase</b> vs. <b>carrying value</b>. Pay less than carrying value → <b>gain</b>; pay more → <b>loss</b>. (Market value of the bonds is a distractor — use carrying value.)",
        "<b>Debt to equity</b> = Total liabilities ÷ Total stockholders' equity. Higher = more leveraged/riskier.",
        "<b>Times interest earned</b> = (Net income + Interest expense + Tax expense) ÷ Interest expense = EBIT ÷ interest. Higher = more easily covers interest.",
        "Assuming more debt can be GOOD as long as the firm earns a return above the borrowing rate."
      ]}
    ],
    mnemonics:[
      "<b>Price direction — compare the two rates:</b> Stated < Market = Discount; Stated > Market = Premium; equal = Par. (Buyers won't overpay for a low coupon → discount.)",
      "<b>Interest expense</b> = carrying value × MARKET rate. <b>Cash</b> = face × STATED rate. Amortization = the gap.",
      "<b>Carrying value drifts to FACE:</b> discount climbs up, premium slides down.",
      "<b>Issue price = PV(face) + PV(coupons)</b> at the market rate — single-amount table + annuity table.",
      "<b>Retirement gain/loss:</b> Carrying value − Cash paid. Positive = gain (paid less than you owed)."
    ]
  },

  {
    id:"ch10", num:"10", tab:"Ch 10", seg:"Chapter 10", title:"Stockholders' Equity",
    blurb:"The corporate form, issuing common & preferred stock, treasury stock, cash & stock dividends, stock splits, the equity section, and the equity ratios (ROE, EPS, dividend yield, P/E).",
    sections:[
      { h:"Corporate Form & Share Terminology", items:[
        "Corporation advantages: <b>limited liability, easy transfer of ownership, ability to raise capital</b>. Disadvantages: <b>double taxation</b> and more regulation.",
        "<b>Authorized</b> = max shares the charter allows. <b>Issued</b> = shares ever sold. <b>Outstanding</b> = issued − treasury (held by the public).",
        "<b>Order, greatest → smallest: Authorized ≥ Issued ≥ Outstanding.</b>",
        "<b>Outstanding shares = Issued − Treasury.</b> Treasury shares are issued but NOT outstanding (no votes, no dividends)."
      ]},
      { h:"Issuing Common Stock", items:[
        "<b>Par / stated value:</b> Common Stock is credited for shares × par (or stated value); the rest goes to <b>Additional Paid-In Capital (APIC)</b>.",
        "<b>No-par WITH a stated value:</b> credit Common Stock for shares × stated value, remainder to APIC. (No-par, no stated value: all of it goes to Common Stock.)",
        "<b>Total paid-in capital</b> = Common Stock + Preferred Stock + APIC (everything investors paid in). It excludes Retained Earnings and is reduced by Treasury Stock on the balance sheet.",
        "Cash received = shares × issue price (that's the debit). The par vs. APIC split only affects which equity accounts get the credit."
      ]},
      { h:"Preferred Stock & Dividend Allocation", items:[
        "Preferred gets dividends <b>first</b>, at its fixed rate: <b>Preferred annual dividend = shares × par × dividend rate</b> (or shares × stated $ dividend).",
        "<b>Cumulative</b>: any skipped (in-arrears) dividends must be paid before common gets anything. <b>Noncumulative</b>: missed dividends are gone forever.",
        "Allocation: pay preferred its arrears (if cumulative) + current year, then <b>common gets the remainder</b>.",
        "Preferred is 'in between' debt and common: fixed payment like debt, but it's still equity (no legal obligation, no tax deduction)."
      ]},
      { h:"Treasury Stock (cost method)", items:[
        "<b>Buying</b> treasury stock: debit Treasury Stock for <b>cost</b> (shares × price paid). It's a <b>contra-equity</b> account — it REDUCES total equity. Original issue price is irrelevant.",
        "<b>Reissuing above cost:</b> debit Cash, credit Treasury Stock at cost, credit the excess to <b>APIC–Treasury Stock</b>. Never record a gain.",
        "<b>Reissuing below cost:</b> the shortfall reduces APIC–Treasury (then Retained Earnings). Never record a loss.",
        "Treasury stock transactions never touch the income statement."
      ]},
      { h:"Retained Earnings, Cash & Stock Dividends, Splits", items:[
        "<b>Retained Earnings</b> roll-forward: Beg RE + Net income − Dividends declared = End RE. Solve for the missing piece (often dividends).",
        "<b>Cash dividend dates:</b> Declaration (record the liability), Record (who gets paid), Payment (cash out).",
        "<b>Small stock dividend (< 25%)</b>: capitalize RE at <b>market value</b> of the new shares (shares × market price).",
        "<b>Large stock dividend (≥ 25%)</b>: capitalize RE at <b>par value</b> of the new shares.",
        "<b>Stock split</b>: more shares, lower par, lower market price each — <b>no journal entry</b>; total equity, total RE, and total paid-in capital all unchanged.",
        "Stock dividends & splits do NOT change total stockholders' equity (just shuffle within it / nothing)."
      ]},
      { h:"Stockholders' Equity Ratios", items:[
        "<b>Return on equity (ROE)</b> = Net income ÷ <b>average</b> stockholders' equity.",
        "<b>Earnings per share (EPS)</b> = (Net income − Preferred dividends) ÷ weighted-avg common shares.",
        "<b>Price-earnings (P/E)</b> = Stock price ÷ EPS. High P/E = market expects growth.",
        "<b>Dividend yield</b> = Dividends per share ÷ Stock price.",
        "Watch the denominator: ROE uses AVERAGE equity; per-share ratios use the share count."
      ]}
    ],
    mnemonics:[
      "<b>A ≥ I ≥ O:</b> Authorized ≥ Issued ≥ Outstanding. Outstanding = Issued − Treasury.",
      "<b>Stock dividend size rule:</b> small (<25%) = MARKET value; large (≥25%) = PAR value.",
      "<b>Split = no entry:</b> par down, shares up, total equity unchanged.",
      "<b>Treasury = contra-equity at COST</b> — reduces equity; reissue never makes a gain/loss (use APIC then RE).",
      "<b>Preferred first:</b> shares × par × rate; if cumulative, clear the arrears before common."
    ]
  },

  {
    id:"ch11", num:"11", tab:"Ch 11", seg:"Chapter 11", title:"Statement of Cash Flows",
    blurb:"Classify cash flows as Operating / Investing / Financing, then build the operating section (indirect AND direct), investing, and financing. The most reasoning-heavy unit on the exam.",
    sections:[
      { h:"The Three Sections — Classification", items:[
        "<b>Operating (O):</b> day-to-day income items — cash from customers, to suppliers/employees, interest <b>paid</b>, interest & dividends <b>received</b>, taxes. (Interest both ways and dividends <i>received</i> are OPERATING.)",
        "<b>Investing (I):</b> buying/selling <b>long-term assets</b> & investments — equipment, plant, land, and lending/collecting notes receivable (principal).",
        "<b>Financing (F):</b> transactions with <b>owners and lenders</b> — issuing/repaying bonds & notes payable (principal), issuing stock, buying treasury stock, paying <b>dividends</b>.",
        "<b>The classic trap:</b> dividends <b>RECEIVED = Operating</b>; dividends <b>PAID = Financing</b>. Interest received & interest paid are <b>both Operating</b>."
      ]},
      { h:"Format & the Two Operating Methods", items:[
        "Three sections sum to the <b>net change in cash</b>, which ties to Beg cash + change = End cash.",
        "<b>Indirect</b> and <b>direct</b> differ ONLY in the Operating section. Investing & Financing are identical either way.",
        "Indirect starts at net income and adjusts; direct lists actual cash receipts and payments. Indirect is by far the most common test format.",
        "Non-cash investing/financing (e.g., buy equipment by signing a note) are disclosed separately, NOT in the three sections."
      ]},
      { h:"Operating — Indirect Method", items:[
        "Start with <b>Net income</b>, then: <b>+ depreciation/amortization</b> (non-cash expense), <b>+ losses</b>, <b>− gains</b> (the cash from the sale is Investing, so back the gain/loss out of operating).",
        "<b>Changes in current assets (A/R, inventory, prepaids):</b> increase → <b>SUBTRACT</b>; decrease → <b>ADD</b>. (Asset up = cash tied up.)",
        "<b>Changes in current liabilities (A/P, accruals):</b> increase → <b>ADD</b>; decrease → <b>SUBTRACT</b>. (Liability up = cash conserved.)",
        "Mnemonic for signs: assets move <i>opposite</i> to cash; liabilities move <i>with</i> cash.",
        "Depreciation is added back because it reduced net income but used no cash."
      ]},
      { h:"Operating — Direct Method", items:[
        "<b>Same universal rule as indirect:</b> assets move OPPOSITE to cash, liabilities move WITH cash. Just enter each income item at its cash sign first — <b>revenue is + (cash in), every expense is − (cash out)</b> — then adjust by the related account.",
        "<b>Cash from customers:</b> start <b>+Sales</b>; A/R is an asset → increase SUBTRACT, decrease ADD. ⇒ Sales − increase in A/R.",
        "<b>Cash paid to suppliers:</b> start <b>−COGS</b>; inventory (asset) increase SUBTRACT, A/P (liability) increase ADD ⇒ −COGS − ↑inventory + ↑A/P. The cash <i>paid</i> (outflow) = COGS + increase in inventory − increase in A/P.",
        "<b>Cash paid for taxes:</b> start <b>−Tax expense</b>; taxes payable (liability) increase ADD ⇒ −Tax expense + ↑taxes payable. The cash <i>paid</i> = Tax expense − increase in taxes payable.",
        "<b>Cash paid for operating expenses:</b> start <b>−Expense</b>; prepaid (asset) increase SUBTRACT, accrued liability increase ADD.",
        "Bottom line: an <b>increase in any liability</b> (A/P, taxes payable, accruals) <b>ADDS to cash</b>, an <b>increase in any asset</b> (inventory, prepaid) <b>SUBTRACTS</b> — exactly like the indirect method. The only new step is writing each expense as a negative first."
      ]},
      { h:"Investing Section", items:[
        "Include <b>cash actually paid/received</b> for long-term assets and investments.",
        "<b>Cash received on a sale of a fixed asset = book value ± gain/loss</b> (book value + gain, or book value − loss). The whole proceeds go in Investing; the gain/loss itself is removed from Operating.",
        "Use a <b>T-account / roll-forward</b> for net plant assets: Beg + purchases − depreciation − book value of disposals = End → solve for the missing disposal, then add the gain (or subtract loss) to get cash received.",
        "Lending money out / buying investments = cash outflow; collecting note <b>principal</b> / selling investments = inflow (the <b>interest</b> portion collected is Operating)."
      ]},
      { h:"Financing Section", items:[
        "Inflows: <b>issue bonds/notes payable, issue common/preferred stock, resell treasury stock.</b>",
        "Outflows: <b>repay principal of debt, pay cash dividends, buy treasury stock.</b>",
        "Only the <b>principal</b> of a note repayment is Financing — any <b>interest</b> included is Operating.",
        "<b>Cash paid for dividends</b> = Dividends declared − increase in Dividends Payable (or + decrease). Dividends declared = Beg RE + Net income − End RE.",
        "Selling/repurchasing your <i>own</i> stock = Financing; receiving dividends on <i>another</i> company's stock = Operating."
      ]}
    ],
    mnemonics:[
      "<b>O / I / F:</b> Operating = income-statement stuff; Investing = long-term Assets; Financing = debt & owners (bonds, stock, dividends paid).",
      "<b>ONE sign rule for BOTH methods:</b> Assets ↑ subtract / ↓ add; Liabilities ↑ add / ↓ subtract. (Direct method: just write each expense as a negative cash-out first, then apply it.)",
      "<b>Gains & losses:</b> SUBTRACT gains, ADD losses back in operating (the cash lives in Investing).",
      "<b>Dividends: received = Operating, paid = Financing. Interest (paid OR received) = Operating.</b>",
      "<b>Cash from asset sale = book value ± gain/loss</b> → all of it goes to Investing."
    ]
  }
];

/* ---------- HAND-WRITTEN CONCEPTUAL MCQs (src:"C") ---------- */
const QUESTIONS = [
  { ch:"appc", src:"C", q:"You invest a lump sum today and want to know its value in 10 years with annual compounding. Which factor do you use?", choices:["Future value of a single amount","Present value of a single amount","Present value of an annuity","Future value of an annuity"], a:0, why:"One lump sum growing forward in time = Future Value of a single amount, FV = PV(1+i)ⁿ." },
  { ch:"appc", src:"C", q:"A bank account compounds interest quarterly at a 12% annual rate for 3 years. What i and n do you use?", choices:["i = 3%, n = 12","i = 12%, n = 3","i = 4%, n = 9","i = 6%, n = 6"], a:0, why:"Quarterly: i = 12%/4 = 3% per period; n = 3 years × 4 = 12 periods. Always adjust BOTH rate and periods." },
  { ch:"appc", src:"C", q:"To find the equal annual payment that pays off a loan, you:", choices:["Divide the loan amount by the PV-of-annuity factor","Multiply the loan by the FV-of-annuity factor","Divide the loan by the PV-of-single-amount factor","Multiply the loan by the market rate"], a:0, why:"Loan = Payment × PV-annuity factor, so Payment = Loan ÷ PV-annuity factor." },
  { ch:"ch9", src:"C", q:"A bond's stated rate is 8% and the market rate at issuance is 10%. The bond will sell:", choices:["At a discount (below face)","At a premium (above face)","At face value","Cannot be determined"], a:0, why:"Stated (8%) < Market (10%): buyers won't pay full price for a below-market coupon, so it sells at a discount." },
  { ch:"ch9", src:"C", q:"Under the effective-interest method, interest expense each period equals:", choices:["Beginning carrying value × market rate","Face value × stated rate","Face value × market rate","Beginning carrying value × stated rate"], a:0, why:"Interest expense = carrying value × MARKET (effective) rate. Cash paid = face × stated rate; the difference is amortization." },
  { ch:"ch9", src:"C", q:"For a bond issued at a discount, over its life the carrying value will:", choices:["Increase toward face value","Decrease toward face value","Stay constant","Increase above face value"], a:0, why:"A discount bond's carrying value starts below face and rises to face by maturity as the discount amortizes." },
  { ch:"ch9", src:"C", q:"In an installment note, as payments are made over time, the interest portion of each payment:", choices:["Decreases while the principal portion increases","Increases while the principal portion decreases","Stays the same each period","Equals the principal portion every period"], a:0, why:"Interest = carrying value × rate. As principal is paid down the balance shrinks, so interest falls and more of each fixed payment goes to principal." },
  { ch:"ch10", src:"C", q:"Outstanding shares are calculated as:", choices:["Issued shares − Treasury shares","Authorized − Issued","Issued + Treasury","Authorized − Treasury"], a:0, why:"Outstanding = Issued − Treasury. Treasury shares were issued but bought back, so they aren't outstanding." },
  { ch:"ch10", src:"C", q:"A company declares a 5% (small) stock dividend. Retained Earnings is reduced by:", choices:["The market value of the new shares","The par value of the new shares","The original issue price","Zero — no entry is made"], a:0, why:"Small stock dividends (<25%) capitalize Retained Earnings at the MARKET value of the shares issued. (Large ≥25% use par.)" },
  { ch:"ch10", src:"C", q:"Which is TRUE of a 3-for-1 stock split?", choices:["Par value is cut to one-third and total equity is unchanged","Total stockholders' equity increases","Retained earnings decreases","A journal entry debits Retained Earnings"], a:0, why:"A split triples shares, cuts par to 1/3, lowers price — but total equity, RE, and paid-in capital are all unchanged. No journal entry." },
  { ch:"ch11", src:"C", q:"Cash dividends PAID to a company's own shareholders are classified as:", choices:["Financing activities","Operating activities","Investing activities","Not reported on the statement of cash flows"], a:0, why:"Dividends PAID = Financing. (Trap: dividends RECEIVED on another firm's stock = Operating.)" },
  { ch:"ch11", src:"C", q:"Under the indirect method, an INCREASE in accounts receivable is:", choices:["Subtracted from net income","Added to net income","Ignored","Reported in investing activities"], a:0, why:"A current asset increasing means sales were booked but cash wasn't collected — subtract it from net income." },
  { ch:"ch11", src:"C", q:"Depreciation expense appears in the indirect operating section because it:", choices:["Reduced net income but used no cash, so it's added back","Is a cash outflow that must be subtracted","Is an investing activity","Increases the cash balance directly"], a:0, why:"Depreciation is a non-cash expense; it lowered net income without touching cash, so it's added back to reconcile to cash." },
  { ch:"ch11", src:"C", q:"Cash received from selling equipment is reported in which section, and how is the related gain treated in operating?", choices:["Investing inflow; the gain is subtracted from net income","Operating inflow; the gain is added","Financing inflow; the gain is ignored","Investing outflow; the gain is added"], a:0, why:"All sale proceeds go in Investing. The gain is removed from operating (subtracted) so the cash isn't double-counted." }
];

/* ---------- FLASHCARDS  [chId, front, back] ---------- */
const FLASHCARDS = [
  ["appc","Simple interest formula","FV = P + P·r·t  (interest only on original principal)"],
  ["appc","Compound future value of a single amount","FV = PV × (1 + i)ⁿ"],
  ["appc","Present value of a single amount","PV = FV ÷ (1 + i)ⁿ"],
  ["appc","Quarterly compounding adjustments","i = annual rate ÷ 4;  n = years × 4"],
  ["appc","Semiannual compounding adjustments","i = annual rate ÷ 2;  n = years × 2"],
  ["appc","Annuity (definition)","A series of EQUAL payments at EQUAL time intervals"],
  ["appc","Equal loan payment","Payment = Loan amount ÷ PV-annuity factor(i, n)"],
  ["appc","Recorded value of a note/lease","Present value of its future cash flows"],
  ["appc","Ordinary annuity vs. annuity due","Ordinary = payments at period END; due = at the BEGINNING"],

  ["ch9","Bond at par / discount / premium","Stated = Market → par; Stated < Market → discount; Stated > Market → premium"],
  ["ch9","Bond issue price","PV of face (single amount) + PV of interest payments (annuity), at the MARKET rate"],
  ["ch9","Cash interest on a bond","Face × stated rate × period fraction (fixed)"],
  ["ch9","Interest expense (effective-interest)","Beginning carrying value × MARKET rate × period fraction"],
  ["ch9","Discount bond carrying value over time","Rises UP toward face (interest expense > cash paid)"],
  ["ch9","Premium bond carrying value over time","Falls DOWN toward face (interest expense < cash paid)"],
  ["ch9","Gain/loss on bond retirement","Carrying value − Cash paid to retire. Positive = gain"],
  ["ch9","Installment note: interest portion","Beginning carrying value × rate × time (decreases each period)"],
  ["ch9","Debt to equity ratio","Total liabilities ÷ Total stockholders' equity"],
  ["ch9","Times interest earned","(Net income + Interest expense + Tax expense) ÷ Interest expense"],

  ["ch10","Outstanding shares","Issued − Treasury"],
  ["ch10","Order greatest → smallest","Authorized ≥ Issued ≥ Outstanding"],
  ["ch10","Total paid-in capital","Common Stock + Preferred Stock + APIC"],
  ["ch10","Preferred annual dividend","Shares × par × dividend rate (paid before common)"],
  ["ch10","Cumulative preferred","Skipped (in-arrears) dividends must be paid before common"],
  ["ch10","Treasury stock account type","Contra-equity, recorded at COST — reduces total equity"],
  ["ch10","Small stock dividend (<25%)","Capitalize RE at MARKET value of new shares"],
  ["ch10","Large stock dividend (≥25%)","Capitalize RE at PAR value of new shares"],
  ["ch10","Stock split entry","No journal entry; par ↓, shares ↑, total equity unchanged"],
  ["ch10","Return on equity","Net income ÷ AVERAGE stockholders' equity"],
  ["ch10","Dividend yield","Dividends per share ÷ Stock price"],
  ["ch10","Price-earnings (P/E)","Stock price ÷ EPS"],
  ["ch10","Dividends declared (from RE)","Beg RE + Net income − End RE"],

  ["ch11","Three sections","Operating (income items) · Investing (long-term assets) · Financing (debt & owners)"],
  ["ch11","Dividends received vs. paid","Received = Operating; Paid = Financing"],
  ["ch11","Interest paid & received","Both Operating"],
  ["ch11","Indirect: current asset change","Increase → subtract; Decrease → add"],
  ["ch11","Indirect: current liability change","Increase → add; Decrease → subtract"],
  ["ch11","Indirect: gains and losses","Subtract gains, add losses back"],
  ["ch11","Cash from customers (direct)","Sales − increase in A/R (or + decrease in A/R)"],
  ["ch11","Cash paid to suppliers (direct)","Start −COGS, then asset↑ subtract / liab↑ add. Cash paid = COGS + ↑inventory − ↑A/P"],
  ["ch11","Cash paid for taxes (direct)","Start −Tax expense, then liab↑ add. Cash paid = Tax expense − ↑taxes payable"],
  ["ch11","Cash received on asset sale","Book value ± gain/loss → reported in Investing"],
  ["ch11","Cash paid for dividends","Dividends declared − increase in Dividends Payable"]
];

/* ---------- HIGH-YIELD 'GOTCHA' FACTS  [chId, prompt, answer] ---------- */
const FACTS = [
  ["appc","$20,000 at 8% simple for 5 yrs → ?","$28,000  (20,000 + 20,000×.08×5)"],
  ["appc","$20,000 at 8% compounded annually for 5 yrs → ?","≈ $29,387  (20,000 × 1.08⁵)"],
  ["appc","Compounds semiannually for 5 yrs at 6%: i and n?","i = 3%, n = 10"],
  ["appc","Which table values a single future lump sum today?","PV of a single amount"],
  ["appc","Which table values a stream of equal future payments today?","PV of an annuity"],

  ["ch9","'Issued at 108' means…","108% of face value (a premium)"],
  ["ch9","'Issued for 95' means…","95% of face value (a discount)"],
  ["ch9","Semiannual 10% stated bond — rate used for CASH interest","5% per period (face × 5%)"],
  ["ch9","Retire bond: carrying value $52.6M, pay $47.0M → ?","Gain of $5.6M (paid less than carrying value)"],
  ["ch9","Which interest rate prices the bond?","The MARKET (yield) rate, not the stated rate"],
  ["ch9","Is more debt always bad?","No — it's good if return earned > the borrowing rate (leverage)"],

  ["ch10","No-par stock with a $5 stated value, 25,000 sh — Common Stock credit","$125,000 (25,000 × $5 stated); rest to APIC"],
  ["ch10","10,000 sh of $100, 8% preferred — annual preferred dividend","$80,000 (10,000 × 100 × 8%)"],
  ["ch10","Treasury stock recorded at…","COST (price paid to buy back), not original issue price"],
  ["ch10","Does a stock split change total equity?","No — and no journal entry is made"],
  ["ch10","Small vs. large stock dividend cutoff","25%: below = market value; at/above = par value"],
  ["ch10","Reissue treasury below cost — do you record a loss?","No — reduce APIC-Treasury, then Retained Earnings"],

  ["ch11","Dividend RECEIVED from another company's stock","Operating activity"],
  ["ch11","Dividend PAID to your shareholders","Financing activity"],
  ["ch11","Interest paid on debt — which section?","Operating (not Financing)"],
  ["ch11","Buy equipment by signing a note (no cash)","Non-cash — disclosed separately, not in the 3 sections"],
  ["ch11","A/R increased $10,000 (indirect)","Subtract $10,000 from net income"],
  ["ch11","A/P increased $6,000 (indirect)","Add $6,000 to net income"],
  ["ch11","Sold equipment, book value $45k, for $40k","$40,000 cash → Investing; $5,000 LOSS added back in operating"]
];
