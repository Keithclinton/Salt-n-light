import { CrownIcon } from './Icons';
import './layout.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <CrownIcon size={26} color="var(--gold)" />
        <p className="site-footer__verse">
          YOU ARE THE SALT OF THE EARTH.
          <br />
          YOU ARE THE LIGHT OF THE WORLD.
        </p>
        <p className="site-footer__ref">MATTHEW 5:13&ndash;16</p>
        <p className="site-footer__copy">&copy; {new Date().getFullYear()} Salt &amp; Light. All rights reserved.</p>
      </div>
    </footer>
  );
}
