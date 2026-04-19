'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

interface User { id: string; name: string; email: string; }
interface Query { _id: string; symptoms: string; result: string; createdAt: string; }

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function ResultMarkdown({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className={styles.resultBody}>
      {lines.map((line, i) => {
        if (line.startsWith('## ') || line.startsWith('**') && line.endsWith('**')) {
          const clean = line.replace(/^##\s*/, '').replace(/^\*\*|\*\*$/g, '');
          return <h3 key={i} className={styles.resultH3}>{clean}</h3>;
        }
        if (line.startsWith('* ') || line.startsWith('- ') || line.match(/^\d+\.\s/)) {
          const clean = line.replace(/^[\*\-]\s/, '').replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '$1');
          return <li key={i} className={styles.resultLi}>{clean}</li>;
        }
        if (line.trim() === '') return <div key={i} className={styles.resultSpacer} />;
        const clean = line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
        return <p key={i} className={styles.resultP}>{clean}</p>;
      })}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<'checker' | 'history'>('checker');
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Query[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user); else router.push('/login'); })
      .catch(() => router.push('/login'));
  }, [router]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.queries) setHistory(data.queries);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'history') loadHistory();
  }, [tab, loadHistory]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setError('');
    setResult('');
    setLoading(true);
    try {
      const res = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setResult(data.result);
    } catch {
      setError('Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>✦</span>
            <span className={styles.brandName}>SymptomSense</span>
          </div>
          <nav className={styles.nav}>
            <button
              className={`${styles.navItem} ${tab === 'checker' ? styles.navActive : ''}`}
              onClick={() => setTab('checker')}
            >
              <span className={styles.navIcon}>◎</span>
              Symptom Checker
            </button>
            <button
              className={`${styles.navItem} ${tab === 'history' ? styles.navActive : ''}`}
              onClick={() => setTab('history')}
            >
              <span className={styles.navIcon}>◷</span>
              Past Queries
            </button>
          </nav>
        </div>
        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {tab === 'checker' && (
          <div className={styles.checkerPane}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>How are you feeling?</h1>
              <p className={styles.pageSubtitle}>Describe your symptoms and get an educational AI analysis</p>
            </div>

            <div className={styles.aiNotice}>
              <span className={styles.aiNoticeDot}>⚠</span>
              <span>This tool is for <strong>educational purposes only</strong> and does not provide medical diagnoses. Always consult a qualified healthcare professional for medical advice.</span>
            </div>

            <form onSubmit={handleCheck} className={styles.form}>
              <textarea
                className={styles.textarea}
                placeholder="Describe your symptoms in detail… e.g. 'I have had a persistent headache for 2 days, mild fever, and fatigue. The headache is worse in the morning.'"
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                rows={5}
                required
              />
              <button className={styles.submitBtn} type="submit" disabled={loading || !symptoms.trim()}>
                {loading ? (
                  <><span className={styles.btnSpinner} /> Analysing symptoms…</>
                ) : (
                  <>Analyse Symptoms →</>
                )}
              </button>
            </form>

            {error && (
              <div className={styles.errorBox}>
                <span>⚠</span> {error}
              </div>
            )}

            {result && (
              <div className={styles.resultCard}>
                <div className={styles.resultHeader}>
                  <div className={styles.resultHeaderLeft}>
                    <span className={styles.resultIcon}>✦</span>
                    <span className={styles.resultTitle}>AI Analysis</span>
                  </div>
                  <span className={styles.aiTag}>AI Generated</span>
                </div>
                <div className={styles.aiWarningBanner}>
                  <strong>⚠ Important Disclaimer:</strong> This analysis is generated by artificial intelligence for informational purposes only. It is <strong>not a medical diagnosis</strong>. Please consult a licensed healthcare professional before making any health decisions.
                </div>
                <ResultMarkdown text={result} />
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className={styles.historyPane}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Past Queries</h1>
              <p className={styles.pageSubtitle}>Your previous symptom checks</p>
            </div>

            {historyLoading && (
              <div className={styles.centerSpinner}><div className={styles.spinner} /></div>
            )}

            {!historyLoading && history.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>◎</div>
                <p>No queries yet. Run your first symptom check!</p>
                <button className={styles.emptyBtn} onClick={() => setTab('checker')}>
                  Check Symptoms
                </button>
              </div>
            )}

            {!historyLoading && history.length > 0 && (
              <div className={styles.historyList}>
                {history.map(q => (
                  <div key={q._id} className={styles.historyCard}>
                    <button
                      className={styles.historyCardHeader}
                      onClick={() => setExpandedQuery(expandedQuery === q._id ? null : q._id)}
                    >
                      <div className={styles.historyCardLeft}>
                        <span className={styles.historyCardDate}>{formatDate(q.createdAt)}</span>
                        <p className={styles.historyCardSymptoms}>{q.symptoms}</p>
                      </div>
                      <span className={`${styles.chevron} ${expandedQuery === q._id ? styles.chevronOpen : ''}`}>›</span>
                    </button>
                    {expandedQuery === q._id && (
                      <div className={styles.historyCardBody}>
                        <div className={styles.aiWarningBanner}>
                          <strong>⚠ AI Disclaimer:</strong> This was AI-generated content for educational purposes only — not a medical diagnosis.
                        </div>
                        <ResultMarkdown text={q.result} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
