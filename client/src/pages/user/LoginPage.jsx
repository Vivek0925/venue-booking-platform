import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Waves,
  Sun,
  PartyPopper,
  Ticket,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { getMe, requestOtp, verifyOtp } from "@/api/user.api";

export default function LoginForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("email");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resending, setResending] = useState(false);

  const otp = otpDigits.join("");
  const inputRefs = useRef([]);

  useEffect(() => {
    let isMounted = true;

    async function checkAuthenticatedUser() {
      try {
        await getMe();
        if (isMounted) navigate("/", { replace: true });
      } catch {
        // An unauthenticated user should remain on the login form.
      }
    }

    checkAuthenticatedUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1);
    setOtpDigits(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;
    setOtpDigits(pastedData.split(""));
    inputRefs.current[5]?.focus();
  };

  async function handleRequestOtp(e) {
    e.preventDefault();
    if (step !== "email") return;

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await requestOtp(email);
      setSuccessMessage(
        res?.message ||
          "OTP sent successfully. Please check your email to continue.",
      );
      setStep("otp");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Couldn't send OTP. Check the email and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendOtp() {
    if (step !== "otp" || resending) return;

    setResending(true);
    setError(null);
    setSuccessMessage(null);
    setOtpDigits(["", "", "", "", "", ""]);
    try {
      const res = await requestOtp(email);
      setSuccessMessage(
        res?.message ||
          "OTP sent successfully. Please check your email to continue.",
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Couldn't resend OTP. Please try again.",
      );
    } finally {
      setResending(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await verifyOtp({ email, otp });
      const redirectTo = searchParams.get("redirect") || "/";
      navigate(redirectTo);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid or expired OTP.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleGoogleLogin() {
    const googleAuthUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
    window.location.href = googleAuthUrl;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#fbf8fd] p-4">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-[#E7DBEF] bg-[#fbf8fd] shadow-[0_20px_50px_rgba(73,34,91,0.08)] md:grid-cols-2">
        {/* Left Side: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-[#49225B]">
            Book Your Fun
          </h1>
          <p className="mb-6 text-xs leading-relaxed text-[#76667D] sm:text-sm">
            From water parks to play zones, find and book the perfect venue for
            your next adventure.
          </p>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 font-medium animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form
            onSubmit={step === "otp" ? handleVerifyOtp : handleRequestOtp}
            className="space-y-5"
          >
            {/* Email Field with Change / Send OTP beside it */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#A56ABD]">
                Email Address
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@email.com"
                  disabled={submitting || step === "otp"}
                  required
                  className="h-11 border-[#D8C7DF] bg-[#fbf8fd] text-sm focus-visible:ring-[#A56ABD]"
                />
                {step === "email" ? (
                  <Button
                    type="submit"
                    disabled={submitting || !email}
                    className="h-11 shrink-0 border border-[#D8C7DF] bg-[#F5EBFA] px-4 text-xs font-semibold text-[#6E3482] shadow-none hover:bg-[#E7DBEF]"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      setStep("email");
                      setError(null);
                      setSuccessMessage(null);
                      setOtpDigits(["", "", "", "", "", ""]);
                    }}
                    className="h-11 shrink-0 border border-[#D8C7DF] px-3 text-xs text-[#76667D] hover:text-[#49225B]"
                  >
                    Change
                  </Button>
                )}
              </div>
            </div>

            {/* OTP Section with Resend OTP beside it */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#A56ABD]">
                Enter 6-Digit OTP
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="grid grid-cols-6 gap-1.5 flex-1"
                  onPaste={handlePaste}
                >
                  {otpDigits.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={step !== "otp" || submitting}
                      className="h-11 border-[#D8C7DF] bg-[#fbf8fd] px-0 text-center text-base font-semibold focus-visible:ring-[#A56ABD]"
                    />
                  ))}
                </div>

                {step === "otp" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOtp}
                    disabled={resending || submitting}
                    className="h-11 shrink-0 border-[#D8C7DF] px-3 text-xs font-medium text-[#6E3482] hover:bg-[#F5EBFA] hover:text-[#49225B]"
                  >
                    {resending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Resend OTP"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Submit / Verify Button */}
            <Button
              type="submit"
              disabled={submitting || (step === "otp" && otp.length < 6)}
              className="mt-2 h-11 w-full rounded-xl bg-[#6E3482] text-sm font-medium text-white shadow-sm shadow-[#D8C7DF] transition-all hover:bg-[#49225B]"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {step === "otp" ? "Verify & Continue" : "Send OTP"}
            </Button>
          </form>

          {/* Social Divider */}
          <div className="mt-8 mb-6 relative flex items-center justify-center">
            <span className="text-[11px] font-medium text-[#A56ABD]">
              Or Continue with
            </span>
          </div>

          {/* Google Auth Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="h-11 w-full gap-2.5 rounded-xl border-[#D8C7DF] text-xs font-medium text-[#49225B] hover:bg-[#fbf8fd]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>

        {/* Right Side: Pastel Brand Panel */}
        <div className="relative hidden flex-col items-center justify-center overflow-hidden border-l border-[#E7DBEF] bg-[radial-gradient(circle_at_100%_0%,#5b0fe8_0%,transparent_48%),radial-gradient(circle_at_0%_100%,#17108d_0%,transparent_52%),linear-gradient(135deg,#b98df4_0%,#b8edf0_48%,#e6e8f5_100%)] p-12 text-center md:flex">
          <Sun className="absolute right-10 top-10 h-6 w-6 text-[#C28BCF] stroke-1" />
          <Waves className="absolute left-10 top-1/2 h-6 w-6 -translate-y-1/2 text-[#6E3482] stroke-1.5" />
          <PartyPopper className="absolute bottom-10 left-10 h-6 w-6 text-[#A56ABD] stroke-1.5" />

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#D8C7DF] bg-[#fbf8fd]/80 text-[#6E3482] shadow-sm backdrop-blur-sm">
            <Ticket className="w-6 h-6 rotate-[-15deg] stroke-[1.8]" />
          </div>

          <h2 className="mb-2 text-xl font-bold tracking-tight text-[#49225B]">
            Ready for Adventure?
          </h2>
          <p className="mb-6 max-w-xs text-xs leading-relaxed text-[#76667D]">
            Access exclusive deals for top-rated venues, theme parks, and fun
            weekend getaways.
          </p>

          <div className="flex items-center -space-x-1.5">
            <div className="w-7 h-7 rounded-full bg-lime-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-lime-900">
              AJ
            </div>
            <div className="w-7 h-7 rounded-full bg-rose-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-rose-900">
              SK
            </div>
            <div className="w-7 h-7 rounded-full bg-sky-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-sky-900">
              RV
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#6E3482] text-[9px] font-bold text-white shadow-xs">
              +12k
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
