import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link href="/" className="nav__logo">
            STORIE<span>DI</span>BRAND
          </Link>
          <p>Le incredibili storie dietro i marchi più famosi.</p>
        </div>
        <div className="footer__col">
          <h4>Esplora</h4>
          <Link href="/episodi">Episodi</Link>
          <Link href="/#youtube">YouTube</Link>
          <Link href="/#collabora">Collabora</Link>
        </div>
        <div className="footer__col">
          <h4>Guarda su</h4>
          <a href="https://www.youtube.com/@StoriediBrand" target="_blank" rel="noopener">
            YouTube
          </a>
          <a href="#">Spotify</a>
          <a href="#">Apple Podcasts</a>
        </div>
        <div className="footer__col">
          <h4>Contatti</h4>
          <a href="mailto:info@storiedibrand.it">info@storiedibrand.it</a>
          <a href="https://www.instagram.com/storiedibrand" target="_blank" rel="noopener">
            Instagram @storiedibrand
          </a>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Storie di Brand</span>
        <span>Made with ♥ in Italy</span>
      </div>
    </footer>
  );
}
