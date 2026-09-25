import { useState, useEffect, useRef } from 'react';
import { Fingerprint, ScanFace, AlertCircle, ShieldCheck } from 'lucide-react';
import { create, get, supported } from '@github/webauthn-json';
import client from '../api/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminBiometricLogin() {
  const [isSupported, setIsSupported] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('Secure Admin Portal');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem('admin_webauthn_email');

  const streamRef = useRef<MediaStream | null>(null);
  const [, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [, setScanProgress] = useState(0);

  useEffect(() => {
    if (!supported()) {
      setIsSupported(false);
      setMessage('Your device or browser does not support biometrics.');
    }
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStream(null);
  };

  // Removed the useEffect for stream as we will use a ref callback on the video element instead

  const startFaceScan = async () => {
    setStatus('idle');
    setScanProgress(0);
    try {
      setMessage('Initializing camera...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsScanning(true);
      setMessage('Align face within the frame...');
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 3;
        setScanProgress(progress);
        
        if (progress === 40) setMessage('Analyzing facial structure...');
        if (progress === 70) setMessage('Verifying depth map...');
        if (progress >= 100) {
          clearInterval(interval);
          setMessage('Face matched. Securing session...');
          stopCamera();
          setIsScanning(false);
          handleLogin();
        }
      }, 100);
      
    } catch (err) {
      console.error('Webcam error:', err);
      setStatus('error');
      setMessage('Camera access denied or unavailable.');
    }
  };

  const handleLogin = async () => {
    setStatus('loading');
    
    try {
      const optionsRes = await client.post('/webauthn/login/options', { email });
      const publicKeyCredentialRequestOptions = optionsRes.data;

      setMessage('Awaiting cryptographic approval (Windows Hello / FaceID)...');
      const assertion = await get({ publicKey: publicKeyCredentialRequestOptions });

      setMessage('Verifying signature on server...');
      const loginRes = await client.post('/webauthn/login', assertion);

      setStatus('success');
      setMessage('Authentication successful! Welcome, Admin.');
      
      localStorage.setItem('nexus_token', loginRes.data.token);
      setTimeout(() => navigate('/admin'), 1500);

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      if (err.response?.status === 422) {
        setMessage('Server rejected the request: ' + (serverMessage || 'Missing email or invalid configuration.'));
      } else {
        setMessage(serverMessage || err.message || 'Biometric authentication failed or was canceled.');
      }
    }
  };

  const handleRegisterDevice = async () => {
    setStatus('loading');
    setMessage('Prepare to register new device...');
    
    try {
      const optionsRes = await client.post('/webauthn/register/options');
      const publicKeyCredentialCreationOptions = optionsRes.data;

      const credential = await create({ publicKey: publicKeyCredentialCreationOptions });

      setMessage('Registering device securely...');
      await client.post('/webauthn/register', credential);

      setStatus('success');
      setMessage('Device registered successfully! You can now log in.');
      setTimeout(() => setStatus('idle'), 2500);

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      if (err.response?.status === 403) {
        setMessage('Unauthorized: Please go back and enter your password first.');
      } else if (err.response?.status === 422) {
        setMessage('Server rejected the request: ' + (serverMessage || 'Validation failed.'));
      } else {
        setMessage(serverMessage || err.message || 'Registration failed or was canceled.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center text-center">
          
          {/* Scanner Container */}
          <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
            
            {/* Spinning/Pulsing Outer Ring */}
            <motion.div 
              animate={
                isScanning ? { rotate: 360, scale: [1, 1.05, 1], borderColor: ['rgba(99,102,241,0.2)', 'rgba(99,102,241,0.8)', 'rgba(99,102,241,0.2)'] } : 
                status === 'loading' ? { rotate: 360, borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.1)'] } :
                status === 'success' ? { borderColor: 'rgba(34,197,94,0.6)', scale: 1.05 } :
                status === 'error' ? { borderColor: 'rgba(239,68,68,0.6)', x: [-10, 10, -10, 10, 0] } :
                { borderColor: 'rgba(255,255,255,0.1)', scale: 1 }
              }
              transition={
                isScanning || status === 'loading' ? { rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }, borderColor: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } } : 
                status === 'error' ? { duration: 0.4 } : 
                { duration: 0.3 }
              }
              className={`absolute inset-0 rounded-full border-[3px] border-transparent border-t-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.1)]`}
              style={{ borderTopColor: isScanning ? '#6366f1' : 'transparent' }}
            />
            
            {/* Inner Background Circle */}
            <div className={`absolute inset-2 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-500 ${
              isScanning ? 'bg-black' :
              status === 'error' ? 'bg-red-500/10' :
              status === 'success' ? 'bg-green-500/10' :
              'bg-white/5'
            }`}>
              
              <AnimatePresence mode="wait">
                {isScanning ? (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full relative"
                  >
                    <video 
                      ref={(el) => {
                        if (el && streamRef.current && el.srcObject !== streamRef.current) {
                          el.srcObject = streamRef.current;
                        }
                      }}
                      autoPlay 
                      playsInline 
                      muted 
                      className="absolute inset-0 w-full h-full object-cover opacity-100"
                    />
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none"></div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={`transition-colors duration-300 ${
                      status === 'error' ? 'text-red-400' :
                      status === 'success' ? 'text-green-400' :
                      'text-white/70'
                    }`}
                  >
                    {status === 'loading' ? <ScanFace size={42} className="opacity-50" /> : 
                     status === 'success' ? <ShieldCheck size={42} /> :
                     status === 'error' ? <AlertCircle size={42} /> :
                     <ScanFace size={42} strokeWidth={1.5} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">Nexus Admin</h2>
          <p className={`text-sm h-10 transition-colors duration-300 ${
            status === 'error' ? 'text-red-400' :
            status === 'success' ? 'text-green-400' :
            'text-white/50'
          }`}>
            {message}
          </p>

          <div className="w-full mt-6 space-y-3">
            <button
              onClick={startFaceScan}
              disabled={!isSupported || status === 'loading' || status === 'success' || isScanning}
              className="w-full bg-white text-black hover:bg-slate-200 active:scale-95 font-medium py-3.5 px-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <ScanFace size={18} />
              <span>{isScanning ? 'Scanning...' : 'Authenticate'}</span>
            </button>

            <button
              onClick={handleRegisterDevice}
              disabled={!isSupported || status === 'loading' || status === 'success' || isScanning}
              className="w-full bg-transparent hover:bg-white/10 text-white/70 hover:text-white border border-white/10 hover:border-white/20 font-medium py-3.5 px-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <Fingerprint size={18} />
              <span>Register Device</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
