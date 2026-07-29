"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addDoc, collection, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  UploadCloud,
  FileText,
  Trash2,
  ArrowRight,
  Loader2,
  User,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { db, storage } from "@/lib/firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  mobile: string;
  email: string;
  idType: string;
  idNumber: string;
  country: string;
  description: string;
  termsAccepted: boolean;
}

interface FieldState {
  touched: boolean;
  error: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COUNTRIES = [
  "Sri Lanka", "India", "Pakistan", "Bangladesh", "Nepal",
  "Romania", "Bosnia", "Russia", "Germany", "Cyprus",
  "Qatar", "UAE", "Saudi Arabia", "Kuwait", "Oman",
  "Malaysia", "Jordan", "Israel",
];
const ID_TYPES = ["Passport", "NIC", "Other"];

const INITIAL_FORM: FormData = {
  name: "",
  mobile: "",
  email: "",
  idType: "NIC",
  idNumber: "",
  country: "",
  description: "",
  termsAccepted: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validate(field: keyof FormData, value: string | boolean): string {
  if (field === "name") {
    if (!String(value).trim()) return "Please enter your full name.";
  }
  if (field === "mobile") {
    if (!String(value).trim()) return "Please enter your mobile number.";
    if (!/^[+\d\s\-()]{7,}$/.test(String(value)))
      return "Enter a valid phone number.";
  }
  if (field === "email" && String(value).trim()) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)))
      return "Enter a valid email address.";
  }
  if (field === "idNumber") {
    if (!String(value).trim()) return "Please enter your ID number.";
  }
  if (field === "country") {
    if (!String(value)) return "Please choose a destination country.";
  }
  return "";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepBadge({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-main-700 text-white text-xs font-bold font-heading flex-shrink-0">
        {step}
      </span>
      <span className="text-xs font-semibold uppercase tracking-widest text-main-500 font-mono">
        {label}
      </span>
    </div>
  );
}

