import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { validateProject, parseSkillsList } from '../utils/projectUtils';
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  VStack,
  Select,
  HStack,
} from '@chakra-ui/react';

const ProjectForm = ({ 
  project, 
  onSubmit, 
  isLoading,
  customCategories,
  disableFields = [],
  showCategoryField = true,
  showLocationField = true,
  additionalFields = [],
  onCancel
}) => {
  const { t } = useTranslation();
  
  const defaultValues = {
    title: project?.title || '',
    description: project?.description || '',
    requiredSkills: project?.required_skills?.join(', ') || '',
    timeCommitment: project?.time_commitment || '',
    location: project?.location || '',
    categoryId: project?.category_id || ''
  };

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setError
  } = useForm({ defaultValues });

  const onSubmitForm = (data) => {
    // Validate form data
    const formattedData = {
      ...data,
      required_skills: parseSkillsList(data.requiredSkills)
    };

    const { isValid, errors: validationErrors } = validateProject(formattedData);
    
    if (!isValid) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field, { type: 'manual', message });
      });
      return;
    }

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <VStack spacing={4}>
        <FormControl isInvalid={errors.title} isDisabled={disableFields.includes('title')}>
          <FormLabel>{t('projectForm.title')}</FormLabel>
          <Input
            {...register('title', { 
              required: t('projectForm.titleRequired') 
            })}
          />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.description}>
          <FormLabel>{t('projectForm.description')}</FormLabel>
          <Textarea
            {...register('description', { 
              required: t('projectForm.descriptionRequired')
            })}
            minH="150px"
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.requiredSkills}>
          <FormLabel>{t('projectForm.requiredSkills')}</FormLabel>
          <Input
            {...register('requiredSkills', {
              required: t('projectForm.skillsRequired')
            })}
            placeholder={t('projectForm.skillsPlaceholder')}
          />
          <FormErrorMessage>{errors.requiredSkills?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.timeCommitment}>
          <FormLabel>{t('projectForm.timeCommitment')}</FormLabel>
          <Input
            {...register('timeCommitment', {
              required: t('projectForm.timeCommitmentRequired')
            })}
            placeholder={t('projectForm.timeCommitmentPlaceholder')}
          />
          <FormErrorMessage>{errors.timeCommitment?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.location}>
          <FormLabel>{t('projectForm.location')}</FormLabel>
          <Input
            {...register('location', {
              required: t('projectForm.locationRequired')
            })}
            placeholder={t('projectForm.locationPlaceholder')}
          />
          <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.categoryId}>
          <FormLabel>{t('projectForm.category')}</FormLabel>
          <Select
            {...register('categoryId', {
              required: t('projectForm.categoryRequired')
            })}
          >
            <option value="">{t('projectForm.selectCategory')}</option>
            {/* Add category options dynamically */}
          </Select>
          <FormErrorMessage>{errors.categoryId?.message}</FormErrorMessage>
        </FormControl>

        <HStack spacing={4} width="100%" justify="flex-end">
          {onCancel && (
            <Button 
              variant="outline" 
              onClick={onCancel}
              isDisabled={isLoading}
            >
              {t('projectForm.cancel')}
            </Button>
          )}
          <Button 
            type="submit" 
            colorScheme="blue"
            isLoading={isLoading}
            loadingText={t('projectForm.submitting')}
          >
            {project ? t('projectForm.updateProject') : t('projectForm.createProject')}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

ProjectForm.propTypes = {
  // Project data
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    description: PropTypes.string,
    required_skills: PropTypes.arrayOf(PropTypes.string),
    time_commitment: PropTypes.string,
    location: PropTypes.string,
    category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),

  // Required callbacks
  onSubmit: PropTypes.func.isRequired,

  // Optional callbacks
  onCancel: PropTypes.func,

  // Loading state
  isLoading: PropTypes.bool,

  // Form configuration
  customCategories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  ),

  // Field configuration
  disableFields: PropTypes.arrayOf(
    PropTypes.oneOf(['title', 'description', 'requiredSkills', 'timeCommitment', 'location', 'categoryId'])
  ),
  showCategoryField: PropTypes.bool,
  showLocationField: PropTypes.bool,

  // Additional fields configuration
  additionalFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'textarea', 'select', 'number']).isRequired,
      required: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired
        })
      )
    })
  )
};

ProjectForm.defaultProps = {
  project: undefined,
  onCancel: undefined,
  isLoading: false,
  customCategories: [],
  disableFields: [],
  showCategoryField: true,
  showLocationField: true,
  additionalFields: []
};

// Additional type definitions for documentation
ProjectForm.fieldTypes = ['text', 'textarea', 'select', 'number'];

ProjectForm.defaultFields = [
  'title',
  'description',
  'requiredSkills',
  'timeCommitment',
  'location',
  'categoryId'
];

export default ProjectForm;
