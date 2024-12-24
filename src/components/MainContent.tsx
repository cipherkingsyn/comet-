import React from 'react';

export function MainContent() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div id="content" className="text-center relative z-10">
        <h1 className="text-5xl font-bold mb-2 text-black">COMET</h1>
        <p className="text-xl mb-8 text-black">Fast, limitless web exploration.</p>
        <button className="btn">
          <span>Get started!</span>
        </button>
      </div>
    </div>
  );
}