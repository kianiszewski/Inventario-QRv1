import React from 'react';
import BarcodeScanner from './components/BarcodeScanner';

const App = () => {
  return (
    <div className="App">
      <h1>Inventario QR</h1>
      <BarcodeScanner />
    </div>
  );
}

export default App;
