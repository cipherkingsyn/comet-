import React from 'react';
import { GlowingBall } from './components/GlowingBall';
import { MainContent } from './components/MainContent';

function App() {
  return (
    <div className="relative min-h-screen bg-black">
      <GlowingBall text="COMET" />
      <MainContent />
    </div>
  );
}

export default App;