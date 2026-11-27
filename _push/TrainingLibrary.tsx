// Training Library (2026-11-27, Site Edits). One component, two pages:
//   mode "public"  -> /training          : the free library. ?g=<slug> lands on ONE training (ads + ManyChat links).
//   mode "portal"  -> /portal/library    : the same library inside the Jupiter Portal, with the full guides.
// Catalog (titles, problem sequence, offers) lives in this file so it renders for search engines.
// Full guide bodies load from the public repo jupiter-revenue-systems/training-library (guides/<slug>.json).
// Backend (n8n): /webhook/training-get (free signup -> portal session) and /webhook/training-lib (load, unlock, click).
// Session = the normal portal session (localStorage jrs_portal_session_v1). Self contained: react + framer only.
// Copy rules: contractions, no em or en dashes, digits for numbers.
import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

/**
 * @framerIntrinsicWidth 1200
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */

const API = "https://ekaistone.app.n8n.cloud/webhook"
const SESSION_KEY = "jrs_portal_session_v1"
const RAW = "https://raw.githubusercontent.com/jupiter-revenue-systems/training-library/main/guides/"
function rawBase() {
    try {
        return (window as any).__TL_RAW || RAW
    } catch (e) {
        return RAW
    }
}
const GH = "https://github.com/jupiter-revenue-systems/"
const FONT_URL = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap"

type Item = { n: number; slug: string; kw: string; g: string; t: string; f: string; who: string[]; d: string; o: string; of: string; p: string; s: string; np: string; ns: string; pick?: boolean }
const GROUPS: { k: string; t: string; b: string; c: string }[] = [{"k":"live","t":"Your business, run by agents","b":"The biggest gap. Nobody shows a real business with every step run by agents: ad, DM, page, checkout, emails, CRM, portal. We show the real thing.","c":"#A4ED07"},{"k":"safe","t":"Safe agents on live systems","b":"Owners are scared AI will break what already works. Almost nobody teaches restore points, backups and the rules agents never break.","c":"#FF8A3D"},{"k":"check","t":"Check the work","b":"AI says done when it isn't. Nobody teaches how to prove it's done on the live result.","c":"#F7FF4D"},{"k":"after","t":"After the sale","b":"Coaches and agencies drown in onboarding, check-ins and revisions. Nobody teaches AI-run delivery.","c":"#4FE3C1"},{"k":"dm","t":"DMs that sell","b":"DM automation is common. A DM agent tied to a real pipeline (qualify, book, pay, CRM) is not.","c":"#FF4FA3"},{"k":"money","t":"Did AI make you money?","b":"Nobody teaches how to prove an AI system made money.","c":"#7CFFB2"},{"k":"tools","t":"Interactive tools","b":"Free tools that give a personal result are rare. Everyone else gives text.","c":"#22C4FF"},{"k":"job","t":"For people with jobs","b":"The market says quit or start an agency. We say keep your job and build something small that works.","c":"#FFB86B"},{"k":"team","t":"Run AI like a team","b":"Ray and others cover this as plain articles. We beat it with real downloads and a running business behind it.","c":"#A98BFF"}]
const ITEMS: Item[] = [{"n":1,"slug":"every-agent","kw":"AGENTS","g":"live","t":"Every Agent Behind My $90K Month","f":"Guide","who":["C","A","Cr","J"],"d":"A live tour of the business: every agent, the job it does, what it touches, and the few jobs I still do myself. Real screens, no theory. You'll see exactly what an AI-run business looks like from the inside.","o":"A clear picture of an AI-run business, and the first 3 jobs you'd hand off.","of":"hops","p":"I hear about AI agents but can't picture them in my business.","s":"Shows a real business, job by job.","np":"Which of these fit MY business, and where do I start?","ns":"#21 Your AI Org Chart","pick":true},{"n":2,"slug":"ad-click-to-paid","kw":"PAID","g":"live","t":"From Ad Click to Paid, Start to Finish","f":"Guide","who":["C","A","Cr"],"d":"The full path a buyer takes, from ad to DM to page to checkout to emails to portal, with the agent that runs each step. Built for owners whose tools don't talk to each other.","o":"A map of your own path, with the missing pieces marked.","of":"web","p":"My tools don't talk to each other and leads fall through.","s":"Shows how the pieces connect.","np":"I see the map, but building it myself would take months.","ns":"Low-Ticket Build $4,999+ (or #3 to start)","pick":true},{"n":3,"slug":"one-person-sales-team","kw":"SALES","g":"live","t":"The 1-Person Sales Team","f":"Zip pack","who":["C","Cr"],"d":"Drop the zip into Claude and it interviews you about one offer. You get the page copy, an order bump that makes the result faster, and an upsell that solves what comes next.","o":"A complete sales plan for one offer, ready to build.","of":"launch","p":"I have an offer but no page that sells it.","s":"Writes the page, the bump and the upsell.","np":"I have the copy but no page or checkout to put it on.","ns":"Launchpad $97, or Low-Ticket Build"},{"n":4,"slug":"15-emails","kw":"EMAILS","g":"live","t":"15 Emails That Sell While You Sleep","f":"Skill","who":["C","Cr","A"],"d":"Give it one offer and a few of your past emails. It writes 15 short daily emails in your voice, one idea and one button each, ready to load into any email tool.","o":"A full follow-up sequence, written in an evening.","of":"bcs","p":"My list never hears from me, so it never buys.","s":"Writes the whole sequence in your voice.","np":"Emails go out, but booked calls don't follow.","ns":"Booked Call System $67"},{"n":5,"slug":"claude-runs-your-crm","kw":"CRM","g":"live","t":"Let Claude Run Your CRM","f":"Guide","who":["C","A"],"d":"Connect Claude to your CRM and give it 5 safe first jobs: tag new leads, flag the hot ones, draft follow-ups, clean duplicates, and send you a Monday pipeline report.","o":"Leads stop slipping through, and you see your pipeline every week.","of":"bcs","p":"My CRM is a mess and nobody follows up.","s":"Claude does the follow-up and the reporting.","np":"Now I have more conversations than I can answer.","ns":"#16 The One DM Ready to Buy","pick":true},{"n":6,"slug":"overnight-build","kw":"NIGHT","g":"live","t":"Plan It at 10 PM, Done by 7 AM","f":"Zip pack","who":["C","A","Cr"],"d":"A planner that turns one big task into a master prompt, a run checklist for Claude Code, and a morning report. You review finished work, not a blank page.","o":"Your first overnight build, finished while you sleep.","of":"sc","p":"There aren't enough hours in my day.","s":"Gives you the night shift.","np":"Something broke overnight and I didn't know.","ns":"#7 Before You Let AI Touch Your Business","pick":true},{"n":7,"slug":"before-ai-touches","kw":"SAFE","g":"safe","t":"Before You Let AI Touch Your Business","f":"Guide + skill","who":["C","A","Cr"],"d":"The rules my agents never break: a restore point before every change, no bulk deletes, never an older copy over newer work, every change logged. The skill makes Claude follow them for you.","o":"You let agents work on your live site and CRM without fear.","of":"seven","p":"I'm scared AI will break something that already works.","s":"Puts safety rules on every agent.","np":"I'm still not ready to hand over the big stuff myself.","ns":"Discovery Call $150, then a Seven Star merge","pick":true},{"n":8,"slug":"nightly-backup","kw":"BACKUP","g":"safe","t":"The Backup You'll Never Think About","f":"Zip pack","who":["C","A","Cr"],"d":"Sets up a nightly backup of your site code and automations to GitHub, plus a one-page restore guide. If anything breaks, you're one step from yesterday.","o":"A nightly safety net, set up once.","of":"portal","p":"If something breaks, I lose everything.","s":"Backs up every night.","np":"My site is safe, but anyone can copy it.","ns":"#9 Someone Copied Your Site"},{"n":9,"slug":"site-copied","kw":"COPIED","g":"safe","t":"Someone Copied Your Site. Now What?","f":"Guide","who":["C","A","Cr"],"d":"A copyright notice, hidden watermarks, and an alarm that emails you when your site shows up on someone else's domain. The same setup that protects this site.","o":"You find out the day someone copies you, with proof.","of":"web","p":"People copy my pages and I never find out.","s":"Alerts you with proof.","np":"My site is protected, but it still doesn't sell.","ns":"#23 Page Teardown"},{"n":10,"slug":"done-means-checked","kw":"DONE","g":"check","t":"Done Means Checked","f":"Skill","who":["C","A","Cr","J"],"d":"Claude lists every request, checks each one on the live result at phone and desktop size, and reports how many are done, what's open, and what it didn't check. No more \"it's done\" when it isn't.","o":"You stop finding mistakes after your clients do.","of":"hops","p":"AI says it's done when it isn't.","s":"Checks every item on the live result.","np":"Checks pass, but my AI still forgets my business.","ns":"#29 The Shared Brain","pick":true},{"n":11,"slug":"second-opinion","kw":"REVIEW","g":"check","t":"The Second Opinion Agent","f":"Skill","who":["C","A"],"d":"A fresh agent that never saw the work compares what the client asked for with what you shipped, then lists every miss. The check a tired owner skips.","o":"Misses caught before the client sees them.","of":"sc","p":"I miss things when I'm tired or rushed.","s":"A fresh agent reviews the work.","np":"Revisions still pile up across clients.","ns":"#14 Every Revision, One List"},{"n":12,"slug":"onboard-in-10","kw":"ONBOARD","g":"after","t":"Onboard a New Client in 10 Minutes","f":"Guide + zip","who":["C","A"],"d":"Intake questions, an account access checklist where the client owns the accounts and you get admin, a welcome email, and a tracker. New clients start without 20 emails back and forth.","o":"Clients start fast, and access is never the delay.","of":"portal","p":"Onboarding eats my first week with every client.","s":"One intake, one checklist, one welcome.","np":"Clients keep asking \"where are we at?\"","ns":"#13 The Portal That Answers for You","pick":true},{"n":13,"slug":"client-portal","kw":"PORTAL","g":"after","t":"The Portal That Answers \"Where Are We At?\"","f":"Guide","who":["C","A"],"d":"Give every client a page that shows their progress, next steps and files, updated as the work moves. Fewer check-in emails, calmer clients.","o":"Clients feel looked after without you writing updates.","of":"portal","p":"Clients chase me for updates.","s":"A live progress page per client.","np":"I want this built for my business.","ns":"Portal System"},{"n":14,"slug":"every-revision","kw":"REVISE","g":"after","t":"Every Revision, One List","f":"Skill","who":["C","A"],"d":"Turns client feedback from emails, PDFs, screenshots and videos into one list with a line per request, then checks each one off on the live work.","o":"No revision gets missed again.","of":"sc","p":"Client feedback comes in 6 places and things get missed.","s":"One list, every request.","np":"I'm still the bottleneck on every delivery.","ns":"HOPS Team $37, then a Seven Star merge"},{"n":15,"slug":"comment-to-customer","kw":"COMMENT","g":"dm","t":"Comment to Customer","f":"Guide","who":["C","Cr","A"],"d":"The exact flow I use: a reel, a comment keyword, a DM, a page, the portal, and the follow-up emails. Real screens of every step.","o":"A map of a DM flow that turns comments into buyers.","of":"igsa","p":"I post, I get comments, and nothing sells.","s":"Shows the whole flow from comment to sale.","np":"Now my DMs blow up and I can't answer them all.","ns":"#16 The One DM Ready to Buy","pick":true},{"n":16,"slug":"dm-ready-to-buy","kw":"DMS","g":"dm","t":"The One DM Ready to Buy","f":"Guide","who":["C","Cr","A"],"d":"What a DM sales agent should do: answer, qualify, book, take payment, hand off to your CRM, and know when to bring you in. Read it before you buy or build one.","o":"You know exactly what a DM agent must do for your business.","of":"igsa","p":"I'm losing buyers in my DMs.","s":"Shows what a real DM agent does.","np":"I want one set up for my offers.","ns":"Instagram Sales Agent $1,499+","pick":true},{"n":17,"slug":"dms-not-a-bot","kw":"VOICE","g":"dm","t":"DMs That Don't Sound Like a Bot","f":"Skill","who":["C","Cr"],"d":"Builds your DM script in your voice: the opener, the follow ask, the reply for each keyword, and buttons under 20 characters that name the reward.","o":"A ready DM script for your next reel.","of":"igsa","p":"My automated DMs sound like a robot.","s":"Writes them in your voice.","np":"I have the script but nothing to send them.","ns":"#20 Build Your Own Freebie"},{"n":18,"slug":"pixel-lying","kw":"PIXEL","g":"money","t":"Is Your Pixel Lying to You?","f":"Zip pack","who":["C","A"],"d":"A 10-minute check of your ad tracking: are purchases counted, matched to the right ad, and not counted twice? You get a plain-words report and what to change.","o":"You know if your ad numbers can be trusted.","of":"sc25","p":"My ads say one thing and my sales say another.","s":"Shows where the tracking breaks.","np":"It's broken, and I can't fix it myself.","ns":"Strategy Call + Action Plan $2,500"},{"n":19,"slug":"did-ai-make-money","kw":"MONEY","g":"money","t":"Did AI Make You Money This Month?","f":"Zip pack","who":["C","A","Cr"],"d":"A Monday report Claude builds from your exports: hours saved, leads, sales by source, and what changed. One page you can trust.","o":"One number you trust, every week.","of":"sc","p":"I can't tell if my AI setup is paying off.","s":"Puts it on one page.","np":"The numbers show my offers are the problem.","ns":"#24 The Offer Ladder Map"},{"n":20,"slug":"build-your-freebie","kw":"FREEBIE","g":"tools","t":"Build Your Own Freebie","f":"Zip pack","who":["C","Cr","A"],"d":"Claude builds your free guide, its comment keyword, its DM and the page that gives it away. The same system behind this library, in a starter version.","o":"Your first freebie ready in an afternoon.","of":"launch","p":"I have no freebie, so nobody joins my list.","s":"Builds the freebie and its DM.","np":"My freebie is done, but nobody sees it.","ns":"Strategy Call $750","pick":true},{"n":21,"slug":"ai-org-chart","kw":"ORG","g":"tools","t":"Your AI Org Chart","f":"Tool","who":["C","A","Cr","J"],"d":"Pick your business type and see which agent does which job, and the hours each one frees up. Your chart saves to your portal.","o":"Your own AI team on one page.","of":"hops","p":"I don't know where to start with AI.","s":"Shows your agents, job by job.","np":"Now I need them set up.","ns":"HOPS Team $37","pick":true},{"n":22,"slug":"2028-score","kw":"2028","g":"tools","t":"Your 2028 Score","f":"Tool (live)","who":["C","A","Cr"],"d":"The AI-First test that's already live: your score, your biggest gap, and the next move for your business type.","o":"Your score and your biggest gap.","of":"hops","p":"Am I ahead or behind on AI?","s":"Scores you against the 12 jobs.","np":"My gap is clear. How do I close it?","ns":"The guide matched to their gap"},{"n":23,"slug":"page-teardown","kw":"AUDIT","g":"tools","t":"Page Teardown","f":"Zip pack","who":["C","A","Cr"],"d":"Drop in your sales page link. Claude grades it like a buying psychologist: the promise, the proof, where the price sits, what's missing. You get your top 5 changes.","o":"You know why visitors leave without buying.","of":"web","p":"My page gets visits but no buyers.","s":"Finds the top 5 problems.","np":"I know what's wrong but can't rebuild it.","ns":"Low-Ticket Build $4,999+"},{"n":24,"slug":"offer-ladder","kw":"LADDER","g":"tools","t":"The Offer Ladder Map","f":"Zip pack","who":["C","Cr","A"],"d":"Claude asks about your offers and maps them low, mid and high, then shows the missing step and the price that fits it.","o":"You know what to sell next and for how much.","of":"launch","p":"I don't know what to sell next.","s":"Maps your offers and the gap.","np":"I need that first low-price offer built.","ns":"Launchpad $97, or Low-Ticket Build","pick":true},{"n":25,"slug":"instagram-money","kw":"CALC","g":"tools","t":"What Your Instagram Should Be Making","f":"Tool (live)","who":["Cr","C"],"d":"The Instagram revenue calculator that's already live: your followers and reach in, a monthly number out.","o":"The gap between your following and your income.","of":"igsa","p":"I have followers but little income.","s":"Shows what you're leaving on the table.","np":"The gap is big. How do I close it?","ns":"#15 Comment to Customer"},{"n":26,"slug":"5-hour-offer","kw":"5HOURS","g":"job","t":"The 5-Hour Offer","f":"Zip pack","who":["J","Cr"],"d":"Keep your job. Claude finds a skill you already have, turns it into one small offer, outlines its page, and gives you a 5-hour weekly plan.","o":"A side offer you can run next to your job.","of":"launch","p":"I want my own income but I'm not quitting my job.","s":"Builds one small offer that fits 5 hours.","np":"I have an offer. Who buys it?","ns":"#20 Build Your Own Freebie"},{"n":27,"slug":"ai-team-at-work","kw":"WORK","g":"job","t":"Your First AI Team at Work","f":"Guide","who":["J"],"d":"3 helpers for a 9 to 5: inbox triage, meeting notes into tasks, and a Friday report. Copy-ready prompts and what's safe to share at work.","o":"Hours back every week, and you look sharp at work.","of":"hops","p":"I'm buried at work.","s":"Hands 3 chores to AI.","np":"I'm faster now. Could this make me money on the side?","ns":"#26 The 5-Hour Offer"},{"n":28,"slug":"learn-ai-30-days","kw":"LEARN","g":"job","t":"Learn AI in 30 Days (It Quizzes You)","f":"Zip pack","who":["J"],"d":"Drop it into Claude or ChatGPT. It builds a 30-day plan around your goal, teaches one thing a day, and quizzes you so it sticks.","o":"You go from curious to confident in a month.","of":"hops","p":"I want to learn AI but don't know where to start.","s":"A daily plan that quizzes you.","np":"I know the basics. What do I build?","ns":"#27 Your First AI Team at Work"},{"n":29,"slug":"shared-brain","kw":"BRAIN","g":"team","t":"The Shared Brain","f":"Zip pack","who":["C","A","Cr","J"],"d":"One folder every chat reads first: your business, your rules, your offers, and handoff notes. Claude interviews you and fills it in, so no chat ever starts from zero.","o":"Your AI knows your business in every chat.","of":"hops","p":"AI forgets my business every new chat.","s":"One memory every chat reads.","np":"My chats still work alone.","ns":"#30 Chats That Talk","pick":true},{"n":30,"slug":"chats-that-talk","kw":"TEAM","g":"team","t":"Chats That Talk to Each Other","f":"Guide + skill","who":["C","A","Cr"],"d":"Split your work into named chats that hand off with an @-mention, so one finished job updates the others.","o":"No more repeating yourself between chats.","of":"sc","p":"I keep re-explaining the same thing.","s":"Chats pass work to each other.","np":"I want this across my whole business.","ns":"Strategy Call + Action Plan $2,500"},{"n":31,"slug":"flight-plans","kw":"FLIGHT","g":"team","t":"Flight Plans: Hand Off Any Task","f":"Skill","who":["C","A"],"d":"Turns any process into a step-by-step page with a copy button on every prompt and command. Anyone on your team can follow it.","o":"You hand off a task without a 30-minute explanation.","of":"sc","p":"My team asks me how to do everything.","s":"Every process becomes a guide.","np":"I want my whole business mapped like this.","ns":"Strategy Call $750"},{"n":32,"slug":"top-1-prompts","kw":"PROMPT","g":"team","t":"The Prompt Behind the Work","f":"Guide + skill","who":["C","A","Cr","J"],"d":"Most people type one line and get average work. This shows how I write the long, exact prompts that run my builds, with real examples, and gives you a skill that interviews you and writes a top 1% prompt for any job.","o":"You write prompts that get finished work back, not a first draft.","of":"sc","p":"I ask AI for something and get generic work back.","s":"Shows you how to brief AI like a top 1% user.","np":"My prompts are better, but I start from zero in every chat.","ns":"#29 The Shared Brain","pick":true}]

