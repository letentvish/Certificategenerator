import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Certificate from './components/Certificate';
import MKCertificate from './components/MKCertificate';
import { useLMS } from './hooks/useLMS';
import { PRESETS } from './utils/presets';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import './App.css';
import './mk-cert.css';

function App() {
  const { loading, lmsData } = useLMS();

  // Template selection: 'college' | 'mk-brand'
  const [activeTemplate, setActiveTemplate] = useState('college');

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

  // MK Brand specific: issuer info
  const [issuer, setIssuer] = useState({
    name: 'Mile Academy Team',
    role: 'MultipliersKraft · Capability Solutions'
  });

  const [customBadge, setCustomBadge] = useState(null);

  const handleBadgeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Use base64 data URL instead of blob URL — html2canvas cannot access blob URLs
    // inside SVG <image> elements due to browser security restrictions
    const reader = new FileReader();
    reader.onload = (ev) => setCustomBadge(ev.target.result);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (lmsData?.preset) {
      const allPresets = [...PRESETS, ...(customPresets || [])];
      const matchedPreset = allPresets.find(p => p.id === lmsData.preset?.id) || lmsData.preset;
      if (matchedPreset) {
        setProgram(matchedPreset.program);
        setCollege(matchedPreset.college);
      }
    }
    if (lmsData?.student) setStudent(s => ({ ...s, ...lmsData.student }));
    if (lmsData?.certificate) setStudent(s => ({ ...s, certId: lmsData.certificate.id || s.certId, date: lmsData.certificate.issueDate || s.date }));
  }, [lmsData]);

  const saveCustomPreset = (name) => {
    const newPreset = { id: 'custom-' + Date.now(), name, college, program };
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    localStorage.setItem('mkraft_custom_presets', JSON.stringify(updated));
    alert('Preset saved successfully!');
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
    setCustomBadge(null);
  };

  const exportMKPDF = async () => {
    const el = document.getElementById('mk-cert');
    if (!el) return;
    const btn = document.querySelector('[data-export-btn]');
    if (btn) { btn.textContent = '⏳ Exporting...'; btn.disabled = true; }
    try {
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#080C1F',
        logging: false,
        onclone: (clonedDoc) => {
          // html2canvas can't parse modern oklch() color syntax.
          // 1. Fix any inline styles with oklch
          clonedDoc.querySelectorAll('[style]').forEach(node => {
            const s = node.getAttribute('style') || '';
            if (s.includes('oklch')) {
              node.setAttribute('style', s.replace(/oklch\([^)]+\)/gi, 'transparent'));
            }
          });
          // 2. Inject a style override that resets browser-default oklch border/outline colors
          const fix = clonedDoc.createElement('style');
          fix.textContent = `
            *, *::before, *::after {
              border-color: rgba(255,255,255,0.08) !important;
              outline-color: transparent !important;
              text-decoration-color: currentColor !important;
              column-rule-color: currentColor !important;
            }
          `;
          clonedDoc.head.appendChild(fix);
        },
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgW = canvas.width;
      const imgH = canvas.height;
      const ratio = Math.min(pdfW / imgW, pdfH / imgH);
      const finalW = imgW * ratio;
      const finalH = imgH * ratio;
      const x = (pdfW - finalW) / 2;
      const y = (pdfH - finalH) / 2;
      pdf.addImage(imgData, 'PNG', x, y, finalW, finalH);
      // file-saver handles blob download correctly across all browsers & localhost
      const blob = pdf.output('blob');
      const safeName = (student.name || 'Certificate').replace(/[^a-z0-9_\- ]/gi, '_');
      const filename = `MK-Certificate-${safeName}.pdf`;
      saveAs(blob, filename);
      if (btn) { btn.textContent = '✅ Saved!'; }
      setTimeout(() => { if (btn) { btn.textContent = '⬇ Export PDF'; btn.disabled = false; } }, 2500);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed: ' + err.message);
      if (btn) { btn.textContent = '⬇ Export PDF'; btn.disabled = false; }
    }
  };

  if (loading) return <div style={{ padding: 40, fontFamily: 'sans-serif' }}>Loading LMS Data...</div>;

  return (
    <div className="app">
      {/* ── SIDEBAR ── */}
      {activeTemplate === 'college' ? (
        <Sidebar
          college={college} setCollege={setCollege}
          program={program} setProgram={setProgram}
          student={student} setStudent={setStudent}
          customPresets={customPresets} saveCustomPreset={saveCustomPreset}
          activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate}
        />
      ) : (
        /* MK Brand Sidebar */
        <aside className="sidebar">
          <div className="sidebar-head">
            <div className="sh-logo" style={{marginBottom: '8px'}}>MKraft <span>Capability Solutions</span></div>
            <h1>Certificate Generator</h1>
            <p>Build &amp; export program completion certificates</p>
          </div>

          <div className="sidebar-scroll">
            {/* Template switcher */}
            <div className="fsec">
              <div className="fsec-title">Certificate Template</div>
              <div className="template-toggle">
                <button id="tmpl-college-btn" className="tmpl-btn" onClick={() => setActiveTemplate('college')}>
                  🏫 College Co-Brand
                </button>
                <button id="tmpl-mk-btn" className="tmpl-btn active">
                  ⚡ MK Brand
                </button>
              </div>
            </div>

            {/* Recipient */}
            <div className="fsec">
              <div className="fsec-title">Recipient / Student</div>
              <div className="fg">
                <label>Full Name *</label>
                <input id="mk-student-name" type="text" value={student.name} onChange={e => setStudent({...student, name: e.target.value})} placeholder="e.g. Priya Sharma" />
              </div>
              <div className="fg">
                <label>ID / Seat Number</label>
                <input id="mk-student-seat" type="text" value={student.seat} onChange={e => setStudent({...student, seat: e.target.value})} placeholder="e.g. MK-2025-047" />
              </div>
            </div>

            {/* Course */}
            <div className="fsec">
              <div className="fsec-title">Course / Skill Program</div>
              <div className="fg">
                <label>Course / Program Title *</label>
                <input id="mk-program-title" type="text" value={program.title} onChange={e => setProgram({...program, title: e.target.value})} placeholder="e.g. Leadership Excellence" />
              </div>
              <div className="fg">
                <label>Duration</label>
                <input id="mk-program-duration" type="text" value={program.duration} onChange={e => setProgram({...program, duration: e.target.value})} placeholder="e.g. 40 Hours" />
              </div>
            </div>

            {/* Issued By */}
            <div className="fsec">
              <div className="fsec-title">Issued By</div>
              <div className="fg">
                <label>Issuer Name</label>
                <input id="mk-issuer-name" type="text" value={issuer.name} onChange={e => setIssuer({...issuer, name: e.target.value})} placeholder="e.g. Mile Academy Team" />
              </div>
              <div className="fg">
                <label>Issuer Role / Department</label>
                <input id="mk-issuer-role" type="text" value={issuer.role} onChange={e => setIssuer({...issuer, role: e.target.value})} placeholder="MultipliersKraft · Capability Solutions" />
              </div>
            </div>

            {/* Custom Badge */}
            <div className="fsec">
              <div className="fsec-title">Custom Badge</div>
              <div className="fg">
                <label>Upload Badge Design (Optional)</label>
                <input type="file" accept="image/*" onChange={handleBadgeUpload} style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem'}} />
                {customBadge && <button className="btn-s" style={{marginTop: '8px', background: 'rgba(255,100,100,0.2)'}} onClick={() => setCustomBadge(null)}>Remove Badge</button>}
              </div>
            </div>

            {/* Meta */}
            <div className="fsec">
              <div className="fsec-title">Certificate Meta</div>
              <div className="fg">
                <label>Certificate ID</label>
                <input id="mk-cert-id" type="text" value={student.certId} onChange={e => setStudent({...student, certId: e.target.value})} />
              </div>
              <div className="fg">
                <label>Issue Date</label>
                <input id="mk-cert-date" type="date" value={student.date} onChange={e => setStudent({...student, date: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="sidebar-actions">
            <button data-export-btn className="btn-p" onClick={exportMKPDF}>⬇ Export PDF</button>
            <div className="btn-row">
              <button className="btn-s" onClick={autoGenId}>⟳ Generate ID</button>
              <button className="btn-s" onClick={clearAll}>✕ Clear</button>
            </div>
          </div>
        </aside>
      )}

      {/* ── PREVIEW ── */}
      <main className="preview">
        <div className="prev-bar">
          <h2>Live Certificate Preview</h2>
          <span className="prev-tag">
            {activeTemplate === 'mk-brand' ? '⚡ MK Brand · Dark' : '🏫 College Co-Brand'} &nbsp;·&nbsp; A4 Landscape · Print-Ready
          </span>
        </div>

        {activeTemplate === 'college' ? (
          <Certificate college={college} program={program} student={student} />
        ) : (
          <MKCertificate student={student} program={program} issuer={issuer} customBadge={customBadge} />
        )}

        <div className="cert-note">
          <h3>🔗 LMS Integration &amp; URL Parameters</h3>
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
