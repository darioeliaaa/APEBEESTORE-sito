"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLingua } from "@/i18n/LinguaProvider";
import { percorso } from "@/i18n/testi";
import type { FotoBanner } from "@/lib/sheet";

const OGNI = 5000;
const due = (n: number) => String(n).padStart(2, "0");

export function Banner({ foto, children }: { foto: FotoBanner[]; children: React.ReactNode }) {
  const { lang, t } = useLingua();
  const [rotte, setRotte] = useState<string[]>([]);
  const [scelta, setScelta] = useState(0);
  const [ferma, setFerma] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const fermo = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibili = foto.filter((f) => !rotte.includes(f.immagine));
  const n = visibili.length;
  // se nel frattempo una foto non si carica, la foto attiva resta dentro il numero di foto rimaste
  const attiva = Math.min(scelta, Math.max(n - 1, 0));

  const vai = useCallback((i: number) => {
    const t = track.current;
    if (!t) return;
    setScelta(i);
    const lento = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollTo({ left: i * t.clientWidth, behavior: lento ? "smooth" : "auto" });
  }, []);

  // quando lo scorrimento si ferma (anche col dito) guardo quale foto è in vista
  const scorri = () => {
    if (fermo.current) clearTimeout(fermo.current);
    fermo.current = setTimeout(() => {
      const t = track.current;
      if (t && t.clientWidth) setScelta(Math.max(0, Math.min(n - 1, Math.round(t.scrollLeft / t.clientWidth))));
    }, 120);
  };
  useEffect(() => () => { if (fermo.current) clearTimeout(fermo.current); }, []);

  // scorre da solo, tranne se il mouse ci è sopra, se si sta usando la tastiera o se chi guarda preferisce niente animazioni
  useEffect(() => {
    if (n < 2 || ferma || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!document.hidden) vai((attiva + 1) % n);
    }, OGNI);
    return () => clearInterval(t);
  }, [n, ferma, attiva, vai]);

  // se il telefono si gira, la foto attiva resta al suo posto
  // (solo se cambia la larghezza: sul telefono scorrendo la pagina cambia anche l'altezza)
  useEffect(() => {
    let larghezza = window.innerWidth;
    const fix = () => {
      if (window.innerWidth === larghezza) return;
      larghezza = window.innerWidth;
      const t = track.current;
      if (t) t.scrollTo({ left: attiva * t.clientWidth, behavior: "auto" });
    };
    window.addEventListener("resize", fix);
    return () => window.removeEventListener("resize", fix);
  }, [attiva]);

  if (n === 0) return <>{children}</>;

  // si scaricano subito solo la foto in vista e quelle accanto, le altre quando servono
  const vicina = (i: number) => i === attiva || i === (attiva + 1) % n || i === (attiva - 1 + n) % n;

  return (
    <div
      className="banner"
      role="region"
      aria-roledescription="carosello"
      aria-label={t.banner.regione}
      onPointerEnter={(e) => e.pointerType === "mouse" && setFerma(true)}
      onPointerLeave={() => setFerma(false)}
      onTouchStart={() => setFerma(true)}
      onFocus={() => setFerma(true)}
      onBlur={() => setFerma(false)}
    >
      <div className="banner-frame">
        <div className="banner-track" ref={track} onScroll={scorri}>
          {visibili.map((f, i) => {
            const carica = vicina(i) ? "eager" : "lazy";
            const img = (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="banner-sfondo" src={f.immagine} alt="" aria-hidden="true" loading={carica} draggable={false} referrerPolicy="no-referrer" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="banner-foto"
                  src={f.immagine}
                  alt=""
                  loading={carica}
                  draggable={false}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  referrerPolicy="no-referrer"
                  onError={() => setRotte((r) => [...r, f.immagine])}
                />
              </>
            );
            // i link verso altri siti (es. Instagram) si aprono in una scheda nuova
            const esterno = f.link?.startsWith("https://");
            return (
              <div
                className="banner-slide"
                key={f.immagine + i}
                role="group"
                aria-roledescription="foto"
                aria-label={t.banner.di(i + 1, n)}
                aria-hidden={i !== attiva}
              >
                {f.link ? (
                  <a
                    href={esterno ? f.link : percorso(lang, f.link)}
                    tabIndex={i === attiva ? 0 : -1}
                    aria-label={t.banner.apri(i + 1)}
                    {...(esterno ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {img}
                  </a>
                ) : (
                  img
                )}
              </div>
            );
          })}
        </div>
      </div>

      {n > 1 && (
        <div className="banner-ctrl">
          <div className="banner-dots">
            {visibili.map((f, i) => (
              <button
                key={f.immagine + i}
                type="button"
                className="banner-dot"
                aria-label={t.banner.foto(i + 1, n)}
                aria-current={i === attiva}
                onClick={() => vai(i)}
              >
                <span />
              </button>
            ))}
          </div>
          <span className="banner-num">
            {due(attiva + 1)} / {due(n)}
          </span>
          <button type="button" className="banner-freccia" aria-label={t.banner.prec} onClick={() => vai((attiva - 1 + n) % n)}>
            <ChevronLeft size={20} strokeWidth={2.4} />
          </button>
          <button type="button" className="banner-freccia" aria-label={t.banner.succ} onClick={() => vai((attiva + 1) % n)}>
            <ChevronRight size={20} strokeWidth={2.4} />
          </button>
        </div>
      )}
    </div>
  );
}
