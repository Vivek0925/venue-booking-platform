import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  TriangleAlert,
  UploadCloud,
  X,
  FileText,
  Loader2,
  ChevronDown,
} from "lucide-react";
import * as z from "zod";

import { submitApplication } from "@/api/user.api";

const kycSchema = z.object({
  panName: z
    .string()
    .min(2, "Full name (as on PAN) is required")
    .transform((val) => val.toUpperCase()),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid 10-digit phone number"),
  panNumber: z
    .string()
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i,
      "Invalid PAN format (e.g. ABCDE1234F)",
    ),
  address: z.string().min(5, "Full street address is required"),
  state: z.string().min(1, "Please select a state"),
  district: z.string().min(2, "District is required"),
  pincode: z.string().regex(/^\d{6}$/, "Must be exactly 6 digits"),
});

const STATES = [
  "Andhra Pradesh",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Karnataka",
];

function Field({ label, error, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8b7c91]">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] font-medium tracking-tight text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default function VendorApplicationForm({ previousApplication }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(kycSchema),
    defaultValues: previousApplication
      ? {
          panName: previousApplication.panName || "",
          phone: previousApplication.phone || "",
          panNumber: previousApplication.panNumber || "",
          address: previousApplication.address || "",
          state: previousApplication.state || "",
          district: previousApplication.district || "",
          pincode: previousApplication.pincode || "",
        }
      : undefined,
  });

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    handleSelectedFile(f);
  };

  const handleSelectedFile = (f) => {
    if (!f) return;

    if (f.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit");
      handleRemoveFile();
      return;
    }

    if (!["image/jpeg", "image/png"].includes(f.type)) {
      setFileError("Only JPG or PNG images are allowed");
      handleRemoveFile();
      return;
    }

    setFileError("");
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleSelectedFile(e.dataTransfer.files?.[0]);
  };

  const handleRemoveFile = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data) => {
    if (!file) {
      setFileError("PAN Document is required");
      return;
    }

    setSubmitError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("panName", data.panName);
    formData.append("phone", data.phone);
    formData.append("panNumber", data.panNumber.toUpperCase());
    formData.append("address", data.address);
    formData.append("state", data.state);
    formData.append("district", data.district);
    formData.append("pincode", data.pincode);
    formData.append("panDocument", file);

    try {
      await submitApplication(formData);
      navigate("/vendor/application/status", { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        return;
      }
      setSubmitError(
        err?.response?.data?.message ||
          "Something went wrong during submission",
      );
    } finally {
      setLoading(false);
    }
  };

  const inp = (err) =>
    `w-full rounded-xl border px-3.5 py-2.5 text-xs text-[#33243b] placeholder:text-[#a293aa] bg-[#fbf8fd] outline-none transition-all duration-150 ${
      err
        ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-[#e7dbef] hover:border-[#d8c7df] focus:border-[#6e3482] focus:bg-white focus:ring-2 focus:ring-[#f0e2ff]"
    }`;

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#fbf8fd]">
      <div className="relative hidden w-180 shrink-0 flex-col justify-between overflow-hidden border-r border-[#6e3482] bg-[#49225B] p-10 text-white lg:flex">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20px 20px, rgba(245,235,250,.22) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-20 translate-y-20 rounded-full bg-[#A56ABD] opacity-20" />
        <div className="absolute left-0 top-0 h-40 w-40 -translate-x-10 -translate-y-10 rounded-full bg-[#A56ABD] opacity-15" />

        <div className="relative z-10">
          <div className="mb-8 inline-block rounded-lg bg-white px-2 py-2">
            <img src="/logo.svg" alt="Venuez logo" className="h-10 w-auto" />
          </div>
          <span className="inline-flex rounded-full border border-[#A56ABD]/50 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#e7dbef]">
            Partner onboarding
          </span>
          <h1 className="mt-4 text-4xl font-black uppercase italic leading-tight tracking-tight text-white">
            Partner
            <br />
            with Us
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#e7dbef]">
            Join our growing network of verified venues and unlock a new stream
            of customers.
          </p>
        </div>

        <div className="relative z-10 space-y-5">
          {[
            {
              num: "01",
              title: "Submit Application",
              desc: "Fill your business details",
            },
            {
              num: "02",
              title: "Verification",
              desc: "We review within 48 hrs",
            },
            { num: "03", title: "Go Live", desc: "Start receiving bookings" },
          ].map((step) => (
            <div
              key={step.num}
              className="flex items-start gap-4 rounded-xl border border-[#A56ABD]/35 bg-white/10 px-3 py-2"
            >
              <span className="mt-0.5 shrink-0 text-xs font-black text-[#d8b9e2]">
                {step.num}
              </span>
              <div>
                <p className="text-xs font-bold text-white">{step.title}</p>
                <p className="text-[11px] text-[#e7dbef]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative z-10 text-[10px] uppercase tracking-widest text-[#d8b9e2]/70">
          © 2025 Venuz · Built for local venues
        </p>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto px-4 py-8 sm:px-10 lg:px-12 flex justify-center items-start">
          <div className="w-full max-w-4xl rounded-3xl border border-[#e7dbef] bg-white p-6 shadow-[0_12px_40px_rgba(73,34,91,0.07)] sm:p-9">
            <header className="mb-6 border-b border-[#f0e6f3] pb-5">
              <span className="mb-3 inline-block rounded-full border border-[#d8c7df] bg-[#f0e2ff] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#6e3482]">
                Partner Onboarding
              </span>
              <h2 className="text-2xl font-bold uppercase tracking-[-0.03em] text-[#49225B]">
                Vendor KYC Verification
              </h2>
              <p className="mt-1 text-xs font-medium text-[#76667D] sm:text-sm">
                Fill in your details and upload your PAN document to continue.
              </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset disabled={loading} className="space-y-4">
                {previousApplication?.rejectionReason && (
                  <div className="rounded-xl border border-[#f2dca7] bg-[#fff9e8] p-4">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#9a6b16]">
                      Reason for Rejection
                    </p>
                    <p className="text-sm leading-relaxed text-[#785313]">
                      {previousApplication.rejectionReason}
                    </p>
                  </div>
                )}
                {submitError && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-600">
                    <TriangleAlert className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{submitError}</span>
                  </div>
                )}

                <Field label="Full Name (as on PAN)" error={errors.panName}>
                  <input
                    {...register("panName", {
                      onChange: (e) => {
                        e.target.value = e.target.value.toUpperCase();
                      },
                    })}
                    placeholder="ENTER FULL NAME"
                    className={`${inp(errors.panName)} uppercase`}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Field label="Phone Number" error={errors.phone}>
                    <input
                      {...register("phone")}
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      className={inp(errors.phone)}
                    />
                  </Field>
                  <Field label="PAN Number" error={errors.panNumber}>
                    <input
                      {...register("panNumber", {
                        onChange: (e) => {
                          e.target.value = e.target.value.toUpperCase();
                        },
                      })}
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      className={`${inp(errors.panNumber)} uppercase font-mono tracking-wider`}
                    />
                  </Field>
                </div>

                <Field label="Street Address" error={errors.address}>
                  <input
                    {...register("address")}
                    placeholder="Building, Street name, Area"
                    className={inp(errors.address)}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <Field label="State" error={errors.state}>
                    <div className="relative">
                      <select
                        {...register("state")}
                        className={`${inp(errors.state)} appearance-none pr-8 cursor-pointer`}
                      >
                        <option value="">Select State</option>
                        {STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </Field>
                  <Field label="District" error={errors.district}>
                    <input
                      {...register("district")}
                      placeholder="District"
                      className={inp(errors.district)}
                    />
                  </Field>
                  <Field label="Pincode" error={errors.pincode}>
                    <input
                      {...register("pincode")}
                      maxLength={6}
                      placeholder="452001"
                      className={inp(errors.pincode)}
                    />
                  </Field>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                    PAN Document
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFile}
                    accept="image/jpeg,image/png"
                  />

                  {!file ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`group flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-6 text-center transition-all ${
                        fileError
                          ? "border-red-400 bg-red-50/50"
                          : isDragging
                            ? "scale-[1.01] border-[#6e3482] bg-[#f0e2ff]"
                            : "border-[#d8c7df] bg-[#fbf8fd] hover:border-[#6e3482] hover:bg-[#f5ebfa]"
                      }`}
                    >
                      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#e7dbef] bg-white text-[#6e3482] shadow-sm transition-transform group-hover:-translate-y-0.5">
                        <UploadCloud className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-bold text-[#33243b]">
                        Drop your PAN document here
                      </span>
                      <span className="mt-1 text-xs text-[#76667D]">
                        or{" "}
                        <span className="font-semibold text-[#6e3482]">
                          browse files
                        </span>{" "}
                        from your device
                      </span>
                      <span className="mt-3 rounded-full border border-[#e7dbef] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#a293aa]">
                        JPG or PNG · max 5MB
                      </span>
                    </div>
                  ) : (
                    <div className="flex min-h-24 items-center justify-between rounded-2xl border border-[#d8c7df] bg-[#f5ebfa] px-4 py-3">
                      <div className="flex items-center gap-3 truncate">
                        {filePreview ? (
                          <img
                            src={filePreview}
                            alt="PAN Preview"
                            className="h-16 w-16 shrink-0 rounded-lg border border-[#d8c7df] object-cover"
                          />
                        ) : (
                          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-[#d8c7df] bg-white">
                            <FileText className="h-6 w-6 text-[#6e3482]" />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-[#33243b]">
                            {file.name}
                          </p>
                          <p className="mt-1 text-[11px] text-[#76667D]">
                            {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to
                            upload
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="rounded-md p-1 text-[#a293aa] transition-colors hover:bg-[#e7dbef] hover:text-[#49225B]"
                        aria-label="Remove uploaded file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {fileError && (
                    <p className="text-[11px] text-red-500 font-medium mt-1">
                      {fileError}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-11 w-full items-center justify-center rounded-xl bg-[#6e3482] text-xs font-semibold uppercase tracking-wide text-white shadow-sm shadow-[#6e3482]/30 transition-all hover:bg-[#49225B] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting Application...
                      </>
                    ) : (
                      "Submit Verification"
                    )}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
