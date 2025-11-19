import { Section } from '../components/Section';
import { InteractShowcase } from '../components/InteractShowcase';

export const Introduction = () => {
  return (
    <Section
      id="introduction"
      kicker="Start here"
      title="Bring intent-driven interactions to life"
      description={
        <>
          Interact pairs a declarative config format with the <code>&lt;interact-element&gt;</code>{' '}
          custom element so you can orchestrate hover, scroll, view, and pointer motion without
          imperative glue code. The docs app ships with a live preview wired to the actual{' '}
          <code>@wix/interact</code> workspace.
        </>
      }
    >
      <InteractShowcase />
    </Section>
  );
};

