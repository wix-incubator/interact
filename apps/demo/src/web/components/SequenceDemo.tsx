import { useState, useMemo, useCallback } from 'react';
import type { InteractConfig } from '@wix/interact/web';
import { useInteractInstance } from '../hooks/useInteractInstance';

const createConfig = (offsetEasing: string): InteractConfig => ({
  effects: {
    'seq-effect-0': {
      key: 'seq-item-1',
      duration: 600,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      fill: 'both',
      keyframeEffect: {
        name: 'seq-entrance-0',
        keyframes: [
          { transform: 'translateY(40px) scale(0.8)', opacity: 0 },
          { transform: 'translateY(0) scale(1)', opacity: 1 },
        ],
      },
    },
    'seq-effect-1': {
      key: 'seq-item-2',
      duration: 600,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      fill: 'both',
      keyframeEffect: {
        name: 'seq-entrance-1',
        keyframes: [
          { transform: 'translateY(40px) scale(0.8)', opacity: 0 },
          { transform: 'translateY(0) scale(1)', opacity: 1 },
        ],
      },
    },
    'seq-effect-2': {
      key: 'seq-item-3',
      duration: 600,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      fill: 'both',
      keyframeEffect: {
        name: 'seq-entrance-2',
        keyframes: [
          { transform: 'translateY(40px) scale(0.8)', opacity: 0 },
          { transform: 'translateY(0) scale(1)', opacity: 1 },
        ],
      },
    },
    'seq-effect-3': {
      key: 'seq-item-4',
      duration: 600,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      fill: 'both',
      keyframeEffect: {
        name: 'seq-entrance-3',
        keyframes: [
          { transform: 'translateY(40px) scale(0.8)', opacity: 0 },
          { transform: 'translateY(0) scale(1)', opacity: 1 },
        ],
      },
    },
    'seq-effect-4': {
      key: 'seq-item-5',
      duration: 600,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      fill: 'both',
      keyframeEffect: {
        name: 'seq-entrance-4',
        keyframes: [
          { transform: 'translateY(40px) scale(0.8)', opacity: 0 },
          { transform: 'translateY(0) scale(1)', opacity: 1 },
        ],
      },
    },
    'seq-effect-5': {
      key: 'seq-item-6',
      duration: 600,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      fill: 'both',
      keyframeEffect: {
        name: 'seq-entrance-5',
        keyframes: [
          { transform: 'translateY(40px) scale(0.8)', opacity: 0 },
          { transform: 'translateY(0) scale(1)', opacity: 1 },
        ],
      },
    },
  },
  sequences: {
    'entrance-sequence': {
      sequenceId: 'entrance-sequence',
      delay: 0,
      offset: 120,
      offsetEasing,
      effects: [
        { effectId: 'seq-effect-0' },
        { effectId: 'seq-effect-1' },
        { effectId: 'seq-effect-2' },
        { effectId: 'seq-effect-3' },
        { effectId: 'seq-effect-4' },
        { effectId: 'seq-effect-5' },
      ],
    },
  },
  interactions: [
    {
      key: 'sequence-trigger',
      trigger: 'click',
      params: { type: 'alternate', threshold: 0.5 },
      sequences: [{ sequenceId: 'entrance-sequence' }],
    },
  ],
});

// Easing presets showcasing different types
const easingPresets = [
  { name: 'linear', value: 'linear', description: 'Named easing' },
  { name: 'quadOut', value: 'quadOut', description: 'Named easing' },
  { name: 'expoIn', value: 'expoIn', description: 'Named easing' },
  { name: 'ease-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)', description: 'CSS cubic-bezier' },
  { name: 'ease-in', value: 'cubic-bezier(0.4, 0, 1, 1)', description: 'CSS cubic-bezier' },
  {
    name: 'overshoot',
    value: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    description: 'CSS cubic-bezier (y > 1)',
  },
  {
    name: 'back-in',
    value: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
    description: 'CSS cubic-bezier (y < 0)',
  },
  { name: 'linear ramp', value: 'linear(0, 0.5, 1)', description: 'CSS linear()' },
  { name: 'fast-then-slow', value: 'linear(0, 0.3 50%, 1)', description: 'CSS linear()' },
];

