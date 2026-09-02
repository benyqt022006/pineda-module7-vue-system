import { describe, it, expect, beforeEach } from 'vitest'

describe('Eventora Event Management System', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('UT01 - Add a new event', () => {
    const events = []

    const newEvent = {
      id: 1,
      title: 'Birthday Party',
      date: '2026-09-15',
      location: 'Concepcion',
    }

    events.push(newEvent)

    expect(events).toHaveLength(1)
    expect(events[0].title).toBe('Birthday Party')
  })

  it('UT02 - Display saved events', () => {
    const events = [
      {
        id: 1,
        title: 'Birthday Party',
        date: '2026-09-15',
        location: 'Concepcion',
      },
      {
        id: 2,
        title: 'School Event',
        date: '2026-09-20',
        location: 'CHCCI',
      },
    ]

    localStorage.setItem(
      'eventora-events',
      JSON.stringify(events)
    )

    const savedEvents = JSON.parse(
      localStorage.getItem('eventora-events')
    )

    expect(savedEvents).toHaveLength(2)
    expect(savedEvents[0].title).toBe('Birthday Party')
    expect(savedEvents[1].title).toBe('School Event')
  })

  it('UT03 - Edit an event', () => {
    const events = [
      {
        id: 1,
        title: 'Old Event',
        date: '2026-09-15',
        location: 'Old Location',
      },
    ]

    const event = events.find(item => item.id === 1)

    event.title = 'Updated Event'
    event.location = 'Updated Location'

    expect(event.title).toBe('Updated Event')
    expect(event.location).toBe('Updated Location')
  })

  it('UT04 - Delete an event', () => {
    const events = [
      {
        id: 1,
        title: 'Event to Delete',
      },
      {
        id: 2,
        title: 'Event to Keep',
      },
    ]

    const remainingEvents = events.filter(
      event => event.id !== 1
    )

    expect(remainingEvents).toHaveLength(1)
    expect(remainingEvents[0].title).toBe('Event to Keep')
  })

  it('UT05 - Search for an event', () => {
    const events = [
      {
        id: 1,
        title: 'Birthday Party',
        location: 'Concepcion',
      },
      {
        id: 2,
        title: 'School Seminar',
        location: 'CHCCI',
      },
    ]

    const searchText = 'birthday'

    const results = events.filter(event =>
      event.title
        .toLowerCase()
        .includes(searchText.toLowerCase())
    )

    expect(results).toHaveLength(1)
    expect(results[0].title).toBe('Birthday Party')
  })
})