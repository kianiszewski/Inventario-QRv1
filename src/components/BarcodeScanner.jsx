import React, { useState, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

const BarcodeScanner = () => {
  const [data, setData] = useState('No hay resultados');
  const [scanning, setScanning] = useState(false);
  const [info, setInfo] = useState({
    codigo: '',
    descripcion: '',
    cantidad: '',
    ubicacion: ''
  });
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  const startScan = () => {
    codeReader.current = new BrowserMultiFormatReader();
    if (videoRef.current) {
      codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          setData(result.text);  // Captura el texto completo del QR
          parseQRData(result.text);  // Extraemos la información
        }
        if (err && err.name !== 'NotFoundException') {
          console.error(err);
        }
      });
      setScanning(true);  // Cambiamos el estado a "escaneando"
    }
  };

  const stopScan = () => {
    if (codeReader.current) {
      codeReader.current.reset();  // Detenemos el escaneo y liberamos la cámara
      setScanning(false);
    }
  };

  // Función para procesar la información del QR
  const parseQRData = (text) => {
    const data = {
      codigo: '',
      descripcion: '',
      cantidad: '',
      ubicacion: ''
    };

    // Separamos por comas y luego por los dos puntos
    const pairs = text.split(',').map(item => item.split(':'));
    pairs.forEach(([key, value]) => {
      if (key && value) {
        const trimmedKey = key.trim().toLowerCase();
        const trimmedValue = value.trim();
        if (trimmedKey === 'código') {
          data.codigo = trimmedValue;
        } else if (trimmedKey === 'descripción') {
          data.descripcion = trimmedValue;
        } else if (trimmedKey === 'cantidad') {
          data.cantidad = trimmedValue;
        } else if (trimmedKey === 'ubicación') {
          data.ubicacion = trimmedValue;
        }
      }
    });

    setInfo(data);  // Guardamos la información extraída
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <video ref={videoRef} style={{ width: '100%', height: 'auto', display: scanning ? 'block' : 'none' }} />
      
      <button onClick={scanning ? stopScan : startScan} style={{ marginTop: '20px', padding: '10px', backgroundColor: scanning ? '#FF4136' : '#007BFF', color: 'white' }}>
        {scanning ? 'Detener escaneo' : 'Comenzar a escanear'}
      </button>

      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <h2>Información capturada:</h2>
        <p><strong>Código:</strong> {info.codigo || 'N/A'}</p>
        <p><strong>Descripción:</strong> {info.descripcion || 'N/A'}</p>
        <p><strong>Cantidad:</strong> {info.cantidad || 'N/A'}</p>
        <p><strong>Ubicación:</strong> {info.ubicacion || 'N/A'}</p>
      </div>

      <p>Texto completo escaneado: {data}</p>
    </div>
  );
};

export default BarcodeScanner;
