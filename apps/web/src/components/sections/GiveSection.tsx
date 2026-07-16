import { FormEvent, useState } from 'react';
import Reveal from '../Reveal';
import './GiveSection.css';

const PRESET_AMOUNTS = [25, 50, 100, 250];

export default function GiveSection() {
  const [amount, setAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  const selectedAmount = customAmount ? Number(customAmount) : amount;

  return (
    <section id="give" className="section give-page">
      <div className="container give-page__container">
        <Reveal className="give-page__intro">
          <span className="eyebrow">Give</span>
          <h2>Support the mission</h2>
          <p>
            Your generosity fuels biblical teaching, genuine community, worship, leadership
            development, and mission, helping make authentic, multiplying disciples of Jesus
            Christ.
          </p>
        </Reveal>

        <Reveal as="form" className="card give-form" delay={120} onSubmit={handleSubmit}>
          <div className="give-form__notice">
            Online giving is coming soon. This form is a preview. No payment will be processed
            yet.
          </div>

          <div className="give-form__frequency">
            <button
              type="button"
              className={frequency === 'one-time' ? 'active' : ''}
              onClick={() => setFrequency('one-time')}
            >
              One-Time
            </button>
            <button
              type="button"
              className={frequency === 'monthly' ? 'active' : ''}
              onClick={() => setFrequency('monthly')}
            >
              Monthly
            </button>
          </div>

          <label className="give-form__label">Amount</label>
          <div className="give-form__amounts">
            {PRESET_AMOUNTS.map((value) => (
              <button
                key={value}
                type="button"
                className={amount === value && !customAmount ? 'active' : ''}
                onClick={() => {
                  setAmount(value);
                  setCustomAmount('');
                }}
              >
                KSh {value}
              </button>
            ))}
          </div>

          <label>
            Custom Amount
            <div className="give-form__custom">
              <span>KSh</span>
              <input
                type="number"
                min={1}
                placeholder="Other amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount(null);
                }}
              />
            </div>
          </label>

          <button type="submit" className="btn btn-primary give-form__submit" disabled>
            {selectedAmount ? `Give KSh ${selectedAmount} ${frequency === 'monthly' ? '/ month' : ''}` : 'Enter an amount'}
          </button>

          <p className="give-form__footnote">
            Prefer another way to give? Reach out to our team and we&rsquo;ll be glad to help.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
