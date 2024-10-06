import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  Select,
  VStack,
  Text,
  Heading,
  Alert,
  AlertIcon,
  Box
} from '@chakra-ui/react';

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start: null, end: null, location: '' });
  const [error, setError] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchCommunities
  }, [selectedCommunity]);

  const fetchCommunities = async () => {
    try {
      const response = await fetch('/api/communities', {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error('Failed to fetch communities');
      const data = await response.json();
      setCommunities(data);
    } catch (error) {
      console.error('Error fetching communities:', error);
      setError(t('eventCalendar.failedToFetchCommunities'));
    }
  };

  const fetchEvents = async () => {
    try {
      const url = selectedCommunity
        ? `/api/events?communityId=${selectedCommunity}`
        : '/api/events';
      const response = await fetch(url, {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      const formattedEvents = data.map(event => ({
        ...event,
        start: new Date(event.start_time),
        end: new Date(event.end_time)
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(t('eventCalendar.failedToFetchEvents'));
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ ...newEvent, start, end });
    setIsAddModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
    fetchRSVPStatus(event.id);
    fetchEventAttendees(event.id);
  };

  const handleAddEvent = async () => {
    try {
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        start_time: newEvent.start.toISOString(),
        end_time: newEvent.end.toISOString(),
        location: newEvent.location,
        organizer_id: user.id,
        community_id: selectedCommunity || null
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to add event');
      }

      const addedEvent = await response.json();
      // ... rest of the function
    } catch (error) {
      console.error('Error adding event:', error);
      setError(t('eventCalendar.failedToAddEvent') + error.message);
    }
  };

  const handleEditEvent = async () => {
    try {
      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({
          ...selectedEvent,
          start_time: selectedEvent.start,
          end_time: selectedEvent.end
        })
      });
      if (!response.ok) throw new Error('Failed to update event');
      const updatedEvent = await response.json();
      setEvents(events.map(event => event.id === updatedEvent.id ? { ...updatedEvent, start: new Date(updatedEvent.start_time), end: new Date(updatedEvent.end_time) } : event));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating event:', error);
      setError(t('eventCalendar.failedToUpdateEvent'));
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error('Failed to delete event');
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setIsDeleteModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error deleting event:', error);
      setError(t('eventCalendar.failedToDeleteEvent'));
    }
  };

  const fetchRSVPStatus = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error('Failed to fetch RSVP status');
      const data = await response.json();
      setRsvpStatus(data.status);
    } catch (error) {
      console.error('Error fetching RSVP status:', error);
      setError(t('eventCalendar.failedToFetchRSVP'));
    }
  };

  const handleRSVP = async (status) => {
    try {
      const response = await fetch(`/api/events/${selectedEvent.id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': user.token
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update RSVP');
      const data = await response.json();
      setRsvpStatus(data.status);
    } catch (error) {
      console.error('Error updating RSVP:', error);
      setError(t('eventCalendar.failedToUpdateRSVP'));
    }
  };

  const fetchEventAttendees = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/attendees`, {
        headers: { 'x-auth-token': user.token }
      });
      if (!response.ok) throw new Error('Failed to fetch attendees');
      const data = await response.json();
      setAttendees(data);
    } catch (error) {
      console.error('Error fetching attendees:', error);
      setError(t('eventCalendar.failedToFetchAttendees'));
    }
  };

     const canEditEvent = (event) => {
       if (!event || !user) return false;
       return user.role === 'admin' || event.organizer_id === user.id;
     };

  return (
    <Box h="100vh" p={4}>
      <Heading as="h2" size="xl" mb={4}>{t('pages.eventCalendar')}</Heading>
      {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}
      <Select
        value={selectedCommunity}
        onChange={(e) => setSelectedCommunity(e.target.value)}
        mb={4}
      >
        <option value="">{t('eventCalendar.allCommunities')}</option>
        {communities.map(community => (
          <option key={community.id} value={community.id}>
            {community.name}
          </option>
        ))}
      </Select>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        style={{ height: 'calc(100% - 80px)' }}
      />

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('eventCalendar.addNewEvent')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder={t('eventCalendar.eventTitle')}
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <Textarea
                placeholder={t('eventCalendar.eventDescription')}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
              <Input
                placeholder={t('eventCalendar.location')}
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
              <Input
                type="datetime-local"
                value={newEvent.start ? moment(newEvent.start).format('YYYY-MM-DDTHH:mm') : ''}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
              />
              <Input
                type="datetime-local"
                value={newEvent.end ? moment(newEvent.end).format('YYYY-MM-DDTHH:mm') : ''}
                onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddEvent}>{t('eventCalendar.addEvent')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('eventCalendar.editEvent')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent && (
              <VStack spacing={4}>
                <Input
                  placeholder={t('eventCalendar.eventTitle')}
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                />
                <Textarea
                  placeholder={t('eventCalendar.eventDescription')}
                  value={selectedEvent.description}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                />
                <Input
                  placeholder={t('eventCalendar.location')}
                  value={selectedEvent.location}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
                />
                <Input
                  type="datetime-local"
                  value={moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, start: new Date(e.target.value) })}
                />
                <Input
                  type="datetime-local"
                  value={moment(selectedEvent.end).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, end: new Date(e.target.value) })}
                />
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEditEvent}>{t('eventCalendar.updateEvent')}</Button>
            <Button colorScheme="red" ml={3} onClick={() => setIsDeleteModalOpen(true)}>{t('eventCalendar.deleteEvent')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('eventCalendar.confirmDeletion')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{t('eventCalendar.deleteConfirmation')}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDeleteEvent}>{t('eventCalendar.deleteEvent')}</Button>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} ml={3}>{t('eventCalendar.cancel')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventCalendar;
