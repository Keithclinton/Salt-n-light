import { useEffect, useState } from 'react';
import { BookIcon, CommunityIcon, CrossIcon, GlobeIcon } from '../components/Icons';
import Reveal from '../components/Reveal';
import FeedbackSection from '../components/sections/FeedbackSection';
import GallerySection from '../components/sections/GallerySection';
import GiveSection from '../components/sections/GiveSection';
import { api, DevotionalEntry, UpdateEntry } from '../lib/api';
import './Home.css';

const coreValues = [
  {
    icon: CrossIcon,
    title: 'Christ-Centeredness',
    body: 'Jesus at the center of all we are and do.',
  },
  {
    icon: CommunityIcon,
    title: 'Authentic Community',
    body: "Real relationships that reflect God's love.",
  },
  {
    icon: BookIcon,
    title: 'Truth Held With Grace',
    body: 'Anchored in Scripture, extended with love.',
  },
  {
    icon: GlobeIcon,
    title: 'Kingdom Influence',
    body: "Empowered to impact our world for God's glory.",
  },
];

export default function Home() {
  const [updates, setUpdates] = useState<UpdateEntry[]>([]);
  const [devotional, setDevotional] = useState<DevotionalEntry | null>(null);

  useEffect(() => {
    let cancelled = false;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const updatesLoaded = api
      .listUpdates()
      .then((data) => !cancelled && setUpdates(data.slice(0, 3)))
      .catch(() => !cancelled && setUpdates([]));

    const devotionalLoaded = api
      .listDevotionals()
      .then((data) => !cancelled && setDevotional(data[0] ?? null))
      .catch(() => !cancelled && setDevotional(null));

    Promise.all([updatesLoaded, devotionalLoaded]).then(() => {
      if (cancelled) return;

      const [navEntry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      const isReload = navEntry?.type === 'reload';

      if (isReload) {
        window.scrollTo({ top: 0 });
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        return;
      }

      if (!window.location.hash) return;
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section id="top" className="hero">
        <div className="hero__sunburst" aria-hidden="true">
          <span className="hero__glow" />
        </div>
        <div className="container hero__content fade-up">
          <div className="hero__logo-wrap">
            <img src="/logo-mark.svg" alt="" aria-hidden="true" className="hero__logo-spin" />
            <h1 className="hero__logo-text">
              <span className="hero__logo-script">the</span>
              <span className="hero__logo-word">SALT</span>
              <span className="hero__logo-word">AND</span>
              <span className="hero__logo-word">LIGHT</span>
            </h1>
          </div>
          <p className="hero__lead">
            Disciples of Jesus Christ rooted in community and equipped to influence the world.
          </p>
          <div className="hero__actions">
            <a href="#feedback" className="btn btn-primary">
              Share Your Feedback
            </a>
            <a href="#vision" className="btn btn-ghost">
              Learn More
            </a>
          </div>
        </div>
      </section>

      <section id="vision" className="section vision-mission">
        <div className="container vision-mission__grid">
          <Reveal className="vision-mission__block">
            <span className="eyebrow">Vision</span>
            <p className="vision-mission__text">
              Disciples of Jesus Christ rooted in community and equipped to influence the world.
            </p>
          </Reveal>
          <Reveal className="vision-mission__block" delay={120}>
            <span className="eyebrow">Mission</span>
            <p className="vision-mission__text">
              Salt &amp; Light exists to make authentic, multiplying disciples of Jesus Christ through
              biblical teaching, genuine community, worship, leadership development, and mission.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section core-values">
        <div className="container">
          <Reveal as="div" className="core-values__heading">
            <span className="eyebrow">Core Values</span>
          </Reveal>
          <div className="core-values__grid">
            {coreValues.map(({ icon: Icon, title, body }, index) => (
              <Reveal key={title} className="core-values__card card" delay={index * 90}>
                <div className="core-values__icon">
                  <Icon size={30} />
                </div>
                <h3 className="core-values__title">{title}</h3>
                <p className="core-values__body">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {devotional && (
        <section className="section-tight devotional">
          <div className="container">
            <Reveal className="devotional__inner">
              <span className="tag">Devotional</span>
              <p className="devotional__verse">&ldquo;{devotional.verseText}&rdquo;</p>
              <p className="devotional__ref">{devotional.reference}</p>
              {devotional.note && <p className="devotional__note">{devotional.note}</p>}
            </Reveal>
          </div>
        </section>
      )}

      {updates.length > 0 && (
        <section id="updates" className="section updates">
          <div className="container">
            <Reveal as="div" className="core-values__heading">
              <span className="eyebrow">Latest Updates</span>
            </Reveal>
            <div className="updates__grid">
              {updates.map((update, index) => (
                <Reveal key={update.id} className="card updates__card" delay={index * 90}>
                  {update.imageUrl && (
                    <img
                      src={update.imageUrl}
                      alt={`Poster for ${update.title}`}
                      className="updates__poster"
                      loading="lazy"
                    />
                  )}
                  <span className="updates__date">
                    {new Date(update.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <h3 className="updates__title">{update.title}</h3>
                  <p className="updates__body">{update.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <GallerySection />
      <FeedbackSection />
      <GiveSection />
    </>
  );
}
