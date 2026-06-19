/** Marquee/ticker scorrevole. Duplica gli elementi per un loop continuo. */
export default function Ticker({ items }: { items: string[] }) {
  const run = items.flatMap((item) => [item, "•"]);
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[...run, ...run].map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
