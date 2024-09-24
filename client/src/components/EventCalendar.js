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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events', {
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
      setError('Failed to fetch events. Please try again later.');
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
        organizer_id: user.id // Make sure this is correct
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
      setError('Failed to add event. ' + error.message);
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
      setError('Failed to update event. Please try again.');
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
      setError('Failed to delete event. Please try again.');
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
      setError('Failed to fetch RSVP status. Please try again.');
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
      setError('Failed to update RSVP. Please try again.');
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
      setError('Failed to fetch attendees. Please try again.');
    }
  };

     const canEditEvent = (event) => {
       if (!event || !user) return false;
       return user.role === 'admin' || event.organizer_id === user.id;
     };

     return (
       <Box h="100vh" p={4}>
         <Heading as="h2" size="xl" mb={4}>{t('eventCalendar.title')}</Heading>
         {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}
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

         <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
           <ModalOverlay />
           <ModalContent>
             <ModalHeader>{t('eventCalendar.eventDetails')}</ModalHeader>
             <ModalCloseButton />
             <ModalBody>
               {selectedEvent && (
                 <VStack align="stretch" spacing={4}>
                   <Heading size="md">{selectedEvent.title}</Heading>
                   <Text>{selectedEvent.description}</Text>
                   <Text>{t('eventCalendar.location')}: {selectedEvent.location}</Text>
                   <Text>{t('eventCalendar.start')}: {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm a')}</Text>
                   <Text>{t('eventCalendar.end')}: {moment(selectedEvent.end).format('MMMM Do YYYY, h:mm a')}</Text>

                   <Box>
                     <Heading size="sm">{t('eventCalendar.rsvp')}</Heading>
                     <Select
                       value={rsvpStatus || ''}
                       onChange={(e) => handleRSVP(e.target.value)}
                     >
                       <option value="">{t('eventCalendar.selectRsvp')}</option>
                       <option value="attending">{t('eventCalendar.attending')}</option>
                       <option value="not_attending">{t('eventCalendar.notAttending')}</option>
                       <option value="maybe">{t('eventCalendar.maybe')}</option>
                     </Select>
                   </Box>

                   <Box>
                     <Heading size="sm">{t('eventCalendar.attendees')}</Heading>
                     <VStack align="stretch">
                       {attendees.map((attendee) => (
                         <Text key={attendee.id}>
                           {attendee.name} - {attendee.status}
                         </Text>
                       ))}
                     </VStack>
                   </Box>
                 </VStack>
               )}
             </ModalBody>
             <ModalFooter>
               {canEditEvent(selectedEvent) && (
                 <>
                   <Button onClick={() => setIsEditModalOpen(false)}>{t('eventCalendar.editEvent')}</Button>
                   <Button colorScheme="red" ml={3} onClick={() => setIsDeleteModalOpen(true)}>{t('eventCalendar.deleteEvent')}</Button>
                 </>
               )}
             </ModalFooter>
           </ModalContent>
         </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <Textarea
                placeholder="Event Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
              <Input
                placeholder="Location"
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
            <Button colorScheme="blue" onClick={handleAddEvent}>Add Event</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent && (
              <VStack spacing={4}>
                <Input
                  placeholder="Event Title"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                />
                <Textarea
                  placeholder="Event Description"
                  value={selectedEvent.description}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                />
                <Input
                  placeholder="Location"
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
            <Button colorScheme="blue" onClick={handleEditEvent}>Update Event</Button>
            <Button colorScheme="red" ml={3} onClick={() => setIsDeleteModalOpen(true)}>Delete Event</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this event?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDeleteEvent}>Delete</Button>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} ml={3}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventCalendar;
