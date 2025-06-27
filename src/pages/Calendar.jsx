import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const TASKS_KEY = 'kanbanTasks';
const statuses = ['To Do', 'In Progress', 'Testing', 'Done'];

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('To Do');
  const [events, setEvents] = useState({});

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
    const grouped = storedTasks.reduce((acc, task) => {
      const key = task.date;
      acc[key] = acc[key] ? [...acc[key], task] : [task];
      return acc;
    }, {});
    setEvents(grouped);
  }, []);

  const handleAdd = () => {
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      summary: input.trim(),
      status,
      date: date.toDateString(),
    };

    const storedTasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
    const updatedTasks = [...storedTasks, newTask];
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    setInput('');
    setEvents((prev) => ({
      ...prev,
      [newTask.date]: [...(prev[newTask.date] || []), newTask],
    }));
  };

  const handleDelete = (id) => {
    const storedTasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
    const updatedTasks = storedTasks.filter((t) => t.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    setEvents((prev) => {
      const filtered = (prev[date.toDateString()] || []).filter((t) => t.id !== id);
      return { ...prev, [date.toDateString()]: filtered };
    });
  };

  const currentEvents = events[date.toDateString()] || [];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">📅 Calendar</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Calendar onChange={setDate} value={date} />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Events for {date.toDateString()}
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add task"
                className="flex-grow p-2 border rounded"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-2 border rounded"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {currentEvents.length === 0 ? (
                <li className="text-gray-500">No events yet.</li>
              ) : (
                currentEvents.map((evt) => (
                  <li
                    key={evt.id}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded"
                  >
                    <span>
                      <span className="font-semibold">{evt.status}:</span> {evt.summary}
                    </span>
                    <button
                      onClick={() => handleDelete(evt.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ❌
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
