import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import EventForm from './components/EventForm.vue'
import EventList from './components/EventList.vue'

describe('Event Management System', () => {

  // TEST 1 — ADD EVENT
  it('adds a new event when valid information is submitted', async () => {
    const wrapper = mount(EventForm)

    const inputs = wrapper.findAll('input')

    await inputs[0].setValue('BSCS Seminar')
    await inputs[1].setValue('2026-09-15')
    await inputs[2].setValue('10:00')
    await inputs[3].setValue('CHCCI Auditorium')
    await inputs[4].setValue('Justin Pineda')

    await wrapper.find('form').trigger('submit.prevent')

    const emitted = wrapper.emitted('add-event')

    expect(emitted).toBeTruthy()
    expect(emitted[0][0].eventName).toBe('BSCS Seminar')
    expect(emitted[0][0].eventDate).toBe('2026-09-15')
  })


  // TEST 2 — VALIDATION
  it('does not add an event when required fields are empty', async () => {
    const wrapper = mount(EventForm)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('add-event')).toBeFalsy()

    expect(wrapper.text()).toContain(
      'Event name is required.'
    )
  })


  // TEST 3 — DISPLAY RECORDS
  it('displays event records correctly', () => {
    const events = [
      {
        id: 1,
        eventName: 'BSCS Seminar',
        eventDate: '2026-09-15',
        eventTime: '10:00',
        location: 'CHCCI Auditorium',
        organizer: 'Justin Pineda',
        status: 'Upcoming'
      }
    ]

    const wrapper = mount(EventList, {
      props: {
        events
      }
    })

    expect(wrapper.text()).toContain('BSCS Seminar')
    expect(wrapper.text()).toContain('CHCCI Auditorium')
    expect(wrapper.text()).toContain('Justin Pineda')
  })


  // TEST 4 — EDIT EVENT
  it('emits edit event when the edit button is clicked', async () => {
    const event = {
      id: 1,
      eventName: 'BSCS Seminar',
      eventDate: '2026-09-15',
      eventTime: '10:00',
      location: 'CHCCI Auditorium',
      organizer: 'Justin Pineda',
      status: 'Upcoming'
    }

    const wrapper = mount(EventList, {
      props: {
        events: [event]
      }
    })

    await wrapper
      .find('.edit-action')
      .trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')[0][0]).toEqual(event)
  })


  // TEST 5 — DELETE EVENT
  it('emits delete event with the correct event ID', async () => {
    const event = {
      id: 25,
      eventName: 'Software Engineering Meeting',
      eventDate: '2026-09-20',
      eventTime: '13:00',
      location: 'Computer Laboratory',
      organizer: 'Justin Pineda',
      status: 'Upcoming'
    }

    const wrapper = mount(EventList, {
      props: {
        events: [event]
      }
    })

    await wrapper
      .find('.delete-action')
      .trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')[0][0]).toBe(25)
  })


  // TEST 6 — DEFECT TEST
  it('rejects an Upcoming event when the event date is already in the past', async () => {
    const wrapper = mount(EventForm)

    const inputs = wrapper.findAll('input')

    await inputs[0].setValue('Past Date Event')
    await inputs[1].setValue('2020-01-01')
    await inputs[2].setValue('10:00')
    await inputs[3].setValue('CHCCI')
    await inputs[4].setValue('Justin Pineda')

    await wrapper
      .find('input[type="radio"][value="Upcoming"]')
      .setValue(true)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('add-event')).toBeFalsy()

    expect(wrapper.text()).toContain(
      'Upcoming events cannot have a past date.'
    )
  })

})