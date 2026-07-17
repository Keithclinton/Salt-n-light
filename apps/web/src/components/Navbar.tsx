import { useState } from 'react';
import { Link } from 'react-router-dom';
import './layout.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/logo-mark.svg" alt="Salt & Light" className="brand__mark" />
          <span className="brand__name">Salt &amp; Light</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${open ? 'site-nav--open' : ''}`}>
          <a href="/" onClick={() => setOpen(false)}>
            Home
          </a>
          <a href="/#gallery" onClick={() => setOpen(false)}>
            Activities
          </a>
          <a href="/#feedback" onClick={() => setOpen(false)}>
            Feedback
          </a>
          <a href="/#give" className="btn btn-gold site-nav__cta" onClick={() => setOpen(false)}>
            Give
          </a>
        </nav>
      </div>
    </header>
  );
}
