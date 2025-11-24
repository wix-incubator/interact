import { InteractConfig } from '@wix/interact';
import { useEffect, useState } from 'react';
import { useInteractInstance } from '../hooks/useInteractInstance';

const complexConfig: InteractConfig = {
  conditions: {
    desktop: {
      type: 'media',
      predicate: 'min-width: 1024px',
    },
    mobile: {
      type: 'media',
      predicate: 'max-width: 767px',
    },
    tabletMinWidth: {
      type: 'media',
      predicate: 'min-width: 768px',
    },
    tabletMaxWidth: {
      type: 'media',
      predicate: 'max-width: 1025px',
    },
  },
  interactions: [
    {
      trigger: 'click',
      params: {
        type: 'repeat',
      },
      key: 'multi-source-1',
      effects: [
        {
          key: 'cascade-target-1',
          effectId: 'desktop-effect',
          conditions: ['desktop'],
        },
        {
          key: 'cascade-target-2',
          effectId: 'mobile-effect',
          conditions: ['tabletMinWidth', 'tabletMaxWidth'],
        },
        {
          key: 'cascade-target-3',
          effectId: 'mobile-effect',
          conditions: ['mobile'],
        },
      ],
    },
  ],
  effects: {
    'desktop-effect': {
      //@ts-ignore
      namedEffect: {
        type: 'SlideIn',
      },
      duration: 1800,
    },
    'mobile-effect': {
      namedEffect: {
        type: 'BounceIn',
        direction: 'center',
        power: 'hard',
      },
      duration: 600,
    },
  },
};

export const ResponsiveDemo = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useInteractInstance(complexConfig);

  return (
    <section className="panel" style={{ marginTop: '20px', position: 'relative' }}>
      <p className="scroll-label">Responsive Demo</p>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '48px',
          color: '#faf7f7',
        }}
      >
        screen width: {width}px
      </div>
      <div style={{ padding: '20px' }}>
        <h3 style={{ marginBottom: '10px' }}>Responsive Interactions</h3>
        <p style={{ marginBottom: '20px', color: '#888' }}>
          Resize the window to see different effects on click.
          <br />
          <strong>Desktop (≥1024px):</strong> SlideIn on Target 1<br />
          <strong>Mobile (≤767px):</strong> BounceIn on Target 2
        </p>

        <div style={{ marginBottom: '30px' }}>
          {/* Trigger */}
          <interact-element data-interact-key="multi-source-1" style={{ display: 'inline-block' }}>
            <button
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                cursor: 'pointer',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Trigger Animation
            </button>
          </interact-element>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* Target 1 */}
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                marginBottom: '8px',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Desktop Target
            </p>
            <interact-element data-interact-key="cascade-target-1">
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Slide In
              </div>
            </interact-element>
          </div>

          {/* Target 2 */}
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                marginBottom: '8px',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Tablet Target
            </p>
            <interact-element data-interact-key="cascade-target-2">
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Bounce In
              </div>
            </interact-element>
          </div>
          {/* Target 3 */}
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                marginBottom: '8px',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Mobile Target
            </p>
            <interact-element data-interact-key="cascade-target-3">
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Bounce In
              </div>
            </interact-element>
          </div>
        </div>
      </div>
    </section>
  );
};
