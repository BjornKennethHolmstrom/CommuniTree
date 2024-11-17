import { 
  formatProjectStatus, 
  validateProject, 
  sortProjects,
  filterProjects,
  calculateProjectProgress,
  formatProjectDuration,
  parseSkillsList,
  validateVolunteerRequirements
} from '../utils/projectUtils';

describe('Project Utilities', () => {
  describe('formatProjectStatus', () => {
    test('formats open status', () => {
      expect(formatProjectStatus('open')).toBe('Open');
      expect(formatProjectStatus('OPEN')).toBe('Open');
    });

    test('formats in_progress status', () => {
      expect(formatProjectStatus('in_progress')).toBe('In Progress');
      expect(formatProjectStatus('IN_PROGRESS')).toBe('In Progress');
    });

    test('formats completed status', () => {
      expect(formatProjectStatus('completed')).toBe('Completed');
      expect(formatProjectStatus('COMPLETED')).toBe('Completed');
    });

    test('handles invalid status', () => {
      expect(formatProjectStatus('invalid')).toBe('Unknown');
      expect(formatProjectStatus('')).toBe('Unknown');
      expect(formatProjectStatus(null)).toBe('Unknown');
    });
  });

  describe('validateProject', () => {
    const validProject = {
      title: 'Test Project',
      description: 'Test Description',
      required_skills: ['React'],
      time_commitment: '10 hours/week',
      location: 'Remote'
    };

    test('validates valid project', () => {
      const result = validateProject(validProject);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('validates missing required fields', () => {
      const result = validateProject({});
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('title');
      expect(result.errors).toHaveProperty('description');
      expect(result.errors).toHaveProperty('required_skills');
    });

    test('validates field lengths', () => {
      const longTitle = 'a'.repeat(101);
      const result = validateProject({
        ...validProject,
        title: longTitle
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeTruthy();
    });

    test('validates skill requirements', () => {
      const result = validateProject({
        ...validProject,
        required_skills: []
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.required_skills).toBeTruthy();
    });
  });

  describe('sortProjects', () => {
    const projects = [
      { id: 1, created_at: '2024-01-01', status: 'open' },
      { id: 2, created_at: '2024-01-02', status: 'completed' },
      { id: 3, created_at: '2024-01-03', status: 'in_progress' }
    ];

    test('sorts by date created', () => {
      const sorted = sortProjects(projects, 'date');
      expect(sorted[0].id).toBe(3);
      expect(sorted[2].id).toBe(1);
    });

    test('sorts by status', () => {
      const sorted = sortProjects(projects, 'status');
      expect(sorted[0].status).toBe('open');
      expect(sorted[2].status).toBe('completed');
    });

    test('handles invalid sort key', () => {
      const sorted = sortProjects(projects, 'invalid');
      expect(sorted).toEqual(projects);
    });
  });

  describe('filterProjects', () => {
    const projects = [
      { id: 1, title: 'React Project', status: 'open', required_skills: ['React'] },
      { id: 2, title: 'Node Project', status: 'completed', required_skills: ['Node.js'] },
      { id: 3, title: 'Full Stack', status: 'in_progress', required_skills: ['React', 'Node.js'] }
    ];

    test('filters by status', () => {
      const filtered = filterProjects(projects, { status: 'open' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe(1);
    });

    test('filters by search term', () => {
      const filtered = filterProjects(projects, { searchTerm: 'React' });
      expect(filtered).toHaveLength(2);
    });

    test('filters by required skills', () => {
      const filtered = filterProjects(projects, { skills: ['Node.js'] });
      expect(filtered).toHaveLength(2);
    });

    test('combines multiple filters', () => {
      const filtered = filterProjects(projects, {
        status: 'in_progress',
        skills: ['React']
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe(3);
    });
  });

  describe('calculateProjectProgress', () => {
    test('calculates progress for new project', () => {
      const progress = calculateProjectProgress({ status: 'open', milestones: [] });
      expect(progress).toBe(0);
    });

    test('calculates progress based on completed milestones', () => {
      const project = {
        status: 'in_progress',
        milestones: [
          { completed: true },
          { completed: true },
          { completed: false },
          { completed: false }
        ]
      };
      expect(calculateProjectProgress(project)).toBe(50);
    });

    test('returns 100 for completed projects', () => {
      const progress = calculateProjectProgress({ status: 'completed' });
      expect(progress).toBe(100);
    });
  });

  describe('formatProjectDuration', () => {
    test('formats duration in weeks', () => {
      expect(formatProjectDuration(2, 'weeks')).toBe('2 weeks');
      expect(formatProjectDuration(1, 'weeks')).toBe('1 week');
    });

    test('formats duration in months', () => {
      expect(formatProjectDuration(3, 'months')).toBe('3 months');
      expect(formatProjectDuration(1, 'months')).toBe('1 month');
    });

    test('handles invalid duration', () => {
      expect(formatProjectDuration(-1, 'weeks')).toBe('Unknown duration');
      expect(formatProjectDuration(null, 'months')).toBe('Unknown duration');
    });
  });

  describe('parseSkillsList', () => {
    test('parses comma-separated skills', () => {
      expect(parseSkillsList('React, Node.js, TypeScript')).toEqual(['React', 'Node.js', 'TypeScript']);
    });

    test('handles whitespace', () => {
      expect(parseSkillsList(' React,Node.js ,  TypeScript  ')).toEqual(['React', 'Node.js', 'TypeScript']);
    });

    test('removes empty skills', () => {
      expect(parseSkillsList('React,, Node.js,')).toEqual(['React', 'Node.js']);
    });

    test('handles empty input', () => {
      expect(parseSkillsList('')).toEqual([]);
      expect(parseSkillsList(null)).toEqual([]);
    });
  });

  describe('validateVolunteerRequirements', () => {
    const project = {
      required_skills: ['React', 'Node.js'],
      time_commitment: '10 hours/week'
    };

    const volunteer = {
      skills: ['React', 'Node.js', 'TypeScript'],
      availability: '15 hours/week'
    };

    test('validates matching requirements', () => {
      const result = validateVolunteerRequirements(project, volunteer);
      expect(result.isValid).toBe(true);
      expect(result.missingSkills).toHaveLength(0);
    });

    test('identifies missing skills', () => {
      const result = validateVolunteerRequirements(project, {
        ...volunteer,
        skills: ['React']
      });
      expect(result.isValid).toBe(false);
      expect(result.missingSkills).toContain('Node.js');
    });

    test('validates time commitment', () => {
      const result = validateVolunteerRequirements(project, {
        ...volunteer,
        availability: '5 hours/week'
      });
      expect(result.isValid).toBe(false);
      expect(result.insufficientTime).toBe(true);
    });

    test('handles invalid input', () => {
      expect(() => validateVolunteerRequirements(null, volunteer)).toThrow();
      expect(() => validateVolunteerRequirements(project, null)).toThrow();
    });
  });
});
