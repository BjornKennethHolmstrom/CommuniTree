// RegisterFormField.js
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';

const RegisterFormField = ({
  field,
  value,
  error,
  onChange,
  config,
  showPassword,
  onTogglePassword,
  t
}) => {
  const isPasswordField = config.type === 'password';

  return (
    <FormControl isInvalid={!!error} isRequired={config.required}>
      <FormLabel>{t(config.translationKey)}</FormLabel>
      <InputGroup>
        <Input
          type={isPasswordField ? (showPassword ? 'text' : 'password') : config.type}
          value={value}
          onChange={onChange}
          placeholder={t(config.placeholderKey)}
        />
        {isPasswordField && (
          <InputRightElement>
            <IconButton
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              onClick={onTogglePassword}
              variant="ghost"
              size="sm"
            />
          </InputRightElement>
        )}
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

RegisterFormField.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  config: PropTypes.shape({
    type: PropTypes.oneOf(['text', 'email', 'password']).isRequired,
    required: PropTypes.bool,
    translationKey: PropTypes.string.isRequired,
    placeholderKey: PropTypes.string.isRequired
  }).isRequired,
  showPassword: PropTypes.bool,
  onTogglePassword: PropTypes.func,
  t: PropTypes.func.isRequired
};

RegisterFormField.defaultProps = {
  error: '',
  showPassword: false,
  onTogglePassword: () => {}
};

export default RegisterFormField;
