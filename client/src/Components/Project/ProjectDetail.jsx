import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Calendar, Settings, Plus } from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import TaskModal from './TaskModal';
import TeamManagement from './TeamManagement';

const ProjectDetail = ({ project, onBack, socket }) => {
  const [activeTab, setActiveTab] = useState('board');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [projectStats, setProjectStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0
  });

  useEffect(() => {
    fetchTeamMembers();
    fetchProjectStats();
  }, [project.id]);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}/team`);
      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchProjectStats = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}/stats`);
      const data = await response.json();
      setProjectStats(data);
    } catch (error) {
      console.error('Error fetching project stats:', error);
    }
  };

  const handleTaskSave = (task) => {
    fetchProjectStats();
    setShowTaskModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
              <p className="text-gray-600 text-sm mt-1">{project.description}</p>
            </div>
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              New Task
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {projectStats.totalTasks}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600 font-medium">To Do</p>
              <p className="text-2xl font-bold text-yellow-700 mt-1">
                {projectStats.todoTasks}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">In Progress</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">
                {projectStats.inProgressTasks}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {projectStats.completedTasks}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'board'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'team'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Users size={18} />
              Team
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Settings size={18} />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'board' && (
          <KanbanBoard projectId={project.id} socket={socket} />
        )}
        {activeTab === 'team' && (
          <TeamManagement
            projectId={project.id}
            teamMembers={teamMembers}
            onMembersChange={fetchTeamMembers}
          />
        )}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Project Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  defaultValue={project.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  defaultValue={project.description}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleTaskSave}
        projectId={project.id}
        teamMembers={teamMembers}
      />
    </div>
  );
};

export default ProjectDetail;