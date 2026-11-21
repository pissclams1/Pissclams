"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";

type Card = {
  id: string; title: string; creator_name: string; tools: string | null; commercial_ok: boolean;
  image_url: string; category: string | null; portfolio_url: string | null;
};
type Action = "next" | "love" | "save" | "share" | "details";
type Ids = { visitor: string; session: string };

const THRESH = 80;          // px of upward drag that counts as "next"
const TAP_WAIT = 250;       // ms: a single tap waits this long so a double-tap can cancel it
const LS = { vid: "adagio_vid", hint: "adagio_hint_seen", saved: "adagio_saved" };
const RECRUIT = process.env.NEXT_PUBLIC_RECRUIT_URL || "";

const ls = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} },
  del: (k: string) => { try { localStorage.removeItem(k); } catch {} },
};
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Fire-and-forget POST with retries, so a flaky connection does not lose a swipe.
async function send(url: string, body: unknown) {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), keepalive: true });
      if (r.status < 500 && r.status !== 429) return r;
    } catch {}
    await sleep(1000 * 2 ** i);
  }
}
const post = (url: string, body: unknown) =>
  fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

async function getFeed(visitor: string, session: string | null, first?: string): Promise<Response> {
  const q = new URLSearchParams({ visitor_id: visitor, n: "10" });
  if (session) q.set("session_id", session);
  if (first) q.set("first", first);
  return fetch(`/api/feed?${q}`);
}

// New visitor: visitor -> (session || feed). Returning visitor: session || feed. Two round trips at most.
async function init(first?: string, retry = true): Promise<{ ids: Ids; cards: Card[] }> {
  let visitor = ls.get(LS.vid) || document.cookie.match(/(?:^|; )adagio_vid=([^;]+)/)?.[1] || null;
  if (!visitor) {
    const utm = new URLSearchParams(location.search).get("utm_source");
    const r = await post("/api/visitor", { utm_source: utm });
    if (!r.ok) throw new Error("visitor");
    visitor = (await r.json()).visitor_id as string;
  }
  ls.set(LS.vid, visitor);
  document.cookie = `adagio_vid=${visitor}; max-age=31536000; path=/; SameSite=Lax`;
  const [s, f] = await Promise.all([post("/api/session", { visitor_id: visitor }), getFeed(visitor, null, first)]);
  if ((s.status === 404 || f.status === 404) && retry) { ls.del(LS.vid); return init(first, false); } // stale id
  if (!s.ok || !f.ok) throw new Error("init");
  return { ids: { visitor, session: (await s.json()).session_id }, cards: (await f.json()).cards };
}

