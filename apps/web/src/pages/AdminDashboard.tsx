import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../lib/auth';
import FeedbackPanel from './admin/FeedbackPanel';
import UpdatesPanel from './admin/UpdatesPanel';
import DevotionalsPanel from './admin/DevotionalsPanel';
import './Admin.css';

const TABS = [
  { key: 'feedback', label: 'Feedback' },
  { key: 'updates', label: 'Updates' },
  { key: 'devotionals', label: 'Devotionals' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('feedback');

  function handleAuthError() {
    clearToken();
    navigate('/admin/login');
  }

  function handleLogout() {
    clearToken();
    navigate('/admin/login');
  }

  return (
    <section className="section admin-dashboard">
      <div className="container">
        <div className="admin-dashboard__header">
          <div>
            <span className="eyebrow">Admin</span>
            <h1>Dashboard</h1>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`admin-tabs__item ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'feedback' && <FeedbackPanel onAuthError={handleAuthError} />}
        {tab === 'updates' && <UpdatesPanel onAuthError={handleAuthError} />}
        {tab === 'devotionals' && <DevotionalsPanel onAuthError={handleAuthError} />}
      </div>
    </section>
  );
}
