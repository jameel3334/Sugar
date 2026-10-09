import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './styles/base.css';
import './styles/noir.css';
import './styles/majlis.css';
import './styles/atelier.css';
import './styles/prism.css';
import './styles/dunes.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
