import { useState, useEffect } from 'react';
import { Fingerprint, ScanFace, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { create, get, supported } from '@github/webauthn-json';
import client from '../api/client';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminBiometricLogin() {
  const [isSupported, setIsSupported] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('Secure Admin Portal');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem('admin_webauthn_email');

  useEffect(() => {
    if (!supported()) {
      setIsSupported(false);
      setMessage('Your device or browser does not support biometrics.');
    }
  }, []);

  const handleLogin = async () => {
    setStatus('loading');
    setMessage('Waiting for device sensor...');
    
    try {
      const optionsRes = await client.post('/webauthn/login/options', { email });
      const publicKeyCredentialRequestOptions = optionsRes.data;

      const assertion = await get({ publicKey: publicKeyCredentialRequestOptions });

      setMessage('Verifying cryptographic signature...');
      const loginRes = await client.post('/webauthn/login', assertion);

      setStatus('success');
      setMessage('Authentication successful!');
      
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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
          
          <div className="flex flex-col items-center mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
              status === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              status === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]' :
              status === 'loading' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse' :
              'bg-slate-800 border border-slate-700 text-indigo-400'
            }`}>
              {status === 'loading' ? <Loader2 size={36} className="animate-spin" /> : 
               status === 'success' ? <ShieldCheck size={36} /> :
               status === 'error' ? <AlertCircle size={36} /> :
               <ScanFace size={36} />}
            </div>
            
            <h2 className="text-2xl font-bold text-white tracking-wide">Nexus Admin</h2>
            <p className={`text-sm mt-2 text-center transition-colors duration-300 ${
              status === 'error' ? 'text-red-400' :
              status === 'success' ? 'text-green-400' :
              'text-slate-400'
            }`}>
              {message}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              disabled={!isSupported || status === 'loading' || status === 'success'}
              className="w-full relative group overflow-hidden rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 px-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <ScanFace size={20} />
              <span>Authenticate with FaceID / Windows Hello</span>
            </button>

            <button
              onClick={handleRegisterDevice}
              disabled={!isSupported || status === 'loading' || status === 'success'}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 font-medium py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <Fingerprint size={20} />
              <span>Register New Device</span>
            </button>
          </div>

          {!isSupported && (
            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 text-xs text-center leading-relaxed">
              Biometric hardware was not detected. Please ensure you are using a compatible browser and device (e.g., TouchID, FaceID, or Windows Hello).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
