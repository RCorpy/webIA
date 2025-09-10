// src/App.jsx
import AuthButton from './components/AuthButton';
import CreditDisplay from './components/CreditDisplay';
import AIRequestForm from './components/AIRequestForm';
import EnvTest from './components/EnvTest';
import './index.css';

function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>AI API Web App</h1>
      <AuthButton />
      <CreditDisplay />
      <AIRequestForm />
      <EnvTest />
    </div>
  );
}

export default App;

