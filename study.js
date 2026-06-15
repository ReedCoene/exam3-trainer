/* ============================================================
   ACG2021 Exam 3 — study scaffolding
   TIERS (what they actually test), RECALL (free-response prompts),
   BRAINDUMP (chapter checklists + keyword detection), ARCHETYPES.
   ============================================================ */

/* ---------- What they actually test (frequency-ranked) ---------- */
const TIERS = {
  appc:{
    High:["PV of an annuity (notes, leases, loan payments)","FV/PV of a single amount","Adjusting i & n for non-annual compounding"],
    Med:["FV of an annuity (savings deposits)","Two-option / signing-bonus comparisons","Simple vs. compound interest"],
    Low:["Solving for n or i from a factor","Annuity due vs. ordinary annuity"]
  },
  ch9:{
    High:["Bond issue price = PV(face)+PV(coupons) at market rate","Interest expense & amortization (effective-interest)","Installment note interest vs. principal portion"],
    Med:["Discount vs. premium direction & carrying-value drift","Lease / note recorded at PV","Retirement gain or loss","Debt-to-equity & times-interest-earned"],
    Low:["Debt vs. equity EPS comparison","Reading a partial amortization schedule to back out a rate"]
  },
  ch10:{
    High:["Dividend allocation: preferred (cumulative) vs. common","Treasury stock purchase & reissue (cost method)","Outstanding = Issued − Treasury"],
    Med:["Issuing common stock (par/stated/no-par split)","Stock dividends (small vs. large) & splits","Dividends declared from the RE roll-forward"],
    Low:["ROE, EPS, P/E, dividend yield","Total paid-in capital","Authorized ≥ Issued ≥ Outstanding ordering"]
  },
  ch11:{
    High:["Operating section — indirect method","Classify a transaction as O / I / F","Cash received from selling a fixed asset (Investing)"],
    Med:["Direct method (cash from customers, to suppliers, for taxes)","Financing section (dividends paid, debt, stock)","Cash paid for dividends from RE & dividends payable"],
    Low:["Non-cash investing/financing disclosure","Net change in cash ties to beginning/ending cash"]
  }
};

/* ---------- RECALL — free-response prompts (type from memory, then reveal) ----------
   {ch, kind:"Definition"|"Process"|"Compare"|"Formula", q, points:[ model-answer bullets ]} */
