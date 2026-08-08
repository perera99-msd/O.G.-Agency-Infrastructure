"use client";

import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, Circle, Clock, Check } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const getCountrySteps = (country?: string) => {
  const dest = country || 'Destination';
  const isRussia = dest.toLowerCase() === 'russia';
  const isRomania = dest.toLowerCase() === 'romania';
  const adj = isRussia ? 'Russian' : isRomania ? 'Romanian' : dest;

  return [
    'Video Upload',
    'Photo Upload',
    'Medical Receipt',
    'Medical Report',
    'Apply the Company',
    'Invitation',
    `${adj} Agreement`,
    'English Agreement',
    `${adj} Embassy Process`,
    'Bureau Done',
    'Tickets',
  ];
};

const getCountryIsoCode = (country?: string) => {
  if (!country) return null;
  const c = country.toLowerCase();
  if (c.includes('russia')) return 'ru';
  if (c.includes('romania')) return 'ro';
  if (c.includes('qatar')) return 'qa';
  if (c.includes('saudi') || c.includes('ksa')) return 'sa';
  if (c.includes('dubai') || c.includes('uae') || c.includes('emirates')) return 'ae';
  if (c.includes('kuwait')) return 'kw';
  if (c.includes('oman')) return 'om';
  if (c.includes('bahrain')) return 'bh';
  if (c.includes('malaysia')) return 'my';
  if (c.includes('singapore')) return 'sg';
  if (c.includes('maldives')) return 'mv';
  if (c.includes('cyprus')) return 'cy';
  if (c.includes('poland')) return 'pl';
  return null;
};

export default function StatusPage() {
  const { user } = useAuth();
  const [heroImage, setHeroImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user?.countryApplied) return;
    const fetchDest = async () => {
      try {
        const q = query(collection(db, "destinations"), where("country", "==", user.countryApplied));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const dest = snap.docs[0].data();
          if (dest.heroImage) setHeroImage(dest.heroImage);
        }
      } catch (err) {
        console.error("Failed to fetch destination image:", err);
      }
    };
    fetchDest();
  }, [user?.countryApplied]);

  const displaySteps = useMemo(() => {
    if (user?.tracking && user.tracking.length > 0) {
      return user.tracking;
    }
    return getCountrySteps(user?.countryApplied).map(step => ({
      step,
      completed: false,
      date: null,
      fileUrl: null
    }));
  }, [user]);

  const completedCount = displaySteps.filter(s => s.completed).length;
  const totalCount = displaySteps.length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  
  const countryCode = getCountryIsoCode(user?.countryApplied);

  return (
    <div style={{ 
      padding: "1.25rem 1rem", 
      maxWidth: "600px",
      margin: "0 auto",
      minHeight: "100vh"
    }}>

      {/* Destination Hero Banner - Glassmorphic Hero Bento */}
      <div style={{
        width: "100%",
        height: "170px",
        borderRadius: "24px",
        marginBottom: "1.25rem",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: heroImage 
          ? `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.75)), url(${heroImage})`
          : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 14px 30px -5px rgba(15, 23, 42, 0.2)"
      }}>
        {countryCode && (
          <div style={{
            width: "58px",
            height: "58px",
            borderRadius: "50%",
            border: "3px solid #ffffff",
            overflow: "hidden",
            marginBottom: "0.5rem",
            boxShadow: "0 8px 20px rgba(0,0,0,0.35)"
          }}>
            <img 
              src={`https://flagcdn.com/w160/${countryCode}.png`} 
              alt="Flag"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
        <h1 style={{
          color: "#ffffff",
          fontSize: "1.4rem",
          fontWeight: 900,
          margin: 0,
          letterSpacing: "-0.3px",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)"
        }}>
          {user?.countryApplied || "Destination"}
        </h1>
      </div>
      
      {/* Progress Header Card - Vibrant Gradient Bento */}
      <div style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        borderRadius: "24px",
        padding: "1.6rem 1.5rem",
        color: "white",
        marginBottom: "1.75rem",
        boxShadow: "0 14px 30px -5px rgba(37, 99, 235, 0.35)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative background shapes */}
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "150px", height: "150px", background: "rgba(255,255,255,0.12)", borderRadius: "50%" }} />
        
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 900, margin: 0, letterSpacing: "-0.3px" }}>
                {user?.countryApplied ? `${user.countryApplied} Migration` : 'Migration Progress'}
              </h2>
              <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "0.82rem", marginTop: "4px", fontWeight: 600 }}>
                Personal checklist & milestone tracking
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "0.6rem" }}>
            <span style={{ fontSize: "2.2rem", fontWeight: 900, lineHeight: 1 }}>{progressPercentage}%</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(10px)", padding: "5px 12px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.3)" }}>
              {completedCount} of {totalCount} done
            </span>
          </div>
          
          {/* Progress Bar Track */}
          <div style={{ width: "100%", height: "10px", background: "rgba(0, 0, 0, 0.2)", borderRadius: "30px", overflow: "hidden" }}>
            <div style={{ 
              width: `${progressPercentage}%`, 
              height: "100%", 
              background: "#10b981",
              borderRadius: "30px",
              transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" 
            }} />
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div style={{ 
        position: "relative", 
        paddingLeft: "0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        {/* Vertical Timeline Line */}
        <div style={{
          position: "absolute",
          left: "24px",
          top: "20px",
          bottom: "20px",
          width: "2px",
          background: "linear-gradient(to bottom, #10b981 0%, #e2e8f0 100%)",
          zIndex: 0
        }} />

        {displaySteps.map((trackingItem, idx) => {
          const stepTitle = trackingItem.step;
          const isDone = trackingItem.completed;
          const stepDate = trackingItem.date;

          return (
            <div key={stepTitle + idx} style={{ display: "flex", gap: "1rem", position: "relative", zIndex: 1 }}>
              
              {/* Timeline Node */}
              <div style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: isDone ? "#10b981" : "#ffffff",
                border: isDone ? "2px solid #10b981" : "2px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "4px",
                boxShadow: isDone ? "0 6px 15px rgba(16, 185, 129, 0.3)" : "0 4px 10px rgba(0,0,0,0.03)",
                transition: "all 0.3s ease"
              }}>
                {isDone ? (
                  <Check size={16} color="white" strokeWidth={3} />
                ) : (
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8" }}>{idx + 1}</span>
                )}
              </div>

              {/* Content Card - Bento Box */}
              <div style={{
                flex: 1,
                background: "#ffffff",
                borderRadius: "20px",
                padding: "1.1rem 1.25rem",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s ease",
                opacity: isDone ? 1 : 0.9
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <h3 style={{ 
                    fontSize: "1rem", 
                    fontWeight: 900, 
                    color: isDone ? "#0f172a" : "#475569",
                    margin: 0
                  }}>
                    {stepTitle}
                  </h3>
                  
                  {/* Status Pill */}
                  <div style={{
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: isDone ? "#ecfdf5" : "#f1f5f9",
                    color: isDone ? "#059669" : "#64748b"
                  }}>
                    {isDone ? "Completed" : "Pending"}
                  </div>
                </div>

                {/* Date or Pending Text */}
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px",
                  fontSize: "0.76rem",
                  color: "#94a3b8",
                  fontWeight: 600
                }}>
                  {isDone ? (
                    <>
                      <CheckCircle2 size={13} color="#10b981" />
                      Updated: {stepDate || 'Recently'}
                    </>
                  ) : (
                    <>
                      <Clock size={13} />
                      Awaiting completion
                    </>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
      
      {/* Footer spacer */}
      <div style={{ height: "40px" }} />
    </div>
  );
}