const WHO: Record<string, string> = { C: "Coach", A: "Agency owner", Cr: "Creator", J: "I have a job" }
const TOOL_URL: Record<string, string> = { "2028-score": "/ai-first-assessment", "instagram-money": "/instagram-revenue-calculator" }

type Offer = { name: string; price: string; href: string; job: string; c: string; cta: string }
const OFFERS: Record<string, Offer> = {
    hops: { name: "The HOPS Team", price: "$37", href: "/hops", job: "6 AI agents, already built, that do the work: content, blog, site, support, ads and memory.", c: "#A4ED07", cta: "Get the HOPS Team" },
    launch: { name: "Jupiter Launchpad", price: "$97", href: "/launchpad", job: "Your plan before you spend on ads: who's buying, what to say, and your first ads.", c: "#22C4FF", cta: "See Launchpad" },
    bcs: { name: "Booked Call System", price: "$67", href: "/booked-call-system", job: "A call application, confirm or cancel, and follow-up after every call.", c: "#7FE8FF", cta: "See the system" },
    sc: { name: "Strategy Call", price: "$750", href: "/strategy-session", job: "60 minutes with me, used your way: clarity on your offers, a strategy for AI to run your business, or training on advanced AI.", c: "#F7FF4D", cta: "Book a Strategy Call" },
    sc25: { name: "Strategy Call + Action Plan", price: "$2,500", href: "/strategy-session/playbook", job: "90 minutes with me, plus a detailed step by step action plan you can follow.", c: "#A98BFF", cta: "Get the call + plan" },
    disc: { name: "Discovery Call", price: "$150", href: "/discovery-call", job: "30 minutes about a build: a website, a portal, a low-ticket product or a full AI-first merge. It's not a strategy call.", c: "#FF8A3D", cta: "Book a Discovery Call" },
    igsa: { name: "Instagram Sales Agent", price: "from $1,499", href: "/ig-sales-agent", job: "An agent that answers comments and DMs in your voice, asks your questions and books ready buyers.", c: "#FF4FA3", cta: "See the Sales Agent" },
    web: { name: "Low-Ticket Product Build", price: "from $4,999", href: "/websites", job: "Your offer, page, checkout and portal, built for you.", c: "#FF8A3D", cta: "See the build" },
    portal: { name: "Jupiter Portal System", price: "by quote", href: "/portal-system", job: "A client portal built for your business.", c: "#4FE3C1", cta: "See the Portal System" },
    seven: { name: "Seven Star Build", price: "from $15,000", href: "/seven-star", job: "Your whole revenue system merged and run by agents, by my own hands.", c: "#E2732E", cta: "See the Seven Star Build" },
}

