'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { createMockProject } from '@/services/mock/mock';
import { toastSuccess } from '@/components/toast/toaster';

type ProjectFormProps = {
  onProjectCreated?: (project: Project) => void;
};

export default function ProjectForm({ onProjectCreated }: ProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('default');
  const [state, setState] = useState<0 | 1 | 2>(0);

  // Simulate current user; in a real app you'd use `useSession()` to get this.
  const mockAdminId = 'admin123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Project name is required.');

    let project = createMockProject(name); // id = name in mock by default

    // Manually set other fields based on form input
    project = {
      ...project,
      name,
      description,
      theme,
      state,
      admin: mockAdminId,
      createdAt: new Date(),
    };

    toastSuccess(`Project "${name}" created successfully!`);
    onProjectCreated?.(project); // update parent
    setName('');
    setDescription('');
    setTheme('default');
    setState(0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4 bg-gray-900 p-6 rounded-lg"
    >
      <h2 className="text-xl font-bold text-white">Create New Project</h2>

      <div className="flex flex-col gap-1">
        <label className="text-gray-300">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-box"
          placeholder="Enter project name"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="input-box"
          placeholder="Brief description"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-300">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="input-box"
        >
          <option value="default">Default</option>
          <option value="blue">Ocean Blue</option>
          <option value="green">Forest Green</option>
          <option value="orange">Sunset Orange</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-300">State</label>
        <select
          value={state}
          onChange={(e) => setState(parseInt(e.target.value) as 0 | 1 | 2)}
          className="input-box"
        >
          <option value={0}>Not Started</option>
          <option value={1}>In Progress</option>
          <option value={2}>Completed</option>
        </select>
      </div>

      <button type="submit" className="button-3 self-start">
        Create Project
      </button>
    </form>
  );
}