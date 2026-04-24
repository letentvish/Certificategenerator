import React from 'react';

/**
 * MKCertificateV2 — Modern Geometric Brand Certificate
 * Inspired by the provided image with vibrant blue, arcs, and speckled texture.
 * Updated: Reduced font sizes, MK logo, and integrated MK Glass badge system.
 */
export default function MKCertificateV2({ student, program, issuer, customBadge }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '[Date]';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return '[Date]'; }
  };

  const recipientName = student?.name || '[RECIPIENT NAME]';
  const courseTitle  = (program?.title || 'COURSE / SKILL PROGRAM').toUpperCase();
  const duration = program?.duration || '3 month';
  const issuerName = issuer?.name || 'Donna Stroupe';
  const issueDate = formatDate(student?.date);

  /* ── MK Badge Logic (Integrated from Glass Template) ── */
  const S    = 220;   // viewBox square
  const cx   = 110;
  const cy   = 110;
  const rIn  = 64;    // inner circle
  const rHex = 36;    // hexagon scale
  const fontSize = 8.5;
  const charWidthBase = fontSize * 0.52;
  const targetLetterSpacing = 3.0;
  const segment = ` ${courseTitle}  ✦ `;
  const unitW = segment.length * (charWidthBase + targetLetterSpacing);
  const N = Math.max(1, Math.round(565 / unitW));
  const finalStr = segment.repeat(N);
  const totalChars = finalStr.length;
  const idealR = (totalChars * (charWidthBase + targetLetterSpacing)) / (2 * Math.PI);
  const rRng = Math.max(86, Math.min(94, idealR));
  const finalCirc = 2 * Math.PI * rRng;
  const dynamicSpacing = (finalCirc / totalChars) - charWidthBase;
  const textPath = `M ${cx},${cy - rRng} a ${rRng},${rRng} 0 1,1 0,${2 * rRng} a ${rRng},${rRng} 0 1,1 0,-${2 * rRng}`;

  const hex = (r) => [0,1,2,3,4,5].map(i => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');

  return (
    <div className="mk-cert-v2" id="mk-cert">
      {/* ── Background Elements ── */}
      <div className="v2-bg-main" />
      <div className="v2-bg-texture" />
      
      {/* ── Geometric Shapes ── */}
      <div className="v2-shape-arc" />
      <div className="v2-shape-semicircle" />
      <div className="v2-shape-bar" />

      {/* ── Content ── */}
      <div className="v2-content">
        <div className="v2-header">
          <div className="v2-title">
            <span className="v2-white">certificate</span>
            <br />
            <span className="v2-cyan">completion</span>
          </div>
          <div className="v2-logo-box">
            <img src="logo.png" alt="MultipliersKraft" className="v2-logo-img" />
          </div>
        </div>

        <div className="v2-body">
          <p className="v2-award-text">This Certificate awarded to</p>
          <h1 className="v2-name">{recipientName}</h1>
          <p className="v2-desc">
            Has Successfully completed the course, {courseTitle}, with duration {duration}, wish you success your life
          </p>
        </div>

        <div className="v2-footer">
          <div className="v2-issuer-section">
            <p className="v2-label">Issued By</p>
            <p className="v2-issuer-name">{issuerName}</p>
          </div>
          <div className="v2-date-section">
            <p className="v2-label">Issue Date</p>
            <p className="v2-date">{issueDate}</p>
          </div>
        </div>
      </div>

      {/* ── MK Integrated Badge ── */}
      <div className="v2-badge">
        <svg className="v2-badge-svg" viewBox={`0 0 ${S} ${S}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="v2BadgeBg" cx="38%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#1c3a88" />
              <stop offset="100%" stopColor="#091540" />
            </radialGradient>
            <filter id="v2BadgeSoft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <path id="v2BadgePath" d={textPath} />
          </defs>

          {!customBadge && (
            <g>
              <circle cx={cx} cy={cy} r={rIn} fill="url(#v2BadgeBg)" />
              <circle cx={cx} cy={cy} r={rIn} fill="none" stroke="#F5A623" strokeWidth="0.8" strokeOpacity="0.3" />
              <polygon points={hex(rHex)} fill="none" stroke="#F5A623" strokeWidth="1.8" filter="url(#v2BadgeSoft)" />
              <polygon points={hex(rHex * 0.86)} fill="rgba(245,166,35,0.08)" />
              <text x={cx} y={cy - 2} textAnchor="middle" fontSize="20" fontWeight="900" fill="#F5A623" letterSpacing="2" filter="url(#v2BadgeSoft)">MK</text>
              <text x={cx} y={cy + 13} textAnchor="middle" fontSize="6.5" fontWeight="700" fill="rgba(255,255,255,0.85)" letterSpacing="2">VERIFIED</text>
              <text x={cx - 24} y={cy + 12} fontSize="5" fill="#F5A623" textAnchor="middle" opacity="0.9">✦</text>
              <text x={cx + 24} y={cy + 12} fontSize="5" fill="#F5A623" textAnchor="middle" opacity="0.9">✦</text>
            </g>
          )}

          <text fontSize={fontSize} fill="#FFFFFF" fontWeight="700" letterSpacing={dynamicSpacing}>
            <textPath href="#v2BadgePath" startOffset="0%">{finalStr}</textPath>
          </text>
        </svg>
        {customBadge && (
          <img src={customBadge} alt="Custom Badge" className="v2-badge-custom-img" />
        )}
      </div>
    </div>
  );
}
