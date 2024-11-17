/**
 * Formats project status for display
 */
export const formatProjectStatus = (status) => {
  if (!status) return 'Unknown';
  
  const statusMap = {
    open: 'Open',
    in_progress: 'In Progress',
    completed: 'Completed'
  };

  const normalizedStatus = status.toLowerCase();
  return statusMap[normalizedStatus] || 'Unknown';
};

/**
 * Validates project data
 */
export const validateProject = (project) => {
  const errors = {};

  if (!project.title?.trim()) {
    errors.title = 'Title is required';
  } else if (project.title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  if (!project.description?.trim()) {
    errors.description = 'Description is required';
  }

  if (!Array.isArray(project.required_skills) || project.required_skills.length === 0) {
    errors.required_skills = 'At least one required skill is needed';
  }

  if (!project.time_commitment?.trim()) {
    errors.time_commitment = 'Time commitment is required';
  }

  if (!project.location?.trim()) {
    errors.location = 'Location is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sorts projects based on different criteria
 */
export const sortProjects = (projects, sortKey) => {
  if (!Array.isArray(projects)) return [];

  const sorters = {
    date: (a, b) => new Date(b.created_at) - new Date(a.created_at),
    status: (a, b) => {
      const statusOrder = { open: 0, in_progress: 1, completed: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
  };

  const sorter = sorters[sortKey];
  if (!sorter) return projects;

  return [...projects].sort(sorter);
};

/**
 * Filters projects based on multiple criteria
 */
export const filterProjects = (projects, filters) => {
  if (!Array.isArray(projects)) return [];

  return projects.filter(project => {
    // Status filter
    if (filters.status && project.status !== filters.status) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Skills filter
    if (Array.isArray(filters.skills) && filters.skills.length > 0) {
      const projectSkills = project.required_skills.map(s => s.toLowerCase());
      const searchSkills = filters.skills.map(s => s.toLowerCase());
      const hasRequiredSkill = searchSkills.some(skill => projectSkills.includes(skill));
      if (!hasRequiredSkill) return false;
    }

    return true;
  });
};

/**
 * Calculates project progress percentage
 */
export const calculateProjectProgress = (project) => {
  if (project.status === 'completed') return 100;
  if (project.status === 'open') return 0;
  
  if (!Array.isArray(project.milestones) || project.milestones.length === 0) {
    return 0;
  }

  const completedMilestones = project.milestones.filter(m => m.completed).length;
  return Math.round((completedMilestones / project.milestones.length) * 100);
};

/**
 * Formats project duration
 */
export const formatProjectDuration = (duration, unit) => {
  if (!duration || duration < 0) return 'Unknown duration';

  if (unit === 'weeks') {
    return `${duration} ${duration === 1 ? 'week' : 'weeks'}`;
  }

  if (unit === 'months') {
    return `${duration} ${duration === 1 ? 'month' : 'months'}`;
  }

  return 'Unknown duration';
};

/**
 * Parses comma-separated skills list into array
 */
export const parseSkillsList = (skillsString) => {
  if (!skillsString) return [];

  return skillsString
    .split(',')
    .map(skill => skill.trim())
    .filter(Boolean);
};

/**
 * Validates volunteer requirements against project needs
 */
export const validateVolunteerRequirements = (project, volunteer) => {
  if (!project || !volunteer) {
    throw new Error('Project and volunteer data are required');
  }

  const missingSkills = project.required_skills.filter(
    skill => !volunteer.skills.includes(skill)
  );

  const projectHours = parseInt(project.time_commitment);
  const volunteerHours = parseInt(volunteer.availability);
  const insufficientTime = volunteerHours < projectHours;

  return {
    isValid: missingSkills.length === 0 && !insufficientTime,
    missingSkills,
    insufficientTime
  };
};