const RECALL = [
  // Appendix C
  { ch:"appc", kind:"Compare", q:"Explain the difference between simple and compound interest.", points:[
    "Simple: interest only on the original principal — FV = P(1 + r·t).",
    "Compound: interest earns interest; each period figures on the new, larger balance — FV = PV(1+i)ⁿ.",
    "Compound grows faster over more than one period."]},
  { ch:"appc", kind:"Process", q:"You're given an annual rate but interest compounds quarterly. Walk through how you set up i and n.", points:[
    "i (rate per period) = annual rate ÷ 4.",
    "n (number of periods) = years × 4.",
    "Adjust BOTH before reading the factor table.","(Semiannual = ÷2 and ×2; monthly = ÷12 and ×12.)"]},
  { ch:"appc", kind:"Process", q:"How do you find the equal periodic payment that pays off a loan?", points:[
    "Loan amount = Payment × PV-of-annuity factor(i, n).",
    "So Payment = Loan amount ÷ PV-annuity factor(i, n).",
    "Use the per-period i and total number of payments n."]},
  { ch:"appc", kind:"Definition", q:"What is an annuity, and which factor values a stream of equal future payments TODAY?", points:[
    "Annuity = a series of equal payments at equal time intervals.",
    "Present value of an annuity values that stream today.",
    "It's the basis for recording notes, leases, and a bond's coupon stream."]},

  // Chapter 9
  { ch:"ch9", kind:"Process", q:"Describe, step by step, how to calculate the issue price of a bond.", points:[
    "Issue price = PV of the face amount + PV of the interest (coupon) payments.",
    "Discount BOTH at the MARKET rate per period.",
    "Semiannual: halve the stated & market rates, double the periods (n = years × 2).",
    "Cash coupon each period = face × stated rate × period fraction.",
    "Use the PV-of-single-amount table for face and the PV-of-annuity table for the coupons."]},
  { ch:"ch9", kind:"Process", q:"Under the effective-interest method, how do you get interest expense, cash interest, and amortization each period?", points:[
    "Interest expense = beginning carrying value × MARKET rate × period fraction.",
    "Cash interest = face × STATED rate × period fraction.",
    "Amortization = difference between the two.",
    "Discount: expense > cash, carrying value rises. Premium: expense < cash, carrying value falls.",
    "New carrying value = old ± amortization (toward face)."]},
  { ch:"ch9", kind:"Compare", q:"When does a bond sell at a discount vs. a premium vs. par? Why?", points:[
    "Stated = Market → par.",
    "Stated < Market → discount (buyers won't pay full price for a below-market coupon).",
    "Stated > Market → premium (an above-market coupon is worth extra).",
    "Price is set by the market rate; the stated rate only sets the cash coupon."]},
  { ch:"ch9", kind:"Definition", q:"In an installment note, how do the interest and principal portions of each equal payment change over time?", points:[
    "Interest portion = beginning carrying value × rate × time.",
    "As principal is paid down, the balance shrinks → interest portion DECREASES.",
    "Principal portion INCREASES each period (payment is fixed).",
    "Carrying value is highest at the start."]},
  { ch:"ch9", kind:"Formula", q:"State the debt-to-equity and times-interest-earned ratios and what each tells you.", points:[
    "Debt to equity = Total liabilities ÷ Total stockholders' equity (leverage/risk).",
    "Times interest earned = (Net income + Interest expense + Tax expense) ÷ Interest expense.",
    "TIE = EBIT ÷ interest; higher means interest is more easily covered."]},

  // Chapter 10
  { ch:"ch10", kind:"Process", q:"A company has cumulative preferred stock with dividends in arrears. How do you allocate a cash dividend between preferred and common?", points:[
    "Preferred annual dividend = shares × par × rate.",
    "Pay preferred its ARREARS (prior unpaid years) first if cumulative.",
    "Then pay preferred the CURRENT year.",
    "Whatever remains goes to common."]},
  { ch:"ch10", kind:"Compare", q:"Contrast a small stock dividend, a large stock dividend, and a stock split.", points:[
    "Small (<25%): capitalize RE at MARKET value of new shares.",
    "Large (≥25%): capitalize RE at PAR value of new shares.",
    "Split: no journal entry; par ↓, shares ↑, price ↓.",
    "None of the three change total stockholders' equity."]},
  { ch:"ch10", kind:"Process", q:"Walk through the cost-method entries for buying treasury stock and then reselling it above and below cost.", points:[
    "Buy: debit Treasury Stock at COST (contra-equity, reduces total equity).",
    "Resell above cost: debit Cash, credit Treasury at cost, credit APIC–Treasury for the excess.",
    "Resell below cost: shortfall reduces APIC–Treasury, then Retained Earnings.",
    "Never record a gain or loss on your own stock."]},
  { ch:"ch10", kind:"Definition", q:"Define authorized, issued, and outstanding shares and give the outstanding-share formula.", points:[
    "Authorized = max shares the charter allows.",
    "Issued = shares ever sold.",
    "Outstanding = issued − treasury (held by the public).",
    "Order: Authorized ≥ Issued ≥ Outstanding."]},

  // Chapter 11
  { ch:"ch11", kind:"Definition", q:"List what goes in each section — Operating, Investing, Financing — and the two big classification traps.", points:[
    "Operating = income-statement items: customers, suppliers, employees, interest (paid & received), taxes.",
    "Investing = buying/selling long-term assets & investments; lending/collecting note principal.",
    "Financing = issuing/repaying debt principal, issuing stock, treasury stock, dividends PAID.",
    "Trap 1: dividends received = Operating, dividends paid = Financing.",
    "Trap 2: interest paid AND received are both Operating."]},
  { ch:"ch11", kind:"Process", q:"Build the operating section using the indirect method — what are the adjustments to net income?", points:[
    "Start with net income.",
    "Add back depreciation/amortization (non-cash).",
    "Subtract gains, add losses (cash is in Investing).",
    "Current assets: increase → subtract, decrease → add.",
    "Current liabilities: increase → add, decrease → subtract."]},
  { ch:"ch11", kind:"Formula", q:"Give the direct-method figures for cash from customers, cash paid to suppliers, and cash paid for taxes — using the universal sign rule.", points:[
    "Universal rule: revenue starts +, every expense starts − (cash out); then asset ↑ SUBTRACT, liability ↑ ADD.",
    "Cash from customers: +Sales − increase in A/R.",
    "Cash paid to suppliers: −COGS − ↑inventory + ↑A/P → cash paid = COGS + increase in inventory − increase in A/P.",
    "Cash paid for taxes: −Tax expense + ↑taxes payable → cash paid = Tax expense − increase in taxes payable.",
    "Same asset/liability rule as the indirect method — just enter expenses as negatives first."]},
  { ch:"ch11", kind:"Process", q:"How do you find the cash RECEIVED from selling a fixed asset, and where does it go?", points:[
    "Cash received = book value ± gain/loss (book value + gain, or − loss).",
    "All proceeds go in the Investing section.",
    "The gain/loss is removed from Operating so cash isn't double-counted.",
    "Use a net-plant-assets roll-forward to back out the disposal if needed."]}
];

