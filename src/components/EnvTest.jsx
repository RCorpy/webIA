function EnvTest() {
  return (
    <div>
      <h1>Environment Test</h1>
      <p>API URL: {import.meta.env.VITE_API_URL || 'Not found'}</p>
    </div>
  );
}

export default EnvTest;