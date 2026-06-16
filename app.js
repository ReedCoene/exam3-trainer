/* ============================================================
   ACG2021 · Exam 3 Trainer — logic, quiz engine, drills,
   free-response Recall & Brain Dump.
   ============================================================ */

/* ---------- tiny helpers ---------- */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const el = (t, c, h) => { const e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e; };
const rint = (lo, hi) => Math.floor(Math.random()*(hi-lo+1))+lo;
const pick = arr => arr[rint(0,arr.length-1)];
const shuffle = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=rint(0,i);[a[i],a[j]]=[a[j],a[i]];} return a; };
const money = n => "$"+Math.round(n).toLocaleString("en-US");
const money2 = n => "$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const pct = (n,d=1) => (n).toFixed(d)+"%";
// PV/FV factor helpers
const fvSingle=(i,n)=>Math.pow(1+i,n);
const pvSingle=(i,n)=>1/Math.pow(1+i,n);
const pvAnnuity=(i,n)=>(1-Math.pow(1+i,-n))/i;
const fvAnnuity=(i,n)=>(Math.pow(1+i,n)-1)/i;
function matrixHTML(m){
  let h=`<div class="matrixbox"><div class="matrix-title">${m.title||"Framework grid"}</div><table class="matrix"><tr><td class="m-corner">${m.corner||""}</td>`;
  m.colLabels.forEach(c=>h+=`<th class="m-col">${c}</th>`);
  h+=`</tr>`;
  m.rowLabels.forEach((r,i)=>{
    h+=`<tr><th class="m-row">${r}</th>`;
    (m.cells[i]||[]).forEach(cell=>h+=`<td class="m-cell">${cell}</td>`);
    h+=`</tr>`;
  });
  return h+`</table></div>`;
}

/* ---------- progress (localStorage) ---------- */
const STORE = "acg2021_progress_v1";
let progress = JSON.parse(localStorage.getItem(STORE) || "{}");
function saveProgress(){ localStorage.setItem(STORE, JSON.stringify(progress)); }
function bump(path, n=1){
  const keys = path.split(".");
  let o = progress;
  for(let i=0;i<keys.length-1;i++){ o[keys[i]] = o[keys[i]]||{}; o=o[keys[i]]; }
  o[keys.at(-1)] = (o[keys.at(-1)]||0)+n;
  saveProgress();
}
/* ---------- flagging questions ---------- */
function qid(q){ let h=0,s=q.q||""; for(let i=0;i<s.length;i++){ h=(h*31+s.charCodeAt(i))|0; } return "q"+(h>>>0).toString(36); }
function isFlagged(q){ return !!(progress.flagged && progress.flagged[qid(q)]); }
function toggleFlag(q){ progress.flagged=progress.flagged||{}; const id=qid(q); if(progress.flagged[id]) delete progress.flagged[id]; else progress.flagged[id]=1; saveProgress(); return !!progress.flagged[id]; }
/* ---------- weak spots (auto-tracked misses) ---------- */
function isMissed(q){ return !!(progress.missed && progress.missed[qid(q)]); }
function markMissed(q){ progress.missed=progress.missed||{}; progress.missed[qid(q)]=1; saveProgress(); }
function clearMissed(q){ if(progress.missed && progress.missed[qid(q)]){ delete progress.missed[qid(q)]; saveProgress(); } }
function flagBtn(q){
  const mk=()=>isFlagged(q)?"⚑ Flagged":"⚐ Flag";
  const b=el("button","flagbtn"+(isFlagged(q)?" on":""), mk());
  b.title="Flag this question as looking off / to revisit";
  b.onclick=(e)=>{ e.stopPropagation(); const on=toggleFlag(q); b.classList.toggle("on",on); b.textContent=mk(); };
  return b;
}
function srcWord(s){ return s==="L"?"LECTURE":s==="T"?"TEXTBOOK":s==="P"?"PRACTICE":s==="PE"?"PRACTICE EXAM":s==="M"?"MOCK EXAM":s==="B"?"REVIEW BANK":s==="C"?"CONCEPT":""; }
function refLabel(q){ return (q&&q.ref)?("📎 "+q.ref):""; }

/* ---------- navigation ---------- */
const VIEWS = ["dashboard","recall","braindump","drills","journals","quiz","learn","gotchas","cards","facts","cram"];
function go(view, arg){
  if(quizIntv){ clearInterval(quizIntv); quizIntv=null; }
  $$(".nav-btn").forEach(b=>b.classList.toggle("active", b.dataset.view===view));
  const main = $("#main"); main.innerHTML="";
  ({dashboard:renderDashboard, recall:renderRecall, braindump:renderBrainDump, learn:renderLearn,
    gotchas:renderGotchas, cards:renderCards, facts:renderFacts, quiz:renderQuiz,
    drills:renderDrills, journals:renderJournal, cram:renderCram}[view])(main, arg);
  window.scrollTo(0,0);
}

/* combined question pool */
const ALLQ = QUESTIONS
  .concat(typeof PRACTICE!=="undefined"?PRACTICE:[])
  .concat(typeof TESTBANK!=="undefined"?TESTBANK:[])
  .concat(typeof EXAMBANK!=="undefined"?EXAMBANK:[])
  .concat(typeof MOCKBANK!=="undefined"?MOCKBANK:[]);
const REALQ = ALLQ.filter(q=>q.src==="P"||q.src==="B"||q.src==="PE"||q.src==="M");
function qsForChapter(ch){ return ALLQ.filter(q=>q.ch===ch); }
function chMeta(id){ return CHAPTERS.find(c=>c.id===id)||{num:"?",tab:"?",title:""}; }

/* ============================================================
   DASHBOARD
   ============================================================ */
function examCountdown(){
  const diff = new Date(EXAM_DATE) - new Date();
  if(diff<=0) return "It's exam time — you've got this! 💪";
  const h = Math.floor(diff/3.6e6), d=Math.floor(h/24), hr=h%24;
  return d>0 ? `${d}d ${hr}h until the exam` : `${hr}h until the exam — go hard`;
}
function renderDashboard(main){
  const hero = el("div","hero");
  hero.innerHTML = `
    <div class="hero-top">
      <div>
        <h1>ACG2021 · Exam 3 Trainer</h1>
        <p class="sub">Financial Accounting — Time Value of Money (App C), Long-Term Liabilities (Ch 9), Stockholders' Equity (Ch 10), Statement of Cash Flows (Ch 11)</p>
      </div>
      <div class="countdown" id="cd">${examCountdown()}</div>
    </div>
    <p class="split"><b>Study by RETRIEVING, not rereading.</b> Start with 🎯 Recall and 🧠 Brain Dump, hammer the 🧮 Drills, then prove it on the Quiz. The Learn/Cram tabs are reference only.</p>`;
  main.appendChild(hero);

  const grid = el("div","card-grid");
  const tiles = [
    ["🎯","Recall","Type answers from memory — definitions, processes, comparisons. Reveals the model answer after you commit.","recall"],
    ["🧠","Brain Dump","Pick a unit, dump everything you know, get a checklist of what you hit and what you missed.","braindump"],
    ["🧮","Drills","Infinite randomized problems: TVM, bond pricing & interest, installment notes, dividends, cash-flow classification.","drills"],
    ["✍️","Journal Entries","Build the actual journal entries for bonds & equity yourself — auto-graded against the correct entry.","journals"],
    ["✅","Quiz","Real review problems & concept checks — timed mock, interleaved, weak spots, by chapter.","quiz"],
    ["📖","Learn","Comprehensive notes ranked by what's actually tested, each paired with a real review question.","learn"],
    ["⚡","Cram","One-screen formula sheet + the high-yield hit list. Read it last.","cram"]
  ];
  tiles.forEach(([icon,title,desc,v])=>{
    const c = el("button","tile");
    c.innerHTML = `<div class="tile-ic">${icon}</div><h3>${title}</h3><p>${desc}</p>`;
    c.onclick=()=>go(v);
    grid.appendChild(c);
  });
  main.appendChild(grid);

  const mast = el("div","panel");
  mast.appendChild(el("h2",null,"Your progress by unit"));
  CHAPTERS.forEach(ch=>{
    const qTotal = ALLQ.filter(q=>q.ch===ch.id).length;
    const correct = (progress.quiz?.[ch.id]?.correct)||0;
    const cardSeen = (progress.cards?.[ch.id])||0;
    const pctv = qTotal? Math.min(100, Math.round(100*correct/qTotal)) : 0;
    const row = el("div","mrow");
    row.innerHTML = `
      <div class="mrow-label">${ch.tab} · ${ch.title}</div>
      <div class="bar"><div class="bar-fill" style="width:${pctv}%"></div></div>
      <div class="mrow-stat">${correct}/${qTotal} correct · ${cardSeen} cards reviewed</div>`;
    row.onclick=()=>go("learn", ch.id);
    mast.appendChild(row);
  });
  main.appendChild(mast);

  const drillStats = progress.drills||{};
  const note = el("div","panel small");
  note.innerHTML = `<b>Drill record:</b> ${drillStats.correct||0}/${drillStats.seen||0} correct.
    This exam is computation-heavy — bond pricing, effective-interest amortization, installment notes, dividend allocation, and cash-flow figures all reward reps. Do a Drills set every study block.`;
  main.appendChild(note);

  const wcount=ALLQ.filter(isMissed).length;
  if(wcount){
    const wb=el("button","btn weakbtn","🩹 Review your "+wcount+" weak spot"+(wcount>1?"s":"")+" →");
    wb.onclick=()=>go("quiz",{mode:"weak"});
    main.appendChild(wb);
  }
}

/* ============================================================
   RECALL — free-response (type from memory, then reveal)
   ============================================================ */