function FieldWrapper({
  children,
  error,
  success,
}: {
  children: React.ReactNode;
  error?: string;
  success?: boolean;
}) {
  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400 font-sans"
          >
            <AlertCircle size={11} className="flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({
  id,
  name,
  type = "text",
  label,
  placeholder,
  hint,
  required,
  value,
  icon: Icon,
  onChange,
  onBlur,
  fieldState,
}: {
  id: string;
  name: keyof FormData;
  type?: string;
  label: string;
  placeholder: string;
  hint?: string;
  required?: boolean;
  value: string;
  icon: React.ElementType;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (name: keyof FormData, value: string) => void;
  fieldState: FieldState;
}) {
  const hasError = fieldState.touched && fieldState.error;
  const isValid = fieldState.touched && !fieldState.error && value.trim();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-main-700 mb-1.5 font-heading">
        {label}
        {required && <span className="text-main-300 ml-1">*</span>}
        {!required && (
          <span className="ml-2 text-xs font-normal text-secondary-500 font-sans">
            (optional)
          </span>
        )}
      </label>
      {hint && (
        <p className="text-xs text-secondary-500 mb-2 font-sans">{hint}</p>
      )}
      <FieldWrapper error={hasError ? fieldState.error : ""} success={!!isValid}>
        <div className="relative">
          <Icon
            size={16}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${hasError
                ? "text-red-400"
                : isValid
                  ? "text-main-500"
                  : "text-secondary-300"
              }`}
          />
          <input
            type={type}
            id={id}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            onBlur={() => onBlur(name, value)}
            placeholder={placeholder}
            className={`w-full pl-10 pr-10 py-3.5 rounded-xl border-2 bg-white text-main-900 placeholder-secondary-300 text-sm font-sans transition-all outline-none
              ${hasError
                ? "border-red-400 focus:border-red-400 bg-red-50/30"
                : isValid
                  ? "border-main-500 focus:border-main-500"
                  : "border-secondary-100 focus:border-main-300 hover:border-secondary-300"
              }`}
          />
          {isValid && (
            <CheckCircle2
              size={15}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-main-500 pointer-events-none"
            />
          )}
        </div>
      </FieldWrapper>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InquiryForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [fields, setFields] = useState<Record<string, FieldState>>({
    name: { touched: false, error: "" },
    mobile: { touched: false, error: "" },
    email: { touched: false, error: "" },
    idNumber: { touched: false, error: "" },
    country: { touched: false, error: "" },
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Live-clear error once user starts fixing
    if (fields[name]?.touched) {
      const error = validate(name as keyof FormData, value);
      setFields((prev) => ({ ...prev, [name]: { touched: true, error } }));
    }
  };

  const handleBlur = (name: keyof FormData, value: string) => {
    const error = validate(name, value);
    setFields((prev) => ({ ...prev, [name]: { touched: true, error } }));
  };

  const handleSelectBlur = () => {
    const error = validate("country", formData.country);
    setFields((prev) => ({
      ...prev,
      country: { touched: true, error },
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      setCvFile(file);
    } else {
      setFields((prev) => ({
        ...prev,
        country: { touched: true, error: "Only PDF files are accepted." },
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      setCvFile(file);
    } else {
      setFields((prev) => ({
        ...prev,
        country: { touched: true, error: "Only PDF files are accepted. Please convert your CV to PDF." },
      }));
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = () => {
    setCvFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all required fields to show errors
    const requiredFields: (keyof FormData)[] = [
      "name",
      "mobile",
      "email",
      "idNumber",
      "country",
    ];
    const newFields = { ...fields };
    let hasError = false;
    requiredFields.forEach((f) => {
      const error = validate(f, formData[f] as string);
      newFields[f] = { touched: true, error };
      if (error) hasError = true;
    });
    setFields(newFields);
    if (hasError || !formData.termsAccepted) return;

    setIsSubmitting(true);
    try {
      // Helper for Base64 PDF conversion
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
        });
      };

      // Step 1: Encode CV as Base64 data URL first (fast & CORS-proof)
      let initialCvUrl: string | null = null;
      if (cvFile) {
        try {
          initialCvUrl = await fileToBase64(cvFile);
        } catch (b64Err) {
          console.warn("Base64 conversion error:", b64Err);
        }
      }

      // Step 2: Submit to Firestore with Base64 CV URL included immediately
      const docRef = await addDoc(collection(db, "inquiries"), {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.mobile.trim(),
        idType: formData.idType,
        idNumber: formData.idNumber.trim(),
        destinationOfInterest: formData.country,
        message: formData.description.trim() || "No additional message provided.",
        status: "new",
        isBookmarked: false,
        cvUrl: initialCvUrl,
        cvFileName: cvFile?.name || null,
        submittedAt: serverTimestamp(),
      });

      // Step 3: Attempt Firebase Storage upload in background (production mode)
      if (cvFile && storage && typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
        (async () => {
          try {
            const safeFileName = `${Date.now()}-${cvFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
            const fileRef = ref(storage, `inquiries/cv/${safeFileName}`);
            await uploadBytes(fileRef, cvFile);
            const downloadUrl = await getDownloadURL(fileRef);

            // Replace Base64 URL with Storage download URL if successful
            await updateDoc(doc(db, "inquiries", docRef.id), {
              cvUrl: downloadUrl,
            });
          } catch (cvError) {
            // Silently fall back to Base64 URL already saved in Firestore
          }
        })();
      }

      setSubmitSuccess(true);
      setFormData(INITIAL_FORM);
      setCvFile(null);
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      setFields((prev) => ({
        ...prev,
        country: {
          touched: true,
          error: "We couldn't submit your inquiry right now. Please try again.",
        },
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.mobile.trim() !== "" &&
    formData.idNumber.trim() !== "" &&
    formData.country !== "" &&
    formData.termsAccepted;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <section className="min-h-screen px-4 py-16 md:py-24 flex items-start justify-center">
      <div className="w-full max-w-5xl">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left mb-10"
        >
          {/* <p className="inline-block text-[10px] font-mono tracking-[0.22em] uppercase text-main-300 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full mb-4">
            Recruitment & Inquiry
          </p> */}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-black leading-tight mb-3">
            Start Your Application
          </h1>
          <p className="font-mono text-[10px] tracking-[0.18em] text-secondary-500 uppercase mb-3 md:whitespace-nowrap">
            Fill in your details below. Our consultants will review your profile and get back to you within a few business days.
          </p>
        </motion.div>

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!submitSuccess ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                noValidate
              >
                {/* ── Section 1: Personal Details ── */}
                <div className="px-6 md:px-10 pt-8 pb-7 border-b border-secondary-100">
                  <StepBadge step={1} label="Your Details" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField
                      id="name"
                      name="name"
                      label="Full Name"
                      placeholder="Dinuka Perera"
                      required
                      value={formData.name}
                      icon={User}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      fieldState={fields.name}
                    />
                    <InputField
                      id="mobile"
                      name="mobile"
                      type="tel"
                      label="Mobile Number"
                      placeholder="+94 70 123 4567"
                      required
                      value={formData.mobile}
                      icon={Phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      fieldState={fields.mobile}
                    />
                    <InputField
                      id="email"
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="dinukaperera@example.com"
                      value={formData.email}
                      icon={Mail}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      fieldState={fields.email}
                    />

                    {/* ID Type Select */}
                    <div>
                      <label
                        htmlFor="idType"
                        className="block text-sm font-semibold text-main-700 mb-1.5 font-heading"
                      >
                        ID Type <span className="text-main-300 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary-300">
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <path d="M3 10h18" />
                          </svg>
                        </div>
                        <select
                          id="idType"
                          name="idType"
                          value={formData.idType}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-8 py-3.5 rounded-xl border-2 bg-white text-sm font-sans appearance-none cursor-pointer outline-none transition-all border-secondary-100 focus:border-main-300 hover:border-secondary-300 text-main-900"
                        >
                          {ID_TYPES.map((t) => (
                            <option key={t} value={t} className="text-main-900">
                              {t}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>

                    {/* ID Number Input */}
                    <div>
                      <label className="block text-sm font-semibold text-main-700 mb-1.5 font-heading">
                        ID Number <span className="text-main-300 ml-1">*</span>
                      </label>
                      <FieldWrapper error={fields.idNumber?.touched ? fields.idNumber?.error || "" : ""}>
                        <input
                          type="text"
                          id="idNumber"
                          name="idNumber"
                          required
                          value={formData.idNumber}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("idNumber", formData.idNumber)}
                          placeholder="e.g. NID / Passport number"
                          className="w-full pl-10 pr-10 py-3.5 rounded-xl border-2 bg-white text-main-900 placeholder-secondary-300 text-sm font-sans transition-all outline-none border-secondary-100 focus:border-main-300 hover:border-secondary-300"
                        />
                      </FieldWrapper>
                    </div>

                    {/* Country Select */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="country"
                        className="block text-sm font-semibold text-main-700 mb-1.5 font-heading"
                      >
                        Destination Country
                        <span className="text-main-300 ml-1">*</span>
                      </label>
                      <FieldWrapper
                        error={
                          fields.country.touched ? fields.country.error : ""
                        }
                      >
                        <div className="relative">
                          <Globe
                            size={16}
                            className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${fields.country.touched && fields.country.error
                                ? "text-red-400"
                                : formData.country
                                  ? "text-main-500"
                                  : "text-secondary-300"
                              }`}
                          />
                          <select
                            id="country"
                            name="country"
                            required
                            value={formData.country}
                            onChange={handleInputChange}
                            onBlur={handleSelectBlur}
                            className={`w-full pl-10 pr-8 py-3.5 rounded-xl border-2 bg-white text-sm font-sans appearance-none cursor-pointer outline-none transition-all
                              ${fields.country.touched && fields.country.error
                                ? "border-red-400 bg-red-50/30"
                                : formData.country
                                  ? "border-main-500 text-main-900"
                                  : "border-secondary-100 text-secondary-300 hover:border-secondary-300 focus:border-main-300"
                              }`}
                          >
                            <option value="" disabled>
                              Choose a country…
                            </option>
                            {COUNTRIES.map((c) => (
                              <option key={c} value={c} className="text-main-900">
                                {c}
                              </option>
                            ))}
                          </select>
                          <svg
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </FieldWrapper>
                    </div>
                  </div>
                </div>

                {/* ── Section 2: CV Upload ── */}
                <div className="px-6 md:px-10 py-7 border-b border-secondary-100">
                  <StepBadge step={2} label="Upload Your CV" />

                  <AnimatePresence mode="wait">
                    {!cvFile ? (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-xl py-10 px-6 text-center cursor-pointer transition-all select-none
                          ${isDragActive
                            ? "border-main-300 bg-main-300/5 scale-[1.01]"
                            : "border-secondary-200 hover:border-main-300 hover:bg-main-50/60"
                          }`}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".pdf,application/pdf"
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-main-50 flex items-center justify-center">
                            <UploadCloud
                              size={26}
                              strokeWidth={1.5}
                              className="text-main-500"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-main-700 font-heading">
                              Drag & drop your CV here
                            </p>
                            <p className="text-xs text-secondary-500 mt-1 font-sans">
                              or{" "}
                              <span className="text-main-500 underline underline-offset-2 font-medium">
                                click to browse your files
                              </span>
                            </p>
                            <p className="text-xs text-secondary-400 mt-2 font-sans">
                              📄 Only PDF files are accepted (max 5MB)
                            </p>
                          </div>
                        </div>
                        {isDragActive && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-main-300/10 rounded-xl flex items-center justify-center"
                          >
                            <p className="text-main-500 font-semibold font-heading text-sm">
                              Release to upload
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="file"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="flex items-center gap-4 border-2 border-main-500 bg-main-50/40 rounded-xl px-5 py-4"
                      >
                        <div className="w-10 h-10 rounded-lg bg-main-500/10 flex items-center justify-center flex-shrink-0">
                          <FileText size={18} className="text-main-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-main-900 font-heading truncate">
                            {cvFile.name}
                          </p>
                          <p className="text-xs text-secondary-500 font-mono mt-0.5">
                            {(cvFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                            <span className="text-main-500">Uploaded ✓</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="p-2 rounded-lg hover:bg-red-50 text-secondary-400 hover:text-red-500 transition-colors flex-shrink-0"
                          title="Remove file"
                        >
                          <Trash2 size={15} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Section 3: Statement ── */}
                <div className="px-6 md:px-10 py-7 border-b border-secondary-100">
                  <StepBadge step={3} label="About You" />
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-main-700 mb-1.5 font-heading"
                  >
                    Tell Us About Yourself{" "}
                    <span className="ml-2 text-xs font-normal text-secondary-500 font-sans">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Mention your work experience, skills, or what kind of job you are looking for. Even a few sentences help."
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-secondary-100 bg-white text-main-900 placeholder-secondary-300 text-sm font-sans focus:outline-none focus:border-main-300 hover:border-secondary-300 transition-all resize-y"
                  />
                </div>

                {/* ── Section 4: Consent & Submit ── */}
                <div className="px-6 md:px-10 py-7">
                  <label className="flex items-start gap-3 cursor-pointer group mb-6">
                    <div className="relative mt-0.5 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={handleCheckboxChange}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center
                        ${formData.termsAccepted
                            ? "bg-main-500 border-main-500"
                            : "border-secondary-300 group-hover:border-main-300"
                          }`}
                      >
                        {formData.termsAccepted && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            viewBox="0 0 12 10"
                            className="w-3 h-3"
                          >
                            <polyline
                              points="1.5,5 4.5,8 10.5,2"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </motion.svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-secondary-700 leading-relaxed font-sans">
                      I confirm all the information I provided is accurate and I
                      give permission for{" "}
                      <strong className="text-main-700">OG Agency</strong> to
                      contact me about job opportunities.
                    </span>
                  </label>

                  <motion.button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    whileTap={isFormValid ? { scale: 0.98 } : {}}
                    className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-heading font-bold text-sm tracking-wide transition-all
                      ${isFormValid && !isSubmitting
                        ? "bg-gradient-to-r from-main-700 to-main-500 text-white shadow-lg shadow-main-500/30 hover:shadow-main-500/50 hover:from-main-900 hover:to-main-700 cursor-pointer"
                        : "bg-secondary-100 text-secondary-400 cursor-not-allowed"
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting your application…
                      </>
                    ) : (
                      <>
                        Submit My Application
                        <ArrowRight size={16} />
                      </>
                    )}
                  </motion.button>

                  {!isFormValid && !isSubmitting && (
                    <p className="text-center text-xs text-secondary-400 font-sans mt-3">
                    </p>
                  )}
                </div>
              </motion.form>
            ) : (
              /* ── Success State ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="py-20 px-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-main-50 border-4 border-main-300 mx-auto flex items-center justify-center mb-8"
                >
                  <CheckCircle2 size={36} className="text-main-500" strokeWidth={1.5} />
                </motion.div>
                <h2 className="font-heading text-2xl font-bold text-main-900 mb-3">
                  Application Received!
                </h2>
                <p className="text-secondary-500 font-sans text-sm max-w-sm mx-auto leading-relaxed mb-2">
                  Thank you for applying. Our consultants will carefully review
                  your details and contact you within{" "}
                  <strong className="text-main-700">2–3 business days</strong>.
                </p>

                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="text-sm text-main-500 hover:text-main-700 underline underline-offset-4 font-medium font-sans transition-colors"
                >
                  Submit another application
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        {/* <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-white/50 font-sans mt-6"
        >
          Your information is kept private and will only be used to match you
          with job opportunities.
        </motion.p> */}
      </div>
    </section>
  );
}