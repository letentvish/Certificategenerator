import React from 'react';
import { PRESETS } from '../utils/presets';

export default function Sidebar({ college, setCollege, program, setProgram, student, setStudent, customPresets, saveCustomPreset }) {
  
  const handlePresetChange = (e) => {
    const key = e.target.value;
    if (!key) return;
    const allPresets = [...PRESETS, ...(customPresets || [])];
    const p = allPresets.find(pr => pr.id === key);
    if (p) {
      setProgram(p.program);
      setCollege(p.college);
    }
  };

  const autoGenId = () => {
    const yr = new Date().getFullYear();
    const rand = Math.random().toString(36).substring(2,7).toUpperCase();
    setStudent({ ...student, certId: `MKR-${yr}-${rand}` });
  };

  const clearAll = () => {
    if (!window.confirm('Clear all fields and reset the certificate?')) return;
    setProgram({ title: '', fullProgramName: '', batch: '', duration: '', period: '', status: '', domains: [] });
    setStudent({ name: '', seat: '', certId: '', date: new Date().toISOString().split('T')[0] });
  };

  const addDomain = () => setProgram({ ...program, domains: [...program.domains, ''] });
  const updateDomain = (i, val) => {
    const newDomains = [...program.domains];
    newDomains[i] = val;
    setProgram({ ...program, domains: newDomains });
  };
  const removeDomain = (i) => {
    const newDomains = [...program.domains];
    newDomains.splice(i, 1);
    setProgram({ ...program, domains: newDomains });
  };

  const handleSavePresetClick = () => {
    const name = window.prompt("Enter a name for this College + Program Preset:");
    if (name && name.trim() && saveCustomPreset) {
      saveCustomPreset(name.trim());
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCollege({ ...college, logoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div className="sh-logo" style={{marginBottom: '8px'}}>MKraft <span>Capability Solutions</span></div>
        <h1>Certificate Generator</h1>
        <p>Build & export program completion certificates</p>
      </div>

      <div className="sidebar-scroll">
        {/* Preset Section */}
        <div className="fsec">
          <div className="fsec-title">Program Template</div>
          <div className="fg">
            <label>Load Program Preset</label>
            <select onChange={handlePresetChange} defaultValue="">
              <option value="">— Custom / New Program —</option>
              <optgroup label="System Defaults">
                {PRESETS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
              {customPresets && customPresets.length > 0 && (
                <optgroup label="Your Saved Presets">
                  {customPresets.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
          <button className="btn-s" style={{width: '100%', marginTop: '8px'}} onClick={handleSavePresetClick}>
            💾 Save Current Setup as Preset
          </button>
        </div>

        {/* College Section */}
        <div className="fsec">
          <div className="fsec-title">Institution Settings</div>
          <div className="fg">
            <label>College Name</label>
            <input type="text" value={college.name} onChange={e => setCollege({...college, name: e.target.value})} />
          </div>
          <div className="fg">
            <label>Subtitle / Department</label>
            <input type="text" value={college.subtitle} onChange={e => setCollege({...college, subtitle: e.target.value})} />
          </div>
          <div className="fg">
            <label>City / Location</label>
            <input type="text" value={college.city} onChange={e => setCollege({...college, city: e.target.value})} />
          </div>
          <div className="fg">
            <label>Acronym / Wordmark</label>
            <input type="text" value={college.acronym} onChange={e => setCollege({...college, acronym: e.target.value})} />
          </div>
          <div className="fg">
            <label>Logo Upload (Image File)</label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} style={{padding: '5px', fontSize: '0.65rem'}} title="Upload Custom College Logo" />
            {college.logoUrl && college.logoUrl.startsWith('data:image') && (
              <div style={{fontSize: '0.6rem', color: '#888', marginTop: '4px'}}>✓ Custom image loaded.</div>
            )}
          </div>
        </div>

        {/* Student Section */}
        <div className="fsec">
          <div className="fsec-title">Student Information</div>
          <div className="fg">
            <label>Student Full Name *</label>
            <input type="text" value={student.name} onChange={e => setStudent({...student, name: e.target.value})} placeholder="e.g. Priya Sharma" />
          </div>
          <div className="fg">
            <label>Seat / Roll Number</label>
            <input type="text" value={student.seat} onChange={e => setStudent({...student, seat: e.target.value})} placeholder="e.g. PGDM-2025-047" />
          </div>
        </div>

        {/* Program Section */}
        <div className="fsec">
          <div className="fsec-title">Program Details</div>
          <div className="fg">
             <label>Certificate Subtitle (Program Title)</label>
             <input type="text" value={program.title} onChange={e => setProgram({...program, title: e.target.value})} />
          </div>
          <div className="fg">
             <label>Batch / Semester</label>
             <input type="text" value={program.batch} onChange={e => setProgram({...program, batch: e.target.value})} />
          </div>
          <div className="fg">
             <label>Academic Program (Full Name)</label>
             <input type="text" value={program.fullProgramName} onChange={e => setProgram({...program, fullProgramName: e.target.value})} />
          </div>
          <div className="fg">
             <label>Duration</label>
             <input type="text" value={program.duration} onChange={e => setProgram({...program, duration: e.target.value})} />
          </div>
          <div className="fg">
             <label>Period</label>
             <input type="text" value={program.period} onChange={e => setProgram({...program, period: e.target.value})} />
          </div>
          <div className="fg">
             <label>Completion Status</label>
             <input type="text" value={program.status} onChange={e => setProgram({...program, status: e.target.value})} />
          </div>
        </div>

        {/* Domains */}
        <div className="fsec">
          <div className="fsec-title">Course Focus & Domains</div>
          <div className="dom-list">
            {program.domains.map((d, i) => (
              <div className="dom-item" key={i}>
                <input type="text" value={d} onChange={e => updateDomain(i, e.target.value)} placeholder="e.g. Emotional Intelligence" />
                <button className="dom-rm" onClick={() => removeDomain(i)}>✕</button>
              </div>
            ))}
          </div>
          <button className="btn-add-dom" onClick={addDomain}>＋ Add Domain</button>
        </div>

        <div className="fsec">
          <div className="fsec-title">Certificate Meta</div>
          <div className="fg">
             <label>Certificate ID</label>
             <input type="text" value={student.certId} onChange={e => setStudent({...student, certId: e.target.value})} />
          </div>
          <div className="fg">
             <label>Issue Date</label>
             <input type="date" value={student.date} onChange={e => setStudent({...student, date: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="sidebar-actions">
        <button className="btn-p" onClick={() => window.print()}>🖨 Print / Export PDF</button>
        <div className="btn-row">
          <button className="btn-s" onClick={autoGenId}>⟳ Generate ID</button>
          <button className="btn-s" onClick={clearAll}>✕ Clear</button>
        </div>
      </div>
    </aside>
  );
}
