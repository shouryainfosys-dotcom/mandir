import React, { useState, useEffect } from 'react';
import { Menu, Calendar, Heart, Lock, LogOut, Upload, Home, Image as ImageIcon, Plus, Trash2, Save, Info, Phone, MapPin, Clock, CreditCard, X, Settings, Layout, Camera, MessageSquare, Bell, User, Edit3, Sparkles, ChevronRight } from 'lucide-react';
import { AppState, TempleEvent } from './types.ts';
import { getData, saveData, checkAdminAuth } from './datastore.ts';
import { getDivineThought } from './gemini.ts';
import { INITIAL_DATA } from './constants.ts';

// --- Global Components ---

const ScrollingBanner = ({ message, bgColor = "bg-[#FF9933]", textColor = "text-white" }: { message: string, bgColor?: string, textColor?: string }) => (
  <div className={`${bgColor} ${textColor} py-1 overflow-hidden border-y border-[#FFD700]/20 shadow-sm z-40 relative`}>
    <div className="animate-marquee whitespace-nowrap text-[9px] md:text-xs font-bold flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="mx-6 md:mx-8 font-serif italic drop-shadow-sm flex items-center gap-1.5">
          <Sparkles size={10} className="text-[#FFD700]"/> ॐ {message} ॐ
        </span>
      ))}
    </div>
  </div>
);

const Navbar = ({ onNavigate, currentPage, mainHeading }: { onNavigate: (page: string) => void, currentPage: string, mainHeading: string }) => (
  <nav className="sticky top-0 z-50 bg-[#800000] text-white shadow-lg border-b-2 border-[#FFD700]">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center h-12 md:h-14">
        <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="bg-[#FF9933] p-1 rounded-lg mr-2 shadow-sm group-hover:scale-110 transition-all duration-300 border border-[#FFD700]/50">
             <span className="text-xs md:text-base font-bold">ॐ</span>
          </div>
          <div>
            <h1 className="devotional-font text-xs md:text-base lg:text-lg font-bold text-[#FFD700] drop-shadow-md leading-tight">
              {mainHeading || 'श्री विठ्ठल मन्दिर'}
            </h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-3 font-bold">
          {['home', 'gallery', 'events', 'donation', 'contact'].map(id => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`text-[10px] lg:text-xs transition-all duration-300 hover:text-[#FFD700] relative py-1 ${currentPage === id ? 'text-[#FFD700]' : 'text-gray-100'}`}
            >
              {id === 'home' ? 'मुख्य' : id === 'gallery' ? 'गैलरी' : id === 'events' ? 'कार्यक्रम' : id === 'donation' ? 'दान' : 'संपर्क'}
              {currentPage === id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFD700] rounded-full"></span>
              )}
            </button>
          ))}
          <button onClick={() => onNavigate('admin')} className="bg-black/20 px-2 py-0.5 rounded hover:bg-[#FF9933] transition-all border border-[#FFD700]/30 text-[#FFD700] flex items-center gap-1 text-[8px]">
            <Lock size={8} /> एडमिन
          </button>
        </div>

        <div className="md:hidden flex items-center gap-2">
           <button onClick={() => onNavigate('admin')} className="p-1 bg-[#FF9933] rounded shadow-sm"><Lock size={12}/></button>
           <Menu className="text-[#FFD700]" size={16} />
        </div>
      </div>
    </div>
  </nav>
);

const Footer = ({ data }: { data: AppState }) => (
  <footer className="bg-[#3a0000] text-white py-6 mt-6 border-t-2 border-[#FFD700] relative overflow-hidden">
    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/mandala.png')]"></div>
    
    <div className="absolute left-2 bottom-4 z-0 hidden lg:block pointer-events-none transform opacity-30">
      <img src={data?.homepage?.footerLeftImage} alt="" className="w-24 h-24 object-contain" />
    </div>
    <div className="absolute right-2 bottom-4 z-0 hidden lg:block pointer-events-none transform opacity-30">
      <img src={data?.homepage?.footerRightImage} alt="" className="w-24 h-24 object-contain" />
    </div>

    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
      <div className="space-y-1">
        <h3 className="devotional-font text-lg text-[#FFD700]">{data?.homepage?.footerTitle}</h3>
        <p className="text-gray-300 text-[8px] italic leading-relaxed font-serif border-l-2 border-[#FFD700]/30 pl-2 opacity-80">{data?.homepage?.footerDescription}</p>
      </div>
      
      <div className="bg-black/10 p-3 rounded-lg border border-white/5 shadow-inner">
        <h4 className="font-bold text-[8px] mb-1.5 text-[#FFD700] flex items-center gap-2 uppercase tracking-wider border-b border-white/5 pb-1">
          <Settings size={10} className="text-[#FF9933]"/> संपर्क
        </h4>
        <div className="space-y-1 text-gray-300 text-[8px]">
          <p className="flex items-center gap-2"><Phone size={8} className="text-[#FF9933] shrink-0"/> {data?.homepage?.footerPhone}</p>
          <p className="flex items-start gap-2 leading-tight"><MapPin size={8} className="text-[#FF9933] mt-0.5 shrink-0"/> {data?.homepage?.footerAddress}</p>
        </div>
      </div>

      <div className="bg-black/10 p-3 rounded-lg border border-white/5 shadow-inner">
        <h4 className="font-bold text-[8px] mb-1.5 text-[#FFD700] flex items-center gap-2 uppercase tracking-wider border-b border-white/5 pb-1">
          <Clock size={10} className="text-[#FF9933]"/> दर्शन समय
        </h4>
        <div className="flex justify-between md:block md:space-y-1">
          <div>
            <p className="text-[6px] uppercase tracking-widest text-[#FF9933] font-black opacity-60">प्रातः</p>
            <p className="text-xs font-black text-[#FFD700]">{data?.homepage?.footerMorningTime}</p>
          </div>
          <div>
            <p className="text-[6px] uppercase tracking-widest text-orange-400 font-black opacity-60">संध्या</p>
            <p className="text-xs font-black text-[#FFD700]">{data?.homepage?.footerEveningTime}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="text-center mt-4 border-t border-white/5 pt-2 text-gray-500 text-[7px] italic relative z-10">
      &copy; 2024 {data?.homepage?.mainHeading}. सर्वाधिकार सुरक्षित।
    </div>
  </footer>
);

// --- Public Pages ---

