import { InteractConfig, Interaction } from '@wix/interact/react';
import { useInteractInstance } from '../hooks/useInteractInstance';
import { useState } from 'react';

type EasingOption = 'linear' | 'quadIn' | 'quadOut' | 'cubicIn' | 'cubicOut' | 'sineIn' | 'sineOut';

const staggerItems = [
  { id: 1, label: 'Design', color: '#3b82f6' },
  { id: 2, label: 'Develop', color: '#8b5cf6' },
  { id: 3, label: 'Deploy', color: '#ec4899' },
  { id: 4, label: 'Iterate', color: '#f97316' },
  { id: 5, label: 'Scale', color: '#10b981' },
];

const createStaggerConfig = (offset: number, easing: EasingOption): InteractConfig => ({
  interactions: [
    {
      trigger: 'viewEnter',
      key: 'stagger-demo-container',
      params: {
        type: 'repeat',
        threshold: 0.3,
      },
      sequence: {
        delay: 0,
        offset,
        offsetEasing: easing,
      },
      effects: staggerItems.map((item, index) => ({
        effectId: `stagger-item-${index}`,
        selector: `[data-stagger-id="${item.id}"]`,
      })),
    },
  ],
  effects: Object.fromEntries(
    staggerItems.map((_, index) => [
      `stagger-item-${index}`,
      {
        duration: 600,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fill: 'both' as const,
        keyframeEffect: {
          name: `stagger-entrance-${index}`,
          keyframes: [
            { opacity: 0, transform: 'translateY(40px) scale(0.9)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' },
          ],
        },
      },
    ]),
  ),
});

export const StaggerDemo = () => {
  const [offset, setOffset] = useState(150);
  const [easing, setEasing] = useState<EasingOption>('quadOut');
  const [configKey, setConfigKey] = useState(0);

  // Recreate the config when settings change
  const config = createStaggerConfig(offset, easing);
  useInteractInstance(config);

  const handleReset = () => {
    setConfigKey((prev) => prev + 1);
  };

  return (
    <section className="panel stagger-demo-section">
      <p className="scroll-label">Sequence Stagger Demo</p>
      <div className="stagger-demo-header">
        <h3>Sequenced Animations</h3>
        <p className="stagger-demo-description">
          Effects are staggered using the new <code>sequence</code> property with configurable{' '}
          <code>offset</code> and <code>offsetEasing</code>.
          <br />
          Scroll down to trigger the entrance animation, then adjust settings and reset.
        </p>
      </div>

      <div className="stagger-demo-controls">
        <div className="stagger-control-group">
          <label>
            Offset (ms): <span className="stagger-control-value">{offset}</span>
          </label>
          <input
            type="range"
            min="50"
            max="600"
            step="25"
            value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
          />
        </div>

        <div className="stagger-control-group">
          <label>
            Easing: <span className="stagger-control-value">{easing}</span>
          </label>
          <select value={easing} onChange={(e) => setEasing(e.target.value as EasingOption)}>
            <option value="linear">Linear</option>
            <option value="quadIn">Quad In (accelerate)</option>
            <option value="quadOut">Quad Out (decelerate)</option>
            <option value="cubicIn">Cubic In</option>
            <option value="cubicOut">Cubic Out</option>
            <option value="sineIn">Sine In</option>
            <option value="sineOut">Sine Out</option>
          </select>
        </div>

        <button className="stagger-reset-button" onClick={handleReset}>
          Reset Animation
        </button>
      </div>

      <Interaction tagName="div" interactKey="stagger-demo-container" key={configKey}>
        <div className="stagger-demo-grid">
          {staggerItems.map((item) => (
            <div
              key={item.id}
              data-stagger-id={item.id}
              className="stagger-demo-card"
              style={{ '--card-color': item.color } as React.CSSProperties}
            >
              <span className="stagger-demo-index">{item.id}</span>
              <span className="stagger-demo-label">{item.label}</span>
            </div>
          ))}
        </div>
      </Interaction>

      <div className="stagger-demo-info">
        <p className="stagger-demo-config-preview">
          <strong>Current Config:</strong>
          <code>{`sequence: { offset: ${offset}, offsetEasing: '${easing}' }`}</code>
        </p>
        <p className="stagger-demo-delays">
          <strong>Calculated delays:</strong>{' '}
          {calculateDelaysPreview(staggerItems.length, offset, easing)}
        </p>
      </div>
    </section>
  );
};

// Simple preview of delays for display purposes
function calculateDelaysPreview(count: number, offset: number, easing: EasingOption): string {
  const easingFns: Record<EasingOption, (t: number) => number> = {
    linear: (t) => t,
    quadIn: (t) => t ** 2,
    quadOut: (t) => 1 - (1 - t) ** 2,
    cubicIn: (t) => t ** 3,
    cubicOut: (t) => 1 - (1 - t) ** 3,
    sineIn: (t) => 1 - Math.cos((t * Math.PI) / 2),
    sineOut: (t) => Math.sin((t * Math.PI) / 2),
  };

  const fn = easingFns[easing];
  const last = count - 1;
  const delays = Array.from({ length: count }, (_, i) => {
    const easedValue = fn(i / last);
    return Math.floor(easedValue * last * offset);
  });

  return delays.map((d) => `${d}ms`).join(', ');
}
