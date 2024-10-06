import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Textarea, Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const ProjectForm = ({ project, onSubmit, isLoading }) => {
  const { t } = useTranslation();
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
        <label htmlFor="title" className="block mb-1">{t('projectForm.title')}</label>
        <Input
          id="title"
          {...register('title', { required: t('projectForm.titleRequired') })}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block mb-1">{t('projectForm.description')}</label>
        <Textarea
          id="description"
          {...register('description', { required: t('projectForm.descriptionRequired') })}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="requiredSkills" className="block mb-1">{t('projectForm.requiredSkills')}</label>
        <Input
          id="requiredSkills"
          {...register('requiredSkills', { required: t('projectForm.skillsRequired') })}
          className={errors.requiredSkills ? 'border-red-500' : ''}
        />
        {errors.requiredSkills && <p className="text-red-500 text-sm mt-1">{errors.requiredSkills.message}</p>}
      </div>

      <div>
        <label htmlFor="timeCommitment" className="block mb-1">{t('projectForm.timeCommitment')}</label>
        <Input
          id="timeCommitment"
          {...register('timeCommitment', { required: t('projectForm.timeCommitmentRequired') })}
          className={errors.timeCommitment ? 'border-red-500' : ''}
        />
        {errors.timeCommitment && <p className="text-red-500 text-sm mt-1">{errors.timeCommitment.message}</p>}
      </div>

      <div>
        <label htmlFor="location" className="block mb-1">{t('projectForm.location')}</label>
        <Input
          id="location"
          {...register('location', { required: t('projectForm.locationRequired') })}
          className={errors.location ? 'border-red-500' : ''}
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
      </div>

      <div>
        <label htmlFor="categoryId" className="block mb-1">{t('projectForm.category')}</label>
        <Select
          id="categoryId"
          {...register('categoryId', { required: t('projectForm.categoryRequired') })}
          className={errors.categoryId ? 'border-red-500' : ''}
        >
          <option value="">{t('projectForm.selectCategory')}</option>
          {/* Add category options here */}
        </Select>
        {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
      </div>

      <div className="flex space-x-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('projectForm.submitting') : (project ? t('projectForm.updateProject') : t('projectForm.createProject'))}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          {t('projectForm.cancel')}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
