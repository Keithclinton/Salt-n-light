import { FormEvent, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import { StarIcon } from '../Icons';
import Reveal from '../Reveal';
import './FeedbackSection.css';

export default function FeedbackSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      await api.submitFeedback({
        ...(name.trim() ? { name: name.trim() } : {}),
        ...(email.trim() ? { email: email.trim() } : {}),
        message,
        ...(rating > 0 ? { rating } : {}),
      });
      setStatus('success');
      setName('');
      setEmail('');
      setRating(0);
      setMessage('');
    } catch (err) {
      setStatus('error');
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <section id="feedback" className="section feedback-page">
      <div className="container feedback-page__container">
        <Reveal className="feedback-page__intro">
          <span className="eyebrow">Feedback</span>
          <h2>We&rsquo;d love to hear from you</h2>
          <p>
            Whether it&rsquo;s a testimony, a suggestion, or a prayer request, your voice helps
            shape how Salt &amp; Light serves this community.
          </p>
        </Reveal>

        <Reveal as="form" className="card feedback-form" delay={120} onSubmit={handleSubmit}>
          {status === 'success' ? (
            <div className="feedback-form__success">
              <h3>Thank you!</h3>
              <p>Your feedback has been received.</p>
              <button type="button" className="btn btn-ghost" onClick={() => setStatus('idle')}>
                Submit another response
              </button>
            </div>
          ) : (
            <>
              <div className="feedback-form__row">
                <label>
                  Name (optional)
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </label>
                <label>
                  Email (optional)
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                  />
                </label>
              </div>
              <p className="feedback-form__hint">
                Leave name and email blank to submit your feedback anonymously.
              </p>

              <label className="feedback-form__rating-label">
                Rating (optional)
                <div className="feedback-form__rating">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={`Rate ${value} out of 5`}
                      onClick={() => setRating(value === rating ? 0 : value)}
                    >
                      <StarIcon filled={value <= rating} />
                    </button>
                  ))}
                </div>
              </label>

              <label>
                Message
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts..."
                />
              </label>

              {status === 'error' && <p className="feedback-form__error">{error}</p>}

              <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Send Feedback'}
              </button>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}