const EXAMPLES = ["I'm scared AI will break my site", "My DMs are full and nobody answers", "AI forgets my business every chat", "My page gets visits but no buyers", "I want income but I'm keeping my job", "Type the word from my video, like SAFE"]
const GOALS: { label: string; q: string }[] = [
    { label: "Save time", q: "time" },
    { label: "Get more leads", q: "leads" },
    { label: "Sell more", q: "sell" },
    { label: "Keep AI safe", q: "safe" },
    { label: "Learn AI", q: "learn" },
]
const SYN: Record<string, string[]> = {
    time: ["hours", "overnight", "onboard", "busy", "buried", "week", "delivery", "updates"],
    leads: ["dms", "comment", "freebie", "list", "crm", "follow", "instagram", "page"],
    sell: ["buy", "sales", "offer", "checkout", "emails", "price", "money", "income", "paid"],
    safe: ["break", "backup", "scared", "copy", "copied", "restore", "check", "done"],
    learn: ["learn", "start", "prompt", "work", "job", "basics", "score", "chat"],
}

function groupOf(k: string) {
    return GROUPS.find((x) => x.k === k) || GROUPS[0]
}
function kindOf(it: Item): "book" | "claude" | "mac" | "phone" | "imac" {
    if (it.n === 1 || it.n === 2) return "imac"
    if (it.g === "dm" || it.f.indexOf("Tool") === 0) return "phone"
    if (it.f === "Skill") return "claude"
    if (it.f === "Zip pack") return "mac"
    return "book"
}
function fmtNote(f: string) {
    if (f === "Skill") return "A skill you add to Claude once. It works on its own after that."
    if (f === "Zip pack") return "A zip you drop into Claude or ChatGPT. It walks you through the job."
    if (f.indexOf("Tool") === 0) return "An interactive tool. You get your own result."
    if (f === "Guide + skill") return "A step by step guide, plus a skill for Claude."
    if (f === "Guide + zip") return "A step by step guide, plus a zip of templates."
    return "A step by step guide with copy buttons."
}
function readSession(): { token: string; exp: number } | null {
    try {
        const s = JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null")
        if (!s || typeof s.token !== "string" || !(Number(s.exp) > Date.now())) return null
        return s
    } catch (e) {
        return null
    }
}
function post(url: string, body: any) {
    return fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, credentials: "omit", body: JSON.stringify(body) }).then((r) => r.json())
}
function cookie(n: string) {
    try {
        const m = document.cookie.match(new RegExp("(?:^|; )" + n + "=([^;]*)"))
        return m ? decodeURIComponent(m[1]) : ""
    } catch (e) {
        return ""
    }
}
function score(it: Item, q: string) {
    const words = q.toLowerCase().replace(/[^a-z0-9$ ]/g, " ").split(/\s+/).filter((w) => w.length > 1)
    if (!words.length) return 1
    const hay = (it.t + " " + it.d + " " + it.p + " " + it.o + " " + it.s + " " + it.f + " " + groupOf(it.g).t + " " + it.kw).toLowerCase()
    let sc = 0
    for (const w of words) {
        if (it.kw.toLowerCase() === w) sc += 20
        if (it.t.toLowerCase().indexOf(w) >= 0) sc += 4
        if (hay.indexOf(w) >= 0) sc += 2
        const syn = SYN[w]
        if (syn) for (const x of syn) if (hay.indexOf(x) >= 0) sc += 1
        else if (w.length > 4 && hay.indexOf(w.slice(0, w.length - 2)) >= 0) sc += 1
    }
    return sc
}

// ---------- icons (one per group) ----------
function Icon({ k, size = 18 }: { k: string; size?: number }) {
    const P: Record<string, React.ReactNode> = {
        live: (<><circle cx="12" cy="12" r="4.2" /><ellipse cx="12" cy="12" rx="10" ry="3.6" transform="rotate(-20 12 12)" /></>),
        safe: (<><path d="M12 3l7 3v5.5c0 4.3-2.9 7.6-7 9.5-4.1-1.9-7-5.2-7-9.5V6l7-3z" /><path d="M9 12l2.2 2.2L15 10.5" /></>),
        check: (<><circle cx="12" cy="12" r="9" /><path d="M8 12.2l2.8 2.8L16.2 9.5" /></>),
        after: (<><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M3.5 9.5h17M8 14h5" /></>),
        dm: (<><path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v7a2.5 2.5 0 01-2.5 2.5H11l-4.5 4v-4h0A2.5 2.5 0 014 13.5v-7z" /><path d="M8.5 10h7" /></>),
        money: (<><path d="M4 19V5M4 19h16" /><path d="M7.5 15l3.5-4 3 2.5L19 8" /></>),
        tools: (<><path d="M5 7h8M17 7h2M5 12h2M11 12h8M5 17h10M19 17h0" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="17" cy="17" r="2" /></>),
        job: (<><rect x="3.5" y="7.5" width="17" height="12" rx="2.5" /><path d="M9 7.5V6a2 2 0 012-2h2a2 2 0 012 2v1.5M3.5 13h17" /></>),
        team: (<><circle cx="12" cy="5.5" r="2.5" /><circle cx="5.5" cy="17.5" r="2.5" /><circle cx="18.5" cy="17.5" r="2.5" /><path d="M10.8 7.7L6.7 15.3M13.2 7.7l4.1 7.6M8 17.5h8" /></>),
    }
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {P[k] || P.live}
        </svg>
    )
}

// ---------- mockup art (drawn in CSS, one look per format) ----------
function Art({ it, big }: { it: Item; big?: boolean }) {
    const g = groupOf(it.g)
    const kind = kindOf(it)
    const short = it.t.length > 34 ? it.t.slice(0, 32).replace(/\s+\S*$/, "") + "…" : it.t
    return (
        <div className={"tl-art tl-art-" + kind + (big ? " big" : "")} style={{ ["--c" as any]: g.c }} aria-hidden="true">
            <span className="tl-art-glow" />
            <span className="tl-art-badge">
                <Icon k={it.g} size={14} />
                {it.f}
            </span>
            {kind === "book" && (
                <div className="mk-book">
                    <i className="mk-spine" />
                    <b>Free guide</b>
                    <em>{it.t}</em>
                    <span>Ekai Stone</span>
                </div>
            )}
            {kind === "claude" && (
                <div className="mk-win">
                    <div className="mk-bar"><i /><i /><i /><u>Claude</u></div>
                    <div className="mk-chat">
                        <p className="me">/{it.slug}</p>
                        <p className="ai"><s /><s /><s className="sh" /></p>
                        <p className="ok">Skill ready</p>
                    </div>
                </div>
            )}
            {kind === "mac" && (
                <div className="mk-mac">
                    <div className="mk-screen">
                        <div className="mk-zip"><i />{it.slug}.zip</div>
                        <div className="mk-file">START_HERE.md</div>
                        <div className="mk-lines"><s /><s /><s className="sh" /></div>
                    </div>
                    <div className="mk-base" />
                </div>
            )}
            {kind === "phone" && (
                <div className="mk-phone">
                    <i className="mk-notch" />
                    <p className="in">{it.kw}</p>
                    <p className="out">{short}</p>
                    <p className="btn">Open it</p>
                </div>
            )}
            {kind === "imac" && (
                <div className="mk-imac">
                    <div className="mk-screen">
                        <div className="mk-flow"><i /><b /><i /><b /><i /><b /><i /></div>
                        <div className="mk-lines"><s /><s className="sh" /></div>
                    </div>
                    <div className="mk-stand" />
                </div>
            )}
        </div>
    )
}

function Card({ it, onOpen, owned }: { it: Item; onOpen: (s: string) => void; owned?: boolean }) {
    const g = groupOf(it.g)
    return (
        <a className="tl-card" href={"?g=" + it.slug} onClick={(e) => { e.preventDefault(); onOpen(it.slug) }} style={{ ["--c" as any]: g.c }}>
            <Art it={it} />
            <div className="tl-card-b">
                <span className="tl-card-g"><Icon k={it.g} size={14} />{g.t}</span>
                <h3>{it.t}</h3>
                <p>{it.o}</p>
                <span className="tl-card-go">{owned ? "In your library. Open it" : "Get it free"} <i>→</i></span>
            </div>
        </a>
    )
}

function Seq({ it, onOpen }: { it: Item; onOpen: (s: string) => void }) {
    const m = it.ns.match(/^#(\d+)/)
    const nx = m ? ITEMS.find((x) => x.n === Number(m[1])) : null
    return (
        <div className="tl-seq">
            <div><b>Your problem</b><p>{it.p}</p></div>
            <div><b>This solves</b><p>{it.s}</p></div>
            <div><b>What comes next</b><p>{it.np}</p></div>
            <div className="nx"><b>Your next step</b>{nx ? <p><a href={"?g=" + nx.slug} onClick={(e) => { e.preventDefault(); onOpen(nx.slug) }}>{nx.t} (free)</a></p> : <p>{it.ns}</p>}</div>
        </div>
    )
}

function OfferCard({ k, line, tag, onClick }: { k: string; line?: string; tag?: string; onClick?: (k: string) => void }) {
    const o = OFFERS[k]
    if (!o) return null
    return (
        <a className="tl-offer" href={o.href} style={{ ["--c" as any]: o.c }} onClick={() => onClick && onClick(k)}>
            {tag && <span className="tl-offer-tag">{tag}</span>}
            <div className="tl-offer-top"><h4>{o.name}</h4><b>{o.price}</b></div>
            <p>{line || o.job}</p>
            <span className="tl-offer-cta">{o.cta} →</span>
        </a>
    )
}

function Paths({ onClick }: { onClick?: (k: string) => void }) {
    return (
        <div className="tl-paths">
            <div className="tl-path" style={{ ["--c" as any]: "#A4ED07" }}>
                <span className="tl-path-k">Do it yourself</span>
                <h3>Start small, tonight.</h3>
                <p>Ready-made products under $100. Each one does one job.</p>
                <OfferCard k="hops" onClick={onClick} /><OfferCard k="launch" onClick={onClick} /><OfferCard k="bcs" onClick={onClick} />
            </div>
            <div className="tl-path" style={{ ["--c" as any]: "#F7FF4D" }}>
                <span className="tl-path-k">Do it with me</span>
                <h3>A call, used your way.</h3>
                <p>Clarity on your offers, a strategy for AI to run your business, or training on the advanced side. You choose.</p>
                <OfferCard k="sc" onClick={onClick} /><OfferCard k="sc25" onClick={onClick} />
            </div>
            <div className="tl-path" style={{ ["--c" as any]: "#FF8A3D" }}>
                <span className="tl-path-k">Done for you</span>
                <h3>I build it. You run it.</h3>
                <p>Builds start with a Discovery Call. It's about your build, not strategy.</p>
                <OfferCard k="disc" onClick={onClick} /><OfferCard k="igsa" onClick={onClick} /><OfferCard k="web" onClick={onClick} /><OfferCard k="seven" onClick={onClick} />
            </div>
        </div>
    )
}

// ---------- the search pill ----------
function Pill({ q, setQ, onKeyword }: { q: string; setQ: (s: string) => void; onKeyword: (slug: string) => void }) {
    const [ph, setPh] = useState(EXAMPLES[0])
    const isStatic = useIsStaticRenderer()
    useEffect(() => {
        if (isStatic) return
        let i = 0, c = 0, dir = 1, t: any
        const tick = () => {
            const full = EXAMPLES[i]
            c += dir
            setPh(full.slice(0, c) || " ")
            if (dir > 0 && c >= full.length) { dir = -1; t = setTimeout(tick, 1700); return }
            if (dir < 0 && c <= 0) { dir = 1; i = (i + 1) % EXAMPLES.length }
            t = setTimeout(tick, dir > 0 ? 46 : 18)
        }
        try {
            if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        } catch (e) {}
        c = EXAMPLES[0].length
        dir = -1
        t = setTimeout(tick, 2200)
        return () => clearTimeout(t)
    }, [])
    const submit = (e: any) => {
        e.preventDefault()
        const w = q.trim().toLowerCase()
        const hit = ITEMS.find((x) => x.kw.toLowerCase() === w)
        if (hit) onKeyword(hit.slug)
        else {
            const el = document.getElementById("tl-grid")
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }
    return (
        <form className="tl-pill" onSubmit={submit} role="search">
            <span className="tl-orb" aria-hidden="true" />
            <input id="tl-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder={ph} aria-label="What are you stuck on? Type your problem, or the word from my video." autoComplete="off" />
            <button type="submit" aria-label="Find my training">↑</button>
        </form>
    )
}

// ---------- signup form (public) ----------
function GetForm({ it, onDone }: { it: Item; onDone: (r: any) => void }) {
    const [f, setF] = useState({ first: "", last: "", email: "", phone: "" })
    const [busy, setBusy] = useState(false)
    const [err, setErr] = useState("")
    useEffect(() => {
        try {
            const q = new URLSearchParams(window.location.search)
            setF((x) => ({ ...x, first: q.get("n") || x.first, email: q.get("e") || x.email }))
        } catch (e) {}
    }, [])
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())
    const ok = f.first.trim().length > 0 && f.last.trim().length > 0 && okEmail
    const go = (e: any) => {
        e.preventDefault()
        if (!ok || busy) return
        setBusy(true)
        setErr("")
        let utm = {}, xid = "", ig = ""
        try {
            utm = JSON.parse(window.sessionStorage.getItem("ss_utm") || "{}")
            xid = window.localStorage.getItem("ss_xid") || ""
            ig = new URLSearchParams(window.location.search).get("ig") || ""
        } catch (e2) {}
        const event_id = "tl_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
        let tz = ""
        try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "" } catch (e3) {}
        post(API + "/training-get", { first_name: f.first.trim(), last_name: f.last.trim(), email: f.email.trim().toLowerCase(), phone: f.phone.trim(), slug: it.slug, time_zone: tz, event_id, ig, xid, utm, page_url: window.location.href, fbp: cookie("_fbp"), fbc: cookie("_fbc") })
            .then((r) => {
                if (!r || !r.ok) { setBusy(false); setErr("That didn't go through. Check your email and try again."); return }
                try {
                    const w = window as any
                    if (w.fbq) w.fbq("track", "Lead", { content_name: "training:" + it.slug }, { eventID: event_id })
                } catch (e4) {}
                onDone(r)
            })
            .catch(() => { setBusy(false); setErr("The connection dropped. Try again.") })
    }
    const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value })
    return (
        <form className="tl-form" onSubmit={go} id="tl-form">
            <h3>Where should I send it?</h3>
            <p className="tl-form-s">It opens in your own free portal, with the whole library. You only do this once.</p>
            <div className="tl-form-2">
                <label>First name<input id="tl-first" value={f.first} onChange={set("first")} autoComplete="given-name" required /></label>
                <label>Last name<input id="tl-last" value={f.last} onChange={set("last")} autoComplete="family-name" required /></label>
            </div>
            <label>Email<input id="tl-email" type="email" inputMode="email" value={f.email} onChange={set("email")} autoComplete="email" required /></label>
            <label><span>Phone <i>(optional)</i></span><input id="tl-phone" type="tel" inputMode="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" /></label>
            {err && <p className="tl-err" role="alert">{err}</p>}
            <button type="submit" className="tl-btn" disabled={!ok || busy}>{busy ? "Opening your portal…" : "Send it to my portal"} <i>→</i></button>
            <p className="tl-fine">Free. No card. Unsubscribe any time.</p>
        </form>
    )
}

