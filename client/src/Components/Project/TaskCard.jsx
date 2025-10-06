import React, { useState } from 'react';
import { MoreVertical, Calendar, User, Flag, Edit, Trash2, MessageSquare } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onClick }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.status !== 'done';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-gray-800 flex-1 line-clamp-2 pr-2">
          {task.title}
        </h4>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical size={16} className="text-gray-600" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap mb-3">
        {task.priority && (
          <span
            className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 border ${getPriorityColor(
              task.priority
            )}`}
          >
            <Flag size={12} />
            {task.priority}
          </span>
        )}

        {task.dueDate && (
          <span
            className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${
              isOverdue(task.dueDate)
                ? 'text-red-600 bg-red-50 font-medium'
                : 'text-gray-600 bg-gray-50'
            }`}
          >
            <Calendar size={12} />
            {formatDate(task.dueDate)}
          </span>
        )}

        {task.commentCount > 0 && (
          <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded flex items-center gap-1">
            <MessageSquare size={12} />
            {task.commentCount}
          </span>
        )}
      </div>

      {task.assignee && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {task.assignee.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-700">{task.assignee.name}</span>
        </div>
      )}

      {task.tags && task.tags.length > 0 && (
        <div className="flex gap-1 mt-3 flex-wrap">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;