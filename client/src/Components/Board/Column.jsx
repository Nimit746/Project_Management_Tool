/* eslint-disable no-unused-vars */
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const Column = ({ column, tasks, onCreateTask, onEditTask, onDeleteTask }) => {
  const getColumnColor = (columnId) => {
    switch (columnId) {
      case 'todo':
        return 'border-blue-500';
      case 'inprogress':
        return 'border-yellow-500';
      case 'done':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };

  const getColumnBg = (columnId) => {
    switch (columnId) {
      case 'todo':
        return 'bg-blue-50';
      case 'inprogress':
        return 'bg-yellow-50';
      case 'done':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="flex flex-col min-w-[320px] max-w-[320px] bg-white rounded-lg shadow-sm border-t-4 ${getColumnColor(column.id)}">
      <div className={`p-4 rounded-t-lg ${getColumnBg(column.id)}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {column.title}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({tasks.length})
            </span>
          </h3>
          <button
            onClick={() => onCreateTask(column.id)}
            className="p-1 hover:bg-white rounded-md transition-colors"
            title="Add task"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 overflow-y-auto min-h-[200px] ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            }`}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                No tasks yet
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onEdit={onEditTask}
                    onDelete={() => onDeleteTask(task.id, column.id)}
                  />
                ))}
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;