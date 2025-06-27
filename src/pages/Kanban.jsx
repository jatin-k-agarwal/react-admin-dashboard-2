import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';

const TASKS_KEY = 'kanbanTasks';
const statuses = ['To Do', 'In Progress', 'Testing', 'Done'];
const priorities = ['Low', 'Medium', 'High'];
const priorityColors = {
  Low: 'bg-green-200 text-green-800',
  Medium: 'bg-yellow-200 text-yellow-800',
  High: 'bg-red-200 text-red-800',
};

export default function KanbanPage() {
  const [tasks, setTasks] = useState({});
  const [newSummary, setNewSummary] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [selected, setSelected] = useState([]);

  const sensors = useSensors(useSensor(PointerSensor));

  // Load tasks
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
    setTasks(group(stored));
  }, []);

  // Persist tasks
  const persist = (grouped) => {
    setTasks(grouped);
    const flat = Object.values(grouped).flat();
    localStorage.setItem(TASKS_KEY, JSON.stringify(flat));
  };

  const group = (arr) => statuses.reduce((acc, s) => {
    acc[s] = arr.filter((t) => t.status === s);
    return acc;
  }, {});

  const handleAdd = () => {
    if (!newSummary.trim()) return;
    const task = {
      id: uuidv4(),
      summary: newSummary,
      status: 'To Do',
      priority: newPriority,
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    const updated = { ...tasks, 'To Do': [task, ...(tasks['To Do'] || [])] };
    persist(updated);
    setNewSummary('');
  };

  const handleEdit = (id, status, text) => {
    const updated = {
      ...tasks,
      [status]: tasks[status].map((t) =>
        t.id === id ? { ...t, summary: text } : t
      ),
    };
    persist(updated);
    setEditingId(null);
  };

  const handlePriorityChange = (id, status, prio) => {
    const updated = {
      ...tasks,
      [status]: tasks[status].map((t) =>
        t.id === id ? { ...t, priority: prio } : t
      ),
    };
    persist(updated);
  };

  const handleDueChange = (id, status, date) => {
    const updated = {
      ...tasks,
      [status]: tasks[status].map((t) =>
        t.id === id ? { ...t, dueDate: date } : t
      ),
    };
    persist(updated);
  };

  const handleStatusChange = (id, oldStatus, newStatus) => {
    const moving = tasks[oldStatus].find((t) => t.id === id);
    const source = tasks[oldStatus].filter((t) => t.id !== id);
    const dest = [...(tasks[newStatus] || []), { ...moving, status: newStatus }];
    persist({ ...tasks, [oldStatus]: source, [newStatus]: dest });
  };

  const handleDelete = () => {
    const flat = Object.values(tasks)
      .flat()
      .filter((t) => !selected.includes(t.id));
    persist(group(flat));
    setSelected([]);
  };

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    let srcStatus, tgtStatus, srcIdx, tgtIdx;

    for (const s of statuses) {
      const list = tasks[s] || [];
      srcIdx = list.findIndex((t) => t.id === active.id);
      if (srcIdx > -1) srcStatus = s;
      tgtIdx = list.findIndex((t) => t.id === over.id);
      if (tgtIdx > -1) tgtStatus = s;
    }
    if (!srcStatus || !tgtStatus) return;

    if (srcStatus === tgtStatus) {
      const lst = tasks[srcStatus];
      const ordered = arrayMove(lst, srcIdx, tgtIdx);
      persist({ ...tasks, [srcStatus]: ordered });
    } else {
      handleStatusChange(active.id, srcStatus, tgtStatus);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="New task summary"
          value={newSummary}
          onChange={(e) => setNewSummary(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
        >
          {priorities.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Task
        </button>
        {selected.length > 0 && (
          <button
            onClick={handleDelete}
            className="px-4 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Selected
          </button>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statuses.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks[status] || []}
              selected={selected}
              setSelected={setSelected}
              editingId={editingId}
              setEditingId={setEditingId}
              editingText={editingText}
              setEditingText={setEditingText}
              onEdit={handleEdit}
              onPriority={handlePriorityChange}
              onDue={handleDueChange}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function Column({
  status,
  tasks,
  selected,
  setSelected,
  editingId,
  setEditingId,
  editingText,
  setEditingText,
  onEdit,
  onPriority,
  onDue,
}) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold mb-4">{status}</h2>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            selected={selected}
            setSelected={setSelected}
            isEditing={editingId === t.id}
            editingText={editingText}
            setEditingId={setEditingId}
            setEditingText={setEditingText}
            onEdit={onEdit}
            onPriority={onPriority}
            onDue={onDue}
          />
        ))}
      </SortableContext>
    </div>
  );
}

function TaskCard({
  task,
  selected,
  setSelected,
  isEditing,
  editingText,
  setEditingId,
  setEditingText,
  onEdit,
  onPriority,
  onDue,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border rounded p-3 mb-3 bg-gray-50 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <input
          type="checkbox"
          checked={selected.includes(task.id)}
          onChange={(e) => {
            const updated = e.target.checked
              ? [...selected, task.id]
              : selected.filter((id) => id !== task.id);
            setSelected(updated);
          }}
        />
        {isEditing ? (
          <input
            className="flex-1 mx-2 p-1 border rounded"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onBlur={() => onEdit(task.id, task.status, editingText)}
            onKeyDown={(e) => e.key === 'Enter' && onEdit(task.id, task.status, editingText)}
            autoFocus
          />
        ) : (
          <span
            className="flex-1 mx-2 cursor-pointer hover:underline"
            onClick={() => {
              setEditingId(task.id);
              setEditingText(task.summary);
            }}
          >
            {task.summary}
          </span>
        )}
      </div>

      <div className="mt-2 flex justify-between items-center">
        <select
          value={task.priority}
          className={`px-2 py-1 rounded text-sm ${priorityColors[task.priority]}`}
          onChange={(e) => onPriority(task.id, task.status, e.target.value)}
        >
          {priorities.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <input
          type="date"
          value={task.dueDate}
          className="text-sm border rounded px-1"
          onChange={(e) => onDue(task.id, task.status, e.target.value)}
        />
      </div>
    </div>
  );
}
