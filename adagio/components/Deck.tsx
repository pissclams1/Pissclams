"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";

type Card = { id: string; title: string; creator_name: string; tools: string | null; commercial_ok: boolean; image_url: string };
type Action = "like" | "pass" | "save" | "share" | "details";

const THRESH = 80;
const LS = { vid: "adagio_vid", hint: "adagio_hint_seen", saved: "adagio_saved" };
const RECRUIT = process.env.NEXT_PUBLIC_RECRUIT_URL || "#";

const ls = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} },
};
const post = (url: string, body: unknown) =>
  fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), keepalive: true });
const reduced = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

async function bootstrap(): Promise<{ visitor: string; session: string }> {
  let visitor = ls.get(LS.vid) || document.cookie.match(/(?:^|; )adagio_vid=([^;]+)/)?.[1] || null;
  if (!visitor) {
    const utm = new URLSearchParams(location.search).get("utm_source");
    const r = await post("/api/visitor", { utm_source: utm });
    if (!r.ok) throw new Error("visitor");
    visitor = (await r.json()).visitor_id as string;
  }
  ls.set(LS.vid, visitor);
  document.cookie = `adagio_vid=${visitor}; max-age=31536000; path=/; SameSite=Lax`;
  let r = await post("/api/session", { visitor_id: visitor });
  if (r.status === 404) { // stale id (e.g. DB reset): start over
    try { localStorage.removeItem(LS.vid); } catch {}
    return bootstrap();
  }
  if (!r.ok) throw new Error("session");
  return { visitor, session: (await r.json()).session_id as string };
}

