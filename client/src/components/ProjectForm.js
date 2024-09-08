import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectForm = ({ project, onSubmit }) => {
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [requiredSkills, setRequiredSkills] = useState(project?.required_skills?.join(', ') || '');
  const [timeCommitment, setTimeCommitment] = useState(project?.time_commitment || '');
  const [location, setLocation] = useState(project?.location || '');
  const [errors, setErrors] = useState({});

  const [categoryId, setCategoryId] = useState(project?.category_id || '');
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!requiredSkills.trim()) newErrors.requiredSkills = 'At least one skill is required';
    if (!timeCommitment.trim()) newErrors.timeCommitment = 'Time commitment is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const projectData = {
        title,
        description,
        required_skills: requiredSkills.split(',').map(skill => skill.trim()),
        time_commitment: timeCommitment,
        location,
        category_id: categoryId
      };
      await onSubmit(projectData);
      navigate('/projects');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block mb-2">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="requiredSkills" className="block mb-2">Required Skills (comma-separated)</label>
        <input
          type="text"
          id="requiredSkills"
          value={requiredSkills}
          onChange={(e) => setRequiredSkills(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.requiredSkills && <p className="text-red-500 text-sm mt-1">{errors.requiredSkills}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="timeCommitment" className="block mb-2">Time Commitment</label>
        <input
          type="text"
          id="timeCommitment"
          value={timeCommitment}
          onChange={(e) => setTimeCommitment(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.timeCommitment && <p className="text-red-500 text-sm mt-1">{errors.timeCommitment}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="location" className="block mb-2">Location</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block mb-2">Category</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        {project ? 'Update Project' : 'Create Project'}
      </button>
    </form>
  );
};

export default ProjectForm;
