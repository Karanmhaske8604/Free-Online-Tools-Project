import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Smile } from 'lucide-react';

export default function AgeCalc() {
  const [dob, setDob] = useState('2000-01-01');
  const [time, setTime] = useState('00:00');
  const [age, setAge] = useState(null);
  const [nextBday, setNextBday] = useState(null);

  const calculateAge = () => {
    const birthDateTime = new Date(`${dob}T${time}`);
    const now = new Date();

    if (isNaN(birthDateTime.getTime()) || birthDateTime > now) {
      setAge(null);
      setNextBday(null);
      return;
    }

    const diffMs = now - birthDateTime;

    // Calculate details
    let years = now.getFullYear() - birthDateTime.getFullYear();
    let months = now.getMonth() - birthDateTime.getMonth();
    let days = now.getDate() - birthDateTime.getDate();

    if (days < 0) {
      months -= 1;
      // Get days in previous month
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Cumulative stats
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalSeconds = Math.floor(diffMs / 1000);

    // Calculate Next Birthday
    const nextBdayYear =
      now.getMonth() > birthDateTime.getMonth() ||
      (now.getMonth() === birthDateTime.getMonth() && now.getDate() >= birthDateTime.getDate())
        ? now.getFullYear() + 1
        : now.getFullYear();

    const nextBdayDate = new Date(nextBdayYear, birthDateTime.getMonth(), birthDateTime.getDate());
    const timeToBday = nextBdayDate - now;

    const bdayDays = Math.ceil(timeToBday / (1000 * 60 * 60 * 24));
    const bdayMonths = Math.floor(bdayDays / 30.4375); // Avg days in month
    const bdayRemainingDays = Math.round(bdayDays % 30.4375);
    const dayOfWeek = nextBdayDate.toLocaleDateString('en-US', { weekday: 'long' });

    setAge({
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
    });

    setNextBday({
      daysTotal: bdayDays,
      months: bdayMonths,
      daysLeft: bdayRemainingDays,
      dayOfWeek,
    });
  };

  useEffect(() => {
    calculateAge();
    const interval = setInterval(calculateAge, 1000);
    return () => clearInterval(interval);
  }, [dob, time]);

  return (
    <div className="tool-split-layout fade-in">
      <div className="tool-controls glass-panel">
        <h3>Birth Details</h3>
        
        <div className="form-group">
          <label className="form-label">Date of Birth</label>
          <div className="input-with-icon">
            <Calendar className="input-inner-icon" size={16} />
            <input
              type="date"
              className="glass-input prefix-padding"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Time of Birth (Optional)</label>
          <div className="input-with-icon">
            <Clock className="input-inner-icon" size={16} />
            <input
              type="time"
              className="glass-input prefix-padding"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="tool-results glass-panel age-results-panel">
        {age ? (
          <div className="age-summary-container">
            <div className="exact-age-row">
              <span className="results-sec-title">Your Exact Age</span>
              <div className="exact-age-grid">
                <div className="age-unit-card">
                  <div className="val">{age.years}</div>
                  <div className="unit">Years</div>
                </div>
                <div className="age-unit-card">
                  <div className="val">{age.months}</div>
                  <div className="unit">Months</div>
                </div>
                <div className="age-unit-card">
                  <div className="val">{age.days}</div>
                  <div className="unit">Days</div>
                </div>
              </div>
            </div>

            <div className="metrics-row cumulative-stats-row">
              <div className="metric-block">
                <div className="metric-title">Total Days</div>
                <div className="metric-value">{age.totalDays.toLocaleString()}</div>
              </div>
              <div className="metric-block">
                <div className="metric-title">Total Hours</div>
                <div className="metric-value">{age.totalHours.toLocaleString()}</div>
              </div>
              <div className="metric-block">
                <div className="metric-title">Total Seconds</div>
                <div className="metric-value text-glow-sec">{age.totalSeconds.toLocaleString()}</div>
              </div>
            </div>

            {nextBday && (
              <div className="next-birthday-banner glass-panel">
                <Smile size={24} className="bday-icon" />
                <div className="bday-details">
                  <h4>Next Birthday Countdown</h4>
                  <p>
                    <strong>{nextBday.daysTotal} days</strong> remaining ({nextBday.months} months and {nextBday.daysLeft} days). It will fall on a <strong>{nextBday.dayOfWeek}</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-age-placeholder">
            <Calendar size={48} className="empty-icon" />
            <p>Please enter a valid Date of Birth.</p>
            <span>Future dates are not supported.</span>
          </div>
        )}
      </div>

      <style>{`
        .age-results-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .results-sec-title {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.75rem;
          text-align: center;
        }
        .exact-age-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .age-unit-card {
          background: rgba(99, 102, 241, 0.06);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: var(--radius-md);
          padding: 1.5rem 1rem;
          text-align: center;
        }
        .age-unit-card .val {
          font-family: var(--font-display);
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1.1;
        }
        .age-unit-card .unit {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }
        .cumulative-stats-row {
          margin-bottom: 2rem;
        }
        .text-glow-sec {
          text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
          color: #06b6d4 !important;
        }
        .next-birthday-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(168, 85, 247, 0.06) !important;
          border-color: rgba(168, 85, 247, 0.2) !important;
        }
        .bday-icon {
          color: #a855f7;
          flex-shrink: 0;
        }
        .bday-details h4 {
          color: #a855f7;
          font-size: 1rem;
          margin-bottom: 0.15rem;
        }
        .bday-details p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .empty-age-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
