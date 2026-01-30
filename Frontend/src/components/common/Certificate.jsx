import React from 'react';
import { Award } from 'lucide-react';

const Certificate = ({ studentName, courseName, date, certificateId, score }) => {
    // 3300px x 2550px (Landscape 11x8.5" @ 300DPI)
    return (
        <div className="w-[3300px] h-[2550px] bg-[#fffcf5] text-black relative flex flex-col items-center justify-center p-32 mx-auto shadow-2xl overflow-hidden select-none">
            {/* --- Ornamental Borders --- */}
            {/* Outer Gold Border */}
            <div className="absolute inset-12 border-[12px] border-[#C5A059] z-10"></div>
            {/* Inner Thin Border */}
            <div className="absolute inset-[60px] border-[3px] border-[#C5A059] z-10"></div>

            {/* Corner Flourishes (CSS Shapes) - Scaled Up */}
            <div className="absolute top-12 left-12 w-48 h-48 border-t-[12px] border-l-[12px] border-[#C5A059] z-20"></div>
            <div className="absolute top-12 right-12 w-48 h-48 border-t-[12px] border-r-[12px] border-[#C5A059] z-20"></div>
            <div className="absolute bottom-12 left-12 w-48 h-48 border-b-[12px] border-l-[12px] border-[#C5A059] z-20"></div>
            <div className="absolute bottom-12 right-12 w-48 h-48 border-b-[12px] border-r-[12px] border-[#C5A059] z-20"></div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
            </div>

            {/* Watermark - Scaled Up */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Award size={1800} strokeWidth={0.5} />
            </div>

            {/* --- Content Content --- */}
            <div className="relative z-30 text-center w-full max-w-7xl flex flex-col items-center mt-20">

                {/* Header */}
                <div className="mb-24">
                    <h1 className="text-[180px] font-serif font-bold text-[#1a1a1a] mb-8 uppercase tracking-widest text-shadow-md leading-none">
                        Certificate
                    </h1>
                    <h2 className="text-[60px] font-light uppercase tracking-[0.4em] text-[#C5A059]">
                        of Achievement
                    </h2>
                </div>

                {/* Recipient */}
                <div className="mb-20 w-full">
                    <p className="text-[50px] text-gray-500 italic font-serif mb-12">This certificate is proudly presented to</p>
                    <div className="text-[140px] font-bold font-serif text-[#1a4d2e] border-b-[8px] border-[#C5A059]/30 pb-10 px-24 inline-block min-w-[1800px] mb-4 leading-none">
                        {studentName}
                    </div>
                </div>

                {/* Course Info */}
                <div className="mb-32 w-full max-w-[2400px]">
                    <p className="text-[50px] text-gray-500 italic font-serif mb-6">for successfully completing the curriculum and requirements for</p>
                    <h3 className="text-[100px] font-bold text-[#1a1a1a] my-10 font-serif leading-tight">
                        {courseName}
                    </h3>
                    <div className="flex items-center justify-center gap-4 mt-12">
                        <div className="bg-[#1a4d2e] text-white px-16 py-6 rounded-full font-bold text-[50px] shadow-xl border-4 border-[#C5A059]">
                            Score: {score}%
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="grid grid-cols-3 gap-32 w-full mt-auto items-end px-20">
                    {/* Date */}
                    <div className="text-center">
                        <div className="border-t-[4px] border-[#1a1a1a] w-full pt-6 font-serif italic text-[50px]">
                            {new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <p className="text-[30px] font-bold uppercase tracking-wider text-gray-500 mt-4">Date</p>
                    </div>

                    {/* Seal */}
                    <div className="text-center flex justify-center transform translate-y-12">
                        <div className="w-[400px] h-[400px] bg-[#C5A059] rounded-full flex items-center justify-center shadow-2xl relative border-[12px] border-white">
                            <div className="w-[350px] h-[350px] border-[6px] border-white/50 rounded-full flex items-center justify-center p-8 text-center text-[30px] font-bold text-white uppercase tracking-widest leading-relaxed">
                                <span className="drop-shadow-lg">
                                    Official<br />Verified<br />Certification
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="text-center">
                        {/* Simulated Signature */}
                        <div className="font-[cursive] text-[80px] text-[#1a1a1a] mb-[-20px] transform -rotate-2">
                            EduSkill Board
                        </div>
                        <div className="border-t-[4px] border-[#1a1a1a] w-full pt-6"></div>
                        <p className="text-[30px] font-bold uppercase tracking-wider text-gray-500 mt-4">Authorized Signature</p>
                    </div>
                </div>
            </div>

            {/* Footer Elements */}
            <div className="absolute bottom-16 text-center w-full z-30">
                <p className="text-[30px] text-gray-400 font-mono tracking-widest">
                    VERIFICATION ID: {certificateId}
                </p>
            </div>
        </div>
    );
};

export default Certificate;
