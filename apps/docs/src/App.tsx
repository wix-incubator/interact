import { Layout } from './components/Layout';
import { Introduction } from './pages/Introduction';
import { ComponentExamples } from './pages/ComponentExamples';
import { ApiCheatsheet } from './pages/ApiCheatsheet';

function App() {
  return (
    <Layout>
      <Introduction />
      <ComponentExamples />
      <ApiCheatsheet />
    </Layout>
  );
}

export default App;

