import { useEffect, useState } from 'react';
import { api, ApiError, FeedbackEntry } from '../../lib/api';
import { StarIcon } from '../../components/Icons';

export default function FeedbackPanel({ onAuthError }: { onAuthError: () => void }) {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await api.listFeedback();
      setEntries(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onAuthError();
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Failed to load feedback.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this feedback entry?')) return;
    setDeletingId(id);
    try {
      await api.deleteFeedback(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete entry.');
    } finally {
      setDeletingId(null);
    }
  }

  const averageRating = (() => {
    const rated = entries.filter((e) => e.rating != null);
    if (!rated.length) return null;
    return (rated.reduce((sum, e) => sum + (e.rating ?? 0), 0) / rated.length).toFixed(1);
  })();

  return (
    <div>
      <div className="admin-dashboard__stats">
        <div className="card admin-dashboard__stat">
          <span className="admin-dashboard__stat-value">{entries.length}</span>
          <span className="admin-dashboard__stat-label">Total Responses</span>
        </div>
        <div className="card admin-dashboard__stat">
          <span className="admin-dashboard__stat-value">{averageRating ?? '—'}</span>
          <span className="admin-dashboard__stat-label">Average Rating</span>
        </div>
      </div>

      {error && <p className="feedback-form__error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p className="admin-dashboard__empty">No feedback submitted yet.</p>
      ) : (
        <div className="card admin-dashboard__table-wrap">
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.name || <span className="admin-dashboard__anonymous">Anonymous</span>}</td>
                  <td>{entry.email || '—'}</td>
                  <td>
                    {entry.rating ? (
                      <span className="admin-dashboard__rating">
                        <StarIcon size={16} filled />
                        {entry.rating}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="admin-dashboard__message">{entry.message}</td>
                  <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="admin-dashboard__delete"
                      onClick={() => handleDelete(entry.id)}
                      disabled={deletingId === entry.id}
                    >
                      {deletingId === entry.id ? 'Removing...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