/* ---------- BRAIN DUMP — per-unit checklists with keyword detection ----------
   {chId:{title, items:[{label, kw:[ lowercase keywords/phrases that count as a hit ]}]}} */
const BRAINDUMP = {
  appc:{ title:"Time Value of Money", items:[
    { label:"Simple interest (only on principal)", kw:["simple interest","principal only","p·r·t","prt","original principal"] },
    { label:"Compound interest (interest on interest)", kw:["compound","interest on interest","(1+i)","1+i"] },
    { label:"FV of a single amount = PV(1+i)ⁿ", kw:["future value","fv","grow","(1+i)^n","compound forward"] },
    { label:"PV of a single amount = FV ÷ (1+i)ⁿ", kw:["present value","pv","discount","today's value","worth today"] },
    { label:"FV of an annuity (saving equal deposits)", kw:["future value of an annuity","fv annuity","deposits","accumulate"] },
    { label:"PV of an annuity (value a payment stream)", kw:["present value of an annuity","pv annuity","stream","equal payments"] },
    { label:"Adjust i and n for non-annual compounding", kw:["quarterly","semiannual","monthly","divide the rate","per period","÷ 4","÷ 2","÷12"] },
    { label:"Loan payment = amount ÷ PV-annuity factor", kw:["payment =","amortize","loan payment","factor"] },
    { label:"Note/lease recorded at PV of cash flows", kw:["present value of the payments","record at pv","pv of payments"] }
  ]},
  ch9:{ title:"Long-Term Liabilities", items:[
    { label:"Debt vs. equity financing & leverage", kw:["leverage","debt","equity financing","tax deductible","dilute","eps"] },
    { label:"Installment note: interest = balance × rate; interest ↓, principal ↑", kw:["installment","interest portion","principal portion","carrying value × rate","decreases"] },
    { label:"Lease recorded at PV (asset + liability up)", kw:["lease","present value of the lease","right-of-use","asset and liability"] },
    { label:"Stated vs. market rate → par/discount/premium", kw:["stated rate","market rate","discount","premium","par","yield"] },
    { label:"Issue price = PV(face) + PV(coupons) at market rate", kw:["issue price","pv of face","pv of the interest","present value","market rate"] },
    { label:"Cash interest = face × stated rate", kw:["cash interest","face × stated","stated rate","coupon"] },
    { label:"Interest expense = carrying value × market rate", kw:["interest expense","carrying value × market","effective interest","effective-interest"] },
    { label:"Amortization = expense − cash; carrying value drifts to face", kw:["amortization","carrying value","toward face","rises","falls"] },
    { label:"Retirement gain/loss = carrying value − cash paid", kw:["retire","retirement","gain","loss","carrying value","repurchase"] },
    { label:"Debt-to-equity & times interest earned", kw:["debt to equity","times interest earned","tie","ratio"] }
  ]},
  ch10:{ title:"Stockholders' Equity", items:[
    { label:"Corporate form: limited liability, double taxation", kw:["limited liability","double taxation","corporation","raise capital"] },
    { label:"Authorized ≥ Issued ≥ Outstanding; Outstanding = Issued − Treasury", kw:["authorized","issued","outstanding","issued − treasury","issued minus treasury"] },
    { label:"Issuing common: par to Common Stock, rest to APIC", kw:["par value","stated value","apic","additional paid-in","common stock"] },
    { label:"Total paid-in capital = CS + PS + APIC", kw:["paid-in capital","paid in capital","apic","preferred stock"] },
    { label:"Preferred dividend = shares × par × rate; cumulative vs. arrears", kw:["preferred","cumulative","noncumulative","arrears","dividend","par × rate"] },
    { label:"Common gets the remainder of the dividend", kw:["common shareholders","remainder","leftover","allocate"] },
    { label:"Treasury stock at cost = contra-equity", kw:["treasury stock","cost method","contra","reduces equity","buy back"] },
    { label:"RE roll-forward: Beg + NI − Dividends = End", kw:["retained earnings","net income","dividends declared","roll forward","beginning"] },
    { label:"Stock dividend: small=market, large=par", kw:["stock dividend","small","large","market value","par value","25%"] },
    { label:"Stock split: no entry, par ↓, equity unchanged", kw:["stock split","no entry","par value","unchanged","3-for-1","split"] },
    { label:"Ratios: ROE, EPS, P/E, dividend yield", kw:["return on equity","roe","earnings per share","eps","price-earnings","p/e","dividend yield"] }
  ]},
  ch11:{ title:"Statement of Cash Flows", items:[
    { label:"Operating = income-statement cash items", kw:["operating","net income","customers","suppliers","interest","taxes"] },
    { label:"Investing = long-term assets & investments", kw:["investing","equipment","plant","long-term asset","sell equipment","purchase"] },
    { label:"Financing = debt principal, stock, dividends paid", kw:["financing","bonds","notes payable","issue stock","treasury","dividends paid"] },
    { label:"Trap: dividends received=Operating, paid=Financing", kw:["dividends received","dividends paid","received","paid"] },
    { label:"Trap: interest paid & received = Operating", kw:["interest paid","interest received","operating"] },
    { label:"Indirect: start at NI, add back depreciation", kw:["indirect","net income","depreciation","add back","non-cash"] },
    { label:"Indirect: assets opposite, liabilities with cash", kw:["accounts receivable","accounts payable","increase","decrease","subtract","add"] },
    { label:"Indirect: subtract gains, add losses", kw:["gain","loss","subtract gain","add loss"] },
    { label:"Direct: cash from customers / to suppliers / for taxes", kw:["direct method","cash from customers","cash paid to suppliers","cash paid for taxes"] },
    { label:"Cash from asset sale = book value ± gain/loss", kw:["book value","proceeds","cash received","sale of equipment"] },
    { label:"Cash dividends paid = declared − ΔDividends payable", kw:["dividends payable","dividends declared","cash paid for dividends"] }
  ]}
};

