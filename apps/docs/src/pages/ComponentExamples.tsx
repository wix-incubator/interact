import { Section } from '../components/Section';

const quickStart = `import { Interact } from '@wix/interact';

const config = {
  interactions: [
    {
      key: 'docs-card-primary',
      trigger: 'hover',
      effects: [{ effectId: 'card-lift' }]
    }
  ],
  effects: {
    'card-lift': {
      key: 'docs-card-primary',
      transitionProperties: [
        { name: 'transform', value: 'translateY(-8px)', duration: 220 }
      ]
    }
  }
};

const instance = Interact.create(config);
// Later in SPA teardown:
instance.destroy();`;

const reactIntegration = `function FeatureCard() {
  return (
    <interact-element data-interact-key="docs-card-primary">
      <div className="card">React + Interact</div>
    </interact-element>
  );
}`;

export const ComponentExamples = () => (
  <Section
    id="examples"
    kicker="Examples"
    title="Docs-powered component recipes"
    description="Every docs page can import @wix/interact directly thanks to npm workspaces. Use these snippets as drop-in starters for your product pages."
  >
    <div className="card-grid">
      <div className="card">
        <h4>Quick start</h4>
        <pre>{quickStart}</pre>
      </div>
      <div className="card">
        <h4>React component</h4>
        <pre>{reactIntegration}</pre>
      </div>
    </div>
  </Section>
);

