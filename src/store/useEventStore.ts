import { create } from 'zustand'
import { toast } from 'react-toastify'
import axios from 'axios'
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../api/eventApi'

import type {
  EventType,
  EventPayload,
  GetEventsParams,
  GetEventsResponse,
} from '../types'

interface EventStore {
  events: EventType[]
  meta: GetEventsResponse['meta'] | null
  loading: boolean
  error: string | null
  fetchEvents: (params?: GetEventsParams) => Promise<void>
  addEvent: (payload: EventPayload) => Promise<void>
  updateEvent: (id: string, payload: EventPayload) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  meta: null,
  loading: false,
  error: null,

  fetchEvents: async (params) => {
    set({ loading: true, error: null })
    try {
      const res = await getEvents(params)
      set({ events: res.data, meta: res.meta, loading: false })
    } catch (err: unknown) {
      let message = 'Failed to fetch events'
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message
      }
      toast.error(message)
      set({ error: message, loading: false })
    }
  },

  addEvent: async (payload) => {
    set({ loading: true, error: null })
    try {
      const res = await createEvent(payload)
      set((state) => ({
        events: [res.data, ...state.events],
        loading: false,
      }))
      toast.success('Event created successfully!')
    } catch (err: unknown) {
      let message = 'Failed to create event'
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message
      }
      toast.error(message)
      set({ error: message, loading: false })
    }
  },

  updateEvent: async (id, payload) => {
    set({ loading: true, error: null })
    try {
      const res = await updateEvent(id, payload)
      set((state) => ({
        events: state.events.map((event) =>
          event._id === id ? res.data : event
        ),
        loading: false,
      }))
      toast.success('Event updated successfully!')
    } catch (err: unknown) {
      let message = 'Failed to update event'
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message
      }
      toast.error(message)
      set({ error: message, loading: false })
    }
  },

  deleteEvent: async (id) => {
    set({ loading: true, error: null })
    try {
      await deleteEvent(id)
      set((state) => ({
        events: state.events.filter((event) => event._id !== id),
        loading: false,
      }))
      toast.success('Event deleted successfully!')
    } catch (err: unknown) {
      let message = 'Failed to delete event'
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message
      }
      toast.error(message)
      set({ error: message, loading: false })
    }
  },
}))
