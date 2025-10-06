import React from 'react';
import { ArrowLeft, Settings, Share2, MoreVertical } from 'lucide-react';

const ProjectHeader = ({ 
  project, 
  onBack, 
  onSettings, 
  onShare 
}) => {
  const calculateProgress = () => {
    if (!project.totalTasks || project.totalTasks === 0) return 0;
    return Math.round((project.completedTasks / project.totalTasks) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back to projects"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {project.name}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {project.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 size={18} />
              Share
            </button>
            <button
              onClick={onSettings}
              className="p-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Project Progress
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Total Tasks:</span>
            <span className="font-semibold text-gray-800">
              {project.totalTasks || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Completed:</span>
            <span className="font-semibold text-green-600">
              {project.completedTasks || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">In Progress:</span>
            <span className="font-semibold text-blue-600">
              {project.inProgressTasks || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Team Members:</span>
            <span className="font-semibold text-gray-800">
              {project.teamMembers?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;