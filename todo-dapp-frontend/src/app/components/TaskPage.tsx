// components/TaskPage.tsx
'use client'
import React, { useState } from 'react';
import TaskForm from './TaskForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TaskPage() {
  const handleTaskAdded = () => {
    // Refresh tasks or update UI
    console.log('Task added, refreshing...');
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">TodoList-Dapp</h1>
        <TaskForm onTaskAdded={handleTaskAdded} />
        <ToastContainer />
      </div>
    </main>
  );
}