import { Section } from '../components/Section';

const apiList = [
  {
    label: 'Interact.create(config)',
    detail: 'Initializes an instance and registers the <interact-element> custom element.'
  },
  {
    label: 'Interact.getInstance(key)',
    detail: 'Returns the instance responsible for a given interaction key.'
  },
  {
    label: 'add(element, key)',
    detail: 'Registers an element with an instance and applies configured triggers/effects.'
  },
  {
    label: 'remove(key)',
    detail: 'Detaches all handlers and clears cached effects for the provided key.'
  }
];

export const ApiCheatsheet = () => (
  <Section
    id="api"
    kicker="API"
    title="Key entrypoints"
    description="These are the primitives you will reach for when wiring Interact into frameworks, SSR sites, or low-code builders."
  >
    <div className="card-grid">
      {apiList.map((item) => (
        <div key={item.label} className="card">
          <h4>{item.label}</h4>
          <p style={{ margin: 0, color: '#475569' }}>{item.detail}</p>
        </div>
      ))}
    </div>
  </Section>
);

