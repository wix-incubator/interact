import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Docs root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <App />
);

