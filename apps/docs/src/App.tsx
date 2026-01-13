import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MarkdownPage } from './components/MarkdownPage';

function App() {
  // Remove trailing slash from BASE_URL for router basename
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

  return (
    <BrowserRouter basename={basename}>
      <Layout>
        <Routes>
          <Route path="*" element={<MarkdownPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
