import { FormEvent, useEffect, useState } from 'react';
import { api, ApiError, UpdateEntry } from '../../lib/api';

export default function UpdatesPanel({ onAuthError }: { onAuthError: () => void }) {
  const [entries, setEntries] = useState<UpdateEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      setEntries(await api.listUpdates());
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onAuthError();
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Failed to load updates.');
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
      const created = await api.createUpdate({ title, body });
      setEntries((prev) => [created, ...prev]);
      setTitle('');
      setBody('');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onAuthError();
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Failed to post update.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this update?')) return;
    setDeletingId(id);
    try {
      await api.deleteUpdate(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete update.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <form className="card admin-panel-form" onSubmit={handleCreate}>
        <h3>Post an Update</h3>
        <label>
          Title
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Youth Retreat Registration Now Open"
          />
        </label>
        <label>
          Details
          <textarea
            required
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share the details of this update..."
          />
        </label>
        {error && <p className="feedback-form__error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Update'}
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p className="admin-dashboard__empty">No updates posted yet.</p>
      ) : (
        <ul className="admin-panel-list">
          {entries.map((entry) => (
            <li key={entry.id} className="card admin-panel-list__item">
              <div>
                <h4>{entry.title}</h4>
                <p>{entry.body}</p>
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