/* ---------- question archetypes (for the Pattern Trainer) ---------- */
function archetypeOf(q){
  const t=((q.q||"")+" "+(q.choices?q.choices.join(" "):"")).toLowerCase();
  if(/issue price|present value of the bond|sell at|selling price of the bond/.test(t)) return "Bond issue price";
  if(/interest expense|amortization|carrying value of the bond|effective/.test(t)) return "Bond interest & amortization";
  if(/retire|retirement|repurchas/.test(t)) return "Bond retirement (gain/loss)";
  if(/installment note|monthly payment|carrying value.*loan|interest.*first month/.test(t)) return "Installment notes";
  if(/lease/.test(t)) return "Leases (record at PV)";
  if(/future value|present value|compound|annuity|deposit|signing bonus|cd /.test(t)) return "Time value of money";
  if(/debt to equity|times interest earned/.test(t)) return "Debt ratios";
  if(/preferred|cumulative|arrears|dividend.*common|common.*dividend/.test(t)) return "Dividend allocation";
  if(/treasury/.test(t)) return "Treasury stock";
  if(/stock dividend|stock split|par value/.test(t)) return "Stock dividends & splits";
  if(/outstanding|authorized|issued|paid-in capital|no par|stated value/.test(t)) return "Stock issuance & shares";
  if(/return on equity|earnings per share|price-earnings|dividend yield|p\/e/.test(t)) return "Equity ratios";
  if(/operating activities|net cash.*operating|indirect method/.test(t)) return "CFS — operating";
  if(/direct method|cash collected|cash paid to suppliers|cash paid for/.test(t)) return "CFS — direct method";
  if(/investing activities/.test(t)) return "CFS — investing";
  if(/financing activities/.test(t)) return "CFS — financing";
  if(/classify|what section|operating, investing/.test(t)) return "CFS — classification";
  return "Other";
}

/* ---------- JOURNAL ENTRIES — fill-in-the-entry practice ----------
   Account names match this course's conventions (gross method for bonds;
   "Dividends" / "Stock Dividends" for declarations). Amounts in whole dollars.
   Master dropdown list (correct accounts + distractors): */
