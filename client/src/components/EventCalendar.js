import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../contexts/AuthContext';
import { useCommunity } from '../contexts/CommunityContext';
import { useError } from '../contexts/ErrorContext';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Heading,
  Alert,
  AlertIcon,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Input,
  Text,
  Textarea,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';

const localizer = momentLocalizer(moment);

const EventCalendar = ({
  defaultView = 'month',
  showToolbar = true,
  showCreateButton = true,
  showCommunitySelector = true,
  minTime = new Date(2000, 1, 1, 8, 0, 0),
  maxTime = new Date(2000, 1, 1, 20, 0, 0),
  onEventSelect,
  onEventCreate,
  onEventUpdate,
  customViews = [],
  customComponents = {},
  eventPropGetter
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showError } = useError();
  const { activeCommunities } = useCommunity();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: null,
    end: null,
    location: '',
    community_id: ''
  });

  useEffect(() => {
    if (activeCommunities.length > 0) {
      fetchEvents();
    } else {
      setEvents([]);
    }
  }, [activeCommunities]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const communityIds = activeCommunities.map(c => c.id).join(',');
      const response = await fetch(`/api/events?communities=${communityIds}`, {
        headers: { 'x-auth-token': user.token }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      const formattedEvents = data.map(event => ({
        ...event,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        community: activeCommunities.find(c => c.id === event.community_id)
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ ...newEvent, start, end });
    onAddOpen();
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    onViewOpen();
  };

  const handleAddEvent = async () => {
    try {
      if (!newEvent.community_id) {
        throw new Error(t('events.selectCommunity'));
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({
          ...newEvent,
          start_time: newEvent.start,
          end_time: newEvent.end
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add event');
      }

      await fetchEvents();
      onAddClose();
      setNewEvent({
        title: '',
        description: '',
        start: null,
        end: null,
        location: '',
        community_id: ''
      });
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <Box h="calc(100vh - 200px)" p={4}>
      <Heading mb={4}>{t('events.title')}</Heading>

      {activeCommunities.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          {t('events.selectCommunity')}
        </Alert>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          style={{ height: '100%' }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.community?.theme?.primaryColor || '#3182ce'
            }
          })}
        />
      )}

      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('events.addNew')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>{t('events.community')}</FormLabel>
                <Select
                  value={newEvent.community_id}
                  onChange={(e) => setNewEvent({ ...newEvent, community_id: e.target.value })}
                >
                  <option value="">{t('events.selectCommunity')}</option>
                  {activeCommunities.map(community => (
                    <option key={community.id} value={community.id}>
                      {community.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>{t('events.title')}</FormLabel>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t('events.description')}</FormLabel>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t('events.location')}</FormLabel>
                <Input
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddEvent}>
              {t('events.create')}
            </Button>
            <Button variant="ghost" onClick={onAddClose}>
              {t('common.cancel')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

<Modal isOpen={isViewOpen} onClose={onViewClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedEvent?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              {selectedEvent?.community && (
                <Box>
                  <Text fontWeight="bold">{t('events.community')}:</Text>
                  <Text>{selectedEvent.community.name}</Text>
                </Box>
              )}
              <Box>
                <Text fontWeight="bold">{t('events.description')}:</Text>
                <Text>{selectedEvent?.description}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">{t('events.location')}:</Text>
                <Text>{selectedEvent?.location}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">{t('events.time')}:</Text>
                <Text>
                  {selectedEvent?.start && moment(selectedEvent.start).format('LLLL')} - 
                  {selectedEvent?.end && moment(selectedEvent.end).format('LT')}
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onViewClose}>
              {t('common.close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

EventCalendar.propTypes = {
  // View configuration
  defaultView: PropTypes.oneOf(['month', 'week', 'day', 'agenda']),
  showToolbar: PropTypes.bool,
  showCreateButton: PropTypes.bool,
  showCommunitySelector: PropTypes.bool,

  // Time constraints
  minTime: PropTypes.instanceOf(Date),
  maxTime: PropTypes.instanceOf(Date),

  // Event callbacks
  onEventSelect: PropTypes.func,
  onEventCreate: PropTypes.func,
  onEventUpdate: PropTypes.func,

  // Custom components and views
  customViews: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      component: PropTypes.elementType.isRequired
    })
  ),
  customComponents: PropTypes.shape({
    event: PropTypes.elementType,
    toolbar: PropTypes.elementType,
    agenda: PropTypes.shape({
      event: PropTypes.elementType
    })
  }),

  // Event styling
  eventPropGetter: PropTypes.func,

  // Optional styling
  containerStyle: PropTypes.object,
  calendarStyle: PropTypes.object,
  modalStyle: PropTypes.object,

  // Event shape for documentation
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
    description: PropTypes.string,
    location: PropTypes.string,
    community_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

EventCalendar.defaultProps = {
  defaultView: 'month',
  showToolbar: true,
  showCreateButton: true,
  showCommunitySelector: true,
  minTime: new Date(2000, 1, 1, 8, 0, 0),
  maxTime: new Date(2000, 1, 1, 20, 0, 0),
  onEventSelect: undefined,
  onEventCreate: undefined,
  onEventUpdate: undefined,
  customViews: [],
  customComponents: {},
  eventPropGetter: undefined,
  containerStyle: {},
  calendarStyle: {},
  modalStyle: {}
};

export default EventCalendar;
