import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Certificate from './components/Certificate';
import { useLMS } from './hooks/useLMS';
import { PRESETS } from './utils/presets';
import './App.css';

function App() {
  const { loading, lmsData } = useLMS();

  // Component State
  const [customPresets, setCustomPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('mkraft_custom_presets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [college, setCollege] = useState({
    name: 'ISMS Sankalp Business School',
    subtitle: 'Institute of Sales & Marketing Studies',
    city: 'Pune',
    accreditations: ['AICTE', 'TBS'],
    logoUrl: 'isms-logo.png',
    acronym: 'I⚙MS'
  });

  const [program, setProgram] = useState({
    title: 'PROGRAM TITLE',
    fullProgramName: '[Program Name]',
    batch: '[Batch · Semester]',
    duration: '[Duration]',
    period: '[Period]',
    status: 'Successfully Completed',
    domains: []
  });

  const [student, setStudent] = useState({
    name: '',
    seat: '[Seat Number]',
    certId: '[Certificate ID Number]',
    date: new Date().toISOString().split('T')[0]
  });

  // Handle Preset Loading
  useEffect(() => {
    if (lmsData?.preset) {
      const allPresets = [...PRESETS, ...(customPresets || [])];
      const matchedPreset = allPresets.find(p => p.id === lmsData.preset?.id) || lmsData.preset;
      if (matchedPreset) {
        setProgram(matchedPreset.program);
        setCollege(matchedPreset.college);
      }
    }
    if (lmsData?.student) {
      setStudent(s => ({ ...s, ...lmsData.student }));
    }
    if (lmsData?.certificate) {
      setStudent(s => ({ ...s, certId: lmsData.certificate.id || s.certId, date: lmsData.certificate.issueDate || s.date }));
    }
  }, [lmsData]);

  const saveCustomPreset = (name) => {
    const newPreset = {
      id: 'custom-' + Date.now(),
      name: name,
      college: college,
      program: program
    };
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    localStorage.setItem('mkraft_custom_presets', JSON.stringify(updated));
    alert('Preset saved successfully!');
  };

  if (loading) return <div style={{ padding: 40, fontFamily: 'sans-serif' }}>Loading LMS Data...</div>;

  return (
    <div className="app">
      <Sidebar
        college={college} setCollege={setCollege}
        program={program} setProgram={setProgram}
        student={student} setStudent={setStudent}
        customPresets={customPresets} saveCustomPreset={saveCustomPreset}
      />
      <main className="preview">
        <div className="prev-bar">
          <h2>Live Certificate Preview</h2>
          <span className="prev-tag">A4 Landscape · Print-Ready</span>
        </div>
        <Certificate college={college} program={program} student={student} />
        
        {/* Integration note */}
        <div className="cert-note">
          <h3>🔗 LMS Integration & URL Parameters</h3>
          <p>Student name and certificate data can be auto-populated from your LMS by passing URL query parameters. The template handles both manual entry (form above) and programmatic generation.</p>
          <div className="param-grid">
            <div className="param-chip"><code>?student=</code><br/><span>Full student name</span></div>
            <div className="param-chip"><code>?seat=</code><br/><span>Seat / roll number</span></div>
            <div className="param-chip"><code>?preset=</code><br/><span>pgdm2 / pgdm1 / pgp1</span></div>
            <div className="param-chip"><code>?certid=</code><br/><span>Certificate ID</span></div>
            <div className="param-chip"><code>?date=</code><br/><span>Issue date (YYYY-MM-DD)</span></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
