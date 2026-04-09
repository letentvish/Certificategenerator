import React from 'react';

export default function Certificate({ college, program, student }) {
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '[Date]';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'});
    } catch {
      return '[Date]';
    }
  };

  const nameDisplayStyle = {
    fontFamily: 'var(--font-script)',
    fontSize: '3.4rem',
    color: 'var(--navy)'
  };

  return (
    <div className="cert" id="cert">
      {/* Decorative border frames */}
      <div className="cert-frame cert-frame-outer" style={{borderColor: 'var(--gold)'}}></div>
      <div className="cert-frame cert-frame-inner" style={{borderColor: 'rgba(201,168,76,0.35)'}}></div>

      {/* Corner ornaments */}
      <div className="cert-corner tl">
        <svg viewBox="0 0 28 28" fill="none">
          <path d="M2 2 L12 2 L2 12 Z" fill="rgba(201,168,76,0.35)"/>
          <path d="M2 2 L14 2" stroke="#c9a84c" strokeWidth="1.5"/>
          <path d="M2 2 L2 14" stroke="#c9a84c" strokeWidth="1.5"/>
          <circle cx="2" cy="2" r="2" fill="#c9a84c"/>
          <circle cx="7" cy="7" r="1" fill="rgba(201,168,76,0.5)"/>
        </svg>
      </div>
      <div className="cert-corner tr">
        <svg viewBox="0 0 28 28" fill="none">
          <path d="M2 2 L12 2 L2 12 Z" fill="rgba(201,168,76,0.35)"/>
          <path d="M2 2 L14 2" stroke="#c9a84c" strokeWidth="1.5"/>
          <path d="M2 2 L2 14" stroke="#c9a84c" strokeWidth="1.5"/>
          <circle cx="2" cy="2" r="2" fill="#c9a84c"/>
          <circle cx="7" cy="7" r="1" fill="rgba(201,168,76,0.5)"/>
        </svg>
      </div>
      <div className="cert-corner bl">
        <svg viewBox="0 0 28 28" fill="none">
          <path d="M2 2 L12 2 L2 12 Z" fill="rgba(201,168,76,0.35)"/>
          <path d="M2 2 L14 2" stroke="#c9a84c" strokeWidth="1.5"/>
          <path d="M2 2 L2 14" stroke="#c9a84c" strokeWidth="1.5"/>
          <circle cx="2" cy="2" r="2" fill="#c9a84c"/>
          <circle cx="7" cy="7" r="1" fill="rgba(201,168,76,0.5)"/>
        </svg>
      </div>
      <div className="cert-corner br">
        <svg viewBox="0 0 28 28" fill="none">
          <path d="M2 2 L12 2 L2 12 Z" fill="rgba(201,168,76,0.35)"/>
          <path d="M2 2 L14 2" stroke="#c9a84c" strokeWidth="1.5"/>
          <path d="M2 2 L2 14" stroke="#c9a84c" strokeWidth="1.5"/>
          <circle cx="2" cy="2" r="2" fill="#c9a84c"/>
          <circle cx="7" cy="7" r="1" fill="rgba(201,168,76,0.5)"/>
        </svg>
      </div>

      {/* Watermark seal */}
      <div className="cert-seal">
        <img src="WaterMark.svg" alt="Watermark" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      </div>

      {/* Logo Row */}
      <div className="cert-logos">
        <div className="logo-isms">
          {college.logoUrl ? (
            <img src={college.logoUrl} alt={college.name} style={{height: '52px', width: 'auto', objectFit: 'contain'}} />
          ) : (
            <>
              <div>
                <div className="isms-wordmark">{college.acronym || 'COLLEGE'}</div>
                <div className="isms-city">{college.city}</div>
              </div>
              <div className="logo-isms-badge">
                {college.accreditations?.map(b => (
                  <div key={b} className={`logo-isms-badge-pill pill-${b.toLowerCase()}`}>{b}</div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="logo-center-divider"></div>

        <div className="logo-mkraft">
          <img src="logo.png" alt="MultipliersKraft" style={{height: '52px', width: 'auto', objectFit: 'contain'}} />
        </div>
      </div>

      {/* Banner */}
      <div className="cert-banner">
        <div className="banner-col">
          <div className="banner-title">{college.name}</div>
          <div className="banner-sub">{college.subtitle} {college.city && `· ${college.city}`}</div>
        </div>
        <div className="banner-col center">
          <div className="banner-collab">— In Collaboration With —</div>
        </div>
        <div className="banner-col right">
          <div className="banner-title">MultipliersKraft</div>
          <div className="banner-sub">Mkraft Capability Solutions · Talent &amp; Learning</div>
        </div>
      </div>

      {/* Certificate Body */}
      <div className="cert-body">
        <div className="cert-main-title">Certificate of Completion</div>

        <div className="cert-prog-title-row">
          <div className="cpt-line l"></div>
          <div className="cert-prog-title">{program.title}</div>
          <div className="cpt-line r"></div>
        </div>

        <div className="cert-certify-text">This is to certify that</div>

        <div className="cert-name" style={student.name ? nameDisplayStyle : {}}>
          {student.name ? student.name : <span className="cert-name-placeholder">[Student Name]</span>}
        </div>

        <div className="cert-rule"></div>

        <div className="cert-meta-row">
          <span><span className="cert-meta-label">Seat No:</span> <span>{student.seat}</span></span>
          <span className="cert-meta-sep">|</span>
          <span><span className="cert-meta-label">Batch:</span> <span>{program.batch}</span></span>
          <span className="cert-meta-sep">|</span>
          <span><span className="cert-meta-label">Program:</span> <span>{program.fullProgramName}</span></span>
        </div>

        <div className="cert-completion-text">
          Has Successfully Completed the <span>{program.title}</span>
        </div>

        {/* Details Boxes */}
        <div className="cert-boxes">
          <div className="cert-box">
            <div className="cert-box-title">Program Details</div>
            <div className="cert-box-row">
              <span className="cert-box-label">Duration:</span>
              <span className="cert-box-val">{program.duration ? program.duration : <em>[Duration]</em>}</span>
            </div>
            <div className="cert-box-row">
              <span className="cert-box-label">Period:</span>
              <span className="cert-box-val">{program.period ? program.period : <em>[Period]</em>}</span>
            </div>
            <div className="cert-box-row">
              <span className="cert-box-label">Status:</span>
              <span className="cert-box-val">{program.status ? program.status : <em>Successfully Completed</em>}</span>
            </div>
          </div>

          <div className="cert-box">
            <div className="cert-box-title">Course Focus &amp; Domains</div>
            <div>
              {program.domains.filter(d => d.trim()).length > 0 ? (
                program.domains.filter(d => d.trim()).map((d, i) => (
                  <div className="dom-entry" key={i}><span className="dom-bullet">◆</span><span>{d}</span></div>
                ))
              ) : (
                <div className="dom-entry"><span className="dom-bullet">◆</span><span><em>[Domain / Focus Area]</em></span></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="cert-footer">
        <div className="sig-block">
          <div className="sig-line"></div>
          <div className="sig-label">Signature</div>
          <div className="sig-name">DIRECTOR / DEAN</div>
          <div className="sig-org">{college.name}, {college.city}</div>
        </div>

        <div className="footer-center">
          <div className="fc-id-label">Certificate ID</div>
          <div className="fc-id">{student.certId}</div>
          <div className="fc-date">Issue Date: <span>{formatDate(student.date)}</span></div>
          <div className="fc-qr">
            <svg viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="14" height="14" rx="1" fill="none" stroke="white" strokeWidth="1.5"/>
              <rect x="5" y="5" width="8" height="8" fill="white" opacity="0.6"/>
              <rect x="24" y="2" width="14" height="14" rx="1" fill="none" stroke="white" strokeWidth="1.5"/>
              <rect x="27" y="5" width="8" height="8" fill="white" opacity="0.6"/>
              <rect x="2" y="24" width="14" height="14" rx="1" fill="none" stroke="white" strokeWidth="1.5"/>
              <rect x="5" y="27" width="8" height="8" fill="white" opacity="0.6"/>
              <rect x="20" y="20" width="4" height="4" fill="white" opacity="0.5"/>
              <rect x="26" y="20" width="2" height="2" fill="white" opacity="0.5"/>
              <rect x="30" y="20" width="4" height="4" fill="white" opacity="0.5"/>
              <rect x="20" y="26" width="6" height="2" fill="white" opacity="0.5"/>
              <rect x="28" y="24" width="6" height="10" fill="white" opacity="0.3"/>
              <rect x="20" y="30" width="4" height="4" fill="white" opacity="0.5"/>
            </svg>
          </div>
          <div className="fc-scan">Scan to Verify</div>
        </div>

        <div className="sig-block" style={{textAlign:'center'}}>
          <div className="sig-name">MILE ACADEMY TEAM</div>
          <div className="sig-org">MultipliersKraft · Capability Solutions</div>
        </div>
      </div>
    </div>
  );
}