let recallDeck=[], recallPos=0, recallScope="all";
function recallFor(scope){ let d = scope==="all"?RECALL:RECALL.filter(r=>r.ch===scope); return shuffle(d); }
function renderRecall(main, scope){
  recallScope = scope || recallScope || "all";
  recallDeck = recallFor(recallScope); recallPos=0;
  main.appendChild(el("h1","page-h","🎯 Active Recall"));
  main.appendChild(el("p","sub","Produce the answer from memory BEFORE you reveal anything — that's what builds exam recall. Type it out, then check yourself against the model answer."));
  const bar=el("div","scopebar");
  const mk=(id,label)=>{ const b=el("button","chip"+(recallScope===id?" active":""),label); b.onclick=()=>renderRecall(main,id); return b; };
  bar.appendChild(mk("all","All units"));
  CHAPTERS.forEach(ch=>{ if(RECALL.some(r=>r.ch===ch.id)) bar.appendChild(mk(ch.id,ch.tab)); });
  main.appendChild(bar);
  const stage=el("div","recall-stage"); main.appendChild(stage);
  drawRecall(stage);
}
// lightweight offline "grader": keyword overlap between the typed answer and each model point
const RECALL_STOP=new Set("the a an of to and or for in on with by is are as it it's its their our your you you're they we how this that these those into be can will would should value amount each within over also both per via just very then than from at not but so if no using use other more most less which what when does do".split(" "));
function recallKeywords(s){
  return [...new Set((s.toLowerCase().replace(/<[^>]+>/g," ").match(/[a-z][a-z\-]{3,}|\d[\d,\.]*%?/g)||[]))].filter(w=>!RECALL_STOP.has(w));
}
function pointCovered(userText, point){
  const kws=recallKeywords(point); if(!kws.length) return false;
  const hits=kws.filter(k=>userText.includes(k)).length;
  return hits>0 && (hits/kws.length>=0.4 || hits>=3);
}
function drawRecall(stage){
  stage.innerHTML="";
  if(recallPos>=recallDeck.length){
    stage.appendChild(el("div","done","🎉 You worked through all "+recallDeck.length+" recall prompts."));
    const again=el("button","btn","Shuffle & repeat"); again.onclick=()=>{recallDeck=recallFor(recallScope);recallPos=0;drawRecall(stage);};
    stage.appendChild(again); return;
  }
  const r=recallDeck[recallPos];
  const cm=chMeta(r.ch);
  stage.appendChild(el("div","recall-count",`Prompt ${recallPos+1} / ${recallDeck.length} · ${cm.tab}`));
  stage.appendChild(el("div","recall-kind",`${r.kind} recall`));
  stage.appendChild(el("div","recall-prompt",r.q));
  const ta=el("textarea","answerbox"); ta.placeholder="Type everything you can remember… (no peeking)"; stage.appendChild(ta);
  const reveal=el("button","btn","Reveal model answer ↓");
  stage.appendChild(reveal);
  reveal.onclick=()=>{
    reveal.remove();
    ta.setAttribute("readonly","readonly");
    const typed=ta.value.trim().length>0;
    const userText=" "+(ta.value||"").toLowerCase().replace(/<[^>]+>/g," ")+" ";
    let cov=0;
    const lis=r.points.map(p=>{
      const hit=typed && pointCovered(userText,p);
      if(hit) cov++;
      return `<li class="recall-pt ${hit?"hit":"miss"}"><span class="pt-mark">${hit?"✓":"○"}</span><span>${p}</span></li>`;
    }).join("");
    const score = typed
      ? `<div class="recall-autoscore">Auto-check: your answer appears to cover <b>${cov} of ${r.points.length}</b> key point${r.points.length>1?"s":""}. <span class="muted">It's a keyword match, not a perfect grader — the ○ points may just be worded differently, so eyeball them too.</span></div>`
      : `<div class="recall-autoscore muted">Tip: type your answer <i>before</i> revealing and the auto-check will mark which points you hit.</div>`;
    const ma=el("div","model-answer");
    ma.innerHTML=`<h3>Model answer — check yourself</h3>${score}<ul>${lis}</ul>`;
    stage.appendChild(ma);
    const grade=el("div","self-grade");
    const got=el("button","btn","✓ I had it");
    const miss=el("button","btn ghost","✗ Missed parts — review");
    const next=()=>{ recallPos++; drawRecall(stage); };
    got.onclick=()=>{ bump("recall.got"); next(); };
    miss.onclick=()=>{ bump("recall.miss"); next(); };
    grade.append(got,miss); stage.appendChild(grade);
  };
}

/* ============================================================
   BRAIN DUMP — dump a unit, get a gap checklist
   ============================================================ */
let bdScope=null;
function renderBrainDump(main, scope){
  main.appendChild(el("h1","page-h","🧠 Brain Dump"));
  main.appendChild(el("p","sub","Pick a unit and write down everything you know — no notes. Then check it: the app scans your text and shows which key concepts you recalled and which you left out."));
  const bar=el("div","scopebar");
  const mk=(id,label)=>{ const b=el("button","chip"+(bdScope===id?" active":""),label); b.onclick=()=>{bdScope=id; renderBrainDump(main,id);}; return b; };
  CHAPTERS.forEach(ch=>{ if(BRAINDUMP[ch.id]) bar.appendChild(mk(ch.id,ch.tab+" · "+ch.title)); });
  main.appendChild(bar);

  if(!bdScope){ main.appendChild(el("div","bd-intro","👆 Choose a unit above to start a brain dump.")); return; }
  const set=BRAINDUMP[bdScope];
  main.appendChild(el("div","bd-intro",`<b>List everything you know about ${set.title}.</b> Aim for 3–5 minutes of nonstop writing — definitions, formulas, rules, traps. Quantity first; you'll check quality after.`));
  const ta=el("textarea","answerbox"); ta.style.minHeight="220px"; ta.placeholder=`Everything you remember about ${set.title}…`; main.appendChild(ta);
  const check=el("button","btn","Check my dump →"); main.appendChild(check);
  const out=el("div","bd-checklist"); main.appendChild(out);
  check.onclick=()=>{
    const text=" "+ta.value.toLowerCase()+" ";
    let hits=0;
    const rows=set.items.map(it=>{
      const hit=it.kw.some(k=>text.includes(k.toLowerCase()));
      if(hit) hits++;
      return `<div class="bd-item ${hit?"hit":"miss"}"><span class="bd-mark">${hit?"✓":"✗"}</span><span>${it.label}</span></div>`;
    }).join("");
    const pctv=Math.round(100*hits/set.items.length);
    out.innerHTML=`<div class="bd-score">You recalled <span>${hits} / ${set.items.length}</span> key concepts (${pctv}%). The ✗ items are your gaps — study those next.</div>${rows}`;
    bump("braindump.runs");
    const acts=el("div","lesson-actions");
    const lb=el("button","btn ghost","Open Learn for "+chMeta(bdScope).tab); lb.onclick=()=>go("learn",bdScope);
    const rb=el("button","btn ghost","Recall this unit"); rb.onclick=()=>{recallScope=bdScope; go("recall",bdScope);};
    acts.append(lb,rb); out.appendChild(acts);
    out.scrollIntoView({behavior:"smooth",block:"nearest"});
  };
}

/* ============================================================
   LEARN
   ============================================================ */
function renderLearn(main, chId){
  const tabs = el("div","chtabs");
  CHAPTERS.forEach(ch=>{
    const b = el("button","chtab"+(ch.id===chId?" active":""), ch.tab);
    b.onclick=()=>go("learn", ch.id);
    tabs.appendChild(b);
  });
  main.appendChild(tabs);

  if(!chId) chId = CHAPTERS[0].id;
  const ch = CHAPTERS.find(c=>c.id===chId);

  const head = el("div","lesson-head");
  head.innerHTML = `<span class="seg-tag">${ch.seg}</span>
    <h1>${ch.title}</h1><p class="sub">${ch.blurb}</p>`;
  main.appendChild(head);

  const tier=TIERS[ch.id];
  if(tier){
    const tp=el("div","tierpanel");
    tp.innerHTML=`<h2>🎯 What they actually test</h2>
      <div class="tier hi"><span class="tier-tag">HIGH</span><ul>${tier.High.map(x=>`<li>${x}</li>`).join("")}</ul></div>
      <div class="tier md"><span class="tier-tag">MED</span><ul>${tier.Med.map(x=>`<li>${x}</li>`).join("")}</ul></div>
      <div class="tier lo"><span class="tier-tag">LOW</span><ul>${tier.Low.map(x=>`<li>${x}</li>`).join("")}</ul></div>`;
    main.appendChild(tp);
  }

  const used=new Set();
  const stripHtml=s=>s.replace(/<[^>]+>/g," ");
  const STOP=new Set("the a an of to and or for in on with by is are as it its their our your you they we how this that these those into be can will would should value amount each within over also both per via just very".split(" "));
  function topicWords(str,minLen){ return [...new Set((stripHtml(str).toLowerCase().match(/[a-z][a-z\-]{2,}/g)||[]))].filter(w=>w.length>=minLen && !STOP.has(w)); }
  function pairQ(sec){
    const hwords=topicWords(sec.h,3);
    const iwords=topicWords((sec.items||[]).slice(0,4).join(" "),5);
    let best=null,bestN=0;
    for(const q of qsForChapter(ch.id)){
      if(used.has(q)) continue;
      const qt=stripHtml(q.q+" "+(q.choices[q.a]||"")).toLowerCase();
      let n=0;
      hwords.forEach(w=>{ if(qt.includes(w)) n+=3; });
      iwords.forEach(w=>{ if(qt.includes(w)) n+=1; });
      if(n>bestN){bestN=n;best=q;}
    }
    if(best && bestN>=3){ used.add(best); return best; }
    return null;
  }

  const lessonSecs = (typeof LESSONS!=="undefined" && LESSONS[ch.id]) ? LESSONS[ch.id] : ch.sections;
  lessonSecs.forEach(sec=>{
    const s = el("div","lesson-sec");
    s.appendChild(el("h2",null,sec.h));
    if(sec.items){
      const ul = el("ul");
      sec.items.forEach(it=>ul.appendChild(el("li",null,it)));
      s.appendChild(ul);
    }
    if(sec.text) s.appendChild(el("p",null,sec.text));
    if(sec.matrix) s.insertAdjacentHTML("beforeend", matrixHTML(sec.matrix));
    const pq=pairQ(sec);
    if(pq) s.appendChild(renderInlineQ(pq,{label:"📝 How this gets tested:"}));
    main.appendChild(s);
  });

  // worked journal entries for this chapter (so the "what gets debited/credited?" questions click)
  const jents = (typeof JOURNALS!=="undefined") ? JOURNALS.filter(j=>j.ch===ch.id) : [];
  if(jents.length){
    const jeTable=lines=>{
      const drs=lines.filter(l=>l.dr).map(l=>`<tr><td>${l.acct}</td><td class="r">${money(l.dr)}</td><td class="r"></td></tr>`).join("");
      const crs=lines.filter(l=>l.cr).map(l=>`<tr class="cr"><td>${l.acct}</td><td class="r"></td><td class="r">${money(l.cr)}</td></tr>`).join("");
      return `<table class="je-model-tbl"><tr><th>Account</th><th class="r">Debit</th><th class="r">Credit</th></tr>${drs}${crs}</table>`;
    };
    const jb=el("div","lesson-sec je-learn-block");
    jb.appendChild(el("h2",null,"📒 Journal entries to know"));
    jb.insertAdjacentHTML("beforeend",`<p class="je-learn-intro">The exact debits &amp; credits for this chapter — learn the pattern here so the "what gets debited/credited?" questions become automatic, then drill them on the ✍️ Journal tab.</p>`);
    jents.forEach(j=>{
      jb.insertAdjacentHTML("beforeend",`<div class="je-learn"><div class="je-learn-desc">${j.prompt}</div>${jeTable(j.lines)}<div class="je-learn-why">${j.why}</div></div>`);
    });
    const pb=el("button","btn ghost small","Practice these entries →"); pb.onclick=()=>go("journals",ch.id);
    jb.appendChild(pb);
    main.appendChild(jb);
  }

  const mn = el("div","mnemo");
  mn.appendChild(el("h2",null,"🧠 Memory hooks"));
  const ul = el("ul");
  ch.mnemonics.forEach(m=>ul.appendChild(el("li",null,m)));
  mn.appendChild(ul);
  main.appendChild(mn);

  const pool=qsForChapter(ch.id).filter(q=>!used.has(q));
  const extra=pool.slice(0,3);
  if(extra.length){
    const box=el("div","endq");
    box.appendChild(el("h2",null,"📝 More real review questions — "+ch.tab));
    extra.forEach(q=>box.appendChild(renderInlineQ(q,{label:"Review question"})));
    main.appendChild(box);
  }

  const act = el("div","lesson-actions");
  const qb = el("button","btn", "Quiz this unit →");
  qb.onclick=()=>go("quiz", {mode:"chapter", ch:ch.id});
  const cb = el("button","btn ghost", "Flashcards →");
  cb.onclick=()=>go("cards", ch.id);
  const rb = el("button","btn ghost", "Recall →");
  rb.onclick=()=>{recallScope=ch.id; go("recall", ch.id);};
  act.append(qb,cb,rb);
  main.appendChild(act);

  const idx = CHAPTERS.findIndex(c=>c.id===chId);
  const nav = el("div","prevnext");
  if(idx>0){ const p=el("button","btn ghost","← "+CHAPTERS[idx-1].tab); p.onclick=()=>go("learn",CHAPTERS[idx-1].id); nav.appendChild(p); }
  if(idx<CHAPTERS.length-1){ const n=el("button","btn ghost",CHAPTERS[idx+1].tab+" →"); n.onclick=()=>go("learn",CHAPTERS[idx+1].id); nav.appendChild(n); }
  main.appendChild(nav);
}

