import React, { useState } from 'react';
import { FileText, Printer, Plus, Trash2 } from 'lucide-react';

export default function ResumeBuilder() {
  const [profile, setProfile] = useState({
    name: 'Karan Mhaske',
    title: 'Software Developer',
    email: 'karan.mhaske@gmail.com',
    phone: '+91 9876543210',
    location: 'Mumbai, India',
    summary: 'A highly motivated and detail-oriented developer candidate building clean, responsive, and high-performance client-side utility applications. Experienced in React, JavaScript, and CSS variable styling systems.',
  });
  
  const [skills, setSkills] = useState('React, JavaScript, CSS3, HTML5, Vite, Git, Vercel, PDF-lib');
  
  const [education, setEducation] = useState([
    { id: '1', school: 'Tech University', degree: 'Bachelor of Science in Computer Science', year: '2022 - 2026' },
  ]);

  const [experience, setExperience] = useState([
    { id: '1', company: 'Digital Heroes Inc', role: 'Custom Software Developer Intern', duration: 'June 2026 - Present', desc: 'Developed client-side optimization suites and custom file utility features. Improved image compressor savings by up to 75% using canvas processing pipelines.' },
  ]);

  const handleUpdateProfile = (key, val) => {
    setProfile(prev => ({ ...prev, [key]: val }));
  };

  const handleAddEdu = () => {
    setEducation(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), school: 'New College', degree: 'Degree Name', year: 'Year' }]);
  };

  const handleUpdateEdu = (id, key, val) => {
    setEducation(prev => prev.map(edu => edu.id === id ? { ...edu, [key]: val } : edu));
  };

  const handleRemoveEdu = (id) => {
    setEducation(prev => prev.filter(edu => edu.id !== id));
  };

  const handleAddExp = () => {
    setExperience(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), company: 'Company Name', role: 'Job Role', duration: 'Duration', desc: 'Describe work tasks...' }]);
  };

  const handleUpdateExp = (id, key, val) => {
    setExperience(prev => prev.map(exp => exp.id === id ? { ...exp, [key]: val } : exp));
  };

  const handleRemoveExp = (id) => {
    setExperience(prev => prev.filter(exp => exp.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="tool-split-layout cv-builder-layout fade-in">
      <div className="tool-controls glass-panel resume-form-column">
        <h3>Resume Editor</h3>
        
        <div className="accordion-section">
          <h4>Personal Information</h4>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="glass-input" value={profile.name} onChange={(e) => handleUpdateProfile('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input type="text" className="glass-input" value={profile.title} onChange={(e) => handleUpdateProfile('title', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Email</label>
              <input type="email" className="glass-input" value={profile.email} onChange={(e) => handleUpdateProfile('email', e.target.value)} />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Phone</label>
              <input type="text" className="glass-input" value={profile.phone} onChange={(e) => handleUpdateProfile('phone', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Professional Summary</label>
            <textarea className="glass-textarea" rows="3" value={profile.summary} onChange={(e) => handleUpdateProfile('summary', e.target.value)} />
          </div>
        </div>

        <div className="accordion-section">
          <h4>Skills (Comma-separated)</h4>
          <div className="form-group">
            <textarea className="glass-textarea" rows="2" value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>
        </div>

        <div className="accordion-section">
          <div className="section-title-row">
            <h4>Work Experience</h4>
            <button onClick={handleAddExp} className="btn-icon-sm"><Plus size={14} /></button>
          </div>
          {experience.map((exp) => (
            <div key={exp.id} className="cv-item-block">
              <input type="text" className="glass-input mb-2" placeholder="Company Name" value={exp.company} onChange={(e) => handleUpdateExp(exp.id, 'company', e.target.value)} />
              <input type="text" className="glass-input mb-2" placeholder="Job Title" value={exp.role} onChange={(e) => handleUpdateExp(exp.id, 'role', e.target.value)} />
              <input type="text" className="glass-input mb-2" placeholder="Duration" value={exp.duration} onChange={(e) => handleUpdateExp(exp.id, 'duration', e.target.value)} />
              <textarea className="glass-textarea mb-2" rows="2" placeholder="Description" value={exp.desc} onChange={(e) => handleUpdateExp(exp.id, 'desc', e.target.value)} />
              <button onClick={() => handleRemoveExp(exp.id)} className="btn-remove-cv"><Trash2 size={12} /> Remove</button>
            </div>
          ))}
        </div>

        <div className="accordion-section">
          <div className="section-title-row">
            <h4>Education</h4>
            <button onClick={handleAddEdu} className="btn-icon-sm"><Plus size={14} /></button>
          </div>
          {education.map((edu) => (
            <div key={edu.id} className="cv-item-block">
              <input type="text" className="glass-input mb-2" placeholder="School/University" value={edu.school} onChange={(e) => handleUpdateEdu(edu.id, 'school', e.target.value)} />
              <input type="text" className="glass-input mb-2" placeholder="Degree" value={edu.degree} onChange={(e) => handleUpdateEdu(edu.id, 'degree', e.target.value)} />
              <input type="text" className="glass-input mb-2" placeholder="Year" value={edu.year} onChange={(e) => handleUpdateEdu(edu.id, 'year', e.target.value)} />
              <button onClick={() => handleRemoveEdu(edu.id)} className="btn-remove-cv"><Trash2 size={12} /> Remove</button>
            </div>
          ))}
        </div>

        <button onClick={handlePrint} className="btn btn-primary w-full">
          <Printer size={16} />
          Print / Save PDF
        </button>
      </div>

      <div className="tool-results glass-panel resume-preview-column">
        <div className="resume-sheet">
          <div className="resume-header">
            <h1 className="resume-name">{profile.name}</h1>
            <h3 className="resume-title">{profile.title}</h3>
            <div className="resume-contact-row">
              <span>{profile.email}</span>
              <span>•</span>
              <span>{profile.phone}</span>
              {profile.location && (
                <>
                  <span>•</span>
                  <span>{profile.location}</span>
                </>
              )}
            </div>
          </div>

          <div className="resume-body">
            <div className="resume-section">
              <h4 className="resume-section-title">Summary</h4>
              <p className="resume-paragraph">{profile.summary}</p>
            </div>

            <div className="resume-section">
              <h4 className="resume-section-title">Core Skills</h4>
              <div className="resume-skills-list">
                {skills.split(',').map((skill) => (
                  <span key={skill} className="resume-skill-item">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="resume-section">
              <h4 className="resume-section-title">Professional Experience</h4>
              {experience.map((exp) => (
                <div key={exp.id} className="resume-entry">
                  <div className="entry-header">
                    <strong>{exp.role}</strong>
                    <span>{exp.duration}</span>
                  </div>
                  <div className="entry-subheader">{exp.company}</div>
                  <p className="resume-paragraph entry-desc">{exp.desc}</p>
                </div>
              ))}
            </div>

            <div className="resume-section">
              <h4 className="resume-section-title">Education</h4>
              {education.map((edu) => (
                <div key={edu.id} className="resume-entry">
                  <div className="entry-header">
                    <strong>{edu.degree}</strong>
                    <span>{edu.year}</span>
                  </div>
                  <div className="entry-subheader">{edu.school}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .resume-form-column {
          max-height: 80vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem !important;
        }
        .accordion-section {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1rem;
        }
        .accordion-section h4 {
          font-size: 0.95rem;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }
        .section-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .section-title-row h4 {
          margin-bottom: 0;
        }
        .btn-icon-sm {
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .btn-icon-sm:hover {
          color: white;
          background: rgba(255, 255, 255, 0.08);
        }
        .cv-item-block {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          margin-bottom: 0.75rem;
        }
        .mb-2 {
          margin-bottom: 0.5rem;
        }
        .btn-remove-cv {
          background: transparent;
          border: none;
          color: #f43f5e;
          font-size: 0.75rem;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .resume-preview-column {
          padding: 2rem !important;
          background: rgba(15, 23, 42, 0.3) !important;
          display: flex;
          justify-content: center;
        }
        .resume-sheet {
          background: #ffffff;
          color: #1e293b;
          width: 100%;
          max-width: 650px;
          min-height: 800px;
          padding: 3rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          text-align: left;
        }
        .resume-header {
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 1.25rem;
        }
        .resume-name {
          font-size: 2.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.25rem;
          letter-spacing: -0.03em;
        }
        .resume-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: #6366f1;
          margin-bottom: 0.75rem;
        }
        .resume-contact-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }
        .resume-section-title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          text-transform: uppercase;
          color: #0f172a;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.35rem;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }
        .resume-paragraph {
          font-size: 0.9rem;
          color: #334155;
          line-height: 1.5;
        }
        .resume-skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .resume-skill-item {
          background: #f1f5f9;
          color: #475569;
          font-size: 0.8rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }
        .resume-entry {
          margin-bottom: 1.25rem;
        }
        .entry-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          color: #0f172a;
        }
        .entry-subheader {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }
        .entry-desc {
          margin-top: 0.25rem;
        }

        /* Print styles */
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .app-header, .candidate-card, .tool-controls, .app-footer, .print-hide {
            display: none !important;
          }
          .tool-split-layout {
            grid-template-columns: 1fr !important;
          }
          .resume-preview-column {
            background: white !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .resume-sheet {
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
