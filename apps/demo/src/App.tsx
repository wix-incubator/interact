import { Playground } from './components/Playground';
import { ScrollShowcase } from './components/ScrollShowcase';
import { ResponsiveDemo } from './components/ResponsiveDemo';
import { SelectorConditionDemo } from './components/SelectorConditionDemo';

const heroCopy = [
  'Tune triggers, easings, and delays in real time.',
  'Preview viewProgress and hover behaviors without leaving the repo.',
  'Copy the JSON config directly into CMS or product experiments.',
];

function App() {
  return (
    <div className="demo-shell">
      <header className="demo-hero">
        <p className="scroll-label">Interact Demo Lab</p>
        <h1 className="demo-hero-title">Experiment faster</h1>
        <p className="demo-hero-body">
          A playground focused on validating motion recipes, stress-testing new triggers, and
          exporting configs that production surfaces can consume immediately.
        </p>

        <div className="stacked-scenes demo-hero-scenes">
          {heroCopy.map((line) => (
            <div className="panel" key={line}>
              <p className="panel-text">{line}</p>
            </div>
          ))}
        </div>
      </header>

      <Playground />
      <SelectorConditionDemo />
      <div className="scroll-showcase-wrapper">
        <ResponsiveDemo />
        <ScrollShowcase />
      </div>
    </div>
  );
}

export default App;
