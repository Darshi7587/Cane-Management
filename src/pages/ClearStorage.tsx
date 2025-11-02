import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClearStorage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    console.log('✅ All storage cleared!');
    
    // Redirect to login after 1 second
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Clearing Storage...</h1>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}
