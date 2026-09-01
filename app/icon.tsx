import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

/**
 * La favicon: la stessa sigla che fa da firma nella barra sopra i 900px,
 * disegnata col carattere vero del sito invece che con un'immagine a parte,
 * così se il font cambia cambia anche l'icona.
 */
export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default function Icon() {
  const gothic = fs.readFileSync(
    path.join(process.cwd(), "public", "fonts", "GothicCGNo1-Regular.otf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#140c0c",
          fontFamily: "gothic",
          /* Le lettere riempiono il quadrato: a 16px in una scheda del
             browser ogni pixel di margine sprecato è una lettera in meno che
             si legge. `lineHeight: 1` toglie lo spazio che la riga riserva
             per le discendenti, che qui non ci sono. */
          fontSize: 208,
          lineHeight: 1,
          paddingTop: 12,
          letterSpacing: "0.02em",
          color: "#faf9d2",
        }}
      >
        S<span style={{ color: "#ff5757" }}>D</span>B
      </div>
    ),
    { ...size, fonts: [{ name: "gothic", data: gothic, style: "normal" }] }
  );
}
