// components/LoginPage.jsx
'use client'
import { signInWithGoogle } from '@/lib/auth'


export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white rounded-xl shadow-md p-10 w-full max-w-md text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full">
          <svg
            className="w-8 h-8 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold mb-2">FocusDot</h1>
        <p className="text-gray-600 mb-6">Sign in to your account to get started</p>
        <button 
        onClick={() => {
          console.log('Google sign-in clicked')
           signInWithGoogle() // Temporarily commented out
        }}
        className="flex items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
          <svg
            className="w-5 h-5 mr-2"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8c0-17.8-1.5-35.6-4.7-52.8H249v99.7h135.7c-5.8 31.4-23.4 58-49.6 76l80 62.4c47-43.4 74-107.4 74-185.3zM249 492c66 0 121.3-21.7 161.7-58.7l-80-62.4c-22.2 15-50.6 23.9-81.7 23.9-62.8 0-116-42.5-135-99.7l-83.4 64.8C55.8 453.3 145.2 492 249 492zM114 303.1c-6.4-18.8-10-38.8-10-59.1s3.6-40.3 10-59.1l-83.4-64.8C11.7 153.7 0 199.3 0 244s11.7 90.3 30.6 123.9l83.4-64.8zM249 98.3c35.8 0 67.8 12.4 93.2 36.7l69.8-69.8C366.3 29 312 8 249 8 145.2 8 55.8 46.7 30.6 120.1l83.4 64.8c19-57.2 72.2-99.7 135-99.7z"
            />
          </svg>
          Sign in with Google
        </button>
        <p className="text-gray-400 text-xs mt-6">Protected by secure OAuth2</p>
      </div>
    </div>
  );
}