/* ============================================================
   FLASHCARDS  (Leitner spaced repetition)
   ============================================================ */
let cardDeck=[], cardPos=0, cardFlipped=false, cardScope="all";
function deckFor(scope){ let d = scope==="all"? FLASHCARDS : FLASHCARDS.filter(c=>c[0]===scope); return shuffle(d); }
function renderCards(main, scope){
  cardScope = scope || "all";
  cardDeck = deckFor(cardScope); cardPos=0; cardFlipped=false;
  const bar = el("div","scopebar");
  const mk=(id,label)=>{ const b=el("button","chip"+(cardScope===id?" active":""),label); b.onclick=()=>renderCards(main,id); return b; };
  bar.appendChild(mk("all","All"));
  CHAPTERS.forEach(ch=>bar.appendChild(mk(ch.id,ch.tab)));
  main.appendChild(bar);
  const wrap = el("div","card-wrap");
  main.appendChild(wrap);
  drawCard(wrap);
}
function drawCard(wrap){
  wrap.innerHTML="";
  if(cardPos>=cardDeck.length){
    wrap.appendChild(el("div","done","🎉 Deck complete! "+cardDeck.length+" cards reviewed."));
    const again=el("button","btn","Shuffle & repeat"); again.onclick=()=>{cardDeck=deckFor(cardScope);cardPos=0;cardFlipped=false;drawCard(wrap);};
    wrap.appendChild(again); return;
  }
  const [ch,front,back]=cardDeck[cardPos];
  const cm=chMeta(ch);
  const counter=el("div","card-counter",`Card ${cardPos+1} / ${cardDeck.length} · ${cm.tab}`);
  wrap.appendChild(counter);
  const card=el("div","flashcard"+(cardFlipped?" flipped":""));
  card.innerHTML=`<div class="fc-face fc-front"><span class="fc-hint">Q</span><div class="fc-text">${front}</div><span class="fc-tap">tap to flip</span></div>
                  <div class="fc-face fc-back"><span class="fc-hint">A</span><div class="fc-text">${back}</div></div>`;
  card.onclick=()=>{cardFlipped=!cardFlipped; card.classList.toggle("flipped");};
  wrap.appendChild(card);
  const ctrl=el("div","card-ctrl");
  const hard=el("button","btn ghost","Need review");
  const good=el("button","btn","Got it ✓");
  const next=()=>{ bump("cards."+ch); cardPos++; cardFlipped=false; drawCard(wrap); };
  hard.onclick=()=>{ cardDeck.push(cardDeck[cardPos]); next(); };
  good.onclick=next;
  ctrl.append(hard,good);
  wrap.appendChild(ctrl);
}

/* ============================================================
   HIGH-YIELD FACTS (rapid recall)
   ============================================================ */
let factDeck=[], factPos=0, factShown=false, factScope="all";
function factsFor(scope){ let d=scope==="all"?FACTS:FACTS.filter(f=>f[0]===scope); return shuffle(d); }
function renderFacts(main, scope){
  factScope=scope||"all"; factDeck=factsFor(factScope); factPos=0; factShown=false;
  main.appendChild(el("h1","page-h","⭐ High-Yield Facts"));
  main.appendChild(el("p","sub","The specific numbers, cutoffs, and 'gotcha' rules. Recall the answer, then reveal."));
  const bar=el("div","scopebar");
  const mk=(id,label)=>{ const b=el("button","chip"+(factScope===id?" active":""),label); b.onclick=()=>renderFacts(main,id); return b; };
  bar.appendChild(mk("all","All"));
  CHAPTERS.forEach(ch=>{ if(FACTS.some(f=>f[0]===ch.id)) bar.appendChild(mk(ch.id,ch.tab)); });
  main.appendChild(bar);
  const wrap=el("div","card-wrap"); main.appendChild(wrap); drawFact(wrap);
}
function drawFact(wrap){
  wrap.innerHTML="";
  if(factPos>=factDeck.length){
    wrap.appendChild(el("div","done","🎉 Done! "+factDeck.length+" facts reviewed."));
    const again=el("button","btn","Shuffle & repeat"); again.onclick=()=>{factDeck=factsFor(factScope);factPos=0;factShown=false;drawFact(wrap);};
    wrap.appendChild(again); return;
  }
  const [ch,front,back]=factDeck[factPos];
  const cm=chMeta(ch);
  wrap.appendChild(el("div","card-counter",`Fact ${factPos+1} / ${factDeck.length} · ${cm.tab}`));
  const card=el("div","flashcard"+(factShown?" flipped":""));
  card.innerHTML=`<div class="fc-face fc-front"><span class="fc-hint">?</span><div class="fc-text">${front}</div><span class="fc-tap">tap to reveal</span></div>
                  <div class="fc-face fc-back"><span class="fc-hint">FACT</span><div class="fc-text">${back}</div></div>`;
  card.onclick=()=>{factShown=!factShown;card.classList.toggle("flipped");};
  wrap.appendChild(card);
  const ctrl=el("div","card-ctrl");
  const hard=el("button","btn ghost","Review again");
  const good=el("button","btn","Got it ✓");
  const next=()=>{ factPos++; factShown=false; drawFact(wrap); };
  hard.onclick=()=>{ factDeck.push(factDeck[factPos]); next(); };
  good.onclick=next;
  ctrl.append(hard,good); wrap.appendChild(ctrl);
}

/* ============================================================
   QUIZ
   ============================================================ */
