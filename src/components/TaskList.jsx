// src/components/TaskList.jsx 
import { useState, useEffect } from 'react'; 
import { supabase } from '../lib/supabase'; 
import TaskCard from './TaskCard'; 
import TaskForm from './TaskForm'; 

// 🆕 FONCTIONNALITÉ SUPPLÉMENTAIRE (US-10) : Récupération du filtre via les props
export default function TaskList({ boardId, filterPriorite }) { 
  const [tasks, setTasks]   = useState([]); 
  const [loading, setLoading] = useState(true); 

  async function fetchTasks() { 
    setLoading(true); 
    const { data, error } = await supabase 
      .from('tasks') 
      .select('*, categories(*)')   // jointure automatique ! 
      .eq('board_id', boardId) 
      .order('created_at', { ascending: false }); 
    if (!error) setTasks(data || []); 
    setLoading(false); 
  } 

  useEffect(() => { fetchTasks(); }, [boardId]); 

  async function handleDelete(taskId) { 
    if (!confirm('Supprimer cette tâche ?')) return; 
    await supabase.from('tasks').delete().eq('id', taskId); 
    fetchTasks(); 
  } 

  // 🆕 FONCTIONNALITÉ SUPPLÉMENTAIRE (US-10) : Filtrage des tâches avec traduction BDD (low/medium/high)
  const tachesFiltrees = tasks.filter(task => {
    // Si l'utilisateur demande à tout afficher
    if (!filterPriorite || filterPriorite === 'Tous') return true;

    // Sécurité au cas où une tâche n'ait pas de priorité renseignée
    if (!task.priority) return false;

    // Correspondance entre le choix de l'interface (Français) et la valeur en BDD (Anglais/Minuscule)
    let prioriteBDD = task.priority.toLowerCase();

    if (filterPriorite === 'Basse' && prioriteBDD === 'low') return true;
    if (filterPriorite === 'Moyenne' && prioriteBDD === 'medium') return true;
    if (filterPriorite === 'Haute' && prioriteBDD === 'high') return true;

    // Au cas où tu aurais saisi manuellement "Basse", "Moyenne" ou "Haute" directement dans Supabase
    if (filterPriorite.toLowerCase() === prioriteBDD) return true;

    return false;
  });

  if (loading) return <p>Chargement des tâches...</p>; 

  return ( 
    <div> 
      <TaskForm boardId={boardId} onCreated={fetchTasks} /> 

      {/* 🆕 FONCTIONNALITÉ SUPPLÉMENTAIRE (US-10) : Affichage du compteur de tâches trouvées */}
      <div style={{ margin: '1rem 0', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>
        📊 Affichage de <span style={{ background: '#1A8C82', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '12px', fontWeight: 'bold' }}>{tachesFiltrees.length}</span> tâche(s) sur {tasks.length} au total.
      </div>

      <div style={{ display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '0.75rem' }}> 
        {/* On boucle sur tachesFiltrees au lieu de tasks */}
        {tachesFiltrees.map(task => ( 
          <TaskCard key={task.id} task={task} onDelete={handleDelete} /> 
        ))} 
      </div> 

      {/* Gestion des messages si vide */}
      {tasks.length === 0 && ( 
        <p style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}> 
          Aucune tâche — créez-en une ci-dessus ! 🚀 
        </p> 
      )} 

      {tasks.length > 0 && tachesFiltrees.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem', fontStyle: 'italic' }}>
          Aucune tâche ne possède la priorité "{filterPriorite}". 🔍
        </p>
      )}
    </div> 
  ); 
}