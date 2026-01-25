import { useState } from 'react';
import type { InteractConfig } from '@wix/interact/web';
import { Interact, generateCSS } from '@wix/interact/web';

const demoConfig: InteractConfig = {
  interactions: [
    {
      key: 'css-demo-card-1',
      trigger: 'viewEnter',
      params: { type: 'once', threshold: 0.5 },
      effects: [
        {
          keyframeEffect: {
            name: 'fade-slide-up',
            keyframes: [
              { opacity: 0, transform: 'translateX(-50vw)' },
              { opacity: 1, transform: 'translateX(0)' },
            ],
          },
          duration: 600,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'backwards',
        },
      ],
    },
    {
      key: 'css-demo-card-2',
      trigger: 'viewEnter',
      params: { type: 'once', threshold: 0.5 },
      effects: [
        {
          keyframeEffect: {
            name: 'scale-fade-in',
            keyframes: [
              { opacity: 0, transform: 'scale(0.9)' },
              { opacity: 1, transform: 'scale(1)' },
            ],
          },
          duration: 500,
          delay: 150,
          easing: 'ease-out',
          fill: 'backwards',
          initial: {
            opacity: '0',
          },
        },
      ],
    },
    {
      key: 'css-demo-card-3',
      trigger: 'viewEnter',
      params: { type: 'once', threshold: 0.5 },
      effects: [
        {
          keyframeEffect: {
            name: 'blur-reveal',
            keyframes: [
              { opacity: 0.5, filter: 'blur(10px)', transform: 'translateX(-20px)' },
              { opacity: 1, filter: 'blur(0)', transform: 'translateX(0)' },
            ],
          },
          duration: 700,
          delay: 300,
          easing: 'ease-out',
          fill: 'backwards',
          initial: false,
        },
      ],
    },
  ],
  effects: {},
};

export const CSSGenerationDemo = () => {
  const [showCSS, setShowCSS] = useState(true);

  const generatedCSS = generateCSS(demoConfig);
  Interact.create(demoConfig);

  return (
    <section className="demo-section css-generation-demo">
      <style>{generatedCSS}</style>
      <div className="demo-header">
        <h2>CSS Generation Demo</h2>
        <p>
          Use <code>generateCSS()</code> to pre-render animation CSS for SSR or efficient CSR. The
          animations run as pure CSS when enabled, reducing JavaScript overhead.
        </p>
      </div>

      <div className="demo-grid css-demo-cards">
        <interact-element data-interact-key="css-demo-card-1">
          <div className="panel demo-card">
            <p className="scroll-label">Card 1 - Fade Slide Up</p>
            <h3>Entrance Animation</h3>
            <p>
              This card uses the default <code>initial</code> to set visibility to hidden and
              transform to none before the viewEnter animation triggers to enable intersection.
            </p>
          </div>
        </interact-element>

        <interact-element data-interact-key="css-demo-card-2">
          <div className="panel demo-card">
            <p className="scroll-label">Card 2 - Scale Fade In</p>
            <h3>Delayed Start</h3>
            <p>
              Custom <code>initial</code> on this card setting the opacity property ensures the card
              starts transparent and invisible.
            </p>
          </div>
        </interact-element>

        <interact-element data-interact-key="css-demo-card-3">
          <div className="panel demo-card">
            <p className="scroll-label">Card 3 - Blur Reveal</p>
            <h3>Complex Initial State</h3>
            <p>
              When <code>initial</code> is set to false, the first frame of the animation is set and
              might affect intersection.
            </p>
          </div>
        </interact-element>
      </div>

      <div className="demo-controls panel">
        <div className="control-group">
          <button className="toggle-css-btn" onClick={() => setShowCSS(!showCSS)}>
            {showCSS ? 'Hide' : 'Show'} Generated CSS
          </button>
        </div>
      </div>

      {showCSS && (
        <div className="panel css-output">
          <p className="scroll-label">Generated CSS Output</p>
          <pre>{generatedCSS || '/* No CSS generated */'}</pre>
        </div>
      )}
    </section>
  );
};
