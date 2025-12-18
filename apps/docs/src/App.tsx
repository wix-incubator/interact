import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MarkdownPage } from './components/MarkdownPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="*" element={<MarkdownPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
