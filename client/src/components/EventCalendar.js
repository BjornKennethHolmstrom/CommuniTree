import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from './AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Select } from "@/components/ui/select";

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start: null, end: null, location: '' });
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const { user } = useAuth();

  const canEditEvent = (event) => {
    return user.role === 'admin' || event.organizer_id === user.id;
  };

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
      if (!response.ok) throw new Error('Failed to add event');
      const addedEvent = await response.json();
      setEvents([...events, { ...addedEvent, start: new Date(addedEvent.start_time), end: new Date(addedEvent.end_time) }]);
      setIsAddModalOpen(false);
      setNewEvent({ title: '', description: '', start: null, end: null, location: '' });
    } catch (error) {
      console.error('Error adding event:', error);
      setError('Failed to add event. Please try again.');
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

  return (
    <div className="h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Community Event Calendar</h2>
      {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <>
              <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
              <p>{selectedEvent.description}</p>
              <p>Location: {selectedEvent.location}</p>
              <p>Start: {moment(selectedEvent.start).format('MMMM Do YYYY, h:mm a')}</p>
              <p>End: {moment(selectedEvent.end).format('MMMM Do YYYY, h:mm a')}</p>
              
              <div className="mt-4">
                <h4 className="font-semibold">RSVP</h4>
                <Select
                  value={rsvpStatus || ''}
                  onValueChange={handleRSVP}
                >
                  <option value="">Select your RSVP</option>
                  <option value="attending">Attending</option>
                  <option value="not_attending">Not Attending</option>
                  <option value="maybe">Maybe</option>
                </Select>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold">Attendees</h4>
                <ul>
                  {attendees.map((attendee) => (
                    <li key={attendee.id}>
                      {attendee.name} - {attendee.status}
                    </li>
                  ))}
                </ul>
              </div>

              {canEditEvent(selectedEvent) && (
                <DialogFooter>
                  <Button onClick={() => setIsEditModalOpen(false)}>Edit Event</Button>
                  <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>Delete Event</Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
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
          <DialogFooter>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <>
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
              <DialogFooter>
                <Button onClick={handleEditEvent}>Update Event</Button>
                <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>Delete Event</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this event?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteEvent}>Delete</Button>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendar;
