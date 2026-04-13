import React from 'react';

/**
 * MKCertificate — MultipliersKraft Brand Certificate
 * Correct Structure: Dark base layer with blobs, single full-size glass panel,
 * with text on left and small floating badge within glass panel top-right.
 */
export default function MKCertificate({ student, program, issuer, customBadge }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '[Date]';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return '[Date]'; }
  };

  const courseName  = (program?.title || 'COURSE / SKILL PROGRAM').toUpperCase();
  const issuerName  = issuer?.name || 'Mile Academy Team';
  const issuerRole  = issuer?.role || 'MultipliersKraft · Capability Solutions';

  /* ── SVG Badge geometry (more space & radius for text) ── */
  const S    = 220;   // viewBox square
  const cx   = 110;
  const cy   = 110;
  const rIn  = 64;    // inner dark circle
  const rHex = 36;    // hexagon apothem scale

  // ── Robust Circular Text Logic ──
  const rRng = 90;                                   // Standard fixed radius for stability
  const fontSize = 8.5;
  const charWidthBase = fontSize * 0.52;              // Base width for Inter Bold (conservative)
  const segment = ` ${courseName}  ✦ `;              // One segment
  
  // Calculate how many times it fits at a "natural" spacing of 2.5
  const circ = 2 * Math.PI * rRng;                   // ~565
  const segWNatural = segment.length * (charWidthBase + 2.5);
  const N = Math.max(1, Math.round(circ / segWNatural));
  const finalStr = segment.repeat(N);

  // Solve for exact letter-spacing: circ = chars * (base + spacing)
  // spacing = (circ / chars) - base
  const totalChars = finalStr.length;
  const dynamicSpacing = (circ / totalChars) - charWidthBase;

  // Modern robust circle path (two arcs for 100% coverage)
  const textPath = `M ${cx},${cy - rRng} a ${rRng},${rRng} 0 1,1 0,${2 * rRng} a ${rRng},${rRng} 0 1,1 0,-${2 * rRng}`;

  /* ── Flat-top hexagon points ── */
  const hex = (r) => [0,1,2,3,4,5].map(i => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');

  return (
    <div className="mk-cert" id="mk-cert">

      {/* ── Background layers (z-index 0) ── */}
      <div className="mk-bg-grid" />
      <div className="mk-bg-blob mk-bg-blob-tl" />
      <div className="mk-bg-blob mk-bg-blob-br" />

      {/* ── Corner bracket accents ── */}
      <div className="mk-ca mk-ca-tl" />
      <div className="mk-ca mk-ca-tr" />
      <div className="mk-ca mk-ca-bl" />
      <div className="mk-ca mk-ca-br" />

      {/* ══════════════════════════════════════════
          GLASS CARD — Contains everything
      ══════════════════════════════════════════ */}
      <div className="mk-glass-card">
        
        <div className="mk-badge-wrap">
          <svg className="mk-badge-svg" viewBox={`0 0 ${S} ${S}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="mkBg3" cx="38%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#1c3a88" />
                <stop offset="100%" stopColor="#091540" />
              </radialGradient>
              <filter id="mkGlow3" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
                <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="mkSoft3" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b" />
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <path id="mkTP3" d={textPath} />
            </defs>

            {/* Always render the default inner elements (hidden under img when custom badge set) */}
            {!customBadge && (
              <g>
                {/* Inner dark circle */}
                <circle cx={cx} cy={cy} r={rIn} fill="url(#mkBg3)" />
                <circle cx={cx} cy={cy} r={rIn} fill="none" stroke="#F5A623" strokeWidth="0.8" strokeOpacity="0.3" />

                {/* Hexagon outline */}
                <polygon points={hex(rHex)} fill="none" stroke="#F5A623" strokeWidth="1.8" filter="url(#mkSoft3)" />
                <polygon points={hex(rHex * 0.86)} fill="rgba(245,166,35,0.08)" />

                {/* MK text inside hexagon */}
                <text x={cx} y={cy - 2} textAnchor="middle" fontSize="20" fontWeight="900" fill="#F5A623" letterSpacing="2" fontFamily="'Inter','Helvetica Neue',sans-serif" filter="url(#mkSoft3)">MK</text>

                {/* VERIFIED label */}
                <text x={cx} y={cy + 13} textAnchor="middle" fontSize="6.5" fontWeight="700" fill="rgba(255,255,255,0.85)" letterSpacing="2" fontFamily="'Inter','Helvetica Neue',sans-serif">VERIFIED</text>

                {/* Diamond flankers near VERIFIED */}
                <text x={cx - 24} y={cy + 12} fontSize="5" fill="#F5A623" textAnchor="middle" opacity="0.9">✦</text>
                <text x={cx + 24} y={cy + 12} fontSize="5" fill="#F5A623" textAnchor="middle" opacity="0.9">✦</text>
              </g>
            )}

            {/* Circular text — manually calculated spacing for 100% reliable distribution */}
            <text fontSize={fontSize} fill="#FFFFFF" fillOpacity="1" opacity="1" fontFamily="'Inter','Helvetica Neue',sans-serif" fontWeight="700" letterSpacing={dynamicSpacing} style={{filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.9))'}}>
              <textPath href="#mkTP3" startOffset="0%">{finalStr}</textPath>
            </text>
          </svg>
          {/* Custom badge as HTML <img> — far more reliably captured by html2canvas */}
          {customBadge && (
            <img
              src={customBadge}
              alt="Custom Badge"
              className="mk-badge-custom-img"
            />
          )}
        </div>
        
        {/* === Content Wrapper === */}
        <div className="mk-content-wrapper">
          
          <div className="mk-content-left">
            {/* Top block */}
            <div className="mk-header">
              <div className="mk-heading">Certificate</div>
            </div>

            {/* Presentation text */}
            <div className="mk-sub">This is a certificate of completion presented to:</div>

            {/* Recipient name */}
            <div className="mk-name">
              {student?.name
                ? student.name
                : <span className="mk-name-ph">[Recipient Name]</span>}
            </div>

            {/* Description box */}
            <div className="mk-desc-box">
              <p className="mk-desc">
                This is to certify that you have successfully completed the&nbsp;
                <span className="mk-desc-program">{program?.title || '[Program Title]'}</span>
                &nbsp;course and have proven that you possess the necessary skills and professional expertise.
              </p>
            </div>
          </div>

          {/* Issue Details & Signature Block */}
          <div className="mk-footer-area">
            
            <div className="mk-signature-block">
              <div className="mk-sig-line"></div>
              <div className="mk-issuer-name">{issuerName}</div>
              <div className="mk-issuer-role">{issuerRole}</div>
              {student?.date && <div className="mk-issuer-date">Issued on {formatDate(student.date)}</div>}
            </div>

            <div className="mk-footer-right">
              {/* Small meta chips inside footer inline */}
              {(student?.seat || student?.certId) && (
                <div className="mk-meta-footer">
                  {student?.seat && <div className="mk-meta-item">ID: {student.seat}</div>}
                  {student?.certId && <div className="mk-meta-item">REF: {student.certId}</div>}
                </div>
              )}
              
              {/* Logo positioned at bottom right */}
              <div className="mk-bottom-right-logo">
                <img src="logo.png" alt="MultipliersKraft" className="mk-logo" />
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
