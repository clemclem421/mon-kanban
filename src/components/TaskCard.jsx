const PRIORITY_COLORS = { 
  high:   { bg: '#FEF2F2', border: '#DC2626', label: '🔴 Haute' }, 
  medium: { bg: '#FFFBEB', border: '#F59E0B', label: '🟡 Moyenne' }, 
  low:    { bg: '#F0FDF4', border: '#16A34A', label: '🟢 Basse' }, 
}; 
// Libellés selon le statut 
const STATUS_LABELS = { 
  todo:        { label: '📋 À faire',    color: '#64748B' }, 
  in_progress: { label: '⚙ En cours',   color: '#3B82F6' }, 
  review:      { label: '👀 Validation', color: '#F59E0B' }, 
  done:        { label: '✅ Terminée',   color: '#16A34A' }, 
}; 
export default function TaskCard({ task, onDelete }) { 
  const priority = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.low; 
  const status   = STATUS_LABELS[task.status]     || STATUS_LABELS.todo; 
  // Formater la date d'échéance 
  const dueLabel = task.due_date 
    ? new Date(task.due_date).toLocaleDateString('fr-FR', { 
        day: '2-digit', month: 'short', year: 'numeric' 
      }) 
    : null; 
  // Vérifier si la tâche est en retard 
  const isOverdue = task.due_date && 
    new Date(task.due_date) < new Date() && 
    task.status !== 'done'; 
  return ( 
    <div style={{ 
      background: priority.bg, 
      border: `2px solid ${priority.border}`, 
      borderRadius: '10px', 
      padding: '1rem', 
      marginBottom: '0.75rem', 
      boxShadow: '0 2px 6px rgba(0,0,0,0.07)', 
      transition: 'transform 0.15s', 
    }}> 
      {/* En-tête : titre + bouton supprimer */} 
      <div style={{ display: 'flex', justifyContent: 'space-between', 
                    alignItems: 'flex-start', gap: '0.5rem' }}> 
        <h3 style={{ margin: 0, fontSize: '1rem', color: '#1E293B' }}> 
          {task.title} 
        </h3> 
        <button onClick={() => onDelete(task.id)} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', 
                   color: '#94A3B8', fontSize: '1.1rem', padding: '0' }}> 
          ✕ 
        </button> 
      </div> 
      {/* Description */} 
      {task.description && ( 
        <p style={{ margin: '0.5rem 0', color: '#64748B', 
                    fontSize: '0.875rem', lineHeight: '1.4' }}> 
          {task.description} 
        </p> 
      )} 
      {/* Badges */} 
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', 
                    marginTop: '0.75rem', alignItems: 'center' }}> 
        {/* Statut */} 
        <span style={{ fontSize: '0.75rem', fontWeight: 600, 
          color: status.color, background: 'rgba(0,0,0,0.05)', 
          padding: '0.2rem 0.5rem', borderRadius: '999px' }}> 
          {status.label} 
        </span> 
        {/* Priorité */} 
        <span style={{ fontSize: '0.75rem', fontWeight: 600, 
          color: priority.border, background: 'rgba(0,0,0,0.05)', 
          padding: '0.2rem 0.5rem', borderRadius: '999px' }}> 
          {priority.label} 
        </span> 
        {/* Catégorie */} 
        {task.categories && ( 
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', 
            borderRadius: '999px', background: task.categories.color + '33', 
            color: task.categories.color, fontWeight: 600 }}> 
            🏷 {task.categories.name} 
          </span> 
        )} 
        {/* Date d'échéance */} 
        {dueLabel && ( 
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', 
            borderRadius: '999px', background: isOverdue ? '#FEE2E2' : 
'#F1F5F9', 
            color: isOverdue ? '#DC2626' : '#64748B', fontWeight: 600 }}> 
            📅 {isOverdue ? '⚠ ' : ''}{dueLabel} 
          </span> 
        )} 
      </div> 
    </div> 
  ); 
}