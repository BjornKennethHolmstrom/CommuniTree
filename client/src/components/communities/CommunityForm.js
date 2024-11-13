import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  VStack, FormControl, FormLabel, Input, Textarea, 
  Switch, Button, HStack 
} from '@chakra-ui/react';
import { AccessibleForm } from '../common';

const CommunityForm = ({ community, onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState({
    name: community?.name || '',
    description: community?.description || '',
    guidelines: community?.guidelines || '',
    active: community?.active ?? true,
    location: community?.location || '',
    timezone: community?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const handleSubmit = (e) => {
    e.preventDefault();
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

        <HStack spacing={4} width="100%" justify="flex-end">
          <Button variant="ghost" onClick={() => onSubmit(null)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" colorScheme="blue">
            {community ? t('common.save') : t('common.create')}
          </Button>
        </HStack>
      </VStack>
    </AccessibleForm>
  );
};

export default CommunityForm;
