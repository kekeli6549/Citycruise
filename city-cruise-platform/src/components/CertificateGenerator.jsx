import React, { useMemo } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Award, ShieldCheck, Globe, Zap } from 'lucide-react';

/**
 * Logic to capture the certificate DOM and convert it to a high-quality PDF.
 * We use scale: 3 for retina-level clarity.
 */
export const downloadCertificate = async (certificateRef, courseTitle) => {
  if (!certificateRef.current) return;

  try {
    const canvas = await html2canvas(certificateRef.current, {
      scale: 3, // High resolution for professional printing
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // We create the PDF in landscape to match the 1123x794px proportions
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`Rootle-Certificate-${courseTitle.replace(/\s+/g, '-')}.pdf`);
  } catch (error) {
    console.error("Certificate Generation Error:", error);
    alert("There was an issue generating your certificate. Please try again.");
  }
};

const CertificateGenerator = ({ user, course, certificateRef }) => {
  if (!course || !user) return null;

  // UseMemo prevents random data changes on re-renders for consistency
  const date = useMemo(() => new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }), []);

  // Generate a unique Diaspora-styled Serial ID linked to course ID
  const serialNumber = useMemo(() => 
    `RT-${course.id?.toString().toUpperCase().substring(0, 4) || 'CERT'}-${Math.floor(1000 + Math.random() * 9000)}`
  , [course.id]);

  return (
    <div className="fixed left-[-9999px] top-0 shadow-none pointer-events-none">
      <div 
        ref={certificateRef}
        className="w-[1123px] h-[794px] bg-white p-1 relative overflow-hidden font-sans border-[20px] border-slate-50"
        style={{ color: '#0f172a' }}
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-3xl" />

        <div className="h-full w-full border border-slate-200 p-16 flex flex-col justify-between relative z-10">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center shadow-lg shadow-brand-blue/20">
                  <Zap className="text-white" size={18} fill="currentColor" />
                </div>
                <span className="font-heading font-bold text-2xl tracking-tighter">ROOTLE</span>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-400">Professional Excellence Credentials</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Serial ID</p>
              <p className="font-bold text-sm font-mono text-slate-900">{serialNumber}</p>
            </div>
          </div>

          {/* Main Body */}
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <h4 className="text-[12px] font-mono uppercase tracking-[0.5em] text-brand-blue font-bold">Certificate of Excellence</h4>
              <p className="text-slate-500 font-serif italic text-lg">This elite credential is officially granted to</p>
            </div>

            <h1 className="text-7xl font-heading font-bold text-slate-900 tracking-tight py-4">
              {user.firstName} {user.lastName || ''}
            </h1>

            <div className="max-w-2xl mx-auto border-t border-b border-slate-100 py-10">
              <p className="text-slate-500 leading-relaxed font-body text-lg">
                For the successful completion and mastery of the <br />
                <span className="text-slate-900 font-bold uppercase tracking-wide text-2xl block mt-2">"{course.title}"</span> <br />
                curriculum, demonstrating exceptional proficiency in professional standards and leadership.
              </p>
            </div>
          </div>

          {/* Footer Section / Signatures */}
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <div className="flex items-center gap-10">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Date Issued</p>
                  <p className="font-bold border-b border-slate-900 pb-1 text-slate-900">{date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Accreditation</p>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold">
                    <ShieldCheck size={14} />
                    <span className="text-xs uppercase tracking-tighter">Verified Diaspora Member</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col items-center mr-10">
              <div className="absolute top-[-90px] w-28 h-28 border-2 border-brand-blue/10 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-brand-blue/5 border border-brand-blue/30 rounded-full flex items-center justify-center animate-[spin_15s_linear_infinite]">
                   <Globe className="text-brand-blue/10" size={48} />
                </div>
                <Award className="absolute text-brand-blue shadow-xl shadow-brand-blue/20" size={40} />
              </div>
              
              <div className="mt-4 text-center">
                <p className="font-serif italic text-3xl text-slate-800 mb-1">Rootle Board</p>
                <div className="w-40 h-[2px] bg-slate-900 mb-2" />
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Authorized Registrar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;