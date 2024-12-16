import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  VStack, FormControl, FormLabel, Input, Textarea, 
  Switch, Button, HStack 
} from '@chakra-ui/react';
import { AccessibleForm } from '../common';

const CommunityForm = ({
  community,
  onSubmit,
  onCancel,
  isLoading,
  showLocationField = true,
  showTimezoneField = true,
  additionalFields = [],
  customValidation,
  initialValues = {}
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState({
    name: community?.name || initialValues.name || '',
    description: community?.description || initialValues.description || '',
    guidelines: community?.guidelines || initialValues.guidelines || '',
    active: community?.active ?? initialValues.active ?? true,
    location: community?.location || initialValues.location || '',
    timezone: community?.timezone || initialValues.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...additionalFields.reduce((acc, field) => ({
      ...acc,
      [field.key]: community?.[field.key] || initialValues[field.key] || ''
    }), {})
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (customValidation) {
      const validationError = customValidation(formData);
      if (validationError) {
        // Handle validation error
        return;
      }
    }

    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <AccessibleForm
      formTitle={community ? 'communities.editCommunity' : 'communities.createCommunity'}
      onSubmit={handleSubmit}
    >
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>{t('communities.name')}</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('communities.namePlaceholder')}
          />
        </FormControl>

        <FormControl>
          <FormLabel>{t('communities.description')}</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t('communities.descriptionPlaceholder')}
          />
        </FormControl>

        <FormControl>
          <FormLabel>{t('communities.guidelines')}</FormLabel>
          <Textarea
            name="guidelines"
            value={formData.guidelines}
            onChange={handleChange}
            placeholder={t('communities.guidelinesPlaceholder')}
          />
        </FormControl>

        <FormControl>
          <FormLabel>{t('communities.location')}</FormLabel>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder={t('communities.locationPlaceholder')}
          />
        </FormControl>

        <FormControl>
          <FormLabel>{t('communities.timezone')}</FormLabel>
          <Input
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            placeholder={t('communities.timezonePlaceholder')}
          />
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">
            {t('communities.active')}
          </FormLabel>
          <Switch
            name="active"
            isChecked={formData.active}
            onChange={handleChange}
          />
        </FormControl>

        {additionalFields.map(field => (
          <FormControl key={field.key} isRequired={field.required}>
            <FormLabel>{t(field.label)}</FormLabel>
            {field.type === 'textarea' ? (
              <Textarea
                name={field.key}
                value={formData[field.key]}
                onChange={handleChange}
                placeholder={t(field.placeholder)}
              />
            ) : field.type === 'select' ? (
              <Select
                name={field.key}
                value={formData[field.key]}
                onChange={handleChange}
              >
                {field.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                type={field.type}
                name={field.key}
                value={formData[field.key]}
                onChange={handleChange}
                placeholder={t(field.placeholder)}
              />
            )}
          </FormControl>
        ))}

        <HStack spacing={4} width="100%" justify="flex-end">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} isDisabled={isLoading}>
              {t('common.cancel')}
            </Button>
          )}
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            {community ? t('common.save') : t('common.create')}
          </Button>
        </HStack>
      </VStack>
    </AccessibleForm>
  );
};

CommunityForm.propTypes = {
  // Optional community data for editing
  community: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    timezone: PropTypes.string,
    guidelines: PropTypes.string
  }),

  // Required callbacks
  onSubmit: PropTypes.func.isRequired,

  // Optional callbacks
  onCancel: PropTypes.func,

  // Form state
  isLoading: PropTypes.bool,

  // Field visibility flags
  showLocationField: PropTypes.bool,
  showTimezoneField: PropTypes.bool,

  // Additional fields configuration
  additionalFields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'textarea', 'select', 'number']).isRequired,
      required: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired
        })
      ),
      validation: PropTypes.func
    })
  ),

  // Custom validation function
  customValidation: PropTypes.func,

  // Initial form values
  initialValues: PropTypes.object,

  // Optional styling
  containerStyle: PropTypes.object,
  formStyle: PropTypes.object,
  fieldStyle: PropTypes.object
};

CommunityForm.defaultProps = {
  community: undefined,
  onCancel: undefined,
  isLoading: false,
  showLocationField: true,
  showTimezoneField: true,
  additionalFields: [],
  customValidation: undefined,
  initialValues: {},
  containerStyle: {},
  formStyle: {},
  fieldStyle: {}
};

// Field types for documentation
CommunityForm.fieldTypes = ['text', 'textarea', 'select', 'number'];

export default CommunityForm;