// ---------- public: one training (the page an ad or DM lands on) ----------
function Landing({ it, onOpen, session, portalUrl }: { it: Item; onOpen: (s: string) => void; session: boolean; portalUrl: string }) {
    const g = groupOf(it.g)
    const [state, setState] = useState<"form" | "opening" | "code">("form")
    const openPortal = () => { window.location.href = portalUrl + "?g=" + it.slug }
    const done = (r: any) => {
        if (r.token) {
            try { window.localStorage.setItem(SESSION_KEY, JSON.stringify({ token: r.token, exp: Number(r.expires_ms) })) } catch (e) {}
            setState("opening")
            setTimeout(openPortal, 1400)
        } else setState("code")
    }
    const oneTap = () => {
        const s = readSession()
        if (!s) return
        setState("opening")
        post(API + "/training-lib", { token: s.token, action: "unlock", slug: it.slug }).then(openPortal).catch(openPortal)
    }
    return (
        <section className="tl-land" style={{ ["--c" as any]: g.c }}>
            <div className="tl-wrap">
                <a className="tl-back" href="?" onClick={(e) => { e.preventDefault(); onOpen("") }}>← All free trainings</a>
                <div className="tl-land-g">
                    <div className="tl-land-l">
                        <span className="tl-kick"><Icon k={it.g} size={14} />Free {it.f.toLowerCase()} · {g.t}</span>
                        <h1>{it.t}</h1>
                        <p className="tl-lede">{it.d}</p>
                        <div className="tl-out"><b>What you'll have</b><p>{it.o}</p></div>
                        <p className="tl-fmt">{fmtNote(it.f)}</p>
                        <Art it={it} big />
                    </div>
                    <div className="tl-land-r">
                        {state === "form" && !session && <GetForm it={it} onDone={done} />}
                        {state === "form" && session && (
                            <div className="tl-form">
                                <h3>You're already in.</h3>
                                <p className="tl-form-s">Your portal is open on this device. One tap adds this to your library.</p>
                                <button className="tl-btn" onClick={oneTap}>Open it in my portal <i>→</i></button>
                            </div>
                        )}
                        {state === "opening" && (
                            <div className="tl-form tl-opening" role="status">
                                <span className="tl-planet" />
                                <h3>Opening your portal</h3>
                                <p className="tl-form-s">Adding {it.t} to your library.</p>
                            </div>
                        )}
                        {state === "code" && (
                            <div className="tl-form">
                                <h3>It's in your library.</h3>
                                <p className="tl-form-s">You already have a Jupiter Portal with this email. Sign in and it's waiting for you.</p>
                                <a className="tl-btn" href={portalUrl + "?g=" + it.slug}>Sign in to my portal <i>→</i></a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="tl-how-t"><h2>How this training is <em>built</em></h2><p>Every training fixes one problem. Then it tells you what tends to break next, and what I'd do about it.</p></div>
                <Seq it={it} onOpen={onOpen} />
            </div>
        </section>
    )
}

// ---------- portal: the full guide ----------
function OrgChart() {
    const [d, setD] = useState<any>(null)
    const [ty, setTy] = useState("coach")
    const [hrs, setHrs] = useState<Record<string, string>>({})
    useEffect(() => {
        fetch(rawBase() + "orgchart.json").then((r) => r.json()).then(setD).catch(() => setD({ types: [] }))
        try { setHrs(JSON.parse(window.localStorage.getItem("jrs_tl_org") || "{}")) } catch (e) {}
    }, [])
    const setH = (k: string, v: string) => {
        const n = { ...hrs, [k]: v.replace(/[^0-9.]/g, "").slice(0, 4) }
        setHrs(n)
        try { window.localStorage.setItem("jrs_tl_org", JSON.stringify(n)) } catch (e) {}
    }
    if (!d) return <p className="tl-mute">Loading your chart…</p>
    const t = (d.types || []).find((x: any) => x.key === ty) || (d.types || [])[0]
    if (!t) return null
    const total = t.jobs.reduce((a: number, j: any, i: number) => a + (parseFloat(hrs[t.key + i] || "0") || 0), 0)
    return (
        <div className="tl-org">
            <div className="tl-chips">{d.types.map((x: any) => <button key={x.key} type="button" className={"tl-chip" + (x.key === t.key ? " on" : "")} onClick={() => setTy(x.key)}>{x.label}</button>)}</div>
            <p className="tl-mute">Type the hours a week each job takes you now. The total is what you could hand off.</p>
            {t.jobs.map((j: any, i: number) => (
                <div className="tl-org-r" key={t.key + i}>
                    <div><b>{j.job}</b><span>{j.agent}</span><p>{j.does}</p><p className="you">Stays with you: {j.you}</p></div>
                    <label>Hours a week<input id={"tl-org-" + t.key + i} inputMode="decimal" value={hrs[t.key + i] || ""} onChange={(e) => setH(t.key + i, e.target.value)} placeholder="0" /></label>
                </div>
            ))}
            <div className="tl-org-t"><span>Hours a week you could hand off</span><b>{Math.round(total * 10) / 10}</b></div>
        </div>
    )
}

function CopyBtn({ text }: { text: string }) {
    const [did, setDid] = useState(false)
    const go = () => {
        const fin = () => { setDid(true); setTimeout(() => setDid(false), 1600) }
        try { navigator.clipboard.writeText(text).then(fin).catch(fin) } catch (e) { fin() }
    }
    return <button type="button" className={"tl-copy" + (did ? " did" : "")} onClick={go}>{did ? "Copied ✓" : "Copy"}</button>
}

function Reader({ it, onOpen, track }: { it: Item; onOpen: (s: string) => void; track: (k: string) => void }) {
    const g = groupOf(it.g)
    const [gd, setGd] = useState<any>(null)
    const [bad, setBad] = useState(false)
    const [done, setDone] = useState<Record<string, boolean>>({})
    const PK = "jrs_tl_p_" + it.slug
    useEffect(() => {
        setGd(null)
        setBad(false)
        fetch(rawBase() + it.slug + ".json").then((r) => { if (!r.ok) throw 0; return r.json() }).then(setGd).catch(() => setBad(true))
        try { setDone(JSON.parse(window.localStorage.getItem(PK) || "{}")) } catch (e) { setDone({}) }
    }, [it.slug])
    const tog = (k: string) => {
        const n = { ...done, [k]: !done[k] }
        setDone(n)
        try { window.localStorage.setItem(PK, JSON.stringify(n)) } catch (e) {}
    }
    const steps: string[] = []
    if (gd) (gd.sections || []).forEach((s: any, i: number) => (s.steps || []).forEach((_: any, j: number) => steps.push(i + "." + j)))
    const nDone = steps.filter((k) => done[k]).length
    const tool = TOOL_URL[it.slug] || (gd && gd.tool_url)
    const hasRepo = !TOOL_URL[it.slug]
    const pathRow = (label: string, p: any) => {
        if (!p || !p.offer) return null
        const nx = String(p.offer).indexOf("next:") === 0 ? ITEMS.find((x) => x.slug === String(p.offer).slice(5)) : null
        return (
            <div className="tl-pr">
                <span className="tl-path-k">{label}</span>
                {nx ? (
                    <a className="tl-offer" href={"?g=" + nx.slug} style={{ ["--c" as any]: groupOf(nx.g).c }} onClick={(e) => { e.preventDefault(); onOpen(nx.slug) }}>
                        <div className="tl-offer-top"><h4>{nx.t}</h4><b>Free</b></div><p>{p.line}</p><span className="tl-offer-cta">Add it to my library →</span>
                    </a>
                ) : <OfferCard k={p.offer} line={p.line} onClick={track} />}
            </div>
        )
    }
    return (
        <article className="tl-read" style={{ ["--c" as any]: g.c }}>
            <a className="tl-back" href="?" onClick={(e) => { e.preventDefault(); onOpen("") }}>← Your library</a>
            <header className="tl-read-h">
                <div>
                    <span className="tl-kick"><Icon k={it.g} size={14} />{it.f} · {g.t}</span>
                    <h1>{it.t}</h1>
                    <p className="tl-lede">{gd ? gd.promise : it.o}</p>
                    {gd && <div className="tl-meta">{gd.time && <span>{gd.time}</span>}{(gd.need || []).map((x: string, i: number) => <span key={i}>{x}</span>)}</div>}
                    <div className="tl-dl">
                        {tool && <a className="tl-btn" href={tool}>Open the tool <i>→</i></a>}
                        {hasRepo && <a className="tl-btn" href={GH + "free-" + it.slug + "/archive/refs/heads/main.zip"}>Download the files <i>↓</i></a>}
                        {hasRepo && <a className="tl-btn ghost" href={GH + "free-" + it.slug} target="_blank" rel="noopener">View on GitHub</a>}
                    </div>
                </div>
                <Art it={it} big />
            </header>
            {!gd && !bad && <p className="tl-mute">Loading your training…</p>}
            {bad && <p className="tl-mute">The guide didn't load. {hasRepo ? <a href={GH + "free-" + it.slug} target="_blank" rel="noopener">Open it on GitHub</a> : "Refresh the page to try again."}</p>}
            {gd && (
                <>
                    <Seq it={it} onOpen={onOpen} />
                    {steps.length > 0 && <div className="tl-prog"><span>{nDone} of {steps.length} steps done</span><div><i style={{ width: (steps.length ? (nDone / steps.length) * 100 : 0) + "%" }} /></div></div>}
                    <div className="tl-body">
                        {(gd.intro || []).map((x: string, i: number) => <p key={"i" + i} className="tl-intro">{x}</p>)}
                        {gd.forTech && <p className="tl-tech"><b>For the technical</b>{gd.forTech}</p>}
                        {it.slug === "ai-org-chart" && <OrgChart />}
                        {(gd.sections || []).map((s: any, i: number) => (
                            <section key={i} className="tl-sec">
                                <h2>{s.h}</h2>
                                {(s.body || []).map((x: string, j: number) => <p key={j}>{x}</p>)}
                                {(s.steps || []).map((st: any, j: number) => {
                                    const k = i + "." + j
                                    return (
                                        <div key={j} className={"tl-step" + (done[k] ? " done" : "")}>
                                            <button type="button" className="tl-tick" onClick={() => tog(k)} aria-pressed={!!done[k]} aria-label={"Mark step done: " + st.title}>{done[k] ? "✓" : steps.indexOf(k) + 1}</button>
                                            <div className="tl-step-b">
                                                <h3>{st.title}</h3>
                                                <p>{st.text}</p>
                                                {st.copy && <div className="tl-code"><pre>{st.copy}</pre><CopyBtn text={st.copy} /></div>}
                                                {st.why && <p className="tl-why">Why it works: {st.why}</p>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </section>
                        ))}
                        {gd.eureka && <blockquote className="tl-eureka">{gd.eureka}</blockquote>}
                        {gd.check && gd.check.length > 0 && <div className="tl-box"><h3>You're done when</h3><ul>{gd.check.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul></div>}
                        {gd.limits && gd.limits.length > 0 && <div className="tl-box lim"><h3>What this free version doesn't do</h3><ul>{gd.limits.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul></div>}
                    </div>
                    <div className="tl-next">
                        <h2>What comes <em>next</em></h2>
                        <p className="tl-lede">{it.np}</p>
                        <div className="tl-prs">
                            {pathRow("Do it yourself", gd.paths && gd.paths.diy)}
                            {pathRow("Do it with me", gd.paths && gd.paths.dwy)}
                            {pathRow("Done for you", gd.paths && gd.paths.dfy)}
                        </div>
                    </div>
                </>
            )}
        </article>
    )
}

// ---------- the library (grid + filters), shared ----------
function Library({ q, setQ, onOpen, owned, title }: { q: string; setQ: (s: string) => void; onOpen: (s: string) => void; owned: string[]; title?: React.ReactNode }) {
    const [who, setWho] = useState("")
    const [fmt, setFmt] = useState("")
    const list = useMemo(() => {
        let l = ITEMS.filter((x) => (!who || x.who.indexOf(who) >= 0) && (!fmt || x.f.toLowerCase().indexOf(fmt) >= 0))
        if (q.trim()) l = l.map((x) => ({ x, s: score(x, q) })).filter((r) => r.s > 0).sort((a, b) => b.s - a.s).map((r) => r.x)
        return l
    }, [q, who, fmt])
    const grouped = !q.trim()
    return (
        <section className="tl-lib" id="tl-grid">
            <div className="tl-wrap">
                {title}
                <div className="tl-filters">
                    <div className="tl-chips"><span>I'm a</span>{Object.keys(WHO).map((k) => <button key={k} type="button" className={"tl-chip" + (who === k ? " on" : "")} onClick={() => setWho(who === k ? "" : k)}>{WHO[k]}</button>)}</div>
                    <div className="tl-chips"><span>Show</span>{[["guide", "Guides"], ["skill", "Skills"], ["zip", "Zip packs"], ["tool", "Tools"]].map(([k, l]) => <button key={k} type="button" className={"tl-chip" + (fmt === k ? " on" : "")} onClick={() => setFmt(fmt === k ? "" : k)}>{l}</button>)}</div>
                    <span className="tl-count">{list.length} of {ITEMS.length}{q.trim() ? " for “" + q.trim() + "”" : ""}{q.trim() ? <button type="button" className="tl-clear" onClick={() => setQ("")}>Clear</button> : null}</span>
                </div>
                {list.length === 0 && <p className="tl-mute">Nothing matches that yet. Try fewer words, or pick a group below.</p>}
                {grouped
                    ? GROUPS.map((g) => {
                          const li = list.filter((x) => x.g === g.k)
                          if (!li.length) return null
                          return (
                              <div className="tl-group" key={g.k} style={{ ["--c" as any]: g.c }}>
                                  <div className="tl-group-h"><span className="tl-group-i"><Icon k={g.k} size={20} /></span><div><h2>{g.t}</h2><p>{g.b}</p></div></div>
                                  <div className="tl-cards">{li.map((x) => <Card key={x.slug} it={x} onOpen={onOpen} owned={owned.indexOf(x.slug) >= 0} />)}</div>
                              </div>
                          )
                      })
                    : <div className="tl-cards">{list.map((x) => <Card key={x.slug} it={x} onOpen={onOpen} owned={owned.indexOf(x.slug) >= 0} />)}</div>}
            </div>
        </section>
    )
}

export default function TrainingLibrary(p: { mode: "public" | "portal"; portalUrl: string; publicUrl: string; style?: React.CSSProperties }) {
    const mode = p.mode || "public"
    const portalUrl = p.portalUrl || "/portal/library"
    const publicUrl = p.publicUrl || "/training"
    const isStatic = useIsStaticRenderer()
    const [sel, setSel] = useState("")
    const [q, setQ] = useState("")
    const [session, setSession] = useState(false)
    const [pstate, setPstate] = useState<"loading" | "ready" | "out">(mode === "portal" ? "loading" : "ready")
    const [me, setMe] = useState<any>({ unlocked: [] })
    const top = useRef<HTMLDivElement>(null)

    const readSel = () => {
        try {
            const s = new URLSearchParams(window.location.search).get("g") || ""
            return ITEMS.some((x) => x.slug === s) ? s : ""
        } catch (e) {
            return ""
        }
    }
    useEffect(() => {
        if (isStatic) return
        try {
            if (!document.getElementById("lt-fonts")) {
                const l = document.createElement("link")
                l.id = "lt-fonts"
                l.rel = "stylesheet"
                l.href = FONT_URL
                document.head.appendChild(l)
            }
            if (mode === "portal" && !document.querySelector('meta[name="robots"][data-tl]')) {
                const m = document.createElement("meta")
                m.name = "robots"
                m.content = "noindex, nofollow"
                m.setAttribute("data-tl", "1")
                document.head.appendChild(m)
            }
        } catch (e) {}
        const s0 = readSel()
        setSel(s0)
        const onPop = () => setSel(readSel())
        window.addEventListener("popstate", onPop)
        const s = readSession()
        setSession(!!s)
        if (mode === "portal") {
            if (!s) setPstate("out")
            else
                post(API + "/training-lib", { token: s.token, action: s0 ? "unlock" : "load", slug: s0 })
                    .then((d) => {
                        if (d && d.ok) { setMe({ ...d, unlocked: d.unlocked || [] }); setPstate("ready") }
                        else setPstate("out")
                    })
                    .catch(() => setPstate("out"))
        }
        return () => window.removeEventListener("popstate", onPop)
    }, [])

    const open = (slug: string) => {
        setSel(slug)
        try {
            const u = new URL(window.location.href)
            if (slug) u.searchParams.set("g", slug)
            else u.searchParams.delete("g")
            window.history.pushState({}, "", u.toString())
            if (top.current) top.current.scrollIntoView({ behavior: "auto", block: "start" })
            else window.scrollTo(0, 0)
        } catch (e) {}
        if (mode === "portal" && slug && me.unlocked.indexOf(slug) < 0) {
            const s = readSession()
            if (s) post(API + "/training-lib", { token: s.token, action: "unlock", slug }).then((d) => { if (d && d.ok) setMe((m: any) => ({ ...m, unlocked: d.unlocked || m.unlocked.concat(slug) })) }).catch(() => {})
        }
    }
    const track = (offer: string) => {
        try {
            const s = readSession()
            if (s) fetch(API + "/training-lib", { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify({ token: s.token, action: "click", offer, slug: sel }), keepalive: true }).catch(() => {})
            const w = window as any
            if (w.fbq) w.fbq("trackCustom", "TrainingNextStepClick", { offer, training: sel })
        } catch (e) {}
    }
    const it = ITEMS.find((x) => x.slug === sel) || null
    const ld = { "@context": "https://schema.org", "@type": "CollectionPage", "@id": "https://ekaistone.com/training#library", url: "https://ekaistone.com/training", name: "Free AI Training Library", description: "Free guides, Claude skills, zip packs and tools for running a business with AI agents.", author: { "@id": "https://ekaistone.com/#person" }, mainEntity: { "@type": "ItemList", numberOfItems: ITEMS.length, itemListElement: ITEMS.map((x, i) => ({ "@type": "ListItem", position: i + 1, url: "https://ekaistone.com/training?g=" + x.slug, name: x.t })) } }

    return (
        <div className={"tl tl-" + mode} style={p.style} ref={top}>
            <style>{CSS}</style>
            {mode === "public" && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}

            {mode === "public" && !it && (
                <header className="tl-hero">
                    <div className="tl-wrap">
                        <span className="tl-kick"><i className="dot" />Free training library · {ITEMS.length} trainings</span>
                        <h1>Become a <em>top 1%</em> AI user.</h1>
                        <p className="tl-lede">Free guides, skills and zip packs from a business that runs on AI agents. Each one fixes one problem, then shows you what comes next.</p>
                        <Pill q={q} setQ={setQ} onKeyword={open} />
                        <div className="tl-chips tl-goals"><span>I want to</span>{GOALS.map((x) => <button key={x.q} type="button" className={"tl-chip" + (q === x.q ? " on" : "")} onClick={() => { setQ(q === x.q ? "" : x.q); const el = document.getElementById("tl-grid"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }) }}>{x.label}</button>)}</div>
                        <div className="tl-hero-row">{[7, 16, 29, 21, 12].map((n) => ITEMS.find((x) => x.n === n) as Item).filter(Boolean).map((x) => <a key={x.slug} href={"?g=" + x.slug} onClick={(e) => { e.preventDefault(); open(x.slug) }} className="tl-hero-a" style={{ ["--c" as any]: groupOf(x.g).c }}><Art it={x} /></a>)}</div>
                    </div>
                </header>
            )}
            {mode === "public" && it && <Landing it={it} onOpen={open} session={session} portalUrl={portalUrl} />}
            {mode === "public" && !it && (
                <section className="tl-band">
                    <div className="tl-wrap tl-steps3">
                        <div><b>1</b><h3>Pick what you're stuck on</h3><p>Search in your own words, or type the word from one of my videos.</p></div>
                        <div><b>2</b><h3>Tell me where to send it</h3><p>Your name and email, once. It opens your own free portal.</p></div>
                        <div><b>3</b><h3>Fix it, then see what's next</h3><p>Every training shows the problem it solves, what breaks next, and your next step.</p></div>
                    </div>
                </section>
            )}

            {mode === "portal" && pstate === "loading" && <div className="tl-wrap tl-gate"><span className="tl-planet" /><p className="tl-mute">Opening your library…</p></div>}
            {mode === "portal" && pstate === "out" && (
                <div className="tl-wrap tl-gate">
                    <h1>Your library is <em>one step</em> away.</h1>
                    <p className="tl-lede">Sign in to your Jupiter Portal to open it. New here? Get any training free and your portal opens with it.</p>
                    <div className="tl-dl"><a className="tl-btn" href="/portal">Sign in to my portal <i>→</i></a><a className="tl-btn ghost" href={publicUrl + (sel ? "?g=" + sel : "")}>Get it free</a></div>
                </div>
            )}
            {mode === "portal" && pstate === "ready" && (
                <div className="tl-wrap">
                    <nav className="tl-pnav"><a href="/portal">← Portal home</a><span>Your free library</span></nav>
                    {it ? <Reader it={it} onOpen={open} track={track} /> : (
                        <header className="tl-phead">
                            <h1>{me.first_name ? me.first_name + ", your" : "Your"} library is <em>open</em>.</h1>
                            <p className="tl-lede">Every training here is yours. No signing up again. Pick one, or tell me what you're stuck on.</p>
                            <Pill q={q} setQ={setQ} onKeyword={open} />
                            {me.unlocked.length > 0 && (
                                <div className="tl-mine"><h2>Your trainings</h2><div className="tl-cards">{me.unlocked.map((s: string) => ITEMS.find((x) => x.slug === s)).filter(Boolean).reverse().map((x: any) => <Card key={x.slug} it={x} onOpen={open} owned />)}</div></div>
                            )}
                        </header>
                    )}
                </div>
            )}

            {(mode === "public" || pstate === "ready") && (
                <Library q={q} setQ={setQ} onOpen={open} owned={me.unlocked} title={it ? <div className="tl-lib-h"><h2>More free <em>trainings</em></h2></div> : mode === "portal" ? <div className="tl-lib-h"><h2>The whole <em>library</em></h2></div> : null} />
            )}

            {(mode === "public" || pstate === "ready") && (
                <section className="tl-ways">
                    <div className="tl-wrap">
                        <span className="tl-kick"><i className="dot" />When you want more than free</span>
                        <h2>Three ways to <em>work with me</em></h2>
                        <p className="tl-lede">Some people like to do it themselves. Some want it done with them. Some want it done for them. Pick what fits you.</p>
                        <Paths onClick={track} />
                    </div>
                </section>
            )}
            {mode === "public" && !it && (
                <section className="tl-faq">
                    <div className="tl-wrap">
                        <h2>A few good <em>questions</em></h2>
                        <details><summary>Is it really free?</summary><p>Yes. Every training in this library is free. You give your name and email once, and the whole library opens in your portal.</p></details>
                        <details><summary>Do I need to be technical?</summary><p>No. If you can copy and paste, you can follow these. Each step is in plain words, with a note for technical readers when it helps.</p></details>
                        <details><summary>Which AI tools do these work with?</summary><p>Most are built for Claude (Chat, Cowork and Claude Code). The zip packs and prompts also work in ChatGPT unless a training says otherwise.</p></details>
                        <details><summary>What's a skill, and what's a zip pack?</summary><p>A skill is a small set of instructions you add to Claude once, and it uses them on its own. A zip pack is a folder you drop into Claude or ChatGPT, and it walks you through one job, step by step.</p></details>
                        <details><summary>Why do you give this away?</summary><p>Because it's the fastest way to show you how I work. If a free training helps, you'll know what the paid work is like.</p></details>
                    </div>
                </section>
            )}
        </div>
    )
}

addPropertyControls(TrainingLibrary, {
    mode: { type: ControlType.Enum, title: "Mode", options: ["public", "portal"], optionTitles: ["Public /training", "Portal library"], defaultValue: "public" },
    portalUrl: { type: ControlType.String, title: "Portal library URL", defaultValue: "/portal/library" },
    publicUrl: { type: ControlType.String, title: "Public URL", defaultValue: "/training" },
})

const CSS = `
.tl{--bg:#05080E;--bg2:#0A0F18;--card:#0F141D;--card2:#161C27;--line:rgba(243,238,230,.10);--ink:#F3EEE6;--mute:#AEB6C2;--dim:#7C8494;--orange:#E2732E;--lime:#A4ED07;--cream:#F3EEE6;--c:#A4ED07;
 --serif:"Instrument Serif",Georgia,serif;--sans:Geist,Inter,system-ui,sans-serif;--mono:"Geist Mono",ui-monospace,Menlo,monospace;
 width:100%;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:clip}
.tl *{box-sizing:border-box}
.tl a{color:inherit;text-decoration:none}
.tl h1,.tl h2,.tl h3,.tl h4,.tl p,.tl ul,.tl blockquote,.tl pre{margin:0}
.tl-wrap{max-width:1200px;margin:0 auto;padding:0 28px}
.tl h1,.tl h2{font-family:var(--serif);font-weight:400;letter-spacing:-.01em;line-height:1.03;text-wrap:balance}
.tl h1{font-size:clamp(42px,6.4vw,84px)}
.tl h2{font-size:clamp(30px,4.2vw,50px)}
.tl h1 em,.tl h2 em{font-style:italic;color:var(--orange)}
.tl-lede{font-size:clamp(17px,1.5vw,20px);color:var(--mute);max-width:640px;font-weight:300;margin-top:16px}
.tl-mute{color:var(--mute)}
.tl-kick{display:inline-flex;align-items:center;gap:8px;font:500 11px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--c);border:1px solid color-mix(in srgb,var(--c) 35%,transparent);border-radius:99px;padding:9px 14px;background:color-mix(in srgb,var(--c) 8%,transparent);margin-bottom:22px}
.tl-kick .dot{width:6px;height:6px;border-radius:50%;background:var(--c);box-shadow:0 0 12px var(--c)}
.tl-btn{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:10px;background:var(--lime);color:#05080E;font:600 16px/1.2 var(--sans);padding:16px 24px;border-radius:99px;transition:transform .2s,box-shadow .3s;text-align:center}
.tl-btn:hover{transform:translateY(-2px);box-shadow:0 10px 36px -8px rgba(164,237,7,.5)}
.tl-btn:focus-visible,.tl-chip:focus-visible,.tl-card:focus-visible,.tl-offer:focus-visible{outline:2px solid var(--lime);outline-offset:3px}
.tl-btn[disabled]{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none}
.tl-btn.ghost{background:transparent;color:var(--ink);border:1px solid rgba(243,238,230,.25);font-weight:500}
.tl-btn i{font-style:normal}
.tl-chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.tl-chips>span{font:500 11px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin-right:2px}
.tl-chip{all:unset;box-sizing:border-box;cursor:pointer;font-size:14px;padding:8px 14px;border-radius:99px;border:1px solid var(--line);color:var(--mute);background:rgba(255,255,255,.02);transition:.2s}
.tl-chip:hover{color:var(--ink);border-color:rgba(243,238,230,.3)}
.tl-chip.on{background:var(--ink);color:#05080E;border-color:var(--ink)}

/* hero */
.tl-hero{padding:72px 0 40px;position:relative;background:radial-gradient(900px 480px at 85% -10%,rgba(226,115,46,.20),transparent 70%),radial-gradient(700px 420px at 0% 30%,rgba(34,196,255,.10),transparent 70%)}
.tl-hero .tl-kick{--c:#A4ED07}
.tl-pill{display:flex;align-items:center;gap:12px;margin-top:30px;max-width:680px;background:linear-gradient(180deg,#1A202B,#0E131B);border:1px solid rgba(243,238,230,.16);border-radius:99px;padding:9px 9px 9px 14px;box-shadow:0 24px 60px -24px rgba(0,0,0,.9),inset 0 1px 0 rgba(255,255,255,.06)}
.tl-pill:focus-within{border-color:rgba(164,237,7,.55);box-shadow:0 0 0 4px rgba(164,237,7,.10),0 24px 60px -24px rgba(0,0,0,.9)}
.tl-orb{flex:none;width:38px;height:38px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#9be7ff 30%,#22C4FF 55%,#0b3a66 85%);box-shadow:0 0 22px rgba(34,196,255,.75);animation:tlorb 3s ease-in-out infinite}
@keyframes tlorb{50%{box-shadow:0 0 34px rgba(34,196,255,.95);transform:scale(1.05)}}
.tl-pill input{all:unset;flex:1;min-width:0;font:400 17px var(--sans);color:var(--ink);padding:8px 0}
.tl-pill input::placeholder{color:var(--dim)}
.tl-pill button{all:unset;cursor:pointer;flex:none;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--lime);color:#05080E;font-size:20px;font-weight:600}
.tl-goals{margin-top:18px}
.tl-hero-row{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:44px}
.tl-hero-a{display:block;border-radius:18px;overflow:hidden;transition:transform .3s}
.tl-hero-a:hover{transform:translateY(-6px) rotate(-1deg)}
.tl-hero-a .tl-art{aspect-ratio:4/5;border-radius:18px}
.tl-hero-a .tl-art-badge{display:none}
.tl-hero-a .mk-book{width:64%}.tl-hero-a .mk-book em{font-size:clamp(13px,1.7vw,22px)}
.tl-hero-a .mk-phone{width:52%}.tl-hero-a .mk-win,.tl-hero-a .mk-mac,.tl-hero-a .mk-imac{width:84%}

/* art */
.tl-art{position:relative;aspect-ratio:16/11;overflow:hidden;background:linear-gradient(150deg,var(--c),color-mix(in srgb,var(--c) 55%,#05080E));display:grid;place-items:center;border-radius:16px 16px 0 0}
.tl-art.big{aspect-ratio:16/10;border-radius:22px;margin-top:24px}
.tl-art-glow{position:absolute;width:70%;aspect-ratio:1;border-radius:50%;right:-18%;top:-30%;background:rgba(255,255,255,.28);filter:blur(30px)}
.tl-art-badge{position:absolute;left:12px;top:12px;display:inline-flex;gap:6px;align-items:center;font:600 10.5px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:#05080E;background:rgba(255,255,255,.82);padding:6px 10px;border-radius:99px;z-index:2}
.tl-art s{display:block;height:6px;border-radius:9px;background:rgba(243,238,230,.22);margin-top:7px;text-decoration:none}
.tl-art s.sh{width:55%}
.mk-book{position:relative;width:44%;aspect-ratio:3/4;background:linear-gradient(160deg,#141a25,#05080E);border-radius:4px 10px 10px 4px;padding:12% 9% 9% 14%;display:flex;flex-direction:column;box-shadow:18px 22px 40px -12px rgba(0,0,0,.65),inset 0 0 0 1px rgba(255,255,255,.07);transform:rotate(-7deg) translateY(4%)}
.mk-spine{position:absolute;left:0;top:0;bottom:0;width:7%;background:linear-gradient(90deg,rgba(255,255,255,.14),transparent)}
.mk-book b{font:500 clamp(6px,.72vw,9px) var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--c)}
.mk-book em{font-family:var(--serif);font-style:normal;color:#F3EEE6;font-size:clamp(11px,1.5vw,19px);line-height:1.08;margin-top:8%}
.mk-book span{margin-top:auto;font:500 clamp(6px,.7vw,9px) var(--mono);color:#AEB6C2;letter-spacing:.08em}
.tl-art.big .mk-book{width:34%}.tl-art.big .mk-book em{font-size:clamp(14px,2vw,26px)}
.mk-win{width:72%;background:#0E131B;border-radius:12px;box-shadow:0 22px 44px -14px rgba(0,0,0,.7);overflow:hidden;transform:translateY(6%)}
.mk-bar{display:flex;gap:5px;align-items:center;padding:8px 10px;background:#1A202B}
.mk-bar i{width:7px;height:7px;border-radius:50%;background:#3a4252}
.mk-bar u{margin-left:auto;text-decoration:none;font:500 9px var(--mono);color:#D97757;letter-spacing:.08em}
.mk-chat{padding:10px 12px 14px}
.mk-chat p{font:500 clamp(9px,1vw,12px) var(--mono);border-radius:9px;padding:6px 9px;margin-top:6px;max-width:92%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mk-chat .me{background:var(--c);color:#05080E;margin-left:auto;width:max-content}
.mk-chat .ai{background:#1A202B;width:80%;padding:4px 9px 10px}
.mk-chat .ok{color:var(--c);padding-left:2px}
.mk-mac,.mk-imac{width:74%;transform:translateY(5%)}
.mk-screen{background:#0E131B;border:5px solid #232a37;border-radius:12px 12px 0 0;padding:12px 14px 16px;box-shadow:0 22px 44px -14px rgba(0,0,0,.7)}
.mk-imac .mk-screen{border-radius:12px;border-bottom-width:16px}
.mk-base{height:9px;background:linear-gradient(#3a4252,#232a37);border-radius:0 0 12px 12px;margin:0 -7%}
.mk-stand{width:22%;height:16px;margin:0 auto;background:linear-gradient(#3a4252,#232a37);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)}
.mk-zip{display:flex;align-items:center;gap:8px;font:500 clamp(9px,1vw,12px) var(--mono);color:#F3EEE6;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.mk-zip i{flex:none;width:18px;height:14px;border-radius:3px;background:var(--c)}
.mk-file{font:500 clamp(8px,.9vw,11px) var(--mono);color:var(--c);margin-top:9px}
.mk-flow{display:flex;align-items:center;gap:0}
.mk-flow i{flex:none;width:13%;aspect-ratio:1;border-radius:50%;background:var(--c)}
.mk-flow b{flex:1;height:2px;background:rgba(243,238,230,.3)}
.mk-phone{position:relative;width:34%;aspect-ratio:9/17;background:#0E131B;border:5px solid #232a37;border-radius:22px;padding:22% 8% 8%;display:flex;flex-direction:column;gap:7%;box-shadow:0 22px 44px -14px rgba(0,0,0,.7);transform:rotate(5deg) translateY(8%)}
.mk-notch{position:absolute;top:4%;left:50%;width:34%;height:3.5%;border-radius:9px;background:#232a37;transform:translateX(-50%)}
.mk-phone p{font:500 clamp(7px,.82vw,10.5px) var(--sans);border-radius:9px;padding:7% 9%;line-height:1.25}
.mk-phone .in{background:#232a37;color:#F3EEE6;align-self:flex-end;font-family:var(--mono)}
.mk-phone .out{background:#1A202B;color:#AEB6C2}
.mk-phone .btn{background:var(--c);color:#05080E;text-align:center;font-weight:600;margin-top:auto}
.tl-art.big .mk-phone{width:24%}

/* band */
.tl-band{background:var(--cream);color:#141821;padding:44px 0}
.tl-steps3{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.tl-steps3 b{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#141821;color:var(--lime);font:500 14px var(--mono)}
.tl-steps3 h3{font-family:var(--serif);font-weight:400;font-size:26px;line-height:1.1;margin:12px 0 6px}
.tl-steps3 p{color:#4a5160;font-size:15px}

/* library */
.tl-lib{padding:64px 0 30px}
.tl-lib-h{margin-bottom:22px}
.tl-filters{display:flex;flex-wrap:wrap;gap:12px 22px;align-items:center;padding:14px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-bottom:8px}
.tl-count{margin-left:auto;font:500 12px var(--mono);color:var(--dim);display:inline-flex;gap:10px;align-items:center}
.tl-clear{all:unset;cursor:pointer;color:var(--lime);text-decoration:underline}
.tl-group{margin-top:44px}
.tl-group-h{display:flex;gap:14px;align-items:flex-start;margin-bottom:20px}
.tl-group-i{flex:none;display:grid;place-items:center;width:44px;height:44px;border-radius:13px;background:var(--c);color:#05080E}
.tl-group-h h2{font-size:clamp(26px,3vw,36px)}
.tl-group-h p{color:var(--mute);max-width:720px;margin-top:4px;font-size:15px}
.tl-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.tl-lib .tl-cards:first-of-type{margin-top:24px}
.tl-group .tl-cards{margin-top:0}
.tl-card{display:flex;flex-direction:column;background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden;transition:transform .25s,border-color .25s}
.tl-card:hover{transform:translateY(-4px);border-color:color-mix(in srgb,var(--c) 60%,transparent)}
.tl-card-b{padding:18px 20px 20px;display:flex;flex-direction:column;gap:8px;flex:1}
.tl-card-g{display:inline-flex;gap:6px;align-items:center;font:500 10.5px var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--c)}
.tl-card h3{font-family:var(--serif);font-weight:400;font-size:26px;line-height:1.1}
.tl-card p{color:var(--mute);font-size:15px}
.tl-card-go{margin-top:auto;padding-top:10px;font-weight:500;font-size:14px;color:var(--ink)}
.tl-card-go i{font-style:normal;color:var(--c)}

/* landing */
.tl-land{padding:40px 0 20px;background:radial-gradient(800px 460px at 90% 0%,color-mix(in srgb,var(--c) 22%,transparent),transparent 70%)}
.tl-back{display:inline-block;font:500 13px var(--mono);color:var(--mute);margin-bottom:26px}
.tl-back:hover{color:var(--ink)}
.tl-land-g{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:48px;align-items:start}
.tl-land h1{font-size:clamp(38px,5.2vw,68px)}
.tl-out{margin-top:22px;border-left:3px solid var(--c);padding:4px 0 4px 16px}
.tl-out b,.tl-seq b,.tl-path-k{display:block;font:500 11px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--c);margin-bottom:4px}
.tl-fmt{color:var(--dim);font-size:14px;margin-top:14px}
.tl-land-r{position:sticky;top:96px}
.tl-form{background:var(--cream);color:#141821;border-radius:22px;padding:26px;display:grid;gap:14px;box-shadow:0 40px 90px -40px rgba(0,0,0,.9)}
.tl-form h3{font-family:var(--serif);font-weight:400;font-size:30px;line-height:1.05}
.tl-form-s{color:#4a5160;font-size:15px}
.tl-form label{display:grid;gap:6px;font:500 12px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:#4a5160}
.tl-form label i{text-transform:none;letter-spacing:0;font-style:normal;color:#8a8f9a}
.tl-form input{all:unset;box-sizing:border-box;width:100%;background:#fff;border:1.5px solid #d9d2c5;border-radius:12px;padding:13px 14px;font:400 16px var(--sans);color:#141821;text-transform:none;letter-spacing:0}
.tl-form input:focus{border-color:#141821}
.tl-form-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.tl-form .tl-btn{background:#141821;color:var(--lime);width:100%}
.tl-form .tl-btn:hover{box-shadow:0 10px 30px -10px rgba(20,24,33,.6)}
.tl-form .tl-btn[disabled]{opacity:1;background:#cfc8bb;color:#6f695d}
.tl-fine{font-size:13px;color:#6b7280;text-align:center}
.tl-err{color:#b3261e;font-size:14px}
.tl-opening{text-align:center;justify-items:center;padding:44px 26px}
.tl-planet{display:block;width:64px;height:64px;border-radius:50%;background:repeating-linear-gradient(172deg,transparent 0 7px,rgba(122,74,42,.4) 7px 11px),radial-gradient(circle at 35% 30%,#f6dcb8,#c98b55 45%,#7a4a2a 80%);box-shadow:inset -8px -6px 14px rgba(0,0,0,.45);animation:tlspin 2.4s linear infinite;background-size:200% 100%,auto}
@keyframes tlspin{to{background-position:200% 0,0 0}}
.tl-how-t{margin:64px 0 20px}
.tl-how-t p{color:var(--mute);margin-top:10px;max-width:620px}
.tl-seq{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:22px 0}
.tl-seq>div{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;position:relative}
.tl-seq>div:not(:last-child)::after{content:"→";position:absolute;right:-11px;top:50%;transform:translateY(-50%);color:var(--c);font-size:16px;z-index:1}
.tl-seq .nx{border:1px dashed color-mix(in srgb,var(--c) 60%,transparent);background:color-mix(in srgb,var(--c) 7%,var(--card))}
.tl-seq .nx a{text-decoration:underline;text-decoration-color:var(--c);text-underline-offset:3px}
.tl-seq p{font-size:15px;color:var(--ink)}

/* ways */
.tl-ways{padding:72px 0;background:var(--bg2);border-top:1px solid var(--line);margin-top:40px}
.tl-ways .tl-kick{--c:#F7FF4D}
.tl-paths{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:34px;align-items:start}
.tl-path{background:var(--card);border:1px solid var(--line);border-top:4px solid var(--c);border-radius:20px;padding:22px;display:grid;gap:12px}
.tl-path h3{font-family:var(--serif);font-weight:400;font-size:30px;line-height:1.05}
.tl-path>p{color:var(--mute);font-size:15px}
.tl-offer{display:grid;gap:6px;background:var(--card2);border:1px solid var(--line);border-left:3px solid var(--c);border-radius:14px;padding:14px 16px;transition:.2s}
.tl-offer:hover{border-color:var(--c);transform:translateX(2px)}
.tl-offer-top{display:flex;justify-content:space-between;gap:12px;align-items:baseline}
.tl-offer h4{font:500 16px var(--sans)}
.tl-offer b{font:500 14px var(--mono);color:var(--c);white-space:nowrap}
.tl-offer p{color:var(--mute);font-size:14px}
.tl-offer-cta{font-size:13.5px;font-weight:500;color:var(--c)}
.tl-offer-tag{font:500 10.5px var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--c)}

/* faq */
.tl-faq{padding:64px 0 90px}
.tl-faq h2{margin-bottom:20px}
.tl-faq details{border-top:1px solid var(--line);max-width:820px}
.tl-faq summary{cursor:pointer;list-style:none;padding:20px 0;font-family:var(--serif);font-size:25px;display:flex;justify-content:space-between;gap:16px}
.tl-faq summary::-webkit-details-marker{display:none}
.tl-faq summary::after{content:"+";color:var(--orange);font-family:var(--sans)}
.tl-faq details[open] summary::after{content:"–"}
.tl-faq details p{color:var(--mute);padding-bottom:20px;max-width:680px}

/* portal */
.tl-portal{min-height:100vh}
.tl-pnav{display:flex;justify-content:space-between;align-items:center;padding:22px 0;border-bottom:1px solid var(--line);font:500 13px var(--mono);color:var(--mute)}
.tl-pnav span{letter-spacing:.12em;text-transform:uppercase;color:var(--lime)}
.tl-phead{padding:48px 0 0}
.tl-mine{margin-top:44px}
.tl-mine h2{font-size:30px;margin-bottom:16px}
.tl-gate{padding:110px 28px;display:grid;justify-items:start;gap:8px}
.tl-dl{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.tl-read{padding:26px 0 0}
.tl-read-h{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:40px;align-items:center}
.tl-read-h .tl-art.big{margin-top:0;aspect-ratio:4/3}
.tl-read-h .mk-book{width:38%;transform:rotate(-7deg)}
.tl-read h1{font-size:clamp(36px,5vw,62px)}
.tl-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.tl-meta span{font:500 12px var(--mono);color:var(--mute);border:1px solid var(--line);border-radius:99px;padding:6px 12px}
.tl-prog{position:sticky;top:0;z-index:5;background:rgba(5,8,14,.92);backdrop-filter:blur(10px);padding:12px 0;display:flex;gap:14px;align-items:center;font:500 12px var(--mono);color:var(--mute)}
.tl-prog div{flex:1;height:6px;border-radius:9px;background:var(--card2);overflow:hidden}
.tl-prog i{display:block;height:100%;background:linear-gradient(90deg,var(--orange),var(--c));transition:width .4s}
.tl-body{max-width:780px;display:grid;gap:18px;margin-top:10px}
.tl-intro{font-size:18px;color:var(--ink)}
.tl-body p{color:var(--mute)}
.tl-tech{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px;font-size:14.5px}
.tl-tech b{display:block;font:500 11px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:#22C4FF;margin-bottom:4px}
.tl-sec{display:grid;gap:14px;margin-top:26px}
.tl-sec h2{font-size:clamp(28px,3.4vw,38px)}
.tl-step{display:flex;gap:14px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px}
.tl-step.done{border-color:color-mix(in srgb,var(--c) 45%,transparent)}
.tl-tick{all:unset;cursor:pointer;flex:none;width:32px;height:32px;border-radius:50%;border:1.5px solid var(--dim);display:grid;place-items:center;font:500 13px var(--mono);color:var(--mute)}
.tl-step.done .tl-tick{background:var(--c);border-color:var(--c);color:#05080E}
.tl-step-b{flex:1;min-width:0;display:grid;gap:8px}
.tl-step h3{font:500 17px var(--sans);color:var(--ink)}
.tl-code{position:relative;background:#02040A;border:1px solid var(--line);border-radius:12px;padding:14px 14px 48px}
.tl-code pre{font:400 13px/1.55 var(--mono);color:#DFE6F0;white-space:pre-wrap;word-break:break-word;max-height:340px;overflow:auto}
.tl-copy{all:unset;cursor:pointer;position:absolute;right:10px;bottom:10px;font:600 12.5px var(--sans);background:var(--lime);color:#05080E;padding:8px 14px;border-radius:99px}
.tl-copy.did{background:var(--ink)}
.tl-why{font-size:14px;color:var(--dim)!important}
.tl-eureka{font-family:var(--serif);font-size:clamp(26px,3.4vw,38px);line-height:1.12;color:var(--ink);border-left:4px solid var(--c);padding:6px 0 6px 20px;margin:20px 0}
.tl-box{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px 20px}
.tl-box h3{font:500 12px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--c);margin-bottom:8px}
.tl-box.lim h3{color:var(--orange)}
.tl-box ul{padding-left:18px;color:var(--mute);display:grid;gap:6px}
.tl-next{margin-top:56px;padding-top:40px;border-top:1px solid var(--line)}
.tl-prs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:24px}
.tl-pr .tl-path-k{color:var(--mute)}
.tl-org{display:grid;gap:12px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px}
.tl-org-r{display:flex;gap:14px;justify-content:space-between;align-items:center;border-top:1px solid var(--line);padding-top:12px}
.tl-org-r b{display:block;color:var(--ink)}
.tl-org-r span{font:500 11px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--c)}
.tl-org-r p{font-size:14px}
.tl-org-r .you{color:var(--dim)}
.tl-org-r label{flex:none;display:grid;gap:4px;font:500 10.5px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--dim);text-align:right}
.tl-org-r input{all:unset;box-sizing:border-box;width:76px;background:#02040A;border:1px solid var(--line);border-radius:10px;padding:10px;font:500 16px var(--mono);color:var(--ink);text-align:right}
.tl-org-t{display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid var(--line);padding-top:14px}
.tl-org-t b{font-family:var(--serif);font-weight:400;font-size:44px;color:var(--c)}

@media (max-width:1199px){
 .tl-cards{grid-template-columns:repeat(2,minmax(0,1fr))}
 .tl-hero-row{grid-template-columns:repeat(4,1fr)}.tl-hero-row a:nth-child(5){display:none}
 .tl-paths,.tl-prs{grid-template-columns:1fr}
 .tl-seq{grid-template-columns:repeat(2,minmax(0,1fr))}
 .tl-seq>div:nth-child(2)::after{display:none}
 .tl-land-g{gap:32px}
}
@media (max-width:809px){
 .tl-wrap{padding:0 18px}
 .tl-hero{padding:44px 0 28px}
 .tl-hero-row{grid-template-columns:repeat(3,1fr);gap:10px;margin-top:32px}.tl-hero-row a:nth-child(4){display:none}
 .tl-pill input{font-size:16px}
 .tl-hero-a .mk-book{width:70%;padding:14% 9% 9% 15%}.tl-hero-a .mk-book em{font-size:12px}.tl-hero-a .mk-book b,.tl-hero-a .mk-book span{font-size:6px}
 .tl-hero-a .mk-phone{width:58%;border-width:4px;border-radius:16px}.tl-hero-a .mk-phone p{font-size:7.5px}
 .tl-hero-a .mk-screen{padding:8px 9px 12px}.tl-hero-a .mk-zip{font-size:8px}.tl-hero-a .mk-file{font-size:7px}
 .tl-steps3{grid-template-columns:1fr;gap:22px}
 .tl-cards{grid-template-columns:1fr}
 .tl-land-g,.tl-read-h{grid-template-columns:1fr;gap:26px}
 .tl-land-r{position:static}
 .tl-land-l .tl-art.big{display:none}
 .tl-seq{grid-template-columns:1fr}
 .tl-seq>div:not(:last-child)::after{content:"↓";right:auto;left:22px;top:auto;bottom:-17px;transform:none}
 .tl-seq>div:nth-child(2)::after{display:block}
 .tl-seq{gap:16px}
 .tl-count{margin-left:0;width:100%}
 .tl-form-2{grid-template-columns:1fr}
 .tl-ways{padding:52px 0}
 .tl-faq summary{font-size:22px}
 .tl-org-r{flex-direction:column;align-items:stretch}
 .tl-org-r label{text-align:left}
 .tl-gate{padding:70px 18px}
 .tl-btn{width:100%}
 .tl-dl .tl-btn{width:100%}
}
@media (prefers-reduced-motion:reduce){.tl *{animation:none!important;transition:none!important}}
`