const sequenceItems = [
  { id: 1, label: 'First', color: '#3b82f6' },
  { id: 2, label: 'Second', color: '#8b5cf6' },
  { id: 3, label: 'Third', color: '#ec4899' },
  { id: 4, label: 'Fourth', color: '#f97316' },
  { id: 5, label: 'Fifth', color: '#22c55e' },
  { id: 6, label: 'Sixth', color: '#06b6d4' },
];

export const SequenceDemo = () => {
  const [triggerKey, setTriggerKey] = useState(0);
  const [configText, setConfigText] = useState(() =>
    JSON.stringify(createConfig('quadOut'), null, 2),
  );
  const [parseError, setParseError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState('quadOut');

  const config = useMemo(() => {
    try {
      const parsed = JSON.parse(configText);
      setParseError(null);
      return parsed as InteractConfig;
    } catch (e) {
      setParseError((e as Error).message);
      return createConfig('quadOut');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configText, triggerKey]); // triggerKey forces re-creation of Interact instance

  useInteractInstance(config);

  const handleApply = () => {
    setTriggerKey((prev) => prev + 1);
  };

  const handleReset = () => {
    setConfigText(JSON.stringify(createConfig('quadOut'), null, 2));
    setActivePreset('quadOut');
    setTriggerKey((prev) => prev + 1);
  };

  const handlePresetClick = useCallback((preset: (typeof easingPresets)[0]) => {
    setConfigText(JSON.stringify(createConfig(preset.value), null, 2));
    setActivePreset(preset.value);
    setTriggerKey((prev) => prev + 1);
  }, []);

  return (
    <section className="sequence-demo-section panel">
      <div className="sequence-demo-header">
        <p className="scroll-label">Sequence Feature</p>
        <h3>Staggered Animations</h3>
        <p className="sequence-demo-description">
          Use <code>offsetEasing</code> to control stagger timing. Supports named easings, CSS{' '}
          <code>cubic-bezier()</code>, CSS <code>linear()</code>, and custom functions.
        </p>
      </div>

      <div className="easing-presets">
        <p className="scroll-label">Try Different Easing Types</p>
        <div className="easing-preset-buttons">
          {easingPresets.map((preset) => (
            <button
              key={preset.value}
              className={`easing-preset-btn ${activePreset === preset.value ? 'active' : ''}`}
              onClick={() => handlePresetClick(preset)}
              title={`${preset.description}: ${preset.value}`}
            >
              <span className="preset-name">{preset.name}</span>
              <span className="preset-type">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sequence-demo-layout">
        <div className="sequence-config-editor">
          <div className="sequence-config-header">
            <p className="scroll-label">InteractConfig (editable JSON)</p>
            {parseError && <span className="parse-error">Parse error: {parseError}</span>}
          </div>
          <textarea
            className="config-textarea"
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            spellCheck={false}
          />
          <div className="sequence-buttons">
            <button className="sequence-apply-button" onClick={handleApply}>
              Apply & Replay
            </button>
            <button className="sequence-reset-button" onClick={handleReset}>
              Reset to Default
            </button>
          </div>
        </div>

        <div className="sequence-demo-preview">
          <interact-element data-interact-key="sequence-trigger">
            <div className="sequence-trigger-area">
              <p className="sequence-trigger-hint">Scroll into view or click Apply & Replay</p>
              <div className="sequence-items-grid">
                {sequenceItems.map((item) => (
                  <interact-element key={item.id} data-interact-key={`seq-item-${item.id}`}>
                    <div
                      className="sequence-item"
                      style={{ '--item-color': item.color } as React.CSSProperties}
                    >
                      <span className="sequence-item-label">{item.label}</span>
                    </div>
                  </interact-element>
                ))}
              </div>
            </div>
          </interact-element>
        </div>
      </div>

      <div className="sequence-formula">
        <p className="scroll-label">Offset Formula</p>
        <code className="formula-code">
          delay + (easing(index / lastIndex) × lastIndex × offset)
        </code>
      </div>
    </section>
  );
};
