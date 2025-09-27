import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { useExperiences, useEducation, useProjects, useContactMessages } from '../hooks/usePortfolioData';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface AdminFormData {
  type: 'experience' | 'education' | 'project';
  id?: string;
  [key: string]: any;
}

export const AdminPage = () => {
  const { experiences, setExperiences } = useExperiences();
  const { education, setEducation } = useEducation();
  const { projects, setProjects } = useProjects();
  const { messages, fetchMessages } = useContactMessages();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('experiences');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<AdminFormData>({ type: 'experience' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      setIsAuthenticated(true);
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const openModal = (type: AdminFormData['type'], item?: any) => {
    setFormData({
      type,
      ...item,
      technologies: item?.technologies || []
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ type: 'experience' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { type, id, ...data } = formData;
      const table = type === 'experience' ? 'experiences' : type === 'education' ? 'education' : 'projects';

      if (id) {
        // Update
        const { error } = await supabase
          .from(table)
          .update(data)
          .eq('id', id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from(table)
          .insert([data]);
        if (error) throw error;
      }

      // Refresh data
      if (type === 'experience') {
        const { data: newData } = await supabase.from('experiences').select('*').order('order_index');
        setExperiences(newData || []);
      } else if (type === 'education') {
        const { data: newData } = await supabase.from('education').select('*').order('order_index');
        setEducation(newData || []);
      } else if (type === 'project') {
        const { data: newData } = await supabase.from('projects').select('*').order('order_index');
        setProjects(newData || []);
      }

      closeModal();
    } catch (error) {
      alert('Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const table = type === 'experience' ? 'experiences' : type === 'education' ? 'education' : 'projects';
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;

      // Refresh data
      if (type === 'experience') {
        const { data: newData } = await supabase.from('experiences').select('*').order('order_index');
        setExperiences(newData || []);
      } else if (type === 'education') {
        const { data: newData } = await supabase.from('education').select('*').order('order_index');
        setEducation(newData || []);
      } else if (type === 'project') {
        const { data: newData } = await supabase.from('projects').select('*').order('order_index');
        setProjects(newData || []);
      }
    } catch (error) {
      alert('Failed to delete. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center py-20">
        <motion.div
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/10 rounded-xl p-8 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                data-cursor="text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                data-cursor="text"
              />
            </div>
            <motion.button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-cursor="pointer"
            >
              Login
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <motion.button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            data-cursor="pointer"
          >
            Logout
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
            {['experiences', 'education', 'projects', 'messages'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                data-cursor="pointer"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {activeTab !== 'messages' && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>
              <motion.button
                onClick={() => openModal(activeTab as AdminFormData['type'])}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                data-cursor="pointer"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add New
              </motion.button>
            </div>
          )}

          {/* Experiences */}
          {activeTab === 'experiences' && (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-gray-700/50 rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                    <p className="text-gray-300">{exp.company} • {exp.duration}</p>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{exp.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal('experience', exp)}
                      className="p-2 text-gray-400 hover:text-white"
                      data-cursor="pointer"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete('experience', exp.id)}
                      className="p-2 text-red-400 hover:text-red-300"
                      data-cursor="pointer"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="bg-gray-700/50 rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                    <p className="text-gray-300">{edu.school_name} • {edu.duration}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                      edu.type === 'education' 
                        ? 'bg-blue-400/20 text-blue-300' 
                        : 'bg-orange-400/20 text-orange-300'
                    }`}>
                      {edu.type}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal('education', edu)}
                      className="p-2 text-gray-400 hover:text-white"
                      data-cursor="pointer"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete('education', edu.id)}
                      className="p-2 text-red-400 hover:text-red-300"
                      data-cursor="pointer"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-700/50 rounded-lg p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                      {project.featured && (
                        <span className="bg-yellow-400/20 text-yellow-300 px-2 py-1 text-xs rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-2">{project.description}</p>
                    <div className="flex space-x-2">
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-400 hover:text-blue-300 text-sm">
                          Live Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" 
                           className="text-gray-400 hover:text-gray-300 text-sm">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal('project', project)}
                      className="p-2 text-gray-400 hover:text-white"
                      data-cursor="pointer"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete('project', project.id)}
                      className="p-2 text-red-400 hover:text-red-300"
                      data-cursor="pointer"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Messages */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Messages</h2>
              {messages.map((message) => (
                <div key={message.id} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{message.subject}</h3>
                    <span className="text-gray-400 text-sm">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-2">From: {message.name} ({message.email})</p>
                  <p className="text-gray-400">{message.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {formData.id ? 'Edit' : 'Add New'} {formData.type}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formData.type === 'experience' && (
                <>
                  <input
                    type="text"
                    placeholder="Role"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white h-32"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma-separated)"
                    value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : ''}
                    onChange={(e) => setFormData({...formData, technologies: e.target.value.split(',').map(t => t.trim())})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </>
              )}

              {formData.type === 'education' && (
                <>
                  <input
                    type="text"
                    placeholder="Degree/Certification"
                    value={formData.degree || ''}
                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="School/Institution"
                    value={formData.school_name || ''}
                    onChange={(e) => setFormData({...formData, school_name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                  <select
                    value={formData.type || 'education'}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="education">Education</option>
                    <option value="certification">Certification</option>
                  </select>
                  <textarea
                    placeholder="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white h-32"
                  />
                </>
              )}

              {formData.type === 'project' && (
                <>
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white h-32"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma-separated)"
                    value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : ''}
                    onChange={(e) => setFormData({...formData, technologies: e.target.value.split(',').map(t => t.trim())})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                  <input
                    type="url"
                    placeholder="Live URL"
                    value={formData.live_url || ''}
                    onChange={(e) => setFormData({...formData, live_url: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                  <input
                    type="url"
                    placeholder="GitHub URL"
                    value={formData.github_url || ''}
                    onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="mr-2"
                    />
                    Featured Project
                  </label>
                </>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 transition-colors"
                  data-cursor="pointer"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  data-cursor="pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