const JE_ACCOUNTS = [
  "Cash","Bonds Payable","Discount on Bonds Payable","Premium on Bonds Payable",
  "Interest Expense","Interest Payable","Notes Payable","Equipment",
  "Loss on Retirement of Bonds","Gain on Retirement of Bonds",
  "Common Stock","Additional Paid-In Capital – Common Stock","Preferred Stock",
  "Treasury Stock","Additional Paid-In Capital – Treasury Stock",
  "Dividends","Dividends Payable","Stock Dividends","Retained Earnings"
];

// each entry: {ch, prompt, lines:[{acct, dr?, cr?}], why}
const JOURNALS = [
  // ---- Chapter 9: bonds (gross method) ----
  { ch:"ch9", prompt:"On Jan 1, a company issues <b>$200,000</b> of 6%, 5-year bonds <b>at face value (par)</b>. Record the bond issuance.",
    lines:[{acct:"Cash",dr:200000},{acct:"Bonds Payable",cr:200000}],
    why:"Issued at par, so cash equals face. Debit Cash $200,000, credit Bonds Payable $200,000. No discount or premium." },
  { ch:"ch9", prompt:"A company issues <b>$100,000</b> of 8% bonds for <b>$95,000</b> (a discount). Record the issuance.",
    lines:[{acct:"Cash",dr:95000},{acct:"Discount on Bonds Payable",dr:5000},{acct:"Bonds Payable",cr:100000}],
    why:"Gross method: Bonds Payable is credited at FACE ($100,000); the $5,000 shortfall is debited to the contra-liability Discount on Bonds Payable. Cash = the $95,000 received." },
  { ch:"ch9", prompt:"A company issues <b>$100,000</b> of 8% bonds for <b>$108,000</b> (a premium). Record the issuance.",
    lines:[{acct:"Cash",dr:108000},{acct:"Bonds Payable",cr:100000},{acct:"Premium on Bonds Payable",cr:8000}],
    why:"Gross method: Bonds Payable credited at FACE ($100,000); the $8,000 extra is credited to Premium on Bonds Payable (an adjunct account). Cash = $108,000 received." },
  { ch:"ch9", prompt:"A <b>discount</b> bond has a carrying value of <b>$95,000</b>; market rate 10%, face $100,000, stated 8% (annual coupons). Record the <b>annual interest payment</b>.",
    lines:[{acct:"Interest Expense",dr:9500},{acct:"Discount on Bonds Payable",cr:1500},{acct:"Cash",cr:8000}],
    why:"Interest expense = carrying value × market = 95,000 × 10% = 9,500. Cash coupon = face × stated = 100,000 × 8% = 8,000. The 1,500 difference amortizes (credits) the Discount account." },
  { ch:"ch9", prompt:"A <b>premium</b> bond has a carrying value of <b>$108,000</b>; market rate 6%, face $100,000, stated 8% (annual coupons). Record the <b>annual interest payment</b>.",
    lines:[{acct:"Interest Expense",dr:6480},{acct:"Premium on Bonds Payable",dr:1520},{acct:"Cash",cr:8000}],
    why:"Interest expense = 108,000 × 6% = 6,480. Cash coupon = 100,000 × 8% = 8,000. Expense < cash, so the 1,520 difference reduces (debits) the Premium account." },
  { ch:"ch9", prompt:"Bonds Payable issued at par with a carrying value of <b>$100,000</b> are <b>retired early</b> for <b>$96,000</b> cash. Record the retirement.",
    lines:[{acct:"Bonds Payable",dr:100000},{acct:"Cash",cr:96000},{acct:"Gain on Retirement of Bonds",cr:4000}],
    why:"Remove Bonds Payable at its $100,000 carrying value; pay $96,000 cash. Paying less than carrying value = a $4,000 gain (credit)." },
  { ch:"ch9", prompt:"A company buys equipment by signing a <b>$125,000</b> installment note. Record the purchase.",
    lines:[{acct:"Equipment",dr:125000},{acct:"Notes Payable",cr:125000}],
    why:"Get the asset (debit Equipment 125,000) and owe the note (credit Notes Payable 125,000). Assets ↑ and liabilities ↑." },
  { ch:"ch9", prompt:"On a $125,000, 6% installment note, the first monthly payment is <b>$2,417</b>. Record the <b>first payment</b> (first-month interest = $625).",
    lines:[{acct:"Interest Expense",dr:625},{acct:"Notes Payable",dr:1792},{acct:"Cash",cr:2417}],
    why:"Interest = 125,000 × 6% ÷ 12 = 625. The rest of the payment, 2,417 − 625 = 1,792, reduces principal (debit Notes Payable). Cash out = 2,417." },

  // ---- Chapter 10: equity ----
  { ch:"ch10", prompt:"A company issues <b>10,000 shares</b> of <b>$1 par</b> common stock at <b>$15</b> per share. Record the issuance.",
    lines:[{acct:"Cash",dr:150000},{acct:"Common Stock",cr:10000},{acct:"Additional Paid-In Capital – Common Stock",cr:140000}],
    why:"Cash = 10,000 × $15 = 150,000. Common Stock credited at par (10,000 × $1 = 10,000); the excess 140,000 goes to APIC–Common Stock." },
  { ch:"ch10", prompt:"A company issues <b>25,000 shares</b> of <b>no-par</b> common stock (stated value <b>$5</b>) at <b>$50</b> per share. Record the issuance.",
    lines:[{acct:"Cash",dr:1250000},{acct:"Common Stock",cr:125000},{acct:"Additional Paid-In Capital – Common Stock",cr:1125000}],
    why:"Cash = 25,000 × $50 = 1,250,000. Common Stock credited at stated value (25,000 × $5 = 125,000); the rest, 1,125,000, to APIC–Common Stock." },
  { ch:"ch10", prompt:"A company buys back <b>600 shares</b> of its own stock as treasury stock at <b>$24</b> per share. Record the purchase.",
    lines:[{acct:"Treasury Stock",dr:14400},{acct:"Cash",cr:14400}],
    why:"Cost method: debit Treasury Stock for cost (600 × $24 = 14,400), credit Cash. The original issue price is irrelevant." },
  { ch:"ch10", prompt:"A company reissues <b>35 treasury shares</b> (cost <b>$50</b> each) at <b>$56</b> per share. Record the reissuance.",
    lines:[{acct:"Cash",dr:1960},{acct:"Treasury Stock",cr:1750},{acct:"Additional Paid-In Capital – Treasury Stock",cr:210}],
    why:"Cash = 35 × $56 = 1,960. Treasury Stock credited at cost (35 × $50 = 1,750). The 210 excess is credited to APIC–Treasury Stock (never a gain)." },
  { ch:"ch10", prompt:"A company reissues <b>35 treasury shares</b> (cost <b>$50</b> each) at <b>$46</b> per share (below cost). Assume enough APIC–Treasury exists. Record it.",
    lines:[{acct:"Cash",dr:1610},{acct:"Additional Paid-In Capital – Treasury Stock",dr:140},{acct:"Treasury Stock",cr:1750}],
    why:"Cash = 35 × $46 = 1,610. Treasury Stock credited at cost 1,750. The 140 shortfall reduces (debits) APIC–Treasury Stock — never a loss." },
  { ch:"ch10", prompt:"The board <b>declares</b> a <b>$20,000</b> cash dividend. Record the declaration.",
    lines:[{acct:"Dividends",dr:20000},{acct:"Dividends Payable",cr:20000}],
    why:"Declaration creates the liability: debit Dividends $20,000, credit Dividends Payable $20,000. (No cash moves yet.)" },
  { ch:"ch10", prompt:"The company <b>pays</b> the previously declared <b>$20,000</b> cash dividend. Record the payment.",
    lines:[{acct:"Dividends Payable",dr:20000},{acct:"Cash",cr:20000}],
    why:"Payment settles the liability: debit Dividends Payable $20,000, credit Cash $20,000." },
  { ch:"ch10", prompt:"A company declares a <b>10% (small) stock dividend</b>: 1,000,000 shares, $1 par, market price $20. Record the declaration.",
    lines:[{acct:"Stock Dividends",dr:2000000},{acct:"Common Stock",cr:100000},{acct:"Additional Paid-In Capital – Common Stock",cr:1900000}],
    why:"Small (<25%) → record at MARKET. New shares = 1,000,000 × 10% = 100,000. Stock Dividends = 100,000 × $20 = 2,000,000; Common Stock at par 100,000 × $1 = 100,000; remainder 1,900,000 to APIC." },
  { ch:"ch10", prompt:"A company declares a <b>40% (large) stock dividend</b>: 1,000,000 shares, $1 par, market price $20. Record the declaration.",
    lines:[{acct:"Stock Dividends",dr:400000},{acct:"Common Stock",cr:400000}],
    why:"Large (≥25%) → record at PAR. New shares = 1,000,000 × 40% = 400,000 × $1 par = 400,000. Debit Stock Dividends and credit Common Stock for 400,000 — no APIC." }
];
