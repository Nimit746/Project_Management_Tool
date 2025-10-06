import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, MoreVertical } from 'lucide-react';

const ProjectList = ({ onProjectSelect, onCreateProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <button
          onClick={onCreateProject}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div
                  onClick={() => onProjectSelect(project)}
                  className="flex-1"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(showMenu === project.id ? null : project.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                  {showMenu === project.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Delete Project
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{project.teamMembers?.length || 0} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{project.progress || 0}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No projects yet</p>
          <button
            onClick={onCreateProject}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectList;