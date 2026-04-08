import { useState, useRef, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  type ConfirmationResult,
  type User,
} from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

function isInIframe() {
  try { return window.self !== window.top; } catch { return true; }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [redirectPending, setRedirectPending] = useState(true);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setSuccess("Signed in with Google successfully!");
        }
      })
      .catch((err) => {
        if (err.code !== "auth/no-current-user") {
          const msg = getFirebaseError(err.code);
          if (msg) setError(msg);
        }
      })
      .finally(() => setRedirectPending(false));
  }, []);

  const clearMessages = () => { setError(null); setSuccess(null); };

  const getFirebaseError = (code: string) => {
    const map: Record<string, string> = {
      "auth/unauthorized-domain": "This domain is not authorized in Firebase. Go to Firebase Console → Authentication → Settings → Authorized domains and add your Replit domain.",
      "auth/popup-blocked": "Popup was blocked. Redirecting to Google sign-in...",
      "auth/popup-closed-by-user": "Sign-in popup was closed. Please try again.",
      "auth/cancelled-popup-request": "",
      "auth/invalid-phone-number": "Invalid phone number. Use international format: +91 98765 43210",
      "auth/invalid-verification-code": "Incorrect OTP. Please check and try again.",
      "auth/code-expired": "OTP has expired. Please request a new one.",
      "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
    };
    return map[code] ?? null;
  };

  const handleGoogleSignIn = async () => {
    clearMessages();
    setLoading("google");
    const provider = new GoogleAuthProvider();

    if (isInIframe()) {
      try {
        await signInWithRedirect(auth, provider);
      } catch (err: any) {
        const msg = getFirebaseError(err.code) || err.message;
        setError(msg);
        setLoading(null);
      }
      return;
    }

    try {
      await signInWithPopup(auth, provider);
      setSuccess("Signed in with Google successfully!");
    } catch (err: any) {
      if (err.code === "auth/popup-blocked") {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectErr: any) {
          setError(getFirebaseError(redirectErr.code) || redirectErr.message);
          setLoading(null);
        }
      } else {
        const msg = getFirebaseError(err.code) || err.message;
        if (msg) setError(msg);
        setLoading(null);
      }
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth, "recaptcha-container",
        {
          size: "normal",
          callback: () => {},
          "expired-callback": () => {
            setError("reCAPTCHA expired. Please try again.");
            window.recaptchaVerifier = undefined;
          },
        }
      );
    }
    return window.recaptchaVerifier;
  };

  const handleSendOtp = async () => {
    clearMessages();
    if (!phone.trim()) { setError("Please enter a valid phone number."); return; }
    const formatted = phone.startsWith("+") ? phone : `+${phone}`;
    setLoading("otp");
    try {
      const verifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, formatted, verifier);
      setConfirmation(result);
      setOtpSent(true);
      setSuccess("OTP sent! Check your phone.");
    } catch (err: any) {
      window.recaptchaVerifier = undefined;
      setError(getFirebaseError(err.code) || err.message || "Failed to send OTP.");
    } finally {
      setLoading(null);
    }
  };

  const handleVerifyOtp = async () => {
    clearMessages();
    if (!otp.trim() || !confirmation) return;
    setLoading("verify");
    try {
      await confirmation.confirm(otp);
      setSuccess("Phone verified! Signed in successfully.");
      setOtpSent(false);
      setOtp(""); setPhone("");
    } catch (err: any) {
      setError(getFirebaseError(err.code) || "Invalid OTP. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setSuccess(null); setError(null);
    setOtpSent(false); setOtp(""); setPhone("");
    window.recaptchaVerifier = undefined;
  };

  if (redirectPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400 text-sm">Checking sign-in status...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-3xl font-bold text-white">
            {user.photoURL
              ? <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
              : (user.displayName || user.phoneNumber || "U")[0].toUpperCase()
            }
          </div>
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Signed In
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{user.displayName || "Welcome!"}</h2>
          {user.email && <p className="text-slate-400 text-sm mb-1">{user.email}</p>}
          {user.phoneNumber && <p className="text-slate-400 text-sm mb-1">{user.phoneNumber}</p>}
          <p className="text-slate-500 text-xs mb-6 font-mono break-all">UID: {user.uid}</p>
          <div className="bg-white/5 rounded-xl p-4 mb-6 text-left space-y-2">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Session Info</p>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Provider</span>
              <span className="text-white font-medium">{user.providerData[0]?.providerId === "google.com" ? "Google" : "Phone"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Verified</span>
              <span className="text-green-400 font-medium">{user.emailVerified || user.phoneNumber ? "Yes" : "No"}</span>
            </div>
          </div>
          <button onClick={handleSignOut} className="w-full py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold transition-all border border-red-500/20 hover:border-red-500/40">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500 mb-4 shadow-lg shadow-blue-500/30">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome</h1>
          <p className="text-slate-400 mt-1 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-4 text-sm">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {success}
            </div>
          )}

          {isInIframe() && (
            <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl p-3 text-xs">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <span>
                <strong>Preview mode:</strong> Google Sign-In will redirect and come back. For best experience, open the app in a{" "}
                <a href={window.location.href} target="_blank" rel="noreferrer" className="underline font-semibold">new tab ↗</a>
              </span>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
          >
            {loading === "google" ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {loading === "google" ? "Redirecting to Google..." : "Sign in with Google"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-slate-500 text-xs font-medium">or use phone</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Phone Number</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  disabled={otpSent || loading !== null}
                  className="flex-1 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 transition-all"
                />
                <button
                  onClick={handleSendOtp}
                  disabled={loading !== null || otpSent}
                  className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading === "otp" ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : "Send OTP"}
                </button>
              </div>
            </div>

            <div id="recaptcha-container" ref={recaptchaContainerRef} className="flex justify-center"></div>

            {otpSent && (
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit code"
                    maxLength={6}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm text-center tracking-widest font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading !== null || otp.length < 6}
                    className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading === "verify" ? "Verifying..." : "Verify OTP"}
                  </button>
                  <button
                    onClick={() => { setOtpSent(false); setOtp(""); setConfirmation(null); window.recaptchaVerifier = undefined; clearMessages(); }}
                    className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 font-semibold text-sm transition-all border border-white/10"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">Secured by Firebase Authentication</p>
      </div>
    </div>
  );
}