function renderInlineQ(q, opts={}){
  const wrap=el("div","inlineq");
  const w=srcWord(q.src); const cls=(q.src==="P"||q.src==="PE"||q.src==="M"||q.src==="B")?"src-p":q.src==="T"?"src-t":"src-l";
  const tag = w?`<span class='src ${cls}'>${w} Q</span>`:"";
  wrap.innerHTML=`<div class="inlineq-head">${tag}<span class="inlineq-label">${opts.label||"Try a real review question"}</span></div>
    <div class="inlineq-q">${q.q}</div>`;
  wrap.querySelector(".inlineq-head").appendChild(flagBtn(q));
  if(refLabel(q)) wrap.querySelector(".inlineq-q").insertAdjacentHTML("afterend",`<div class="qref">${refLabel(q)}</div>`);
  const cwrap=el("div","choices small");
  let answered=false;
  const order=shuffle(q.choices.map((c,i)=>({c,i})));
  order.forEach(({c,i})=>{
    const b=el("button","choice",c);
    b.onclick=()=>{ if(answered)return; answered=true;
      const correct=i===q.a;
      if(correct){ b.classList.add("right"); clearMissed(q); }
      else { markMissed(q); b.classList.add("wrong"); $$(".choice",cwrap).forEach((bb,k)=>{ if(order[k].i===q.a) bb.classList.add("right"); }); }
      $$(".choice",cwrap).forEach(bb=>bb.classList.add("locked"));
      const exp=el("div","explain "+(correct?"ok":"no")); exp.innerHTML=`<b>${correct?"Correct ✓":"Answer"}</b> — ${q.why}`;
      wrap.appendChild(exp);
    };
    cwrap.appendChild(b);
  });
  wrap.appendChild(cwrap);
  return wrap;
}
let quizSet=[], quizPos=0, quizScore=0, quizCfg=null, quizMissed=[], quizDeadline=0, quizIntv=null;
function startQuizTimer(main){
  if(quizIntv) clearInterval(quizIntv);
  quizIntv=setInterval(()=>{
    const t=$("#qtimer"); const left=Math.max(0,Math.round((quizDeadline-Date.now())/1000));
    if(t){ const m=Math.floor(left/60), s=left%60; t.textContent=`${m}:${String(s).padStart(2,"0")}`; if(left<=60)t.classList.add("danger"); }
    if(left<=0){ clearInterval(quizIntv); quizIntv=null; quizPos=quizSet.length; drawQuiz(main); }
  },1000);
}
function renderQuiz(main, cfg){
  if(!cfg){
    main.appendChild(el("h1","page-h","Practice Quiz"));
    main.appendChild(el("p","sub","Every question has a worked explanation, so wrong answers still teach you."));

    const wc=ALLQ.filter(isMissed).length;
    if(wc){
      const wf=el("button","quiz-feature weak");
      wf.innerHTML=`<div class="feat-badge red">🩹 YOUR WEAK SPOTS</div>
        <h3>Redo the ${wc} question${wc>1?"s":""} you've missed</h3>
        <p>Auto-collected from every quiz & lesson. Answer one correctly and it drops off the list.</p>`;
      wf.onclick=()=>go("quiz",{mode:"weak"});
      main.appendChild(wf);
    }

    const fg=el("button","quiz-feature");
    fg.style.cssText="background:linear-gradient(135deg,#3a3320,#29240f);border-color:#ffd24d";
    const gTypes=new Set(REALQ.map(archetypeOf)).size;
    fg.innerHTML=`<div class="feat-badge" style="background:#ffd24d;color:#1a1f2e">🏁 FINAL GAUNTLET</div>
      <h3>One of every question type (${gTypes} types)</h3>
      <p>Exactly one question from each distinct type in the bank — TVM, bond pricing, amortization, retirement, installment notes, dividends, treasury, every cash-flow type, and more. Clear it and nothing on the exam can surprise you.</p>`;
    fg.onclick=()=>go("quiz",{mode:"gauntlet"});
    main.appendChild(fg);

    const ft=el("button","quiz-feature timed");
    ft.innerHTML=`<div class="feat-badge gold">⏱ TIMED MOCK EXAM</div>
      <h3>Timed Simulator — 30 questions, 45 min</h3>
      <p>Real conditions: countdown clock, no feedback until the end, then a full scored review of every miss.</p>`;
    ft.onclick=()=>go("quiz",{mode:"timed",n:30,secs:45*60,timed:true});
    main.appendChild(ft);

    const fi=el("button","quiz-feature interleave");
    fi.innerHTML=`<div class="feat-badge purple">🔀 INTERLEAVED MIX</div>
      <h3>All four units, shuffled together</h3>
      <p>Forces you to identify the concept first — the way the real exam mixes TVM, bonds, equity & cash flows.</p>`;
    fi.onclick=()=>go("quiz",{mode:"interleave",n:25});
    main.appendChild(fi);

    const fp=el("button","quiz-feature pattern");
    fp.innerHTML=`<div class="feat-badge teal">🧩 PATTERN TRAINER</div>
      <h3>Drill one question type at a time</h3>
      <p>"Bond issue price", "dividend allocation", "CFS — operating"… train instant recognition of each archetype.</p>`;
    fp.onclick=()=>go("quiz",{mode:"patterns"});
    main.appendChild(fp);

    const fc=ALLQ.filter(isFlagged).length;
    if(fc){
      const ff=el("button","quiz-feature flagged");
      ff.innerHTML=`<div class="feat-badge red">⚑ FLAGGED</div>
        <h3>Review your flagged questions (${fc})</h3>
        <p>The questions you marked to revisit or that looked off.</p>`;
      ff.onclick=()=>go("quiz",{mode:"flagged"});
      main.appendChild(ff);
    }

    const grid=el("div","quiz-modes");
    const start=(c)=>go("quiz",c);
    const peN=ALLQ.filter(q=>q.src==="PE").length;
    const mockN=ALLQ.filter(q=>q.src==="M").length;
    const modes=[
      ["Quick Mix (10)","A fast 10-question interleaved set.",{mode:"interleave",n:10}],
      [`Study-Edge Mock Exams (${mockN} Q)`,"All three Study-Edge mock exams, verified answers.",{mode:"mock"}],
      [`Practice Exams (${peN} Q)`,"Both recreated Practice Exams, verified answers.",{mode:"exams"}],
      ["Prof review problems","Only the recreated chapter-review questions.",{mode:"practice"}],
    ];
    modes.forEach(([t,d,c])=>{ const b=el("button","quiz-mode"); b.innerHTML=`<h3>${t}</h3><p>${d}</p>`; b.onclick=()=>start(c); grid.appendChild(b); });
    CHAPTERS.forEach(ch=>{
      const n=ALLQ.filter(q=>q.ch===ch.id).length;
      const b=el("button","quiz-mode"); b.innerHTML=`<h3>${ch.tab}: ${ch.title}</h3><p>${n} questions</p>`;
      b.onclick=()=>start({mode:"chapter",ch:ch.id}); grid.appendChild(b);
    });
    main.appendChild(grid);
    return;
  }
  if(cfg.mode==="patterns"){
    main.appendChild(el("h1","page-h","🧩 Question-Pattern Trainer"));
    main.appendChild(el("p","sub","Each card is a recurring question type. Drill it to train instant recognition."));
    const groups={};
    REALQ.forEach(q=>{ const a=archetypeOf(q); (groups[a]=groups[a]||[]).push(q); });
    const grid=el("div","quiz-modes");
    Object.entries(groups).sort((a,b)=>b[1].length-a[1].length).forEach(([name,qs])=>{
      if(qs.length<2) return;
      const b=el("button","quiz-mode"); b.innerHTML=`<h3>${name}</h3><p>${qs.length} questions</p>`;
      b.onclick=()=>go("quiz",{mode:"pattern",pattern:name}); grid.appendChild(b);
    });
    main.appendChild(grid);
    const back=el("button","btn ghost","← Quiz menu"); back.onclick=()=>go("quiz"); main.appendChild(back);
    return;
  }
  quizCfg=cfg;
  if(cfg.mode==="chapter") quizSet=shuffle(ALLQ.filter(q=>q.ch===cfg.ch));
  else if(cfg.mode==="practice") quizSet=shuffle(ALLQ.filter(q=>q.src==="P"));
  else if(cfg.mode==="exams") quizSet=shuffle(ALLQ.filter(q=>q.src==="PE"));
  else if(cfg.mode==="mock") quizSet=shuffle(ALLQ.filter(q=>q.src==="M"));
  else if(cfg.mode==="gauntlet"){ const g={}; REALQ.forEach(q=>{ const a=archetypeOf(q); (g[a]=g[a]||[]).push(q); }); quizSet=shuffle(Object.keys(g).map(k=>pick(g[k]))); }
  else if(cfg.mode==="pattern") quizSet=shuffle(REALQ.filter(q=>archetypeOf(q)===cfg.pattern));
  else if(cfg.mode==="flagged") quizSet=shuffle(ALLQ.filter(isFlagged));
  else if(cfg.mode==="weak") quizSet=shuffle(ALLQ.filter(isMissed));
  else if(cfg.mode==="timed") quizSet=shuffle(ALLQ).slice(0,cfg.n||30);
  else if(cfg.mode==="interleave") quizSet=shuffle(ALLQ).slice(0,cfg.n||25);
  else quizSet=shuffle(ALLQ).slice(0,cfg.n||20);
  quizPos=0; quizScore=0; quizMissed=[];
  if(cfg.timed){ quizDeadline=Date.now()+(cfg.secs||2700)*1000; drawQuiz(main); startQuizTimer(main); return; }
  drawQuiz(main);
}
function drawQuiz(main){
  main.innerHTML="";
  const timed=quizCfg&&quizCfg.timed;
  if(!quizSet.length){
    main.appendChild(el("div","quiz-result","<p>No questions here yet — flag some while you study and they'll show up.</p>"));
    const back=el("button","btn ghost","Quiz menu"); back.onclick=()=>go("quiz"); main.appendChild(back); return;
  }
  if(quizPos>=quizSet.length){
    if(quizIntv){ clearInterval(quizIntv); quizIntv=null; }
    const p=Math.round(100*quizScore/quizSet.length);
    const res=el("div","quiz-result");
    let msg = p>=90?"Outstanding — exam-ready on this material.":p>=75?"Solid. Review the misses and run it again.":p>=60?"Getting there — revisit the High-yield topics, then retry.":"Go back to Learn + Drills for this material, then come back.";
    res.innerHTML=`<div class="big-score">${quizScore}/${quizSet.length}</div><div class="score-pct">${p}%</div><p>${msg}</p>`;
    const again=el("button","btn","Retry"); again.onclick=()=>renderQuiz(main,quizCfg);
    const back=el("button","btn ghost","Quiz menu"); back.onclick=()=>go("quiz");
    res.append(again,back); main.appendChild(res);
    if(quizMissed.length){
      const rev=el("div","review");
      rev.appendChild(el("h2",null,`Review your ${quizMissed.length} miss${quizMissed.length>1?"es":""}`));
      quizMissed.forEach(q=>{
        const c=el("div","review-q");
        c.innerHTML=`<div class="rv-q">${q.q}</div><div class="rv-a">✓ ${q.choices[q.a]}</div><div class="rv-why">${q.why}</div>`+
          (refLabel(q)?`<div class="qref">${refLabel(q)}</div>`:"");
        c.appendChild(flagBtn(q));
        rev.appendChild(c);
      });
      main.appendChild(rev);
    }
    return;
  }
  const q=quizSet[quizPos];
  const cm=chMeta(q.ch);
  const w=srcWord(q.src);
  const srcTag = w?`<span class='src ${q.src==="P"||q.src==="PE"||q.src==="M"||q.src==="B"?"src-p":q.src==="T"?"src-t":"src-l"}'>${w}</span>`:"";
  const gaunt = quizCfg&&quizCfg.mode==="gauntlet";
  const typeTag = gaunt?`<div class="q-tag" style="color:#ffd24d;border-color:#ffd24d">${archetypeOf(q)}</div>`:"";
  const head=el("div","quiz-head");
  head.innerHTML=`<div class="q-prog">Question ${quizPos+1} / ${quizSet.length}${gaunt?" · every type":""}</div>
    <div class="q-right">${srcTag}${typeTag}<div class="q-tag">${cm.tab}</div>${timed?`<div class="q-timer" id="qtimer">--:--</div>`:""}</div>`;
  main.appendChild(head);
  head.querySelector(".q-right").appendChild(flagBtn(q));
  const pbar=el("div","bar slim"); pbar.innerHTML=`<div class="bar-fill" style="width:${100*quizPos/quizSet.length}%"></div>`;
  main.appendChild(pbar);

  main.appendChild(el("div","q-text",q.q));
  if(!timed && refLabel(q)) main.appendChild(el("div","qref",refLabel(q)));
  const order=shuffle(q.choices.map((c,i)=>({c,i})));
  const choicesWrap=el("div","choices");
  let answered=false;
  order.forEach(({c,i})=>{
    const b=el("button","choice",c);
    b.onclick=()=>{
      if(answered)return; answered=true;
      bump("quiz."+q.ch+".seen");
      const correct = i===q.a;
      if(correct){ quizScore++; bump("quiz."+q.ch+".correct"); b.classList.add("right"); clearMissed(q); }
      else { quizMissed.push(q); markMissed(q); b.classList.add("wrong");
        $$(".choice",choicesWrap).forEach((bb,k)=>{ if(order[k].i===q.a) bb.classList.add("right"); });
      }
      $$(".choice",choicesWrap).forEach(bb=>bb.classList.add("locked"));
      if(!timed){
        const exp=el("div","explain"+(correct?" ok":" no"));
        exp.innerHTML=`<b>${correct?"Correct ✓":"Not quite"}</b> — ${q.why}`;
        main.appendChild(exp);
      }
      const nx=el("button","btn",quizPos+1>=quizSet.length?"Finish →":"Next →"); nx.onclick=()=>{quizPos++;drawQuiz(main);};
      main.appendChild(nx);
    };
    choicesWrap.appendChild(b);
  });
  main.appendChild(choicesWrap);
}