export default function Deck() {
  const [cards, setCards] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [exhausted, setExhausted] = useState(false);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const [swipes, setSwipes] = useState(0);
  const [details, setDetails] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const [offline, setOffline] = useState(false);

  const ids = useRef<{ visitor: string; session: string } | null>(null);
  const fetching = useRef(false);
  const shownAt = useRef(0);
  const locked = useRef(false);
  const topEl = useRef<HTMLDivElement | null>(null);
  const loveEl = useRef<HTMLDivElement | null>(null);
  const passEl = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; y: number; dx: number; dy: number; id: number } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const top = cards[idx];
  const under = cards[idx + 1];

  const flash = useCallback((t: string) => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1600);
  }, []);

  const loadMore = useCallback(async () => {
    if (fetching.current || !ids.current) return;
    fetching.current = true;
    try {
      const r = await fetch(`/api/feed?visitor_id=${ids.current.visitor}&session_id=${ids.current.session}&n=10`);
      if (!r.ok) throw new Error("feed");
      const { cards: next } = (await r.json()) as { cards: Card[] };
      if (!next.length) setExhausted(true);
      else setCards((c) => { const have = new Set(c.map((x) => x.id)); return [...c, ...next.filter((x) => !have.has(x.id))]; });
      setError(false);
    } catch { setError(true); }
    finally { fetching.current = false; }
  }, []);

  // init
  useEffect(() => {
    try { setSaved(new Set(JSON.parse(ls.get(LS.saved) || "[]"))); } catch {}
    if (!ls.get(LS.hint)) setHint(true);
    setOffline(!navigator.onLine);
    const on = () => setOffline(false), off = () => setOffline(true);
    addEventListener("online", on); addEventListener("offline", off);
    bootstrap().then((v) => { ids.current = v; setReady(true); return loadMore(); }).catch(() => { setReady(true); setError(true); });
    return () => { removeEventListener("online", on); removeEventListener("offline", off); };
  }, [loadMore]);

  // top card changed: impression + dwell clock + close sheet
  useEffect(() => {
    if (!top || !ids.current) return;
    shownAt.current = Date.now();
    setDetails(false);
    post("/api/impression", { visitor_id: ids.current.visitor, session_id: ids.current.session, creation_id: top.id }).catch(() => {});
  }, [top?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // prefetch + preload
  useEffect(() => {
    if (cards.length - idx <= 3 && !exhausted && ready && !error) loadMore();
    cards.slice(idx + 1, idx + 4).forEach((c) => { const i = new Image(); i.src = c.image_url; });
  }, [idx, cards, exhausted, ready, error, loadMore]);

  const log = useCallback((action: Action, card: Card) => {
    if (!ids.current) return;
    post("/api/event", {
      visitor_id: ids.current.visitor, session_id: ids.current.session, creation_id: card.id,
      action, dwell_ms: Date.now() - shownAt.current,
    }).catch(() => {});
  }, []);

  const fly = useCallback((dir: 1 | -1) => {
    const el = topEl.current;
    if (!top || locked.current || !el) return;
    locked.current = true;
    const card = top;
    el.style.transition = reduced() ? "opacity 250ms ease-out" : "transform 250ms ease-out, opacity 250ms ease-out";
    if (!reduced()) el.style.transform = `translateX(${dir * innerWidth * 1.2}px) rotate(${dir * 18}deg)`;
    el.style.opacity = "0";
    (dir === 1 ? loveEl : passEl).current!.style.opacity = "1";
    setTimeout(() => {
      log(dir === 1 ? "like" : "pass", card);
      setSwipes((n) => n + 1);
      setIdx((i) => i + 1);
      locked.current = false;
    }, 250);
  }, [top, log]);

  const toggleDetails = useCallback(() => {
    if (!top) return;
    setDetails((d) => { if (!d) log("details", top); return !d; });
    if (hint) { setHint(false); ls.set(LS.hint, "1"); }
  }, [top, log, hint]);

  const save = () => {
    if (!top) return;
    const next = new Set(saved);
    if (next.has(top.id)) { next.delete(top.id); flash("Removed from saved"); }
    else { next.add(top.id); flash("Saved"); log("save", top); }
    setSaved(next); ls.set(LS.saved, JSON.stringify([...next]));
  };

  const share = async (card?: Card) => {
    const text = card ? `Found this on Adagio: "${card.title}" by ${card.creator_name}` : "Adagio: a gallery for AI art";
    const url = location.origin;
    if (card) log("share", card);
    try {
      if (navigator.share) { await navigator.share({ title: "Adagio", text, url }); return; }
      await navigator.clipboard.writeText(url);
      flash("Link copied");
    } catch { /* cancelled */ }
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "ArrowRight") fly(1); else if (e.key === "ArrowLeft") fly(-1); };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [fly]);

  // pointer drag
  const onDown = (e: React.PointerEvent) => {
    if (locked.current) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, dx: 0, dy: 0, id: e.pointerId };
    if (topEl.current) topEl.current.style.transition = "none";
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current; const el = topEl.current;
    if (!d || !el) return;
    d.dx = e.clientX - d.x; d.dy = e.clientY - d.y;
    el.style.transform = `translate(${d.dx}px, ${d.dy * 0.2}px) rotate(${d.dx / 20}deg)`;
    const o = Math.min(Math.abs(d.dx) / THRESH, 1);
    if (loveEl.current) loveEl.current.style.opacity = d.dx > 0 ? String(o) : "0";
    if (passEl.current) passEl.current.style.opacity = d.dx < 0 ? String(o) : "0";
  };
  const onUp = () => {
    const d = drag.current; const el = topEl.current;
    drag.current = null;
    if (!d || !el) return;
    if (Math.abs(d.dx) < 5 && Math.abs(d.dy) < 5) { toggleDetails(); return; }
    if (Math.abs(d.dx) > THRESH) { fly(d.dx > 0 ? 1 : -1); return; }
    el.style.transition = "transform 200ms ease-out";
    el.style.transform = "";
    if (loveEl.current) loveEl.current.style.opacity = "0";
    if (passEl.current) passEl.current.style.opacity = "0";
  };

  const atEnd = ready && !top && exhausted && !error;
  const loading = !top && !atEnd && !error;

  return (
    <div className="app">
      <header className="header">
        <span className="wordmark">adagio</span>
        <span className="counter" aria-label="Swipes this visit">{swipes}</span>
      </header>
      {offline && <div className="banner" role="status">You&apos;re offline</div>}

      <main className="stage">
        {under && (
          <div className="card under" key={under.id}><img src={under.image_url} alt={under.title} /></div>
        )}
        {top && (
          <div className="card top" key={top.id} ref={topEl}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
            <img src={top.image_url} alt={top.title} fetchPriority="high" draggable={false} />
            <div className="stamp love" ref={loveEl}>LOVE</div>
            <div className="stamp pass" ref={passEl}>PASS</div>
            {swipes < 3 && !details && <div className="tap-hint">Tap for details</div>}
          </div>
        )}
        {top && (
          <div className={`sheet${details ? " open" : ""}`} aria-hidden={!details}>
            <h2>{top.title}</h2>
            <p>by {top.creator_name}</p>
            {top.tools && <p>Made with {top.tools}</p>}
            {top.commercial_ok && <span className="badge">Open to commercial work</span>}
          </div>
        )}
        {loading && <div className="center" role="status"><p>&nbsp;</p></div>}
      </main>

      <div className="actions">
        <button className="btn lg pass" aria-label="Pass" onClick={() => fly(-1)} disabled={!top}><Icon name="x" /></button>
        <button className={`btn sm${top && saved.has(top.id) ? " on" : ""}`} aria-label="Save" onClick={save} disabled={!top}>
          <Icon name="bookmark" filled={!!top && saved.has(top.id)} />
        </button>
        <button className="btn lg love" aria-label="Love" onClick={() => fly(1)} disabled={!top}><Icon name="heart" /></button>
        <button className="btn sm" aria-label="Share" onClick={() => share(top)} disabled={!top}><Icon name="share" /></button>
      </div>

      <footer className="footer">
        <div>Adagio shows work made with AI.</div>
        <div>We store an anonymous ID so we can improve the feed. No account needed.</div>
        <a href={RECRUIT} target="_blank" rel="noopener noreferrer">Make art with AI? Share your work</a>
      </footer>

      {toast && <div className="toast" role="status">{toast}</div>}

      {hint && ready && top && (
        <div className="overlay" role="dialog" aria-label="How it works">
          <div>
            <p>Swipe right to love it. Swipe left to pass. Tap to see who made it.</p>
            <button className="pill" onClick={() => { setHint(false); ls.set(LS.hint, "1"); }}>Got it</button>
          </div>
        </div>
      )}

      {error && !top && (
        <div className="overlay" role="alert">
          <div>
            <p>Couldn&apos;t load more art. Check your connection and try again.</p>
            <button className="pill" onClick={async () => {
              setError(false);
              if (!ids.current) { try { ids.current = await bootstrap(); setReady(true); } catch { setError(true); return; } }
              loadMore();
            }}>Try again</button>
          </div>
        </div>
      )}

      {atEnd && (
        <div className="overlay">
          <div>
            <h1 style={{ font: "500 20px var(--sans)" }}>You&apos;ve seen everything for now</h1>
            <p style={{ color: "var(--muted)" }}>New work arrives soon. Come back later.</p>
            <button className="pill" onClick={() => share()}>Share Adagio</button>
          </div>
        </div>
      )}
    </div>
  );
}
