import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';

const ProjectForm = ({ project, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      requiredSkills: project?.required_skills?.join(', ') || '',
      timeCommitment: project?.time_commitment || '',
      location: project?.location || '',
      categoryId: project?.category_id || ''
    }
  });
  const navigate = useNavigate();

  const onSubmitForm = (data) => {
    const projectData = {
      ...data,
      required_skills: data.requiredSkills.split(',').map(skill => skill.trim()),
    };
    onSubmit(projectData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-1">Title</label>
        <Input
          id="title"
          {...register('title', { required: 'Title is required' })}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block mb-1">Description</label>
        <Textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="requiredSkills" className="block mb-1">Required Skills (comma-separated)</label>
        <Input
          id="requiredSkills"
          {...register('requiredSkills', { required: 'At least one skill is required' })}
          className={errors.requiredSkills ? 'border-red-500' : ''}
        />
        {errors.requiredSkills && <p className="text-red-500 text-sm mt-1">{errors.requiredSkills.message}</p>}
      </div>

      <div>
        <label htmlFor="timeCommitment" className="block mb-1">Time Commitment</label>
        <Input
          id="timeCommitment"
          {...register('timeCommitment', { required: 'Time commitment is required' })}
          className={errors.timeCommitment ? 'border-red-500' : ''}
        />
        {errors.timeCommitment && <p className="text-red-500 text-sm mt-1">{errors.timeCommitment.message}</p>}
      </div>

      <div>
        <label htmlFor="location" className="block mb-1">Location</label>
        <Input
          id="location"
          {...register('location', { required: 'Location is required' })}
          className={errors.location ? 'border-red-500' : ''}
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
      </div>

      <div>
        <label htmlFor="categoryId" className="block mb-1">Category</label>
        <Select
          id="categoryId"
          {...register('categoryId', { required: 'Category is required' })}
          className={errors.categoryId ? 'border-red-500' : ''}
        >
          <option value="">Select a category</option>
          {/* Add category options here */}
        </Select>
        {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
      </div>

      <div className="flex space-x-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : (project ? 'Update Project' : 'Create Project')}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
