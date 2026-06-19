"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, ChevronRight, AlertCircle, Building, Mail, User, Briefcase } from "lucide-react";

// Form validation schema with Zod
const partnerSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid business email." }),
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  industry: z.string().min(1, { message: "Please select an industry." }),
  volume: z.string().min(1, { message: "Please select estimated volume." }),
  message: z.string().min(10, { message: "Please provide a message of at least 10 characters." }),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

export default function PartnerForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      industry: "",
      volume: "",
      message: "",
    },
  });

  const onSubmit = async (data: PartnerFormData) => {
    setIsSubmitting(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    console.log("Submitted partnership inquiry:", data);
  };

  const handleReset = () => {
    reset();
    setIsSubmitted(false);
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-secondary-100/30 to-main-50" id="partner-form">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 font-heading text-main-700">
            Partner with O.G. Agency
          </h2>
          <p className="text-lg text-secondary-700 max-w-prose mx-auto">
            Ready to streamline your global hiring operations? Complete the intake form below, and our business development team will schedule a strategy call.
          </p>
        </div>

        <div className="bg-white border border-secondary-100 rounded-3xl p-8 md:p-12 shadow-card hover:shadow-card-hover transition-all">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-main-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-main-500" /> Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      {...register("fullName")}
                      className={`px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none transition-all ${
                        errors.fullName
                          ? "border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-secondary-300 focus:border-main-500 focus:ring-2 focus:ring-main-100"
                      }`}
                    />
                    {errors.fullName && (
                      <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName.message}
                      </span>
                    )}
                  </div>

                  {/* Business Email */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-main-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-main-500" /> Business Email
                    </label>
                    <input
                      type="email"
                      placeholder="jane.doe@company.com"
                      {...register("email")}
                      className={`px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none transition-all ${
                        errors.email
                          ? "border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-secondary-300 focus:border-main-500 focus:ring-2 focus:ring-main-100"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-main-700 mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4 text-main-500" /> Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Corporation"
                      {...register("companyName")}
                      className={`px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none transition-all ${
                        errors.companyName
                          ? "border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-secondary-300 focus:border-main-500 focus:ring-2 focus:ring-main-100"
                      }`}
                    />
                    {errors.companyName && (
                      <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.companyName.message}
                      </span>
                    )}
                  </div>

                  {/* Industry Selection */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-main-700 mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-main-500" /> Sourcing Sector
                    </label>
                    <select
                      {...register("industry")}
                      className={`px-4 py-3 rounded-xl border font-sans text-sm bg-white focus:outline-none transition-all ${
                        errors.industry
                          ? "border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-secondary-300 focus:border-main-500 focus:ring-2 focus:ring-main-100"
                      }`}
                    >
                      <option value="">Select industry...</option>
                      <option value="Hospitality">Hospitality & Catering</option>
                      <option value="IT & Engineering">IT & Software Engineering</option>
                      <option value="Healthcare">Healthcare & Medicine</option>
                      <option value="Construction">Construction & Civil Engineering</option>
                      <option value="Agriculture">Agriculture & Farming</option>
                      <option value="Other">Other / Multi-Sector</option>
                    </select>
                    {errors.industry && (
                      <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.industry.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sourcing Volume Selection */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-main-700 mb-2">
                    Estimated Recruitment Volume (Per Year)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "1-5 recruits", value: "1-5" },
                      { label: "6-20 recruits", value: "6-20" },
                      { label: "21-50 recruits", value: "21-50" },
                      { label: "50+ recruits", value: "50+" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center justify-center p-3 rounded-xl border border-secondary-300 bg-white hover:bg-main-50/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          {...register("volume")}
                          className="mr-2 accent-main-500 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm font-medium text-main-900 select-none">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.volume && (
                    <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.volume.message}
                    </span>
                  )}
                </div>

                {/* Sourcing Requirements Message */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-main-700 mb-2">
                    Describe Sourcing Requirements
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe the roles, skills, and languages required..."
                    {...register("message")}
                    className={`px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none transition-all ${
                      errors.message
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-secondary-300 focus:border-main-500 focus:ring-2 focus:ring-main-100"
                    }`}
                  />
                  {errors.message && (
                    <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.message.message}
                    </span>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-gradient-to-r from-main-700 to-main-500 text-white font-semibold py-4 rounded-xl shadow-md hover:from-main-900 hover:to-main-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Sourcing Plan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8"
              >
                <div className="flex justify-center mb-6 text-emerald-500">
                  <CheckCircle2 className="w-20 h-20 animate-bounce" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-heading text-main-700 mb-4">
                  Inquiry Successfully Received!
                </h3>
                <p className="text-secondary-900 max-w-md mx-auto mb-8 font-sans">
                  Thank you for reaching out to O.G. Agency. Our business development team has logged your requirements and will reach out via email within 24 hours.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="bg-main-700 text-main-50 hover:bg-main-900 px-6 py-3 rounded-xl font-medium transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Submit Another Sourcing Query</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
