import { useEffect, useMemo, useState } from 'react';
import type { InteractConfig } from '@wix/interact/react';
import { Interact, Interaction, generateCSS } from '@wix/interact/react';

const demoConfig: InteractConfig = {
  interactions: [
    {
      key: 'css-demo-card-1',
      trigger: 'viewEnter',
      params: { type: 'repeat', threshold: 0.5 },
      effects: [
        {
          keyframeEffect: {
            name: 'fade-slide-up',
            keyframes: [
              { opacity: 0, transform: 'translateY(30px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ]
          },
          duration: 600,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          initial: {
            opacity: 0,
            transform: 'translateY(30px)'
          }
        }
      ]
    },
    {
      key: 'css-demo-card-2',
      trigger: 'viewEnter',
      params: { type: 'repeat', threshold: 0.5 },
      effects: [
        {
          keyframeEffect: {
            name: 'scale-fade-in',
            keyframes: [
              { opacity: 0, transform: 'scale(0.9)' },
              { opacity: 1, transform: 'scale(1)' }
            ]
          },
          duration: 500,
          delay: 150,
          easing: 'ease-out',
          initial: {
            opacity: 0,
            transform: 'scale(0.9)'
          }
        }
      ]
    },
    {
      key: 'css-demo-card-3',
      trigger: 'viewEnter',
      params: { type: 'repeat', threshold: 0.5 },
      effects: [
        {
          keyframeEffect: {
            name: 'blur-reveal',
            keyframes: [
              { opacity: 0, filter: 'blur(10px)', transform: 'translateX(-20px)' },
              { opacity: 1, filter: 'blur(0)', transform: 'translateX(0)' }
            ]
          },
          duration: 700,
          delay: 300,
          easing: 'ease-out',
          initial: {
            opacity: 0,
            filter: 'blur(10px)',
            transform: 'translateX(-20px)'
          }
        }
      ]
    }
  ],
  effects: {}
};

export const CSSGenerationDemo = () => {
  const [useCSSAnimations, setUseCSSAnimations] = useState(true);
  const [showCSS, setShowCSS] = useState(false);

  const generatedCSS = useMemo(() => generateCSS(demoConfig), []);

  // Inject or remove CSS based on toggle
  useEffect(() => {
    const styleId = 'css-generation-demo-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (useCSSAnimations) {
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = generatedCSS;
    } else {
      styleEl?.remove();
    }

    return () => {
      // Cleanup on unmount
      document.getElementById(styleId)?.remove();
    };
  }, [useCSSAnimations, generatedCSS]);

  // Initialize Interact for trigger handling (both modes need this for viewEnter detection)
  useEffect(() => {
    const instance = Interact.create(demoConfig);
    return () => instance.destroy();
  }, []);

  return (
    <section className="demo-section css-generation-demo">
      <div className="demo-header">
        <h2>CSS Generation Demo</h2>
        <p>
          Use <code>generateCSS()</code> to pre-render animation CSS for SSR or efficient CSR.
          The animations run as pure CSS when enabled, reducing JavaScript overhead.
        </p>
      </div>

      <div className="demo-controls panel">
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={useCSSAnimations}
              onChange={(e) => setUseCSSAnimations(e.target.checked)}
            />
            Use CSS Animations (via generateCSS)
          </label>
          <span className="mode-badge">
            {useCSSAnimations ? '🎨 CSS Mode' : '⚡ JS Mode'}
          </span>
        </div>

        <div className="control-group">
          <button
            className="toggle-css-btn"
            onClick={() => setShowCSS(!showCSS)}
          >
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

      <div className="demo-grid css-demo-cards">
        <Interaction tagName="div" interactKey="css-demo-card-1" className="panel demo-card">
          <p className="scroll-label">Card 1 - Fade Slide Up</p>
          <h3>Entrance Animation</h3>
          <p>
            This card uses <code>initial</code> to set opacity and transform
            before the viewEnter animation triggers.
          </p>
        </Interaction>

        <Interaction tagName="div" interactKey="css-demo-card-2" className="panel demo-card">
          <p className="scroll-label">Card 2 - Scale Fade In</p>
          <h3>Delayed Start</h3>
          <p>
            A 150ms delay creates a staggered effect. The <code>initial</code> 
            property ensures the card starts scaled down and invisible.
          </p>
        </Interaction>

        <Interaction tagName="div" interactKey="css-demo-card-3" className="panel demo-card">
          <p className="scroll-label">Card 3 - Blur Reveal</p>
          <h3>Complex Initial State</h3>
          <p>
            Custom <code>initial</code> includes blur filter, opacity, and transform
            for a sophisticated reveal effect.
          </p>
        </Interaction>
      </div>

      <div className="panel info-box">
        <h4>How it works</h4>
        <ul>
          <li>
            <strong>CSS Mode:</strong> <code>generateCSS()</code> outputs @keyframes and
            animation rules. Animations run on the compositor thread for better performance.
          </li>
          <li>
            <strong>JS Mode:</strong> Animations are controlled by JavaScript via the
            Web Animations API. More flexible but requires hydration.
          </li>
          <li>
            <strong>The <code>initial</code> property:</strong> Defines the pre-animation
            state, rendered as a <code>from</code> keyframe to prevent content flash.
          </li>
        </ul>
      </div>
    </section>
  );
};

