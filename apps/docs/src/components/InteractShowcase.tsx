import { useEffect, useMemo } from 'react';
import { Interact, type InteractConfig } from '@wix/interact';

const demoConfig: InteractConfig = {
  interactions: [
    {
      trigger: 'viewEnter',
      key: 'docs-hero',
      params: { type: 'once', threshold: 0.6 },
      effects: [{ effectId: 'hero-reveal' }]
    },
    {
      trigger: 'hover',
      key: 'docs-card-primary',
      effects: [{ effectId: 'card-lift' }]
    },
    {
      trigger: 'click',
      key: 'docs-card-secondary',
      params: { method: 'toggle' },
      effects: [{ effectId: 'card-press' }]
    }
  ],
  effects: {
    'hero-reveal': {
      key: 'docs-hero',
      duration: 900,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      keyframeEffect: {
        name: 'hero-reveal',
        keyframes: [
          { opacity: 0, transform: 'translateY(28px)' },
          { opacity: 1, transform: 'translateY(0px)' }
        ]
      }
    },
    'card-lift': {
      key: 'docs-card-primary',
      transitionProperties: [
        {
          name: 'transform',
          value: 'translateY(-8px)',
          duration: 220,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        {
          name: 'box-shadow',
          value: '0 24px 50px rgba(15, 23, 42, 0.18)',
          duration: 220,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
      ]
    },
    'card-press': {
      key: 'docs-card-secondary',
      duration: 500,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      keyframeEffect: {
        name: 'card-press',
        keyframes: [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(0.95)', opacity: 0.9 },
          { transform: 'scale(1)', opacity: 1 }
        ]
      }
    }
  }
};

const cards = [
  {
    key: 'docs-card-primary',
    title: 'Hero CTA',
    description: 'Hover to preview transition-based lift + depth.'
  },
  {
    key: 'docs-card-secondary',
    title: 'Click Pulse',
    description: 'Click to trigger the custom keyframe effect powered by motion.'
  }
];

export const InteractShowcase = () => {
  const config = useMemo(() => demoConfig, []);

  useEffect(() => {
    const interactInstance = Interact.create(config);

    return () => {
      interactInstance.destroy();
    };
  }, [config]);

  return (
    <div>
      <interact-element data-interact-key="docs-hero">
        <div
          className="card hero-card"
        >
          <p className="hero-kicker">
            Powered by Interact
          </p>
          <h3 className="hero-title">Configurable animation without the fog</h3>
          <p className="hero-description">
            Drive orchestrated hover, scroll, and pointer interactions using a single JSON file.
          </p>
        </div>
      </interact-element>

      <div className="card-grid">
        {cards.map((card) => (
          <interact-element key={card.key} data-interact-key={card.key}>
            <div className="card card-interactive">
              <h4 className="card-title">{card.title}</h4>
              <p className="card-text-muted">{card.description}</p>
            </div>
          </interact-element>
        ))}
      </div>
    </div>
  );
};

