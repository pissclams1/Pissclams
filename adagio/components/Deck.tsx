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
  const drag = useRef<{ x: number; y: number; dx: number; dy: number; id: number } | null>(null);
  const lastTap = useRef(0);
  const liked = useRef<Set<string>>(new Set());
  const [likedUi, setLikedUi] = useState<Set<string>>(new Set());
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

  // Swipe up = next card. A card gets exactly one verdict: 'like' if hearted, else 'pass'.
  const advance = useCallback(() => {
    const el = topEl.current;
    if (!top || locked.current || !el) return;
    locked.current = true;
    const card = top;
    el.style.transition = reduced() ? "opacity 250ms ease-out" : "transform 250ms ease-out, opacity 250ms ease-out";
    if (!reduced()) el.style.transform = `translateY(${-innerHeight * 1.1}px)`;
    el.style.opacity = "0";
    setTimeout(() => {
      if (!liked.current.has(card.id)) log("pass", card);
      setSwipes((n) => n + 1);
      setIdx((i) => i + 1);
      locked.current = false;
    }, 250);
  }, [top, log]);

  const love = useCallback(() => {
    if (!top || locked.current || liked.current.has(top.id)) return;
    liked.current.add(top.id);
    setLikedUi(new Set(liked.current));
    log("like", top);
    const st = loveEl.current;
    if (st) { st.style.transition = "opacity 120ms"; st.style.opacity = "1"; setTimeout(() => { st.style.transition = "opacity 500ms"; st.style.opacity = "0"; }, 650); }
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
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); advance(); }
      else if (e.key === "Enter" || e.key.toLowerCase() === "l") love();
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [advance, love]);

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
    el.style.transform = `translateY(${Math.min(d.dy, 24)}px)`;
  };
  const onUp = () => {
    const d = drag.current; const el = topEl.current;
    drag.current = null;
    if (!d || !el) return;
    if (Math.abs(d.dx) < 5 && Math.abs(d.dy) < 5) {
      const now = Date.now();
      if (now - lastTap.current < 300) { lastTap.current = 0; setDetails(false); love(); } // double-tap = love
      else { lastTap.current = now; toggleDetails(); }
      return;
    }
    if (d.dy < -THRESH) { advance(); return; }
    el.style.transition = "transform 200ms ease-out";
    el.style.transform = "";
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
        <button className={`btn sm${top && saved.has(top.id) ? " on" : ""}`} aria-label="Save" onClick={save} disabled={!top}>
          <Icon name="bookmark" filled={!!top && saved.has(top.id)} />
        </button>
        <button className={`btn lg love${top && likedUi.has(top.id) ? " on" : ""}`} aria-label="Love" onClick={love} disabled={!top}>
          <Icon name="heart" filled={!!top && likedUi.has(top.id)} />
        </button>
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
            <p>Swipe up for the next one. Tap the heart if you love it. Tap the art to see who made it.</p>
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