/* ============================================================
   COMPUTATIONAL DRILLS
   each generator returns {title, prompt(html), choices[], answerIdx, solution(html)}
   ============================================================ */
function numChoices(correct, makeDistractors, fmt){
  let set = new Set([fmt(correct)]);
  const dist = makeDistractors();
  for(const d of dist){ if(set.size>=4) break; if(isFinite(d)) set.add(fmt(d)); }
  let guard=0;
  while(set.size<4 && guard++<50){ set.add(fmt(correct*(1+ (rint(-25,25)/100)))); }
  const arr=shuffle([...set]);
  return { choices:arr, answerIdx:arr.indexOf(fmt(correct)) };
}

const DRILLS = {
  // ---- Time Value of Money: FV of a single amount ----
  fvSingle(){
    const P=rint(5,40)*1000;
    const rate=pick([4,6,8,10,12]);
    const yrs=pick([3,4,5,6,7]);
    const m=pick([1,1,2,4]);
    const i=rate/100/m, n=yrs*m;
    const fv=P*fvSingle(i,n);
    const fmt=v=>money(v);
    const {choices,answerIdx}=numChoices(fv, ()=>[
      P*(1+rate/100*yrs),        // simple interest
      P*Math.pow(1+rate/100,yrs),// forgot to adjust for compounding frequency
      P*fvSingle(rate/100/m, yrs)// used years not periods
    ], fmt);
    const comp=m===1?"annually":m===2?"semiannually":"quarterly";
    const prompt=`<p>How much will <b>${money(P)}</b> grow to in <b>${yrs} years</b> at <b>${rate}%</b> compounded <b>${comp}</b>?</p>`;
    const solution=`<p>Adjust for the period: i = ${rate}% ÷ ${m} = <b>${(rate/m).toFixed(2)}%</b>, n = ${yrs} × ${m} = <b>${n}</b>.</p>
      <p>FV = PV × (1+i)ⁿ = ${money(P)} × ${(fvSingle(i,n)).toFixed(5)} = <b>${money(fv)}</b></p>
      <p class="tip">Trap: with non-annual compounding you must adjust BOTH the rate and the number of periods.</p>`;
    return {title:"FV of a single amount", prompt, choices, answerIdx, solution};
  },
  // ---- TVM: PV of a single amount ----
  pvSingle(){
    const FV=rint(20,80)*1000;
    const rate=pick([5,6,8,10]);
    const yrs=pick([3,4,5,6]);
    const m=pick([1,1,2]);
    const i=rate/100/m, n=yrs*m;
    const pv=FV*pvSingle(i,n);
    const fmt=v=>money(v);
    const {choices,answerIdx}=numChoices(pv, ()=>[
      FV*pvSingle(rate/100,yrs), // forgot frequency
      FV/(1+rate/100*yrs),       // simple
      FV*fvSingle(i,n)           // grew instead of discounted
    ], fmt);
    const comp=m===1?"annually":"semiannually";
    const prompt=`<p>How much must you deposit <b>today</b> to have <b>${money(FV)}</b> in <b>${yrs} years</b>, at <b>${rate}%</b> compounded <b>${comp}</b>?</p>`;
    const solution=`<p>i = ${(rate/m).toFixed(2)}%, n = ${n}. PV = FV ÷ (1+i)ⁿ = ${money(FV)} × ${pvSingle(i,n).toFixed(5)} = <b>${money(pv)}</b></p>
      <p class="tip">PV is just FV in reverse — you DISCOUNT instead of compound.</p>`;
    return {title:"PV of a single amount", prompt, choices, answerIdx, solution};
  },
  // ---- Bond issue price ----
  bondprice(){
    const face=pick([100000,200000,500000,1000000]);
    const pairs=[[8,10],[10,12],[6,8],[12,14],[7,8]];
    const [stated,market]=pick(pairs);
    const yrs=pick([5,10]);
    const i=market/100/2, n=yrs*2, coupon=face*(stated/100)/2;
    const price=face*pvSingle(i,n)+coupon*pvAnnuity(i,n);
    const fmt=v=>money(v);
    const {choices,answerIdx}=numChoices(price, ()=>[
      face,                                         // par (ignored discount)
      face*pvSingle(stated/100/2,n)+coupon*pvAnnuity(stated/100/2,n), // discounted at stated
      face*pvSingle(i,n)                            // forgot the coupons
    ], fmt);
    const prompt=`<p>Compute the <b>issue price</b> of a <b>${money(face)}</b> bond, <b>${stated}%</b> stated, <b>${yrs} years</b>, interest paid <b>semiannually</b>. Market rate = <b>${market}%</b>. (Round to nearest dollar.)</p>`;
    const solution=`<p>Semiannual: i = ${market}%/2 = <b>${(market/2)}%</b>, n = ${yrs}×2 = <b>${n}</b>, coupon = ${money(face)}×${stated}%/2 = <b>${money(coupon)}</b>.</p>
      <p>PV(face) = ${money(face)} × ${pvSingle(i,n).toFixed(5)} = ${money(face*pvSingle(i,n))}</p>
      <p>PV(coupons) = ${money(coupon)} × ${pvAnnuity(i,n).toFixed(5)} = ${money(coupon*pvAnnuity(i,n))}</p>
      <p>Issue price = <b>${money(price)}</b> — a <b>${stated<market?"discount":"premium"}</b> (stated ${stated<market?"<":">"} market).</p>
      <p class="tip">Always discount at the MARKET rate, and split it semiannually.</p>`;
    return {title:"Bond issue price", prompt, choices, answerIdx, solution};
  },
  // ---- Effective-interest: expense, cash, amortization ----
  bondinterest(){
    const face=pick([200000,400000,500000,600000]);
    const disc=Math.random()<0.6;
    const stated=pick([6,7,8]);
    const market=disc?stated+2:stated-2;
    const cv=disc? face*rint(88,96)/100 : face*rint(104,112)/100;
    const i=market/100/2, sc=stated/100/2;
    const exp=cv*i, cash=face*sc, amort=Math.abs(exp-cash);
    const fmt=v=>money(v);
    const {choices,answerIdx}=numChoices(exp, ()=>[ cash, face*i, cv*sc ], fmt);
    const prompt=`<p>A <b>${money(face)}</b> bond with a <b>${stated}%</b> stated rate (semiannual) was issued to yield <b>${market}%</b>. Its current carrying value is <b>${money(cv)}</b>. What is the <b>interest expense</b> for the next semiannual period?</p>`;
    const solution=`<p>Interest expense = carrying value × market rate per period = ${money(cv)} × ${market}%/2 = <b>${money(exp)}</b>.</p>
      <p>Cash interest = face × stated/2 = ${money(face)} × ${stated}%/2 = ${money(cash)}. Amortization = ${money(amort)} (${disc?"discount":"premium"}).</p>
      <p class="tip">Expense uses the MARKET rate on the CARRYING value; cash uses the STATED rate on FACE.</p>`;
    return {title:"Bond interest (effective-interest)", prompt, choices, answerIdx, solution};
  },
  // ---- Installment note: first-period interest & principal ----
  installment(){
    const loan=pick([100000,125000,150000,200000]);
    const rate=pick([5,6,8,9]);
    const i=rate/100/12, n=pick([36,48,60]);
    const pay=loan*i/(1-Math.pow(1+i,-n));
    const interest1=loan*rate/100/12;
    const principal1=pay-interest1;
    const askInterest=Math.random()<0.5;
    const correct=askInterest?interest1:principal1;
    const fmt=v=>money2(v);
    const {choices,answerIdx}=numChoices(correct, ()=>[
      askInterest?principal1:interest1,
      loan*rate/100,           // annual not monthly
      pay
    ], fmt);
    const prompt=`<p>A <b>${money(loan)}</b>, <b>${rate}%</b> loan is repaid in equal monthly payments of <b>${money2(pay)}</b>. For the <b>first</b> payment, what is the <b>${askInterest?"interest":"principal"}</b> portion?</p>`;
    const solution=`<p>Interest portion = balance × rate × 1/12 = ${money(loan)} × ${rate}% ÷ 12 = <b>${money2(interest1)}</b>.</p>
      <p>Principal portion = payment − interest = ${money2(pay)} − ${money2(interest1)} = <b>${money2(principal1)}</b>.</p>
      <p class="tip">Each period: interest first (on the current balance), the rest pays down principal. Interest shrinks over time.</p>`;
    return {title:"Installment note split", prompt, choices, answerIdx, solution};
  },
  // ---- Dividend allocation: preferred vs common ----
  dividend(){
    const pfShares=pick([2000,5000,10000]);
    const par=pick([25,50,100]);
    const rate=pick([2,5,6,8]);
    const cumulative=Math.random()<0.5;
    const arrears=cumulative?pick([0,1,2,3]):0;
    const pfAnnual=pfShares*par*rate/100;
    const pfTotal=pfAnnual*(arrears+1);
    const commonShares=pick([50000,100000,125000,300000]);
    const total=pfTotal+pick([15000,30000,60000,90000]);
    const common=total-pfTotal;
    const fmt=v=>money(v);
    const {choices,answerIdx}=numChoices(common, ()=>[
      total-pfAnnual,           // ignored arrears
      total,                    // gave it all to common
      pfTotal                   // confused preferred & common
    ], fmt);
    const cum=cumulative?`<b>cumulative</b>${arrears?`, ${arrears} year(s) in arrears`:""}`:`<b>noncumulative</b>`;
    const prompt=`<p>${pfShares.toLocaleString()} shares of <b>${rate}%, $${par} par</b> ${cum} preferred and ${commonShares.toLocaleString()} common shares are outstanding. A <b>${money(total)}</b> dividend is declared. How much goes to <b>common</b>?</p>`;
    const solution=`<p>Preferred per year = ${pfShares.toLocaleString()} × $${par} × ${rate}% = <b>${money(pfAnnual)}</b>.</p>
      <p>Preferred takes ${cumulative&&arrears?`${arrears} arrears + current = ${arrears+1} years = `:""}<b>${money(pfTotal)}</b> first.</p>
      <p>Common = ${money(total)} − ${money(pfTotal)} = <b>${money(common)}</b>.</p>
      <p class="tip">Cumulative preferred must clear ALL arrears before common gets a cent.</p>`;
    return {title:"Dividend allocation", prompt, choices, answerIdx, solution};
  },
  // ---- CFS operating (indirect) ----
  cfsindirect(){
    const ni=rint(80,250)*1000;
    const depr=rint(10,50)*1000;
    const arInc=pick([-1,1])*rint(5,25)*1000;   // +increase
    const apInc=pick([-1,1])*rint(5,25)*1000;
    const invInc=pick([-1,1])*rint(5,20)*1000;
    const gl=pick([0,1,-1])*rint(5,15)*1000;    // +gain, -loss
    const op=ni+depr - arInc + apInc - invInc - gl; // asset incr subtract, liab incr add, gain subtract/loss add
    const fmt=v=>money(v);
    const {choices,answerIdx}=numChoices(op, ()=>[
      ni+depr+arInc-apInc+invInc+gl, // all signs flipped
      ni+depr,
      ni
    ], fmt);
    const sign=v=>(v>=0?"increased":"decreased")+" "+money(Math.abs(v));
    const glTxt=gl>0?`a ${money(gl)} gain on sale of equipment`:gl<0?`a ${money(-gl)} loss on sale of equipment`:`no gains or losses`;
    const prompt=`<p>Net income was <b>${money(ni)}</b>. Depreciation was ${money(depr)}. During the year: Accounts Receivable ${sign(arInc)}, Inventory ${sign(invInc)}, Accounts Payable ${sign(apInc)}, and there was ${glTxt}. Net cash from <b>operating activities</b> (indirect)?</p>`;
    const solution=`<p>Start at NI ${money(ni)}; + depreciation ${money(depr)}; ${gl>0?`− gain ${money(gl)}`:gl<0?`+ loss ${money(-gl)}`:""}</p>
      <p>A/R ${arInc>=0?"increase → subtract":"decrease → add"} ${money(Math.abs(arInc))}; Inventory ${invInc>=0?"increase → subtract":"decrease → add"} ${money(Math.abs(invInc))}; A/P ${apInc>=0?"increase → add":"decrease → subtract"} ${money(Math.abs(apInc))}.</p>
      <p>Net cash from operations = <b>${money(op)}</b>.</p>
      <p class="tip">Assets move OPPOSITE to cash; liabilities move WITH cash. Subtract gains, add losses.</p>`;
    return {title:"CFS — operating (indirect)", prompt, choices, answerIdx, solution};
  },
  // ---- CFS direct method: cash paid/collected (one universal sign rule) ----
  cfsdirect(){
    const v=pick(["suppliers","taxes","customers"]);
    const fmt=x=>money(x);
    const sg=x=>(x>=0?"increased":"decreased")+" "+money(Math.abs(x));
    if(v==="suppliers"){
      const cogs=rint(150,450)*1000, invInc=pick([-1,1])*rint(5,40)*1000, apInc=pick([-1,1])*rint(5,40)*1000;
      const paid=cogs+invInc-apInc;
      const {choices,answerIdx}=numChoices(paid, ()=>[ cogs-invInc+apInc, cogs+invInc+apInc, cogs ], fmt);
      const prompt=`<p>COGS was <b>${money(cogs)}</b>. During the year Inventory ${sg(invInc)} and Accounts Payable ${sg(apInc)}. Under the direct method, what was <b>cash paid to suppliers</b>?</p>`;
      const solution=`<p>Start −COGS. Inventory (asset) ${invInc>=0?"increase → subtract":"decrease → add"}; A/P (liability) ${apInc>=0?"increase → add":"decrease → subtract"}.</p>
        <p>Cash paid = COGS + ↑inventory − ↑A/P = ${money(cogs)} ${invInc>=0?"+":"−"} ${money(Math.abs(invInc))} ${apInc>=0?"−":"+"} ${money(Math.abs(apInc))} = <b>${money(paid)}</b>.</p>
        <p class="tip">Asset ↑ subtracts cash, liability ↑ adds cash — same rule as indirect; the expense just starts negative.</p>`;
      return {title:"CFS — cash paid to suppliers (direct)", prompt, choices, answerIdx, solution};
    }
    if(v==="taxes"){
      const exp=rint(50,300)*1000, payInc=pick([-1,1])*rint(5,30)*1000;
      const paid=exp-payInc;
      const {choices,answerIdx}=numChoices(paid, ()=>[ exp+payInc, exp, Math.abs(payInc) ], fmt);
      const prompt=`<p>Income tax expense was <b>${money(exp)}</b>. Income taxes payable ${sg(payInc)} during the year. Under the direct method, what was <b>cash paid for income taxes</b>?</p>`;
      const solution=`<p>Start −Tax expense. Taxes payable (liability) ${payInc>=0?"increase → add":"decrease → subtract"}.</p>
        <p>Cash paid = Tax expense − ↑taxes payable = ${money(exp)} ${payInc>=0?"−":"+"} ${money(Math.abs(payInc))} = <b>${money(paid)}</b>.</p>
        <p class="tip">A taxes-payable increase means you paid LESS than the expense (the liability conserved cash).</p>`;
      return {title:"CFS — cash paid for taxes (direct)", prompt, choices, answerIdx, solution};
    }
    const sales=rint(300,800)*1000, arInc=pick([-1,1])*rint(5,50)*1000;
    const got=sales-arInc;
    const {choices,answerIdx}=numChoices(got, ()=>[ sales+arInc, sales, Math.abs(arInc) ], fmt);
    const prompt=`<p>Sales (all on account) were <b>${money(sales)}</b>. Accounts Receivable ${sg(arInc)} during the year. Under the direct method, what was <b>cash collected from customers</b>?</p>`;
    const solution=`<p>Start +Sales. A/R (asset) ${arInc>=0?"increase → subtract":"decrease → add"}.</p>
      <p>Cash collected = Sales − ↑A/R = ${money(sales)} ${arInc>=0?"−":"+"} ${money(Math.abs(arInc))} = <b>${money(got)}</b>.</p>
      <p class="tip">Revenue starts positive (cash in); the asset A/R moves opposite to cash.</p>`;
    return {title:"CFS — cash from customers (direct)", prompt, choices, answerIdx, solution};
  },
  // ---- CFS classification ----
  cfsclassify(){
    const items=[
      ["Cash paid to repurchase the company's own (treasury) stock","Financing"],
      ["Cash dividends paid to shareholders","Financing"],
      ["Cash received from issuing bonds payable","Financing"],
      ["Cash received from issuing common stock","Financing"],
      ["Cash paid to buy a new building","Investing"],
      ["Cash received from selling equipment","Investing"],
      ["Cash lent out / collected on a note receivable (principal)","Investing"],
      ["Cash received as dividends on stock the company owns","Operating"],
      ["Cash paid for interest on a note payable","Operating"],
      ["Cash collected from customers","Operating"],
      ["Cash paid to suppliers and employees","Operating"],
      ["Cash paid for income taxes","Operating"]
    ];
    const [stmt,ans]=pick(items);
    const choices=["Operating","Investing","Financing"];
    const answerIdx=choices.indexOf(ans);
    const prompt=`<p>Classify this cash flow:</p><p class="drill-prompt"><b>${stmt}</b></p>`;
    const solution=`<p>This is a <b>${ans}</b> activity.</p>
      <p class="tip">Traps: dividends RECEIVED = Operating, PAID = Financing. Interest paid OR received = Operating. Buying/selling long-term assets = Investing.</p>`;
    return {title:"CFS — classification", prompt, choices, answerIdx, solution};
  },
  // ---- Debt / equity ratios ----
  ratios(){
    const which=pick(["de","tie"]);
    if(which==="de"){
      const eq=rint(2,8)*100000, li=rint(2,9)*100000;
      const de=li/eq;
      const fmt=v=>v.toFixed(2);
      const {choices,answerIdx}=numChoices(de, ()=>[ eq/li, li/(li+eq), (li+eq)/eq ], fmt);
      const prompt=`<p>Total liabilities = <b>${money(li)}</b>, total stockholders' equity = <b>${money(eq)}</b>. What is the <b>debt-to-equity ratio</b>?</p>`;
      const solution=`<p>Debt to equity = liabilities ÷ equity = ${money(li)} ÷ ${money(eq)} = <b>${de.toFixed(2)}</b>.</p>`;
      return {title:"Debt-to-equity", prompt, choices, answerIdx, solution};
    } else {
      const ni=rint(3,12)*1000, intr=rint(1,3)*500, tax=rint(1,4)*1000;
      const tie=(ni+intr+tax)/intr;
      const fmt=v=>v.toFixed(1);
      const {choices,answerIdx}=numChoices(tie, ()=>[ ni/intr, (ni+tax)/intr, (ni+intr)/intr ], fmt);
      const prompt=`<p>Net income = <b>${money(ni)}</b>, interest expense = <b>${money(intr)}</b>, income tax = <b>${money(tax)}</b>. What is <b>times interest earned</b>?</p>`;
      const solution=`<p>TIE = (NI + interest + tax) ÷ interest = (${money(ni)} + ${money(intr)} + ${money(tax)}) ÷ ${money(intr)} = <b>${tie.toFixed(1)}</b>.</p>
        <p class="tip">The numerator is EBIT — add interest and taxes BACK to net income.</p>`;
      return {title:"Times interest earned", prompt, choices, answerIdx, solution};
    }
  }
};

