import React, { useMemo } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Award, ShieldCheck, Globe, Anchor, Star, Trophy } from 'lucide-react';

/**
 * Logic to capture the certificate DOM and convert it to a high-quality PDF.
 */
export const downloadCertificate = async (certificateRef, courseTitle) => {
  if (!certificateRef.current) return;

  try {
    const canvas = await html2canvas(certificateRef.current, {
      scale: 3, // Ultra-high resolution
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`CCI-Credential-${courseTitle.replace(/\s+/g, '-')}.pdf`);
  } catch (error) {
    console.error("Generation Error:", error);
    alert("Issue generating credential. Please try again.");
  }
};

const CertificateGenerator = ({ user, course, certificateRef, isPreview = false }) => {
  if (!course || !user) return null;

  const date = useMemo(() => new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }), []);

  const serialNumber = useMemo(() => 
    `CCI-${course.id?.toString().toUpperCase().substring(0, 4)}-${Math.floor(100000 + Math.random() * 900000)}`
  , [course.id]);

  // Styling wrapper for hidden vs preview mode
  const wrapperClass = isPreview 
    ? "w-full overflow-hidden rounded-xl shadow-2xl scale-[0.6] origin-top md:scale-100 mb-[-150px] md:mb-0" 
    : "fixed left-[-9999px] top-0 shadow-none pointer-events-none";

  return (
    <div className={wrapperClass}>
      <div 
        ref={certificateRef}
        className="w-[1123px] h-[794px] bg-white relative overflow-hidden p-12"
        style={{ color: '#0f172a', fontFamily: "'Inter', sans-serif" }}
      >
        {/* Professional Outer Border */}
        <div className="absolute inset-0 border-[30px] border-slate-900" />
        <div className="absolute inset-4 border-4 border-double border-amber-400/40" />
        
        {/* Subtle Luxury Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Anchor size={600} />
        </div>

        {/* Content Container */}
        <div className="h-full w-full border-[1px] border-amber-200/50 p-12 flex flex-col justify-between relative z-10 bg-white/95">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-900 flex items-center justify-center rounded-sm">
                <Anchor className="text-amber-400" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-[0.2em] text-slate-900 uppercase">City Cruise</h2>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.3em]">International Limited</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Verification Token</p>
              <p className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-md">{serialNumber}</p>
            </div>
          </div>

          {/* Main Body */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-20 bg-amber-200" />
              <Star className="text-amber-500" size={16} fill="currentColor" />
              <h4 className="text-sm font-bold uppercase tracking-[0.6em] text-slate-500">Board of Directors Recognition</h4>
              <Star className="text-amber-500" size={16} fill="currentColor" />
              <div className="h-[1px] w-20 bg-amber-200" />
            </div>

            <h3 className="text-xl font-serif italic text-slate-600">This official credential is hereby bestowed upon</h3>
            
            <h1 className="text-7xl font-bold text-slate-900 tracking-tight border-b-2 border-slate-900 inline-block px-12 py-2 mb-4">
              {user.firstName} {user.lastName || ''}
            </h1>

            <div className="max-w-3xl mx-auto pt-6">
              <p className="text-slate-600 leading-relaxed text-lg italic">
                Having demonstrated distinguished competency and fulfilled all statutory requirements for the professional certification in
              </p>
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-wider mt-4 mb-2">
                {course.title}
              </h2>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                Issued under the authority of the CCI Global Academic Council
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end px-4">
            <div className="text-left space-y-6">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Conferred On</p>
                  <p className="font-bold text-slate-900 text-lg border-b border-slate-200 pb-1">{date}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Security Hash</p>
                  <div className="flex items-center gap-1 text-slate-800 font-mono text-[11px] font-bold">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>SECURED-BY-CCI-INTL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Seal */}
            <div className="relative flex flex-col items-center">
               <div className="w-32 h-32 relative flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-amber-400/20 rounded-full animate-spin-slow" />
                  <div className="w-24 h-24 bg-amber-400/10 border-2 border-amber-500 rounded-full flex items-center justify-center">
                    <Trophy className="text-amber-600" size={40} />
                  </div>
                  {/* Decorative curved text placeholder (SVG circles would go here) */}
               </div>
               <div className="mt-4 text-center">
                  <p className="font-serif italic text-2xl text-slate-900 mb-0 leading-none">A. S. Richardson</p>
                  <div className="w-48 h-[1px] bg-slate-900 my-2" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Managing Director, CCI Ltd.</p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;