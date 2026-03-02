import React from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Award, ShieldCheck, Globe } from 'lucide-react';

const CertificateGenerator = ({ user, course, certificateRef }) => {
  return (
    <div className="absolute left-[-9999px] top-0">
      <div 
        ref={certificateRef}
        className="w-[1000px] h-[700px] bg-white p-16 relative flex flex-col items-center justify-between border-[20px] border-slate-50 overflow-hidden"
        style={{ fontFamily: 'sans-serif' }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-brand-blue/5 rounded-full" />
        <div className="absolute bottom-[-50px] left-[-50px] w-60 h-60 bg-slate-100 rounded-full" />
        
        {/* Header */}
        <div className="text-center z-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-brand-blue rounded-2xl flex items-center justify-center shadow-xl shadow-brand-blue/20">
              <Award className="text-white" size={40} />
            </div>
          </div>
          <p className="text-slate-400 font-mono text-[12px] uppercase tracking-[0.5em] mb-2">Official Certification of Mastery</p>
          <div className="h-1 w-20 bg-brand-blue mx-auto rounded-full" />
        </div>

        {/* Recipient */}
        <div className="text-center z-10">
          <p className="text-slate-500 font-serif italic text-xl mb-4">This is to officially recognize that</p>
          <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-6">
            {user?.firstName || 'Innovator'}
          </h1>
          <p className="max-w-2xl text-slate-500 leading-relaxed text-lg">
            Has successfully completed the advanced curriculum and final assessment for
          </p>
          <h2 className="text-3xl font-bold text-brand-blue mt-4 uppercase tracking-tight">
            {course?.title}
          </h2>
        </div>

        {/* Footer / Validation */}
        <div className="w-full flex justify-between items-end z-10">
          <div className="text-left">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Issue Date</p>
            <p className="font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 border-4 border-slate-100 rounded-full flex items-center justify-center mb-2">
               <ShieldCheck size={48} className="text-slate-200" />
            </div>
            <p className="text-[9px] font-mono text-slate-300 uppercase tracking-tighter text-center">
              Verified Ecosystem <br /> ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Curriculum Director</p>
            <p className="font-serif italic text-xl text-slate-900 border-t border-slate-200 pt-2 px-4">City Cruise Global</p>
          </div>
        </div>

        {/* Branding Watermark */}
        <Globe className="absolute bottom-[-100px] right-[-100px] text-slate-50 opacity-50" size={400} />
      </div>
    </div>
  );
};

export const downloadCertificate = async (certificateRef, courseTitle) => {
  const canvas = await html2canvas(certificateRef.current, {
    scale: 2, // High resolution
    useCORS: true,
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1000, 700]
  });
  pdf.addImage(imgData, 'PNG', 0, 0, 1000, 700);
  pdf.save(`Certificate-${courseTitle.replace(/\s+/g, '-')}.pdf`);
};

export default CertificateGenerator;