const DRILL_META=[
  ["fvSingle","FV single amount","App C"],
  ["pvSingle","PV single amount","App C"],
  ["bondprice","Bond issue price","Ch 9"],
  ["bondinterest","Bond interest & amortization","Ch 9"],
  ["installment","Installment note split","Ch 9"],
  ["dividend","Dividend allocation","Ch 10"],
  ["cfsindirect","CFS operating (indirect)","Ch 11"],
  ["cfsdirect","CFS direct (cash paid/collected)","Ch 11"],
  ["cfsclassify","CFS classification","Ch 11"],
  ["ratios","Debt & equity ratios","Ch 9/10"]
];
let drillType="mix", drillCur=null;
function renderDrills(main, type){
  drillType = type || "mix";
  const bar=el("div","scopebar");
  const mk=(id,label)=>{ const b=el("button","chip"+(drillType===id?" active":""),label); b.onclick=()=>renderDrills(main,id); return b; };
  bar.appendChild(mk("mix","🎲 Mixed"));
  DRILL_META.forEach(([id,label])=>bar.appendChild(mk(id,label)));
  main.appendChild(bar);
  main.appendChild(el("p","sub","New numbers every time. Work it on paper first, then check. The real exam's computational items are multiple-choice — same as here. (Factors use exact math; if you use rounded factor tables you may be off by a few dollars — pick the closest.)"));
  const stage=el("div","drill-stage");
  main.appendChild(stage);
  nextDrill(stage);
}
function nextDrill(stage){
  const key = drillType==="mix" ? pick(DRILL_META.map(m=>m[0])) : drillType;
  drillCur = DRILLS[key]();
  drillCur._key=key;
  stage.innerHTML="";
  const meta=DRILL_META.find(m=>m[0]===key);
  stage.appendChild(el("div","drill-tag",`${drillCur.title} · ${meta[2]}`));
  stage.appendChild(el("div","drill-prompt",drillCur.prompt));
  const choicesWrap=el("div","choices");
  let answered=false;
  drillCur.choices.forEach((c,i)=>{
    const b=el("button","choice",c);
    b.onclick=()=>{
      if(answered)return; answered=true;
      bump("drills.seen");
      const correct=i===drillCur.answerIdx;
      if(correct){ bump("drills.correct"); b.classList.add("right"); }
      else { b.classList.add("wrong"); $$(".choice",choicesWrap)[drillCur.answerIdx].classList.add("right"); }
      $$(".choice",choicesWrap).forEach(bb=>bb.classList.add("locked"));
      const sol=el("div","solution"+(correct?" ok":" no"));
      sol.innerHTML=`<div class="sol-h">${correct?"Correct ✓":"Not quite — here's the work:"}</div>${drillCur.solution}`;
      stage.appendChild(sol);
      const nx=el("button","btn","New problem →"); nx.onclick=()=>nextDrill(stage);
      stage.appendChild(nx);
    };
    choicesWrap.appendChild(b);
  });
  stage.appendChild(choicesWrap);
  const skip=el("button","btn ghost small","Show solution / skip");
  skip.onclick=()=>{ if(answered)return; answered=true;
    $$(".choice",choicesWrap).forEach((bb,i)=>{bb.classList.add("locked"); if(i===drillCur.answerIdx)bb.classList.add("right");});
    const sol=el("div","solution"); sol.innerHTML=`<div class="sol-h">Solution</div>${drillCur.solution}`;
    stage.appendChild(sol);
    const nx=el("button","btn","New problem →"); nx.onclick=()=>nextDrill(stage); stage.appendChild(nx);
  };
  stage.appendChild(skip);
}

