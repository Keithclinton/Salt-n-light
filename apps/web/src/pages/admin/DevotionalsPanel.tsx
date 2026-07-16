import { FormEvent, useEffect, useState } from 'react';
import { api, ApiError, DevotionalEntry } from '../../lib/api';

export default function DevotionalsPanel({ onAuthError }: { onAuthError: () => void }) {
  const [entries, setEntries] = useState<DevotionalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [verseText, setVerseText] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      setEntries(await api.listDevotionals());
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onAuthError();
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Failed to load devotionals.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const created = await api.createDevotional({
        reference,
        verseText,
        ...(note ? { note } : {}),
      });
      setEntries((prev) => [created, ...prev]);
      setReference('');
      setVerseText('');
      setNote('');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onAuthError();
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Failed to post devotional.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this devotional?')) return;
    setDeletingId(id);
    try {
      await api.deleteDevotional(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete devotional.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <form className="card admin-panel-form" onSubmit={handleCreate}>
        <h3>Post a Devotional Verse</h3>
        <label>
          Reference
          <input
            required
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. Matthew 5:13-16"
          />
        </label>
        <label>
          Verse Text
          <textarea
            required
            rows={3}
            value={verseText}
            onChange={(e) => setVerseText(e.target.value)}
            placeholder="You are the salt of the earth..."
          />
        </label>
        <label>
          Reflection (optional)
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="A short reflection or application note..."
          />
        </label>
        {error && <p className="feedback-form__error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Devotional'}
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p className="admin-dashboard__empty">No devotionals posted yet.</p>
      ) : (
        <ul className="admin-panel-list">
          {entries.map((entry) => (
            <li key={entry.id} className="card admin-panel-list__item">
              <div>
                <h4>{entry.reference}</h4>
                <p className="admin-panel-list__verse">&ldquo;{entry.verseText}&rdquo;</p>
                {entry.note && <p>{entry.note}</p>}
                <span className="admin-panel-list__date">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button
                className="admin-dashboard__delete"
                onClick={() => handleDelete(entry.id)}
                disabled={deletingId === entry.id}
              >
                {deletingId === entry.id ? 'Removing...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
