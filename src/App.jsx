import { useState } from 'react';
import AuthButton from './components/AuthButton';
import CreditDisplay from './components/CreditDisplay';
import AIRequestForm from './components/AIRequestForm';
import './index.css';

function App() {
  const [credits, setCredits] = useState(0); // lifted state

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>AI API Web App</h1>
      <AuthButton />
      {/* 🔑 pass both credits and setCredits */}
      <CreditDisplay credits={credits} setCredits={setCredits} />
      <AIRequestForm setCredits={setCredits} />
    </div>
  );
}

export default App;