/* ============================================================
   JOURNAL ENTRIES — fill in the entry, auto-graded
   ============================================================ */
let jeScope="all", jeDeck=[], jePos=0;
function jeFor(scope){ let d=scope==="all"?JOURNALS:JOURNALS.filter(j=>j.ch===scope); return shuffle(d); }
function renderJournal(main, scope){
  jeScope = scope || jeScope || "all";
  jeDeck = jeFor(jeScope); jePos=0;
  main.appendChild(el("h1","page-h","✍️ Journal Entries"));
  main.appendChild(el("p","sub","Build the entry yourself — pick the accounts and enter the debits & credits, then check. This is the single best way to make bonds & equity stick. Whole dollars; debits must equal credits."));
  const bar=el("div","scopebar");
  const mk=(id,label)=>{ const b=el("button","chip"+(jeScope===id?" active":""),label); b.onclick=()=>renderJournal(main,id); return b; };
  bar.appendChild(mk("all","All"));
  CHAPTERS.forEach(ch=>{ if(JOURNALS.some(j=>j.ch===ch.id)) bar.appendChild(mk(ch.id,ch.tab)); });
  main.appendChild(bar);
  const stage=el("div","je-stage"); main.appendChild(stage);
  drawJournal(stage);
}
function drawJournal(stage){
  stage.innerHTML="";
  if(jePos>=jeDeck.length){
    stage.appendChild(el("div","done","🎉 You worked through all "+jeDeck.length+" entries."));
    const again=el("button","btn","Shuffle & repeat"); again.onclick=()=>{jeDeck=jeFor(jeScope);jePos=0;drawJournal(stage);};
    stage.appendChild(again); return;
  }
  const j=jeDeck[jePos];
  const cm=chMeta(j.ch);
  stage.appendChild(el("div","je-tag",`${cm.tab} · Entry ${jePos+1} / ${jeDeck.length}`));
  stage.appendChild(el("div","je-prompt",j.prompt));

  const nRows=j.lines.length+1;
  const optHTML='<option value="">— choose account —</option>'+JE_ACCOUNTS.map(a=>`<option>${a}</option>`).join("");
  const table=el("table","je-table");
  table.innerHTML="<tr><th>Account</th><th class='r'>Debit</th><th class='r'>Credit</th></tr>";
  for(let r=0;r<nRows;r++){
    const tr=el("tr","je-row");
    tr.innerHTML=`<td class="je-acct"><select>${optHTML}</select></td>
      <td class="je-amt"><input inputmode="numeric" placeholder="—"></td>
      <td class="je-amt"><input inputmode="numeric" placeholder="—"></td>`;
    table.appendChild(tr);
  }
  stage.appendChild(table);
  const out=el("div");
  const check=el("button","btn","Check my entry");
  const reveal=el("button","btn ghost small","Show answer");
  stage.append(check,reveal,out);

  function modelHTML(){
    const drs=j.lines.filter(l=>l.dr).map(l=>`<tr><td>${l.acct}</td><td class="r">${money(l.dr)}</td><td class="r"></td></tr>`).join("");
    const crs=j.lines.filter(l=>l.cr).map(l=>`<tr class="cr"><td>${l.acct}</td><td class="r"></td><td class="r">${money(l.cr)}</td></tr>`).join("");
    return `<div class="je-model"><h3>Correct entry</h3><table>${drs}${crs}</table><p style="margin-top:10px">${j.why}</p></div>`;
  }
  function finish(){
    check.remove(); reveal.remove();
    const nx=el("button","btn","New entry →"); nx.onclick=()=>{jePos++;drawJournal(stage);}; stage.appendChild(nx);
  }
  reveal.onclick=()=>{ out.innerHTML=modelHTML(); bump("journals.seen"); finish(); };
  check.onclick=()=>{
    const parse=s=>{ const n=parseFloat(String(s).replace(/[^0-9.\-]/g,"")); return isFinite(n)?n:0; };
    const rows=[...table.querySelectorAll(".je-row")];
    const exp=j.lines.map(l=>({acct:l.acct, side:l.dr?"dr":"cr", amt:l.dr||l.cr, matched:false}));
    let totDr=0, totCr=0;
    const filled=[];
    rows.forEach(tr=>{
      tr.classList.remove("ok","bad");
      const acct=tr.querySelector("select").value;
      const ins=tr.querySelectorAll("input");
      const dr=parse(ins[0].value), cr=parse(ins[1].value);
      totDr+=dr; totCr+=cr;
      if(acct && (dr>0||cr>0)) filled.push({tr,acct,dr,cr});
    });
    filled.forEach(u=>{
      const side=u.dr>0?"dr":"cr", amt=u.dr>0?u.dr:u.cr;
      const m=exp.find(e=>!e.matched && e.acct===u.acct && e.side===side && Math.abs(e.amt-amt)<=1);
      if(m && !(u.dr>0&&u.cr>0)){ m.matched=true; u.tr.classList.add("ok"); u.ok=true; }
      else { u.tr.classList.add("bad"); u.ok=false; }
    });
    const matched=exp.filter(e=>e.matched).length;
    const extras=filled.filter(u=>!u.ok).length;
    const balanced=Math.abs(totDr-totCr)<=1 && totDr>0;
    const perfect=matched===exp.length && extras===0;
    bump("journals.seen"); if(perfect) bump("journals.correct");
    out.innerHTML=
      `<div class="je-balance ${balanced?"ok":"no"}">Debits ${money(totDr)} ${balanced?"=":"≠"} Credits ${money(totCr)} ${balanced?"✓ balanced":"✗ not balanced"}</div>`+
      `<div class="je-result ${perfect?"ok":"no"}"><b>${perfect?"Perfect ✓":"Not quite"}</b> — you matched ${matched} of ${exp.length} correct line${exp.length>1?"s":""}${extras?`, with ${extras} line${extras>1?"s":""} that don't belong`:""}. ${perfect?"Nailed it.":"Compare with the correct entry below."}</div>`+
      modelHTML();
    finish();
  };
}

