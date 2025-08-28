'use client';

import { useState } from 'react';

export default function ClickTest() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('Initial Text');
  const [showBox, setShowBox] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Click Test Page</h1>
      
      {/* Test 1: Counter */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-bold mb-2">Test 1: Counter</h2>
        <p className="mb-2">Count: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Click Me (Count: {count})
        </button>
      </div>

      {/* Test 2: Text Change */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-bold mb-2">Test 2: Text Change</h2>
        <p className="mb-2">Text: {text}</p>
        <button 
          onClick={() => setText('Text Changed!')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Change Text
        </button>
      </div>

      {/* Test 3: Toggle */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-bold mb-2">Test 3: Toggle Box</h2>
        <button 
          onClick={() => setShowBox(!showBox)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mb-2"
        >
          Toggle Box
        </button>
        {showBox && (
          <div className="p-4 bg-yellow-100 rounded">
            <p>Box is visible!</p>
          </div>
        )}
      </div>

      {/* Test 4: Alert */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-bold mb-2">Test 4: Alert Test</h2>
        <button 
          onClick={() => alert('Alert works!')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Show Alert
        </button>
      </div>

      {/* Test 5: Console Log */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-bold mb-2">Test 5: Console Log</h2>
        <button 
          onClick={() => console.log('Console log works!', new Date().toISOString())}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Log to Console
        </button>
        <p className="text-sm text-gray-600 mt-2">Check browser console (F12)</p>
      </div>
    </div>
  );
}