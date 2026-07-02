import React from 'react';
import { Mail, User, ShieldAlert } from 'lucide-react';

export default function CandidateCard() {
  return (
    <div className="candidate-card glass-panel fade-in">
      <div className="candidate-info">
        <div className="avatar-glow">
          <User className="icon-user" size={20} />
        </div>
        <div>
          <h3 className="candidate-name">Karan Mhaske</h3>
          <span className="candidate-role">Software Developer </span>
        </div>
      </div>
      
      <div className="candidate-contact">
        <a href="mailto:karanmhaske3050@gmail.com" className="contact-link">
          <Mail size={16} />
          <span>karanmhaske3050@gmail.com</span>
        </a>
      </div>

      <div className="candidate-actions">
        <a 
          //href="https://digitalheroesco.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-heroes"
          id="built-for-digital-heroes-btn"
        >
          Built for Digital People
        </a>
      </div>

      <style>{`
        .candidate-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.75rem;
          margin-bottom: 2rem;
          background: rgba(30, 41, 59, 0.4) !important;
          border-color: rgba(99, 102, 241, 0.2) !important;
        }

        .candidate-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar-glow {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          border: 1px solid rgba(99, 102, 241, 0.3);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
        }

        .icon-user {
          stroke-width: 2.5;
        }

        .candidate-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .candidate-role {
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: block;
        }

        .candidate-contact {
          display: flex;
          align-items: center;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .contact-link:hover {
          color: var(--primary);
          border-color: rgba(99, 102, 241, 0.3);
          background: rgba(99, 102, 241, 0.05);
        }

        .btn-heroes {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.65rem 1.25rem;
          border-radius: 8px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.9rem;
          color: #ffffff;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-heroes:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
          filter: brightness(1.1);
        }

        .btn-heroes:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .candidate-card {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
            padding: 1.25rem;
          }
          .candidate-info {
            justify-content: center;
          }
          .candidate-contact {
            justify-content: center;
          }
          .candidate-actions {
            display: flex;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