const HomeView = ({ data }: { data: AppState }) => (
  <div className="animate-fadeIn">
    <section className="relative h-[40vh] md:h-[55vh] overflow-hidden flex items-center justify-center">
      <img src={data.homepage.heroImage} className="absolute inset-0 w-full h-full object-cover brightness-[0.45] scale-100 animate-slowZoom" alt="Hero" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h2 className="devotional-font text-xl md:text-3xl lg:text-4xl text-[#FFD700] drop-shadow-2xl animate-fadeIn leading-tight">
          {data.homepage.heroTitle}
        </h2>
      </div>
    </section>

    {/* Welcome Message Scrolling Banner (New Transparent Strip) */}
    <div className="relative z-30 -mt-4 md:-mt-6">
       <ScrollingBanner 
          message={data.homepage.welcomeMessage} 
          bgColor="bg-white/10 backdrop-blur-sm" 
          textColor="text-[#800000]" 
       />
    </div>

    <div className="max-w-7xl mx-auto px-4 md:px-6 mt-4 space-y-6 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily Thought - Smaller & More Compact */}
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-md border-l-[6px] border-[#FF9933] flex flex-col justify-center relative overflow-hidden h-fit self-center">
           <div className="absolute -right-2 -bottom-2 opacity-[0.03] pointer-events-none">
              <Heart size={80} className="text-[#800000]" />
           </div>
          <h3 className="text-[#800000] font-black text-[8px] md:text-[10px] mb-2 flex items-center uppercase tracking-[0.2em] border-b border-gray-50 pb-1">
            <Heart className="mr-1.5 text-red-600 animate-pulse" fill="currentColor" size={12} /> आज का सुविचार
          </h3>
          <p className="text-sm md:text-base lg:text-lg font-serif font-bold text-gray-800 leading-snug relative z-10">
            "{data.homepage.dailyThought}"
          </p>
        </div>
        
        {/* Darshan Image Optimized height */}
        <div className="bg-white p-1 rounded-2xl shadow-md border-2 border-[#FFD700] relative overflow-hidden group h-[250px] md:h-[320px]">
          <div className="absolute top-2 left-2 z-30 bg-[#800000] text-[#FFD700] px-2 py-0.5 rounded-full text-[7px] font-black shadow-md border border-[#FFD700] uppercase tracking-wider">दिव्य दर्शन</div>
          <img src={data.homepage.todaysDarshanImage} className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105" alt="Darshan" />
          <div className="absolute inset-x-2 bottom-2 z-30 bg-black/60 backdrop-blur-md text-white py-2 rounded-lg text-center border border-white/5">
            <p className="text-xs md:text-sm font-bold devotional-font text-[#FFD700]">मंगल दर्शन</p>
          </div>
        </div>
      </div>

      {/* Featured Gallery Reduced Size Strip */}
      {data.gallery.length > 0 && (
        <section className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-[#FFD700]/10">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-1.5">
            <h3 className="devotional-font text-base md:text-lg text-[#800000] flex items-center gap-1.5">
              <ImageIcon size={18} className="text-[#FF9933]" /> दिव्य झलकियाँ
            </h3>
            <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">गैलरी</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {data.gallery.slice(0, 6).map((img, idx) => (
              <div key={img.id} className="min-w-[120px] md:min-w-[180px] h-28 md:h-40 relative rounded-xl overflow-hidden shadow-sm group transform transition-transform hover:-translate-y-0.5">
                <img src={img.url} className="w-full h-full object-cover" alt={img.caption} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#800000]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <p className="text-white text-[7px] font-bold">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Aarti Timings - Thinner Strip */}
      <div className="bg-[#800000] p-4 md:p-6 rounded-[2rem] shadow-lg text-white border-b-4 border-[#FFD700] relative overflow-hidden">
        <div className="absolute -right-8 -top-8 opacity-[0.05] pointer-events-none">
           <Sparkles size={120} className="text-[#FFD700]" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="text-center lg:text-left">
            <h3 className="font-black text-lg md:text-2xl devotional-font text-[#FFD700] tracking-wide">आरती समय</h3>
            <p className="text-orange-200 text-[8px] md:text-[10px] italic font-serif opacity-60">भक्ति का पावन समय</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 w-full lg:w-auto">
            {data.aartiTimings.map(t => (
              <div key={t.id} className="bg-white/10 p-2 md:p-3 rounded-xl border border-white/5 flex flex-col items-center backdrop-blur-sm hover:bg-white/20 transition-all">
                <span className="text-[6px] md:text-[8px] font-black opacity-60 uppercase tracking-widest mb-0.5 text-[#FFD700]">{t.name}</span>
                <span className="text-xs md:text-base font-black">{t.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const GalleryView = ({ data }: { data: AppState }) => (
  <section className="max-w-7xl mx-auto px-5 py-8 animate-fadeIn">
    <div className="text-center mb-8">
      <h2 className="devotional-font text-2xl md:text-3xl text-[#800000] mb-1">दिव्य दर्शन गैलरी</h2>
      <div className="h-0.5 w-16 bg-[#FFD700] mx-auto rounded-full"></div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {data.gallery.map(img => (
        <div key={img.id} className="group relative overflow-hidden rounded-xl shadow-sm aspect-[3/4] border border-white hover:border-[#FFD700] transition-all duration-300">
          <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={img.caption} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#800000]/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
            <p className="text-[#FFD700] font-black text-xs mb-0.5">{img.caption}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const EventsView = ({ data }: { data: AppState }) => (
  <section className="max-w-5xl mx-auto px-5 py-8 animate-fadeIn">
    <div className="text-center mb-8">
      <h2 className="devotional-font text-2xl md:text-3xl text-[#800000] mb-1">धार्मिक कार्यक्रम</h2>
      <div className="h-0.5 w-16 bg-[#FFD700] mx-auto rounded-full"></div>
    </div>
    <div className="space-y-3 md:space-y-6">
      {data.events.map(event => (
        <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col sm:flex-row hover:shadow-md transition-all duration-300">
          <div className="bg-[#800000] text-white p-4 sm:w-32 flex flex-col items-center justify-center text-center">
             <Calendar size={20} className="mb-1 text-[#FFD700]" />
             <span className="text-sm font-black text-[#FFD700]">{event.date}</span>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-center">
            <h3 className="text-base font-black text-[#800000] mb-1 border-b border-gray-50 pb-0.5">{event.title}</h3>
            <p className="text-gray-600 text-[10px] md:text-xs italic font-serif leading-tight opacity-80">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const DonationView = ({ data }: { data: AppState }) => (
  <section className="max-w-5xl mx-auto px-5 py-8 animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 border-[4px] border-[#FFD700] relative overflow-hidden">
       <div className="absolute -left-8 -bottom-8 opacity-[0.03] pointer-events-none">
          <CreditCard size={150} className="text-[#FF9933]" />
       </div>
      <h2 className="devotional-font text-2xl md:text-3xl text-center mb-6 text-[#800000] relative z-10">दान एवं सेवा</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center relative z-10">
        <div className="space-y-4 bg-gray-50 p-4 rounded-xl border-l-[6px] border-[#FF9933] shadow-inner">
          <div className="space-y-3 text-[10px] md:text-xs">
            <div className="border-b border-gray-200 pb-1.5">
              <p className="text-[#FF9933] text-[7px] font-black uppercase tracking-widest">Bank Name</p>
              <p className="font-black text-gray-800">{data.donation.bankName}</p>
            </div>
            <div className="border-b border-gray-200 pb-1.5">
              <p className="text-[#FF9933] text-[7px] font-black uppercase tracking-widest">Account Number</p>
              <p className="font-black tracking-widest text-gray-700">{data.donation.accountNumber}</p>
            </div>
          </div>
          <div className="bg-[#800000] p-3 rounded-lg text-white text-center shadow">
            <p className="text-[7px] font-black uppercase tracking-[0.3em] mb-1 opacity-60">UPI ID</p>
            <p className="text-xs font-black break-all">{data.donation.upiId}</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl shadow border border-[#FFD700]">
            <img src={data.donation.qrCodeUrl} className="w-32 h-32 md:w-40 md:h-40 object-contain" alt="QR" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ContactView = () => (
  <section className="max-w-7xl mx-auto px-5 py-8 animate-fadeIn text-center">
    <h2 className="devotional-font text-2xl md:text-3xl text-[#800000] mb-6">संपर्क करें</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      <div className="bg-white p-5 md:p-6 rounded-xl shadow border-t-[8px] border-[#800000]">
        <h3 className="text-lg font-black text-[#800000] mb-4 border-b border-gray-50 pb-1.5">सन्देश भेजें</h3>
        <div className="space-y-3">
           <input className="w-full p-2.5 bg-gray-50 rounded-lg outline-none border border-transparent focus:border-[#FF9933] text-[10px] transition-all" placeholder="आपका शुभ नाम" />
           <textarea className="w-full p-2.5 bg-gray-50 rounded-lg h-24 outline-none border border-transparent focus:border-[#FF9933] text-[10px] resize-none transition-all" placeholder="आपका पावन सन्देश"></textarea>
           <button className="w-full bg-[#800000] text-white py-2.5 rounded-lg font-black text-xs hover:bg-[#600000] shadow-md transition-all active:scale-95 uppercase tracking-widest">सबमिट करें</button>
        </div>
      </div>
      <div className="bg-[#800000] p-6 rounded-xl shadow text-white flex flex-col items-center justify-center space-y-3 relative overflow-hidden group min-h-[200px]">
         <MapPin size={36} className="text-[#FFD700] group-hover:scale-110 transition-transform" />
         <p className="text-xl font-black tracking-tight">मन्दिर लोकेशन</p>
         <p className="text-[9px] opacity-70 text-center font-serif italic max-w-sm leading-relaxed">मन्दिर जल्द ही गूगल मैप्स पर उपलब्ध होगा। जय विठ्ठल!</p>
      </div>
    </div>
  </section>
);

// --- Admin Panel Component ---

const AdminPanel = ({ data, onUpdateData, onLogout }: { data: AppState, onUpdateData: React.Dispatch<React.SetStateAction<AppState | null>>, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (section: string, field: string, value: any) => {
    onUpdateData(prev => prev ? ({
      ...prev,
      [section]: { ...prev[section as keyof AppState], [field]: value }
    }) : prev);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveData(data);
      alert('सेटिंग्स सुरक्षित कर दी गई हैं!');
    } catch (e) {
      alert('त्रुटि!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (callback: (base64: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => callback(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const addNewEvent = () => {
    const newEvent: TempleEvent = {
        id: Date.now().toString(),
        title: "नया कार्यक्रम",
        date: "2025-01-01",
        description: "यहाँ विवरण लिखें"
    };
    onUpdateData(prev => prev ? ({...prev, events: [newEvent, ...prev.events]}) : prev);
  };

  return (
    <div className="max-w-full mx-auto p-4 animate-fadeIn min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border-[4px] border-[#800000] flex flex-col md:flex-row lg:h-[80vh]">
        {/* Side Menu */}
        <div className="w-full md:w-52 bg-gray-100 p-4 space-y-2 border-r border-gray-200 overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-[#800000] p-1.5 rounded-lg shadow border border-[#FFD700]"><Lock size={14} className="text-[#FFD700]"/></div>
            <h2 className="text-base font-black devotional-font text-[#800000]">एडमिन</h2>
          </div>

          <div className="space-y-1">
            {[
              { id: 'homepage', label: 'होमपेज सामग्री', icon: <Home size={12}/> },
              { id: 'gallery', label: 'दर्शन एवं गैलरी', icon: <ImageIcon size={12}/> },
              { id: 'events', label: 'कार्यक्रम प्रबंधन', icon: <Calendar size={12}/> },
              { id: 'donation', label: 'दान एवं बैंक', icon: <CreditCard size={12}/> },
              { id: 'footer', label: 'संपर्क एवं फुटर', icon: <Settings size={12}/> }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-lg font-bold uppercase tracking-widest text-[8px] flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-[#FF9933] text-white shadow' : 'text-gray-400 hover:bg-white hover:text-[#800000]'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-3 space-y-2">
            <button onClick={handleSave} disabled={isSaving} className="w-full bg-[#22c55e] text-white py-2 rounded-lg font-black text-[9px] shadow hover:bg-[#16a34a] transition-all flex items-center justify-center gap-1.5">
              {isSaving ? 'सेविंग...' : <><Save size={12}/> सेव</>}
            </button>
            <button onClick={onLogout} className="w-full bg-white text-gray-400 py-1.5 rounded-lg font-bold text-[8px] border border-gray-100 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-1.5">
               <LogOut size={10}/> लॉगआउट
            </button>
          </div>
        </div>

        {/* Settings View */}
        <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto hide-scrollbar bg-white relative">
          {activeTab === 'homepage' && (
            <div className="space-y-4 animate-fadeIn">
               <h3 className="text-base font-black text-[#800000] border-b border-gray-50 pb-1">होमपेज प्रबंधन</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest">मन्दिर का नाम</label>
                  <input className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#FF9933] font-bold text-[10px]" value={data.homepage.mainHeading} onChange={e => updateField('homepage', 'mainHeading', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest">हीरो शीर्षक</label>
                  <input className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#FF9933] font-bold text-[10px]" value={data.homepage.heroTitle} onChange={e => updateField('homepage', 'heroTitle', e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest">स्वागत संदेश (स्क्रॉल)</label>
                <textarea className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#FF9933] font-bold text-[10px] resize-none h-16" value={data.homepage.welcomeMessage} onChange={e => updateField('homepage', 'welcomeMessage', e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest">मुख्य बैकग्राउंड</label>
                  <div onClick={() => handleImageUpload(b => updateField('homepage', 'heroImage', b))} className="h-20 rounded-lg border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer hover:border-[#FF9933] transition-all overflow-hidden relative group">
                    <img src={data.homepage.heroImage} className="w-full h-full object-cover brightness-50" alt=""/>
                    <Upload className="absolute text-white" size={14}/>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest">आज का दर्शन</label>
                  <div onClick={() => handleImageUpload(b => updateField('homepage', 'todaysDarshanImage', b))} className="h-20 rounded-lg border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer hover:border-[#FF9933] transition-all overflow-hidden relative group">
                    <img src={data.homepage.todaysDarshanImage} className="w-full h-full object-cover brightness-50" alt=""/>
                    <Camera className="absolute text-white" size={14}/>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="space-y-4 animate-fadeIn">
                <h3 className="text-base font-black text-[#800000] border-b border-gray-50 pb-1">फुटर ग्राफ़िक्स</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest">लेफ्ट इमेज</label>
                      <div onClick={() => handleImageUpload(b => updateField('homepage', 'footerLeftImage', b))} className="h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
                        {data.homepage.footerLeftImage ? <img src={data.homepage.footerLeftImage} className="w-full h-full object-contain" /> : <Plus size={12} />}
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest">राइट इमेज</label>
                      <div onClick={() => handleImageUpload(b => updateField('homepage', 'footerRightImage', b))} className="h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
                        {data.homepage.footerRightImage ? <img src={data.homepage.footerRightImage} className="w-full h-full object-contain" /> : <Plus size={12} />}
                      </div>
                   </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App Entry ---

export default function App() {
  const [page, setPage] = useState('home');
  const [data, setData] = useState<AppState | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const fetched = await getData();
        if (mounted) {
          setData(fetched || INITIAL_DATA);
        }
      } catch (err) {
        if (mounted) setData(INITIAL_DATA);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-[#FFFDD0] flex flex-col items-center justify-center gap-3">
      <div className="w-6 h-6 border-2 border-[#FF9933]/10 border-t-[#FF9933] rounded-full animate-spin"></div>
      <div className="text-sm font-black text-[#800000] devotional-font animate-pulse">प्रतीक्षा करें...</div>
    </div>
  );

  const renderContent = () => {
    if (page === 'admin') {
      if (!isAdmin) {
        return (
          <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#FFFDD0]">
             <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-t-[6px] border-[#800000] w-full max-w-[280px] text-center flex flex-col items-center">
               <div className="bg-[#800000] text-[#FFD700] w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 shadow border border-[#FFD700]"><Lock size={20}/></div>
               <h2 className="text-lg font-black text-[#800000] devotional-font mb-4 uppercase">प्रवेश</h2>
               <form onSubmit={e => {
                 e.preventDefault();
                 if (checkAdminAuth(adminUser, adminPass)) { setIsAdmin(true); setLoginError(''); }
                 else setLoginError('त्रुटि!');
               }} className="space-y-3 w-full">
                 <input className="w-full p-2 bg-gray-50 rounded border border-transparent focus:border-[#FF9933] text-xs font-bold" value={adminUser} onChange={e => setAdminUser(e.target.value)} placeholder="यूज़र" />
                 <input type="password" className="w-full p-2 bg-gray-50 rounded border border-transparent focus:border-[#FF9933] text-xs font-bold" value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="पासवर्ड" />
                 {loginError && <p className="text-red-600 font-black text-[8px]">{loginError}</p>}
                 <button type="submit" className="w-full bg-[#800000] text-white py-2 rounded font-black text-sm shadow hover:-translate-y-0.5 transition-all uppercase">प्रवेश</button>
               </form>
            </div>
          </div>
        );
      }
      return <AdminPanel data={data} onUpdateData={setData} onLogout={() => setIsAdmin(false)} />;
    }
    switch (page) {
      case 'home': return <HomeView data={data} />;
      case 'gallery': return <GalleryView data={data} />;
      case 'events': return <EventsView data={data} />;
      case 'donation': return <DonationView data={data} />;
      case 'contact': return <ContactView />;
      default: return <HomeView data={data} />;
    }
  };

  return (
    <div className="min-h-screen divine-bg flex flex-col font-mukta selection:bg-orange-100 overflow-x-hidden">
      <Navbar onNavigate={setPage} currentPage={page} mainHeading={data?.homepage?.mainHeading} />
      <ScrollingBanner message={data?.homepage?.scrollingMessage} />
      <main className="flex-grow">{renderContent()}</main>
      {page !== 'admin' && <Footer data={data} />}
    </div>
  );
}
