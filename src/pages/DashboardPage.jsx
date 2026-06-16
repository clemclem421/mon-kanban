// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import UserTable from '../components/UserTable';
import TaskList from '../components/TaskList';

export default function DashboardPage({ session }) {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('tasks');
  const [boardId, setBoardId] = useState(null);

  // 🆕 FONCTIONNALITÉ SUPPLÉMENTAIRE (US-10) : État pour mémoriser la priorité sélectionnée par l'utilisateur
  const [filterPriorite, setFilterPriorite] = useState('Tous');

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setUsers(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    supabase.from('boards').select('id').limit(1)
      .then(({ data }) => { if (data?.[0]) setBoardId(data[0].id); });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <header style={{ background: '#1A8C82', color: 'white',
        padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between' }}>
        <h1>🗂️ KanbanRT — Dashboard</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>{session.user.email}</span>
          <button onClick={handleLogout}
            style={{ background: 'white', color: '#1A8C82',
              border: 'none', padding: '0.5rem 1rem', borderRadius: '6px',
              cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </header>

      <main style={{ padding: '2rem' }}>
        {/* Onglets */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[['tasks', '📋 Tâches'], ['users', '👥 Utilisateurs']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '0.5rem 1rem', borderRadius: '6px', border: 'none',
              cursor: 'pointer',
              background: tab === key ? '#1A8C82' : '#E2E8F0',
              color: tab === key ? 'white' : '#1E293B',
              fontWeight: tab === key ? 700 : 400,
            }}>{label}</button>
          ))}
        </div>

        {/* Section de l'onglet Tâches */}
        {tab === 'tasks' && boardId && (
          <div>
            {/* 🆕 FONCTIONNALITÉ SUPPLÉMENTAIRE (US-10) : Menu déroulant pour le filtrage par priorité */}
            <div style={{
              background: 'white', padding: '1rem', borderRadius: '6px',
              border: '1px solid #E2E8F0', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem'
            }}>
              <label style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
                ⚠️ Filtrer par priorité :
              </label>
              <select
                value={filterPriorite}
                onChange={(e) => setFilterPriorite(e.target.value)}
                style={{
                  padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1',
                  background: '#F8FAFC', color: '#1E293B', cursor: 'pointer', outline: 'none'
                }}
              >
                <option value="Tous">Tous les niveaux</option>
                <option value="Basse">🟢 Basse</option>
                <option value="Moyenne">🟡 Moyenne</option>
                <option value="Haute">🔴 Haute</option>
              </select>
            </div>

            {/* 🆕 FONCTIONNALITÉ SUPPLÉMENTAIRE (US-10) : On transmet la variable de filtre au composant TaskList */}
            <TaskList boardId={boardId} filterPriorite={filterPriorite} />
          </div>
        )}

        {tab === 'tasks' && !boardId && (
          <p style={{ color: '#94A3B8' }}>Aucun tableau trouvé. Créez-en un via SQL Editor.</p>
        )}
        
        {tab === 'users' && (
          loading ? <p>Chargement...</p> : <UserTable users={users} onRefresh={fetchUsers} />
        )}
      </main>
    </div>
  );
}