/* ============================================================
   GOTCHAS
   ============================================================ */
function renderGotchas(main){
  main.appendChild(el("h1","page-h","🎯 Gotchas & High-Yield Traps"));
  main.appendChild(el("p","sub","The tricky, frequently-missed distinctions consolidated for the final push."));
  function sec(title, html){ const s=el("div","lesson-sec"); s.innerHTML="<h2>"+title+"</h2>"+html; main.appendChild(s); }

  sec("📈 Bonds: which rate does what? <span class='gtag'>VERY COMMON</span>",
    `<table class="dtable"><tr><th>Use…</th><th>…for</th></tr>
     <tr><td><b>Stated</b> (coupon) rate</td><td>CASH interest = face × stated × period</td></tr>
     <tr><td><b>Market</b> (yield) rate</td><td>PRICING the bond & interest EXPENSE = carrying value × market</td></tr></table>
     <ul><li>Stated &lt; Market → <b>discount</b> (price below face). Stated &gt; Market → <b>premium</b>.</li>
     <li>Discount carrying value rises to face; premium falls to face — <b>both end at face</b>.</li>
     <li>Semiannual: halve BOTH rates, double the periods.</li></ul>`);

  sec("🔁 Retirement: use CARRYING value, not market",
    `<ul><li><b>Gain/Loss = Carrying value − Cash paid to retire.</b> Positive = gain.</li>
     <li>The bond's "market value" in the problem is usually a <b>distractor</b> — ignore it unless it's the cash paid.</li></ul>`);

  sec("🧮 Installment notes & the carrying-value direction",
    `<ul><li>Interest = balance × rate × time → as the balance falls, <b>interest portion DECREASES</b>, principal portion increases.</li>
     <li>Carrying value is <b>highest at the start</b> → the EARLIEST date has the highest balance.</li>
     <li>Recording a note/lease for an asset: <b>assets ↑ and liabilities ↑</b> (no equity effect); record at the <b>PV of payments</b>.</li></ul>`);

  sec("🏛️ Equity: shares, treasury & dividends",
    `<ul><li><b>Authorized ≥ Issued ≥ Outstanding</b>; Outstanding = Issued − Treasury.</li>
     <li><b>Treasury</b> is recorded at <b>COST</b> (contra-equity) — original issue price is a distractor; reissue never creates a gain/loss.</li>
     <li><b>Cumulative</b> preferred clears arrears + current before common; <b>noncumulative</b> skips lost years entirely.</li>
     <li><b>Stock dividend:</b> small (&lt;25%) = MARKET value; large (≥25%) = PAR. <b>Split</b> = no entry, total equity unchanged.</li></ul>`);

  sec("💵 Cash flows: the classification traps",
    `<table class="dtable"><tr><th>Item</th><th>Section</th></tr>
     <tr><td>Dividends <b>received</b> (on investments)</td><td>Operating</td></tr>
     <tr><td>Dividends <b>paid</b> (to your shareholders)</td><td>Financing</td></tr>
     <tr><td>Interest paid <i>and</i> interest received</td><td>Operating</td></tr>
     <tr><td>Buying/selling equipment, plant, investments</td><td>Investing</td></tr>
     <tr><td>Issuing/repaying bond & note <b>principal</b>, stock, treasury</td><td>Financing</td></tr></table>
     <ul><li><b>One sign rule for BOTH methods:</b> assets ↑ subtract / ↓ add; liabilities ↑ add / ↓ subtract. Indirect: start at net income (add back depreciation, subtract gains, add losses). Direct: write each expense as a negative cash-out first, then apply the same rule — so an A/P or taxes-payable increase ADDS, an inventory or prepaid increase SUBTRACTS.</li>
     <li>Direct results: cash to suppliers = COGS + ↑inventory − ↑A/P; cash for taxes = Tax expense − ↑taxes payable; cash from customers = Sales − ↑A/R.</li>
     <li>Cash from selling an asset = <b>book value ± gain/loss</b>, all reported in Investing.</li>
     <li>Buying an asset partly with a note: only the <b>cash</b> portion is Investing; the financed part is a <b>non-cash</b> disclosure.</li></ul>`);

  const q=el("button","btn","Drill these computations →"); q.onclick=()=>go("drills"); main.appendChild(q);
}

/* ============================================================
   CRAM SHEET
   ============================================================ */
function renderCram(main){
  main.appendChild(el("h1","page-h","⚡ Cram Sheet"));
  main.appendChild(el("p","sub","Everything compressed. Read top-to-bottom the day of the exam."));

  const hit=el("div","cram-hitlist");
  hit.appendChild(el("h2",null,"🎯 Highest-yield by unit (hit these first)"));
  const hg=el("div","hit-grid");
  CHAPTERS.forEach(ch=>{ const t=TIERS[ch.id]; if(!t)return;
    const d=el("div","hit-ch"); d.innerHTML=`<b>${ch.tab} ${ch.title}</b><ul>${t.High.map(x=>`<li>${x}</li>`).join("")}</ul>`;
    hg.appendChild(d);
  });
  hit.appendChild(hg); main.appendChild(hit);

  const formulas=el("div","cram-formulas");
  formulas.innerHTML=`<h2>The formulas that win points</h2>
    <ul>
      <li><b>FV single</b> = PV × (1+i)ⁿ · <b>PV single</b> = FV ÷ (1+i)ⁿ (adjust i & n for compounding frequency)</li>
      <li><b>Loan payment</b> = amount ÷ PV-annuity factor(i, n)</li>
      <li><b>Bond issue price</b> = PV(face) + PV(coupons), discounted at the MARKET rate (semiannual: rates ÷2, n ×2)</li>
      <li><b>Cash interest</b> = face × stated rate × period · <b>Interest expense</b> = carrying value × market rate × period</li>
      <li><b>Amortization</b> = |interest expense − cash interest| · discount ↑ to face, premium ↓ to face</li>
      <li><b>Bond retirement gain/loss</b> = carrying value − cash paid</li>
      <li><b>Debt-to-equity</b> = liabilities ÷ equity · <b>Times interest earned</b> = (NI + interest + tax) ÷ interest</li>
      <li><b>Outstanding shares</b> = issued − treasury · <b>Preferred dividend</b> = shares × par × rate</li>
      <li><b>Total paid-in capital</b> = Common + Preferred + APIC</li>
      <li><b>Dividends declared</b> = Beg RE + Net income − End RE · <b>Cash dividends paid</b> = declared − ΔDividends payable</li>
      <li><b>ROE</b> = NI ÷ avg equity · <b>EPS</b> = (NI − pref div) ÷ shares · <b>P/E</b> = price ÷ EPS · <b>Div yield</b> = DPS ÷ price</li>
      <li><b>Cash from asset sale</b> = book value ± gain/loss (Investing)</li>
      <li><b>Direct method (one rule):</b> revenue starts +, each expense starts −; then asset ↑ subtract, liability ↑ add → Cash to suppliers = COGS + ↑inventory − ↑A/P · Cash for taxes = Tax exp − ↑taxes payable</li>
    </ul>`;
  main.appendChild(formulas);

  CHAPTERS.forEach(ch=>{
    const c=el("div","cram-ch");
    c.appendChild(el("h2",null,`${ch.tab} · ${ch.title}`));
    const ul=el("ul");
    ch.mnemonics.forEach(m=>ul.appendChild(el("li",null,m)));
    c.appendChild(ul);
    main.appendChild(c);
  });

  const lists=el("div","cram-lists");
  lists.innerHTML=`<h2>Must-know rules</h2>
  <div class="cram-grid">
    <div><b>Compounding</b><br>i ÷ m, n × m (semi=2, qtr=4, mo=12)</div>
    <div><b>Discount vs premium</b><br>Stated&lt;Mkt = discount · Stated&gt;Mkt = premium</div>
    <div><b>Carrying value drift</b><br>Discount ↑ · Premium ↓ · both → face</div>
    <div><b>Interest expense</b><br>Carrying value × MARKET rate</div>
    <div><b>Cash interest</b><br>Face × STATED rate</div>
    <div><b>Retirement</b><br>CV − cash paid = gain (+) / loss (−)</div>
    <div><b>Shares</b><br>Authorized ≥ Issued ≥ Outstanding</div>
    <div><b>Outstanding</b><br>Issued − Treasury</div>
    <div><b>Treasury</b><br>At COST, contra-equity, no gain/loss</div>
    <div><b>Stock dividend</b><br>Small(&lt;25%)=market · Large(≥25%)=par</div>
    <div><b>Stock split</b><br>No entry · par ↓ · equity unchanged</div>
    <div><b>Cumulative preferred</b><br>Pay arrears + current before common</div>
    <div><b>CFS sections</b><br>Oper=income · Invest=LT assets · Finance=debt/owners</div>
    <div><b>Sign rule (both methods)</b><br>Assets ↑ subtract · Liabilities ↑ add (direct: expenses start −)</div>
    <div><b>Gains/losses</b><br>Subtract gains · add losses back</div>
    <div><b>Dividends</b><br>Received=Operating · Paid=Financing</div>
    <div><b>Interest (both)</b><br>Operating</div>
    <div><b>Asset sale cash</b><br>Book value ± gain/loss → Investing</div>
  </div>`;
  main.appendChild(lists);

  const go2=el("button","btn","Drill the computations →"); go2.onclick=()=>go("drills");
  main.appendChild(go2);
}

/* ---------- boot ---------- */
function boot(){
  $$(".nav-btn").forEach(b=>b.onclick=()=>go(b.dataset.view));
  go("dashboard");
  setInterval(()=>{ const cd=$("#cd"); if(cd) cd.textContent=examCountdown(); }, 60000);
}
if(document.readyState!=="loading") boot(); else document.addEventListener("DOMContentLoaded", boot);
