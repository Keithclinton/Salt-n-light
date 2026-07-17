import { FormEvent, useEffect, useState } from 'react';
import { ALLOWED_IMAGE_TYPES, api, ApiError, UpdateEntry, uploadImage } from '../../lib/api';

export default function UpdatesPanel({ onAuthError }: { onAuthError: () => void }) {
  const [entries, setEntries] = useState<UpdateEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function chooseImage(file: File | null) {
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
    setImageFile(file);
  }

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
      let imageUrl: string | undefined;
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
        setUploading(false);
      }

      const created = await api.createUpdate({ title, body, imageUrl });
      setEntries((prev) => [created, ...prev]);
      setTitle('');
      setBody('');
      chooseImage(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onAuthError();
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Failed to post update.');
    } finally {
      setUploading(false);
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
        <label>
          Poster <span className="admin-panel-form__hint">(optional — JPG, PNG, WEBP or GIF, max 8MB)</span>
          <input
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(',')}
            onChange={(e) => chooseImage(e.target.files?.[0] ?? null)}
          />
        </label>
        {imagePreview && (
          <div className="admin-panel-form__preview">
            <img src={imagePreview} alt="Selected poster preview" />
            <button type="button" className="btn btn-ghost" onClick={() => chooseImage(null)}>
              Remove poster
            </button>
          </div>
        )}
        {error && <p className="feedback-form__error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {uploading ? 'Uploading poster...' : submitting ? 'Posting...' : 'Post Update'}
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
                {entry.imageUrl && (
                  <img
                    src={entry.imageUrl}
                    alt=""
                    className="admin-panel-list__thumb"
                    loading="lazy"
                  />
                )}
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
