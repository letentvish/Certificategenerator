import { useState, useEffect } from 'react';
import { PRESETS } from '../utils/presets';

// Simulated LMS Database Hook
export function useLMS() {
  const [loading, setLoading] = useState(true);
  const [lmsData, setLmsData] = useState(null);

  useEffect(() => {
    // Check URL parameters for immediate LMS query parameters
    const params = new URLSearchParams(window.location.search);
    const student = params.get('student');
    const seat = params.get('seat');
    const presetId = params.get('preset');
    const certid = params.get('certid');
    const date = params.get('date');

    const handleFetch = async () => {
      // Simulate an API call to your LMS backend
      // Right now it just bridges the URL params into structured data
      // In production, you would fetch from: `https://your-lms-domain.com/api/certificates/${params.get('certid')}`
      
      const matchedPreset = PRESETS.find(p => p.id === presetId) || null;

      const data = {
        student: {
          name: student || '',
          seat: seat || '',
        },
        certificate: {
          id: certid || '',
          issueDate: date || new Date().toISOString().split('T')[0]
        },
        preset: matchedPreset
      };

      // Mock network latency for demonstration
      setTimeout(() => {
        setLmsData(data);
        setLoading(false);
      }, 500);
    };

    handleFetch();
  }, []);

  return { loading, lmsData };
}