export default function Deck({ first }: { first?: string }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [exhausted, setExhausted] = useState(false);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const [swipes, setSwipes] = useState(0);
  const [details, setDetails] = useState(false);
  const [loved, setLoved] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const [offline, setOffline] = useState(false);
  const [info, setInfo] = useState(false);

  const ids = useRef<Ids | null>(null);
  const fetching = useRef(false);
  const shownAt = useRef(0);
  const impressed = useRef<string | null>(null);
  const locked = useRef(false);
  const topEl = useRef<HTMLDivElement | null>(null);
  const stampEl = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; y: number; dx: number; dy: number } | null>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lovedRef = useRef<Set<string>>(new Set());

  const top = cards[idx];
  const under = cards[idx + 1];

  const flash = useCallback((t: string) => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1600);
  }, []);

  const append = useCallback((next: Card[]) => {
    if (!next.length) { setExhausted(true); return; }
    setCards((c) => { const have = new Set(c.map((x) => x.id)); return [...c, ...next.filter((x) => !have.has(x.id))]; });
  }, []);

  const loadMore = useCallback(async () => {
    if (fetching.current || !ids.current) return;
    fetching.current = true;
    try {
      const r = await getFeed(ids.current.visitor, ids.current.session);
      if (!r.ok) throw new Error("feed");
      append((await r.json()).cards);
      setError(false);
    } catch { setError(true); }
    finally { fetching.current = false; }
  }, [append]);

  const start = useCallback(async () => {
    setError(false);
    try {
      const r = await init(first);
      ids.current = r.ids; append(r.cards); setReady(true);
    } catch { setReady(true); setError(true); }
  }, [first, append]);

  useEffect(() => {
    try { setSaved(new Set(JSON.parse(ls.get(LS.saved) || "[]"))); } catch {}
    if (!ls.get(LS.hint)) setHint(true);
    setOffline(!navigator.onLine);
    const on = () => setOffline(false), off = () => setOffline(true);
    addEventListener("online", on); addEventListener("offline", off);
    start();
    return () => { removeEventListener("online", on); removeEventListener("offline", off); };
  }, [start]);

  // A card became the top card (and the intro hint is not covering it): log the impression and start the dwell clock.
  useEffect(() => {
    if (!top || !ids.current || hint || impressed.current === top.id) return;
    impressed.current = top.id;
    shownAt.current = Date.now();
    setDetails(false);
    send("/api/impression", { visitor_id: ids.current.visitor, session_id: ids.current.session, creation_id: top.id });
  }, [top, hint]);

  // Fetch the next 10 when 3 remain; preload the next 3 images.
  useEffect(() => {
    if (cards.length - idx <= 3 && !exhausted && ready && !error) loadMore();
    cards.slice(idx + 1, idx + 4).forEach((c) => { const i = new Image(); i.src = c.image_url; });
  }, [idx, cards, exhausted, ready, error, loadMore]);

  const log = useCallback((action: Action, card: Card) => {
    if (!ids.current) return;
    send("/api/event", {
      visitor_id: ids.current.visitor, session_id: ids.current.session, creation_id: card.id,
      action, dwell_ms: Math.max(0, Date.now() - shownAt.current),
    });
  }, []);

  const advance = useCallback(() => {
    const el = topEl.current;
    if (!top || locked.current || !el) return;
    locked.current = true;
    if (tapTimer.current) { clearTimeout(tapTimer.current); tapTimer.current = null; }
    const card = top;
    log("next", card);
    el.style.transition = reduced() ? "opacity 250ms ease-out" : "transform 250ms ease-out, opacity 250ms ease-out";
    if (!reduced()) el.style.transform = `translateY(${-innerHeight * 1.1}px)`;
    el.style.opacity = "0";
    setTimeout(() => { setSwipes((n) => n + 1); setIdx((i) => i + 1); locked.current = false; }, 250);
  }, [top, log]);

  const love = useCallback(() => {
    if (!top || locked.current || lovedRef.current.has(top.id)) return; // one love per creation
    lovedRef.current.add(top.id);
    setLoved(new Set(lovedRef.current));
    log("love", top);
    const st = stampEl.current;
    if (st) { st.style.transition = "opacity 120ms"; st.style.opacity = "1"; setTimeout(() => { st.style.transition = "opacity 500ms"; st.style.opacity = "0"; }, 650); }
  }, [top, log]);

  const toggleDetails = useCallback(() => {
    if (!top) return;
    setDetails((d) => { if (!d) log("details", top); return !d; });
  }, [top, log]);

  const save = () => {
    if (!top) return;
    const next = new Set(saved);
    if (next.has(top.id)) { next.delete(top.id); flash("Removed from saved"); }
    else { next.add(top.id); flash("Saved"); log("save", top); }
    setSaved(next); ls.set(LS.saved, JSON.stringify([...next]));
  };

  const share = async (card?: Card) => {
    const url = card ? `${location.origin}/c/${card.id}` : location.origin;
    const text = card ? `Found this on Adagio: "${card.title}" by ${card.creator_name}` : "Adagio: a gallery for AI art";
    if (card) log("share", card);
    try {
      if (navigator.share) { await navigator.share({ title: "Adagio", text, url }); return; }
      await navigator.clipboard.writeText(url);
      flash("Link copied");
    } catch { /* cancelled or blocked */ }
  };

  const blocked = hint || info;
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setInfo(false); return; }
      if (blocked) return;
      if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); advance(); }
      else if (e.key === "Enter" || e.key.toLowerCase() === "l") love();
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [advance, love, blocked]);

  // Gesture: swipe up past 80px = next. Left, right and down do nothing. A tap is under 5px of movement.
  const onDown = (e: React.PointerEvent) => {
    if (locked.current || blocked) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, dx: 0, dy: 0 };
    if (topEl.current) topEl.current.style.transition = "none";
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current; const el = topEl.current;
    if (!d || !el) return;
    d.dx = e.clientX - d.x; d.dy = e.clientY - d.y;
    el.style.transform = `translateY(${Math.min(d.dy, 0)}px)`;
  };
  const onUp = () => {
    const d = drag.current; const el = topEl.current;
    drag.current = null;
    if (!d || !el) return;
    if (Math.abs(d.dx) < 5 && Math.abs(d.dy) < 5) {
      if (tapTimer.current) { // second tap inside the wait: double-tap = close the sheet and love
        clearTimeout(tapTimer.current); tapTimer.current = null;
        setDetails(false); love();
      } else {
        tapTimer.current = setTimeout(() => { tapTimer.current = null; toggleDetails(); }, TAP_WAIT);
      }
      return;
    }
    if (d.dy < -THRESH) { advance(); return; }
    el.style.transition = "transform 200ms ease-out";
    el.style.transform = "";
  };

  const atEnd = ready && !top && exhausted && !error;
  const isLoved = !!top && loved.has(top.id);
  const isSaved = !!top && saved.has(top.id);

  return (
    <div className="app">
      <header className="header">
        <span className="wordmark">adagio</span>
        <span className="header-right">
          <span className="counter">{swipes} seen</span>
          <button className="icon-btn" aria-label="About Adagio" aria-expanded={info} onClick={() => setInfo((v) => !v)}><Icon name="info" /></button>
        </span>
      </header>

      {offline && <div className="banner" role="status">You&apos;re offline</div>}
      {error && top && <div className="banner" role="alert">Couldn&apos;t load more art. Check your connection and try again.<button onClick={() => loadMore().then(() => {})}>Try again</button></div>}

      {info && (
        <div className="info" role="dialog" aria-label="About Adagio">
          <p>Adagio shows work made with AI.</p>
          <p>We store an anonymous ID so we can improve the feed. No account needed.</p>
          <div className="row">
            {RECRUIT && <a className="link" href={RECRUIT} target="_blank" rel="noopener noreferrer">Make art with AI? Share your work</a>}
            <Link className="link" href="/terms">Terms</Link>
          </div>
        </div>
      )}

      <main className="stage">
        {under && <div className="card under"><img src={under.image_url} alt={under.title} /></div>}
        {top && (
          <div className="card top" key={top.id} ref={topEl}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
            <img src={top.image_url} alt={top.title} fetchPriority="high" draggable={false} />
            <div className="stamp" ref={stampEl}>LOVE</div>
            {swipes < 3 && !details && <div className="tip">Tap for details</div>}
          </div>
        )}
        {top && (
          <div className={`sheet${details ? " open" : ""}`} aria-hidden={!details} inert={!details}>
            <h2>{top.title}</h2>
            <p>by {top.creator_name}</p>
            {top.tools && <p>Made with {top.tools}</p>}
            {top.commercial_ok && <span className="badge">Open to commercial work</span>}
            {top.portfolio_url && <a className="portfolio" href={top.portfolio_url} target="_blank" rel="noopener noreferrer nofollow">View portfolio</a>}
          </div>
        )}
      </main>

      <div className="actions">
        <button className={`btn sm${isSaved ? " on" : ""}`} aria-label="Save" onClick={save} disabled={!top || blocked}><Icon name="bookmark" /></button>
        <button className={`btn lg love${isLoved ? " on" : ""}`} aria-label="Love" onClick={love} disabled={!top || blocked}><Icon name="heart" /></button>
        <button className="btn sm" aria-label="Share" onClick={() => share(top)} disabled={!top || blocked}><Icon name="share" /></button>
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}

      {hint && ready && top && (
        <div className="overlay" role="dialog" aria-label="How it works">
          <div>
            <p className="say">Swipe up for the next one. Tap the heart if you love it. Tap the art to see who made it.</p>
            <button className="pill" onClick={() => { setHint(false); ls.set(LS.hint, "1"); }}>Got it</button>
          </div>
        </div>
      )}

      {error && !top && (
        <div className="overlay" role="alert">
          <div>
            <p className="say">Couldn&apos;t load more art. Check your connection and try again.</p>
            <button className="pill" onClick={async () => { if (!ids.current) await start(); else { setError(false); await loadMore(); } }}>Try again</button>
          </div>
        </div>
      )}

      {atEnd && (
        <div className="overlay">
          <div>
            <h1>You&apos;ve seen everything for now</h1>
            <p>New work arrives soon. Come back later.</p>
            <button className="pill" onClick={() => share()}>Share Adagio</button>
          </div>
        </div>
      )}
    </div>
  );
}
