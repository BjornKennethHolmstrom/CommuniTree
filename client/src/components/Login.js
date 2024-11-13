import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input,
  VStack, 
  Heading, 
  Text, 
  Link,
  Alert, 
  AlertIcon,
  Divider,
  HStack
} from '@chakra-ui/react';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.msg || t('login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={6}>
        <Heading as="h1" size="xl">
          {t('login.title')}
        </Heading>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>{t('login.email')}</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.emailPlaceholder')}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>{t('login.password')}</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.passwordPlaceholder')}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
            >
              {t('login.submit')}
            </Button>
          </VStack>
        </form>

        <VStack spacing={2} width="100%">
          <Link as={RouterLink} to="/forgot-password" color="blue.500">
            {t('login.forgotPassword')}
          </Link>
          
          <Divider my={4} />
          
          <Text>
            {t('login.noAccount')}{' '}
            <Link as={RouterLink} to="/register" color="blue.500">
              {t('login.registerLink')}
            </Link>
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Login;
