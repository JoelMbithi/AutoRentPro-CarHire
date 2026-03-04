"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEnvelope, FaArrowLeft, FaCheckCircle,  FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState(["", "", "", "", "", ""]);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState(token || "");

  // Check if token exists in URL - if yes, go directly to password step
  useEffect(() => {
    if (token) {
      setStep("password");
      setResetToken(token);
    }
  }, [token]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/features/auth/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStep("code");
        if (process.env.NODE_ENV === 'development' && data.resetToken) {
          setResetToken(data.resetToken);
        }
      } else {
        setError(data.error || "Failed to send reset email. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If pasting a whole code
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...resetCode];
      pastedCode.forEach((char, i) => {
        if (i < 6 && /^\d*$/.test(char)) {
          newCode[i] = char;
        }
      });
      setResetCode(newCode);
      
      // Auto-focus last filled input or next empty
      const lastFilledIndex = Math.min(pastedCode.length - 1, 5);
      if (lastFilledIndex >= 0 && lastFilledIndex < 5) {
        const nextInput = document.getElementById(`code-${lastFilledIndex + 1}`);
        nextInput?.focus();
      }
    } else {
      // Single character input
      if (value === "" || /^\d*$/.test(value)) {
        const newCode = [...resetCode];
        newCode[index] = value;
        setResetCode(newCode);
        
        // Auto-focus next input
        if (value !== "" && index < 5) {
          const nextInput = document.getElementById(`code-${index + 1}`);
          nextInput?.focus();
        }
      }
    }
    if (error) setError("");
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !resetCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.replace(/\D/g, '').slice(0, 6);
      if (cleaned.length === 6) {
        const newCode = cleaned.split('');
        setResetCode(newCode);
        setError("");
      } else {
        setError("Please copy a valid 6-digit code");
      }
    } catch (err) {
      setError("Unable to paste. Please type the code manually.");
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const codeString = resetCode.join('');
    if (codeString.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Verify the code is valid
      const response = await fetch("/features/auth/api/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email,
          code: codeString 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep("password");
        setResetToken(data.resetToken);
      } else {
        setError(data.error || "Invalid or expired code. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validatePassword = () => {
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/features/auth/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      } else {
        setError(data.error || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBackToEmail = () => {
    setStep("email");
    setError("");
  };

  const goBackToCode = () => {
    setStep("code");
    setError("");
  };

  return (
    <>
      <style>{`
        .fp-btn-primary {
          transition: background-color 0.15s ease, transform 0.1s ease;
        }

        .fp-btn-primary:hover:not(:disabled) {
          background-color: #e67e00;
        }

        .fp-btn-primary:active:not(:disabled) {
          transform: scale(0.985);
        }

        .fp-btn-secondary {
          transition: background-color 0.15s ease, transform 0.1s ease;
        }

        .fp-btn-secondary:hover:not(:disabled) {
          background-color: #4a3c36;
          color: #fffdf9;
        }

        .fp-back:hover {
          color: #ff8c00;
        }

        .fp-try-again:hover {
          color: #e67e00;
        }

        @keyframes fp-spin {
          to { transform: rotate(360deg); }
        }

        .fp-spinner {
          animation: fp-spin 0.75s linear infinite;
        }

        @keyframes fp-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fp-fade-in {
          animation: fp-fade-in 0.3s ease forwards;
        }

        .code-input {
          width: 48px;
          height: 48px;
          text-align: center;
          font-size: 20px;
          font-weight: 600;
          border: 1px solid #ddd4ca;
          border-radius: 6px;
          background-color: #faf7f4;
          color: #2c2420;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .code-input:focus {
          outline: none;
          border-color: #ff8c00;
          box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
        }
      `}</style>

      <div
        className="fp-root"
        style={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 20px",
        }}
      >
        <div style={{ maxWidth: 440, border: "1px solid #e5e7eb", borderRadius: "0.5rem", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)", width: "100%", margin: "0 auto", padding: "32px 36px", backgroundColor: "#ffff" }}>

          {/* Back link - changes based on step */}
          <div style={{ marginBottom: 28 }}>
            {step === "code" && (
              <button
                onClick={goBackToEmail}
                className="fp-back"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "#7a6a60",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <FaArrowLeft style={{ fontSize: 10 }} />
                Back to email
              </button>
            )}
            {step === "password" && !token && (
              <button
                onClick={goBackToCode}
                className="fp-back"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "#7a6a60",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <FaArrowLeft style={{ fontSize: 10 }} />
                Back to code
              </button>
            )}
            {step === "email" && (
              <Link
                href="/auth/signin"
                className="fp-back"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "#7a6a60",
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
              >
                <FaArrowLeft style={{ fontSize: 10 }} />
                Back to sign in
              </Link>
            )}
          </div>

          {/* Wordmark */}
          <div style={{ marginBottom: 32 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span className="text-2xl font-black tracking-tight">
              <span className="text-gray-900">Auto</span>
              <span className="text-orange-600">Rent</span>
              <span className="text-gray-900">Pro</span>

            </span>
            </Link>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h1
              className="fp-wordmark"
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: "#2c2420",
                lineHeight: 1.3,
                marginBottom: 10,
              }}
            >
              {success 
                ? "Password Reset!" 
                : step === "email" 
                  ? "Reset your password"
                  : step === "code"
                    ? "Enter reset code"
                    : "Create new password"}
            </h1>
            <p style={{ fontSize: 15, color: "#7a6a60", lineHeight: 1.65 }}>
              {success
                ? "Your password has been successfully reset."
                : step === "email"
                  ? "Enter your email to receive a reset code."
                  : step === "code"
                    ? email ? `We sent a 6-digit code to ${email}` : "Enter the 6-digit code from your email"
                    : token 
                      ? "Create a new password for your account." 
                      : "Choose a strong password for your account."}
            </p>
          </div>

          {/* Card Content - removed inner card since container now has background */}
          <>
            {/* Error */}
            {error && (
              <div
                className="fp-fade-in"
                style={{
                  marginBottom: 20,
                  padding: "12px 16px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 6,
                  fontSize: 13,
                  color: "#b91c1c",
                  lineHeight: 1.55,
                }}
              >
                {error}
              </div>
            )}

            {success ? (
              <div className="fp-fade-in" style={{ textAlign: "center", padding: "8px 0" }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    backgroundColor: "#ecfdf5",
                    border: "1px solid #bbf7d0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <FaCheckCircle style={{ color: "#16a34a", fontSize: 20 }} />
                </div>
                <p style={{ fontSize: 14, color: "#4a3c36", marginBottom: 24 }}>
                  Redirecting you to sign in...
                </p>
              </div>
            ) : (
              <>
                {/* Step 1: Email Form - Only show if no token and step is email */}
                {step === "email" && !token && (
                  <form onSubmit={handleEmailSubmit}>
                    <div style={{ marginBottom: 20 }}>
                      <label
                        htmlFor="email"
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#9a8880",
                          marginBottom: 8,
                        }}
                      >
                        Email address
                      </label>
                      <div style={{ position: "relative" }}>
                        <FaEnvelope
                          style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#ff8c00",
                            fontSize: 13,
                            pointerEvents: "none",
                          }}
                        />
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your Email"
                          className="fp-input"
                          style={{
                            width: "100%",
                            paddingLeft: 40,
                            paddingRight: 16,
                            paddingTop: 11,
                            paddingBottom: 11,
                            fontSize: 14,
                            color: "#2c2420",
                            backgroundColor: "#faf7f4",
                            border: "1px solid #ddd4ca",
                            borderRadius: 6,
                            boxSizing: "border-box",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="fp-btn-primary"
                      style={{
                        width: "100%",
                        padding: "12px 20px",
                        backgroundColor: isSubmitting ? "#e8ddd4" : "#ff8c00",
                        color: isSubmitting ? "#9a8880" : "#fffdf9",
                        border: "none",
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="fp-spinner" style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #b0a098", borderTopColor: "#7a6a60", display: "inline-block" }} />
                          Sending…
                        </>
                      ) : (
                        "Send reset code"
                      )}
                    </button>
                  </form>
                )}

                {/* Step 2: Code Entry - Only show if step is code AND no token */}
                {step === "code" && !token && (
                  <form onSubmit={handleCodeSubmit}>
                    <div style={{ marginBottom: 20 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#9a8880",
                          marginBottom: 16,
                          textAlign: "center",
                        }}
                      >
                        6-digit code
                      </label>
                      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                        {resetCode.map((digit, index) => (
                          <input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleCodeChange(index, e.target.value)}
                            onKeyDown={(e) => handleCodeKeyDown(index, e)}
                            className="code-input"
                          />
                        ))}
                      </div>
                      
                      {/* Paste button */}
                      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                        <button
                          type="button"
                          onClick={handlePasteCode}
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: 12,
                            color: "#ff8c00",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                           Paste code
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || resetCode.join('').length !== 6}
                      className="fp-btn-primary"
                      style={{
                        width: "100%",
                        padding: "12px 20px",
                        backgroundColor: isSubmitting || resetCode.join('').length !== 6 ? "#e8ddd4" : "#ff8c00",
                        color: isSubmitting || resetCode.join('').length !== 6 ? "#9a8880" : "#fffdf9",
                        border: "none",
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: isSubmitting || resetCode.join('').length !== 6 ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="fp-spinner" style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #b0a098", borderTopColor: "#7a6a60", display: "inline-block" }} />
                          Verifying...
                        </>
                      ) : (
                        "Verify code"
                      )}
                    </button>

                    <p style={{ fontSize: 11, color: "#9a8880", textAlign: "center", marginTop: 16 }}>
                     Didn&apos;t receive code? Check your spam folder or{" "}
                      <button
                        type="button"
                        onClick={goBackToEmail}
                        style={{ background: "none", border: "none", color: "#ff8c00", cursor: "pointer", textDecoration: "underline" }}
                      >
                        try again
                      </button>
                    </p>
                  </form>
                )}

                {/* Step 3: New Password - Show if step is password OR token exists */}
                {(step === "password" || token) && (
                  <form onSubmit={handlePasswordSubmit}>
                    {/* New Password */}
                    <div style={{ marginBottom: 20 }}>
                      <label
                        htmlFor="password"
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#9a8880",
                          marginBottom: 8,
                        }}
                      >
                        New password
                      </label>
                      <div style={{ position: "relative" }}>
                        <FaLock
                          style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#ff8c00",
                            fontSize: 13,
                            pointerEvents: "none",
                          }}
                        />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter new password"
                          className="fp-input"
                          style={{
                            width: "100%",
                            paddingLeft: 40,
                            paddingRight: 40,
                            paddingTop: 11,
                            paddingBottom: 11,
                            fontSize: 14,
                            color: "#2c2420",
                            backgroundColor: "#faf7f4",
                            border: "1px solid #ddd4ca",
                            borderRadius: 6,
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#ff8c00",
                          }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: 20 }}>
                      <label
                        htmlFor="confirmPassword"
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#9a8880",
                          marginBottom: 8,
                        }}
                      >
                        Confirm password
                      </label>
                      <div style={{ position: "relative" }}>
                        <FaLock
                          style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#ff8c00",
                            fontSize: 13,
                            pointerEvents: "none",
                          }}
                        />
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm new password"
                          className="fp-input"
                          style={{
                            width: "100%",
                            paddingLeft: 40,
                            paddingRight: 40,
                            paddingTop: 11,
                            paddingBottom: 11,
                            fontSize: 14,
                            color: "#2c2420",
                            backgroundColor: "#faf7f4",
                            border: "1px solid #ddd4ca",
                            borderRadius: 6,
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{
                            position: "absolute",
                            right: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#ff8c00",
                          }}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    {/* Password requirements */}
                    <div style={{ marginBottom: 20, fontSize: 12, color: "#7a6a60" }}>
                      <p>Password must be at least 8 characters long</p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.password || !formData.confirmPassword}
                      className="fp-btn-primary"
                      style={{
                        width: "100%",
                        padding: "12px 20px",
                        backgroundColor: isSubmitting || !formData.password || !formData.confirmPassword ? "#e8ddd4" : "#ff8c00",
                        color: isSubmitting || !formData.password || !formData.confirmPassword ? "#9a8880" : "#fffdf9",
                        border: "none",
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: isSubmitting || !formData.password || !formData.confirmPassword ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="fp-spinner" style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #b0a098", borderTopColor: "#7a6a60", display: "inline-block" }} />
                          Resetting...
                        </>
                      ) : (
                        "Reset password"
                      )}
                    </button>
                  </form>
                )}
              </>
            )}
          </>

          {/* Footer note - only show on email step */}
          {step === "email" && !token && (
            <p
              style={{
                marginTop: 24,
                fontSize: 12,
                color: "#9a8880",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Remember your password?{" "}
              <Link
                href="/auth/signin"
                style={{ color: "#ff8c00", textDecoration: "none" }}
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;