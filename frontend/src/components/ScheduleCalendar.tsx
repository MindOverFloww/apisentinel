import React, { useState } from 'react';

export interface CalendarEvent {
  id: string;
  time: string;
  dayIndex: number; // 0 to 6 (Mon to Sun)
  title: string;
  icon?: string;
}

interface ScheduleCalendarProps {
  title?: string;
  events?: CalendarEvent[];
}

const defaultEvents: CalendarEvent[] = [
  { id: '1', time: '12:00', dayIndex: 1, title: 'SOC Incident Review 📹' },
  { id: '2', time: '13:00', dayIndex: 4, title: 'Traffic Anomaly Audit 📊' },
  { id: '3', time: '14:00', dayIndex: 2, title: 'SQLi & Brute Force Rules 🛡️' },
  { id: '4', time: '15:00', dayIndex: 4, title: 'Isolation Forest Retrain 🤖' },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const times = ['12:00', '13:00', '14:00', '15:00'];

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  title = 'Security & Audit Timeline',
  events = defaultEvents,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('May 2025');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      {/* Top Month Header Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <button
          onClick={() => setSelectedMonth('April 2025')}
          style={{
            fontSize: '11px',
            fontWeight: 500,
            color: 'rgba(0, 0, 0, 0.45)',
            background: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            borderRadius: '999px',
            padding: '4px 12px',
            cursor: 'pointer',
          }}
        >
          April
        </button>

        <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', color: '#121316' }}>
          {selectedMonth}
        </div>

        <button
          onClick={() => setSelectedMonth('June 2025')}
          style={{
            fontSize: '11px',
            fontWeight: 500,
            color: 'rgba(0, 0, 0, 0.45)',
            background: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            borderRadius: '999px',
            padding: '4px 12px',
            cursor: 'pointer',
          }}
        >
          June
        </button>
      </div>

      {/* Days of week header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '45px repeat(7, 1fr)',
          gap: '4px',
          textAlign: 'center',
          fontSize: '11px',
          fontWeight: 600,
          color: 'rgba(0, 0, 0, 0.55)',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <div /> {/* Spacer for time column */}
        {days.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Time slots and event pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
        {times.map((time) => {
          const matchingEvents = events.filter((e) => e.time === time);

          return (
            <div
              key={time}
              style={{
                display: 'grid',
                gridTemplateColumns: '45px repeat(7, 1fr)',
                gap: '4px',
                alignItems: 'center',
                minHeight: '26px',
                position: 'relative',
              }}
            >
              {/* Time Label */}
              <span
                style={{
                  fontSize: '10.5px',
                  color: 'rgba(0, 0, 0, 0.42)',
                  fontWeight: 500,
                  userSelect: 'none',
                }}
              >
                {time}
              </span>

              {/* Day cells with subtle dashed markers */}
              {days.map((_, dayIdx) => {
                const event = matchingEvents.find((e) => e.dayIndex === dayIdx);

                return (
                  <div
                    key={dayIdx}
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Subtle grid tick */}
                    <div
                      style={{
                        width: '1px',
                        height: '12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      }}
                    />

                    {/* Floating event pill */}
                    {event && (
                      <div
                        style={{
                          position: 'absolute',
                          zIndex: 10,
                          whiteSpace: 'nowrap',
                          background: '#0c0d0e',
                          color: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '10px',
                          fontWeight: 600,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          transform: 'scale(1)',
                          transition: 'transform 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        {event.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleCalendar;
