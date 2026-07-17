import { useCallback, useEffect, useState } from 'react';
import Reveal from '../Reveal';
import { activityPhotos } from '../../data/activityPhotos';
import './GallerySection.css';

export default function GallerySection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);

  const step = useCallback((delta: number) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      return (current + delta + activityPhotos.length) % activityPhotos.length;
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, step]);

  if (activityPhotos.length === 0) return null;

  const active = openIndex === null ? null : activityPhotos[openIndex];

  return (
    <section id="gallery" className="section gallery">
      <div className="container">
        <Reveal as="div" className="gallery__heading">
          <span className="eyebrow">Our Activities</span>
          <p className="gallery__intro">
            Moments from our gatherings, outreach, and life together as a community.
          </p>
        </Reveal>

        <div className="gallery__grid">
          {activityPhotos.map((photo, index) => (
            <Reveal key={photo.src} className="gallery__item" delay={(index % 3) * 90}>
              <button
                type="button"
                className="gallery__tile"
                onClick={() => setOpenIndex(index)}
                aria-label={`View larger: ${photo.caption}`}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" className="gallery__img" />
                <span className="gallery__caption">{photo.caption}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="gallery__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          onClick={close}
        >
          <button type="button" className="gallery__close" onClick={close} aria-label="Close">
            &times;
          </button>

          {activityPhotos.length > 1 && (
            <button
              type="button"
              className="gallery__nav gallery__nav--prev"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
            >
              &#8249;
            </button>
          )}

          <figure className="gallery__figure" onClick={(e) => e.stopPropagation()}>
            <img src={active.src} alt={active.alt} className="gallery__figure-img" />
            <figcaption className="gallery__figure-caption">{active.caption}</figcaption>
          </figure>

          {activityPhotos.length > 1 && (
            <button
              type="button"
              className="gallery__nav gallery__nav--next"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </section>
  );
}
