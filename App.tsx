import React, { useState, useEffect } from 'react';
import { Menu, Calendar, Heart, Lock, LogOut, Upload, Home, Image as ImageIcon, Plus, Trash2, Save, Info, Phone, MapPin, Clock, CreditCard, X, Settings, Layout, Camera, MessageSquare, Bell, User, Edit3, Sparkles, ChevronRight } from 'lucide-react';
import { AppState, TempleEvent } from './types.ts';
import { getData, saveData, checkAdminAuth } from './datastore.ts';
import { getDivineThought } from './gemini.ts';
import { INITIAL_DATA } from './constants.ts';

// --- Global Components ---

const ScrollingBanner = ({ message }: { message: string }) => (
  <div className="bg-[#FF9933] text-white py-1.5 overflow-hidden border-y border-[#FFD700]/30 shadow-md z-40 relative">
    <div className="animate-marquee whitespace-nowrap text-sm md:text-base font-bold flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="mx-8 font-serif italic text-white drop-shadow-sm flex items-center gap-2">
          <Sparkles size={14} className="text-[#FFD700]"/> ॐ {message || 'श्री गुरुदत्त विठ्ठल मन्दिर में आपका स्वागत है'} ॐ
        </span>
      ))}
    </div>
  </div>
);

const Navbar = ({ onNavigate, currentPage, mainHeading }: { onNavigate: (page: string) => void, currentPage: string, mainHeading: string }) => (
  <nav className="sticky top-0 z-50 bg-[#800000] text-white shadow-lg border-b-2 border-[#FFD700]">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center h-16 md:h-20">
        <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="bg-[#FF9933] p-1.5 md:p-2 rounded-lg mr-2 md:mr-3 shadow-md group-hover:scale-110 transition-all duration-300 border border-[#FFD700]/50">
             <span className="text-lg md:text-xl font-bold">ॐ</span>
          </div>
          <div>
            <h1 className="devotional-font text-lg md:text-xl lg:text-2xl font-bold text-[#FFD700] drop-shadow-md leading-tight">
              {mainHeading || 'श्री विठ्ठल मन्दिर'}
            </h1>
            <p className="text-[0.5rem] uppercase tracking-[0.2em] text-orange-200 font-bold opacity-60 hidden md:block">Shree Gurudatt Vitthal Mandir</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-5 lg:space-x-7 font-bold">
          {['home', 'gallery', 'events', 'donation', 'contact'].map(id => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`text-sm lg:text-base transition-all duration-300 hover:text-[#FFD700] relative py-1 ${currentPage === id ? 'text-[#FFD700]' : 'text-gray-100'}`}
            >
              {id === 'home' ? 'मुख्य' : id === 'gallery' ? 'गैलरी' : id === 'events' ? 'कार्यक्रम' : id === 'donation' ? 'दान' : 'संपर्क'}
              {currentPage === id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFD700] rounded-full"></span>
              )}
            </button>
          ))}
          <button onClick={() => onNavigate('admin')} className="bg-black/20 px-3 py-1.5 rounded-lg hover:bg-[#FF9933] transition-all border border-[#FFD700]/30 text-[#FFD700] flex items-center gap-1.5 text-xs">
            <Lock size={12} /> एडमिन
          </button>
        </div>

        <div className="md:hidden flex items-center gap-2">
           <button onClick={() => onNavigate('admin')} className="p-1.5 bg-[#FF9933] rounded-lg shadow-md"><Lock size={16}/></button>
           <Menu className="text-[#FFD700]" size={24} />
        </div>
      </div>
    </div>
  </nav>
);

const Footer = ({ data }: { data: AppState }) => (
  <footer className="bg-[#3a0000] text-white py-12 mt-16 border-t-4 border-[#FFD700] relative overflow-hidden">
    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/mandala.png')"}}></div>
    
    <div className="absolute left-0 bottom-0 z-0 hidden lg:block pointer-events-none transform translate-x-2 opacity-80">
      <img src={data?.homepage?.footerLeftImage} alt="" className="w-48 h-48 object-contain" />
    </div>
    <div className="absolute right-0 bottom-0 z-0 hidden lg:block pointer-events-none transform -translate-x-2 opacity-80">
      <img src={data?.homepage?.footerRightImage} alt="" className="w-48 h-48 object-contain" />
    </div>

    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
      <div className="space-y-4">
        <h3 className="devotional-font text-3xl text-[#FFD700]">{data?.homepage?.footerTitle}</h3>
        <p className="text-gray-300 text-sm italic leading-relaxed font-serif border-l-2 border-[#FFD700]/30 pl-4 opacity-80">{data?.homepage?.footerDescription}</p>
      </div>
      
      <div className="bg-black/10 p-6 rounded-3xl border border-white/5 shadow-lg backdrop-blur-sm">
        <h4 className="font-bold text-base mb-4 text-[#FFD700] flex items-center gap-2 uppercase tracking-wider border-b border-white/5 pb-2">
          <Settings size={16} className="text-[#FF9933]"/> संपर्क
        </h4>
        <div className="space-y-3 text-gray-300 text-xs">
          <p className="flex items-start gap-2"><Info size={14} className="text-[#FF9933] mt-0.5 shrink-0"/> {data?.homepage?.footerEmail}</p>
          <p className="flex items-start gap-2"><Phone size={14} className="text-[#FF9933] mt-0.5 shrink-0"/> {data?.homepage?.footerPhone}</p>
          <p className="flex items-start gap-2 leading-relaxed"><MapPin size={14} className="text-[#FF9933] mt-0.5 shrink-0"/> {data?.homepage?.footerAddress}</p>
        </div>
      </div>

      <div className="bg-black/10 p-6 rounded-3xl border border-white/5 shadow-lg backdrop-blur-sm">
        <h4 className="font-bold text-base mb-4 text-[#FFD700] flex items-center gap-2 uppercase tracking-wider border-b border-white/5 pb-2">
          <Clock size={16} className="text-[#FF9933]"/> दर्शन समय
        </h4>
        <div className="space-y-4">
          <div>
            <p className="text-[0.55rem] uppercase tracking-widest text-[#FF9933] font-black mb-0.5 opacity-60">प्रातः दर्शन</p>
            <p className="text-xl font-black text-[#FFD700]">{data?.homepage?.footerMorningTime}</p>
          </div>
          <div>
            <p className="text-[0.55rem] uppercase tracking-widest text-orange-400 font-black mb-0.5 opacity-60">संध्या दर्शन</p>
            <p className="text-xl font-black text-[#FFD700]">{data?.homepage?.footerEveningTime}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="text-center mt-10 border-t border-white/5 pt-6 text-gray-500 text-[10px] italic relative z-10">
      &copy; 2024 {data?.homepage?.mainHeading}. सर्वाधिकार सुरक्षित।
    </div>
  </footer>
);

// --- Public Pages ---

const HomeView = ({ data }: { data: AppState }) => (
  <div className="animate-fadeIn">
    <section className="relative h-[60vh] md:h-[75vh] overflow-hidden flex items-center justify-center">
      <img src={data.homepage.heroImage} className="absolute inset-0 w-full h-full object-cover brightness-[0.4] scale-100 animate-slowZoom" alt="Hero" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#FFFDD0]/20"></div>
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h2 className="devotional-font text-3xl md:text-5xl lg:text-6xl text-[#FFD700] mb-4 md:mb-8 drop-shadow-xl animate-fadeIn leading-tight">
          {data.homepage.heroTitle}
        </h2>
        <div className="bg-black/20 backdrop-blur-sm p-6 md:p-10 rounded-[2.5rem] border border-[#FFD700]/10 shadow-2xl">
           <div className="inline-block bg-[#FF9933] text-white px-4 py-1 rounded-full font-black uppercase text-[0.5rem] tracking-[0.2em] shadow-md border border-[#FFD700] mb-4">स्वागतम</div>
          <p className="text-white text-lg md:text-2xl italic font-serif font-light leading-relaxed">
            "{data.homepage.welcomeMessage}"
          </p>
        </div>
      </div>
    </section>

    <div className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-24 relative z-20 space-y-16 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border-l-[10px] border-[#FF9933] flex flex-col justify-center">
          <h3 className="text-[#800000] font-black text-xs md:text-sm mb-4 flex items-center uppercase tracking-[0.2em] border-b border-gray-50 pb-3">
            <Heart className="mr-2 text-red-600 animate-pulse" fill="currentColor" size={20} /> आज का सुविचार
          </h3>
          <p className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-gray-800 leading-snug">
            "{data.homepage.dailyThought}"
          </p>
        </div>
        
        <div className="bg-white p-2 rounded-[3rem] shadow-xl border-2 border-[#FFD700] relative overflow-hidden group min-h-[350px]">
          <div className="absolute top-6 left-6 z-30 bg-[#800000] text-[#FFD700] px-4 py-1.5 rounded-full text-[0.55rem] font-black shadow-md border border-[#FFD700] uppercase tracking-wider">दिव्य दर्शन</div>
          <img src={data.homepage.todaysDarshanImage} className="w-full h-full object-cover rounded-[2.8rem] transition-transform duration-700 group-hover:scale-105" alt="Darshan" />
          <div className="absolute inset-x-4 bottom-6 z-30 bg-black/40 backdrop-blur-md text-white py-4 rounded-[2rem] text-center border border-white/5">
            <p className="text-lg font-bold devotional-font text-[#FFD700]">मंगल दर्शन</p>
          </div>
        </div>
      </div>

      {/* Featured Gallery Section on Home Page */}
      {data.gallery.length > 0 && (
        <section className="bg-white/50 backdrop-blur-sm p-8 rounded-[3rem] shadow-lg border border-[#FFD700]/10">
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <h3 className="devotional-font text-2xl md:text-3xl text-[#800000] flex items-center gap-3">
              <ImageIcon className="text-[#FF9933]" /> दिव्य झलकियाँ
            </h3>
            <span className="text-[0.6rem] font-black uppercase tracking-widest text-gray-400">गैलरी से विशेष दर्शन</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar">
            {data.gallery.slice(0, 6).map((img, idx) => (
              <div key={img.id} className="min-w-[200px] md:min-w-[280px] h-64 md:h-80 relative rounded-3xl overflow-hidden shadow-md group transform transition-transform hover:-translate-y-2">
                <img src={img.url} className="w-full h-full object-cover" alt={img.caption} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#800000]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-xs font-bold">{img.caption}</p>
                </div>
                {idx === 0 && (
                   <div className="absolute top-3 left-3 bg-[#FF9933] text-white text-[0.5rem] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">Featured</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="bg-[#800000] p-8 md:p-12 rounded-[3rem] shadow-xl text-white border-b-8 border-[#FFD700] relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left space-y-1">
            <h3 className="font-black text-3xl md:text-5xl devotional-font text-[#FFD700] tracking-wide">आरती समय</h3>
            <p className="text-orange-200 text-sm md:text-base italic font-serif opacity-70">भक्ति का पावन समय</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 w-full lg:w-auto">
            {data.aartiTimings.map(t => (
              <div key={t.id} className="bg-white/5 p-4 md:p-6 rounded-[2rem] border border-white/5 flex flex-col items-center backdrop-blur-sm hover:bg-white/10 transition-all shadow-md">
                <span className="text-[0.55rem] font-black opacity-50 uppercase tracking-widest mb-2 text-[#FFD700]">{t.name}</span>
                <span className="text-xl md:text-2xl font-black">{t.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const GalleryView = ({ data }: { data: AppState }) => (
  <section className="max-w-7xl mx-auto px-6 py-16 animate-fadeIn">
    <div className="text-center mb-12">
      <h2 className="devotional-font text-4xl md:text-5xl text-[#800000] mb-3">दिव्य दर्शन गैलरी</h2>
      <div className="h-1 w-24 bg-[#FFD700] mx-auto rounded-full"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
      {data.gallery.map(img => (
        <div key={img.id} className="group relative overflow-hidden rounded-[2.5rem] shadow-lg aspect-[3/4] border-4 border-white hover:border-[#FFD700] transition-all duration-300 bg-gray-50">
          <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={img.caption} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#800000]/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
            <p className="text-[#FFD700] font-black text-xl mb-0.5">{img.caption}</p>
            <p className="text-white/60 text-[0.5rem] uppercase tracking-widest font-bold">अमृत दर्शन</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const EventsView = ({ data }: { data: AppState }) => (
  <section className="max-w-5xl mx-auto px-6 py-16 animate-fadeIn">
    <div className="text-center mb-12">
      <h2 className="devotional-font text-4xl md:text-5xl text-[#800000] mb-3">धार्मिक कार्यक्रम</h2>
      <div className="h-1 w-24 bg-[#FFD700] mx-auto rounded-full"></div>
    </div>
    <div className="space-y-6 md:space-y-10">
      {data.events.map(event => (
        <div key={event.id} className="bg-white rounded-[2.5rem] shadow-md overflow-hidden border border-gray-100 flex flex-col sm:flex-row hover:shadow-xl transition-all duration-300">
          <div className="bg-[#800000] text-white p-8 sm:w-48 flex flex-col items-center justify-center text-center">
             <Calendar size={32} className="mb-3 text-[#FFD700]" />
             <span className="text-xl font-black text-[#FFD700]">{event.date}</span>
          </div>
          <div className="p-8 flex-1 flex flex-col justify-center">
            <h3 className="text-2xl font-black text-[#800000] mb-2 border-b border-gray-50 pb-1">{event.title}</h3>
            <p className="text-gray-600 text-base italic font-serif leading-relaxed opacity-80">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const DonationView = ({ data }: { data: AppState }) => (
  <section className="max-w-5xl mx-auto px-6 py-16 animate-fadeIn">
    <div className="bg-white rounded-[3rem] shadow-xl p-8 md:p-16 border-[8px] border-[#FFD700] relative">
      <h2 className="devotional-font text-4xl md:text-5xl text-center mb-12 text-[#800000]">दान एवं सेवा</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-8 bg-gray-50 p-8 rounded-[2rem] border-l-[10px] border-[#FF9933] shadow-inner">
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <p className="text-[#FF9933] text-[0.6rem] font-black uppercase tracking-widest mb-1">Bank Name</p>
              <p className="text-lg md:text-xl font-black text-gray-800">{data.donation.bankName}</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <p className="text-[#FF9933] text-[0.6rem] font-black uppercase tracking-widest mb-1">Account Number</p>
              <p className="text-lg md:text-2xl font-black tracking-widest text-gray-700">{data.donation.accountNumber}</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <p className="text-[#FF9933] text-[0.6rem] font-black uppercase tracking-widest mb-1">IFSC Code</p>
              <p className="text-lg md:text-xl font-black text-[#800000] uppercase tracking-wider">{data.donation.ifscCode}</p>
            </div>
          </div>
          <div className="bg-[#800000] p-6 rounded-[2rem] text-white text-center shadow-lg">
            <p className="text-[0.55rem] font-black uppercase tracking-[0.3em] mb-3 opacity-60">Official UPI ID</p>
            <p className="text-xl md:text-2xl font-black break-all">{data.donation.upiId}</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border-2 border-[#FFD700] hover:scale-105 transition-transform">
            <img src={data.donation.qrCodeUrl} className="w-56 h-56 object-contain" alt="QR" />
          </div>
          <p className="mt-8 text-lg font-black text-[#800000] italic uppercase tracking-widest opacity-60">सुरक्षित ऑनलाइन दान</p>
        </div>
      </div>
    </div>
  </section>
);

const ContactView = () => (
  <section className="max-w-7xl mx-auto px-6 py-16 animate-fadeIn text-center">
    <h2 className="devotional-font text-4xl md:text-5xl text-[#800000] mb-12">संपर्क करें</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-lg border-t-[12px] border-[#800000]">
        <h3 className="text-2xl font-black text-[#800000] mb-8 border-b border-gray-50 pb-3">सन्देश भेजें</h3>
        <div className="space-y-5">
           <input className="w-full p-4 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-[#FF9933] text-base font-medium transition-all" placeholder="आपका शुभ नाम" />
           <textarea className="w-full p-4 bg-gray-50 rounded-[1.5rem] h-40 outline-none border border-transparent focus:border-[#FF9933] text-base font-medium resize-none transition-all" placeholder="आपका पावन सन्देश"></textarea>
           <button className="w-full bg-[#800000] text-white py-4 rounded-[1.5rem] font-black text-lg hover:bg-[#600000] shadow-md transition-all active:scale-95 uppercase tracking-widest">सबमिट करें</button>
        </div>
      </div>
      <div className="bg-[#800000] p-8 md:p-10 rounded-[2.5rem] shadow-lg text-white flex flex-col items-center justify-center space-y-6 relative overflow-hidden group">
         <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
         <MapPin size={64} className="text-[#FFD700] group-hover:scale-110 transition-transform" />
         <p className="text-3xl font-black tracking-tight">मन्दिर लोकेशन</p>
         <p className="text-base opacity-70 text-center font-serif italic max-w-sm leading-relaxed">मन्दिर जल्द ही गूगल मैप्स पर उपलब्ध होगा। जय विठ्ठल!</p>
         <div className="h-1 w-24 bg-[#FFD700]/20 rounded-full"></div>
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
    <div className="max-w-full mx-auto p-4 md:p-8 animate-fadeIn min-h-screen bg-gray-50">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-[8px] border-[#800000] flex flex-col md:flex-row lg:h-[80vh]">
        {/* Side Menu */}
        <div className="w-full md:w-72 lg:w-[320px] bg-gray-100 p-8 space-y-5 border-r border-gray-200 overflow-y-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#800000] p-3 rounded-xl shadow-md border border-[#FFD700]"><Lock size={24} className="text-[#FFD700]"/></div>
            <div>
               <h2 className="text-2xl font-black devotional-font text-[#800000]">एडमिन</h2>
               <p className="text-[0.55rem] font-bold uppercase tracking-widest opacity-40">Management</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { id: 'homepage', label: 'होमपेज सामग्री', icon: <Home size={18}/> },
              { id: 'gallery', label: 'दर्शन एवं गैलरी', icon: <ImageIcon size={18}/> },
              { id: 'events', label: 'कार्यक्रम प्रबंधन', icon: <Calendar size={18}/> },
              { id: 'donation', label: 'दान एवं बैंक', icon: <CreditCard size={18}/> },
              { id: 'footer', label: 'संपर्क एवं फुटर', icon: <Settings size={18}/> }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-5 py-4 rounded-2xl font-bold uppercase tracking-widest text-[0.65rem] flex items-center gap-4 transition-all ${activeTab === tab.id ? 'bg-[#FF9933] text-white shadow-lg' : 'text-gray-400 hover:bg-white hover:text-[#800000]'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-8 space-y-3">
            <button onClick={handleSave} disabled={isSaving} className="w-full bg-[#22c55e] text-white py-4 rounded-2xl font-black text-base shadow-md hover:bg-[#16a34a] transition-all flex items-center justify-center gap-2">
              {isSaving ? 'सेविंग...' : <><Save size={20}/> सेव करें</>}
            </button>
            <button onClick={onLogout} className="w-full bg-white text-gray-400 py-3 rounded-2xl font-bold text-xs border border-gray-100 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2">
               <LogOut size={16}/> लॉगआउट
            </button>
          </div>
        </div>

        {/* Settings View */}
        <div className="flex-1 p-8 md:p-12 space-y-12 overflow-y-auto hide-scrollbar bg-white relative">
          {activeTab === 'homepage' && (
            <div className="space-y-10 animate-fadeIn">
               <h3 className="text-3xl font-black text-[#800000] border-b border-gray-50 pb-3">होमपेज प्रबंधन</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest ml-3">मन्दिर का नाम</label>
                  <input className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FF9933] font-bold text-base" value={data.homepage.mainHeading} onChange={e => updateField('homepage', 'mainHeading', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest ml-3">हीरो शीर्षक</label>
                  <input className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FF9933] font-bold text-base" value={data.homepage.heroTitle} onChange={e => updateField('homepage', 'heroTitle', e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest ml-3">स्वागत संदेश (Welcome Message)</label>
                <textarea className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#FF9933] font-bold text-base resize-none h-24" value={data.homepage.welcomeMessage} onChange={e => updateField('homepage', 'welcomeMessage', e.target.value)} />
              </div>

              <div className="space-y-2">
                <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest ml-3">स्क्रॉलिंग संदेश</label>
                <input className="w-full p-5 bg-gray-50 border border-[#FFD700]/10 rounded-2xl outline-none focus:border-[#FF9933] font-black text-[#800000] text-lg text-center" value={data.homepage.scrollingMessage} onChange={e => updateField('homepage', 'scrollingMessage', e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest ml-3">मुख्य बैकग्राउंड</label>
                  <div onClick={() => handleImageUpload(b => updateField('homepage', 'heroImage', b))} className="h-40 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer hover:border-[#FF9933] transition-all overflow-hidden relative group shadow-inner">
                    <img src={data.homepage.heroImage} className="w-full h-full object-cover brightness-50" alt=""/>
                    <Upload className="absolute text-white group-hover:scale-110 transition-all" size={24}/>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest ml-3">आज का दर्शन</label>
                  <div onClick={() => handleImageUpload(b => updateField('homepage', 'todaysDarshanImage', b))} className="h-40 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer hover:border-[#FF9933] transition-all overflow-hidden relative group shadow-inner">
                    <img src={data.homepage.todaysDarshanImage} className="w-full h-full object-cover brightness-50" alt=""/>
                    <Camera className="absolute text-white group-hover:scale-110 transition-all" size={24}/>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-10 animate-fadeIn">
               <h3 className="text-3xl font-black text-[#800000] border-b border-gray-50 pb-3">गैलरी प्रबंधन</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {data.gallery.map(img => (
                     <div key={img.id} className="relative group border border-gray-100 p-3 rounded-2xl bg-white shadow-sm">
                        <img src={img.url} className="w-full h-36 object-cover rounded-xl mb-3" alt=""/>
                        <button onClick={() => onUpdateData(prev => prev ? ({...prev, gallery: prev.gallery.filter(i => i.id !== img.id)}) : prev)} className="absolute top-5 right-5 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                        <input className="w-full p-2 bg-gray-50 rounded-lg text-center font-bold text-[0.65rem]" value={img.caption} onChange={e => onUpdateData(prev => prev ? ({...prev, gallery: prev.gallery.map(i => i.id === img.id ? {...i, caption: e.target.value} : i)}) : prev)} />
                     </div>
                   ))}
                   <button onClick={() => handleImageUpload(b => onUpdateData(prev => prev ? ({...prev, gallery: [...prev.gallery, {id: Date.now().toString(), url: b, caption: 'नया पावन दर्शन'}]}) : prev))} className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-200 h-48 hover:border-[#FF9933] hover:text-[#FF9933] hover:bg-gray-50 transition-all shadow-inner">
                      <Plus size={32}/>
                      <span className="font-bold uppercase tracking-widest text-[0.5rem] mt-1">चित्र जोड़ें</span>
                   </button>
                </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6 animate-fadeIn pb-24">
               <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <h3 className="text-3xl font-black text-[#800000]">कार्यक्रम प्रबंधन</h3>
                  <button onClick={addNewEvent} className="bg-[#800000] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-[#600000] transition-all">
                     <Plus size={18}/> नया कार्यक्रम जोड़ें
                  </button>
               </div>
                
                <div className="space-y-4">
                  {data.events.map(event => (
                    <div key={event.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <input 
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold focus:border-[#FF9933] outline-none" 
                            placeholder="कार्यक्रम का नाम" 
                            value={event.title} 
                            onChange={e => onUpdateData(prev => prev ? ({...prev, events: prev.events.map(ev => ev.id === event.id ? {...ev, title: e.target.value} : ev)}) : prev)}
                          />
                          <div className="relative">
                            <input 
                              type="date"
                              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold focus:border-[#FF9933] outline-none" 
                              value={event.date} 
                              onChange={e => onUpdateData(prev => prev ? ({...prev, events: prev.events.map(ev => ev.id === event.id ? {...ev, date: e.target.value} : ev)}) : prev)}
                            />
                            <Calendar size={18} className="absolute right-3 top-3 text-gray-400 pointer-events-none"/>
                          </div>
                       </div>
                       <textarea 
                          className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-medium focus:border-[#FF9933] outline-none resize-none h-20 mb-4" 
                          placeholder="कार्यक्रम विवरण" 
                          value={event.description}
                          onChange={e => onUpdateData(prev => prev ? ({...prev, events: prev.events.map(ev => ev.id === event.id ? {...ev, description: e.target.value} : ev)}) : prev)}
                       />
                       <button 
                          onClick={() => onUpdateData(prev => prev ? ({...prev, events: prev.events.filter(ev => ev.id !== event.id)}) : prev)}
                          className="text-red-500 font-bold text-xs flex items-center gap-2 hover:text-red-700 transition-colors"
                        >
                         <Trash2 size={14}/> इस कार्यक्रम को हटाएँ
                       </button>
                    </div>
                  ))}
                </div>

                <div className="fixed bottom-12 right-12">
                   <button onClick={handleSave} className="bg-[#22c55e] text-white px-10 py-4 rounded-2xl font-black text-lg shadow-2xl hover:bg-[#16a34a] transition-all flex items-center gap-3">
                      <Save size={24}/> सभी सेटिंग्स सुरक्षित करें (Save All)
                   </button>
                </div>
            </div>
          )}

          {activeTab === 'donation' && (
            <div className="space-y-10 animate-fadeIn">
                <h3 className="text-3xl font-black text-[#800000] border-b border-gray-50 pb-3">दान सेवा विवरण</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="space-y-6 bg-gray-50 p-8 rounded-2xl shadow-inner border border-gray-100">
                      <div className="space-y-1.5">
                        <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest ml-3">बैंक नाम</label>
                        <input className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#FF9933] font-bold text-sm" value={data.donation.bankName} onChange={e => updateField('donation', 'bankName', e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest ml-3">अकाउंट नंबर</label>
                        <input className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#FF9933] font-black text-sm" value={data.donation.accountNumber} onChange={e => updateField('donation', 'accountNumber', e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest ml-3">IFSC कोड</label>
                        <input className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#FF9933] font-black uppercase text-sm" value={data.donation.ifscCode} onChange={e => updateField('donation', 'ifscCode', e.target.value)} />
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest ml-3 text-center block">UPI ID</label>
                        <input className="w-full p-4 bg-gray-50 border-2 border-[#FFD700]/10 rounded-2xl outline-none focus:border-[#FF9933] font-black text-[#FF9933] text-lg text-center" value={data.donation.upiId} onChange={e => updateField('donation', 'upiId', e.target.value)} />
                      </div>
                      <div onClick={() => handleImageUpload(b => updateField('donation', 'qrCodeUrl', b))} className="w-full p-8 bg-white border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-[#FF9933] transition-all cursor-pointer group shadow-sm">
                         {data.donation.qrCodeUrl ? (
                            <img src={data.donation.qrCodeUrl} className="w-36 h-36 object-contain" alt="QR" />
                         ) : <Plus size={48} className="text-gray-100"/>}
                         <span className="font-bold text-gray-400 uppercase tracking-widest text-[0.5rem] group-hover:text-[#FF9933]">QR कोड बदलें</span>
                      </div>
                   </div>
                </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="space-y-12 animate-fadeIn">
                <h3 className="text-3xl font-black text-[#800000] border-b border-gray-50 pb-3">फुटर एवं ग्राफ़िक्स</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                     <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest ml-3">ईमेल</label>
                     <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={data.homepage.footerEmail} onChange={e => updateField('homepage', 'footerEmail', e.target.value)} />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest ml-3">फोन</label>
                     <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={data.homepage.footerPhone} onChange={e => updateField('homepage', 'footerPhone', e.target.value)} />
                   </div>
                   <div className="md:col-span-2 space-y-1.5">
                     <label className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest ml-3">मन्दिर पता</label>
                     <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" value={data.homepage.footerAddress} onChange={e => updateField('homepage', 'footerAddress', e.target.value)} />
                   </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                   <h4 className="text-lg font-black text-[#800000] mb-8 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon size={20} className="text-[#FF9933]"/> फ़ुटर साइड ग्राफ़िक्स
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-[0.55rem] font-black text-gray-400 uppercase tracking-widest text-center block">लेफ्ट इमेज</label>
                         <div onClick={() => handleImageUpload(b => updateField('homepage', 'footerLeftImage', b))} className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center cursor-pointer group overflow-hidden">
                            {data.homepage.footerLeftImage ? (
                               <img src={data.homepage.footerLeftImage} className="w-full h-full object-contain" alt="Footer Left"/>
                            ) : <ImageIcon size={32} className="text-gray-100"/>}
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[0.55rem] font-black text-gray-400 uppercase tracking-widest text-center block">राइट इमेज</label>
                         <div onClick={() => handleImageUpload(b => updateField('homepage', 'footerRightImage', b))} className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center cursor-pointer group overflow-hidden">
                            {data.homepage.footerRightImage ? (
                               <img src={data.homepage.footerRightImage} className="w-full h-full object-contain" alt="Footer Right"/>
                            ) : <ImageIcon size={32} className="text-gray-100"/>}
                         </div>
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
    <div className="min-h-screen bg-[#FFFDD0] flex flex-col items-center justify-center gap-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/mandala.png')"}}></div>
      <div className="w-20 h-20 border-4 border-[#FF9933]/10 border-t-[#FF9933] rounded-full animate-spin"></div>
      <div className="text-2xl font-black text-[#800000] animate-pulse devotional-font">लोड हो रहा है...</div>
    </div>
  );

  const renderContent = () => {
    if (page === 'admin') {
      if (!isAdmin) {
        return (
          <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#FFFDD0]">
             <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border-t-[12px] border-[#800000] w-full max-w-lg text-center flex flex-col items-center">
               <div className="bg-[#800000] text-[#FFD700] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg border-2 border-[#FFD700] rotate-6"><Lock size={40}/></div>
               <h2 className="text-3xl font-black text-[#800000] devotional-font mb-8 tracking-widest uppercase">एडमिन प्रवेश</h2>
               <form onSubmit={e => {
                 e.preventDefault();
                 if (checkAdminAuth(adminUser, adminPass)) { setIsAdmin(true); setLoginError(''); }
                 else setLoginError('गलत विवरण!');
               }} className="space-y-6 w-full">
                 <input className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-[#FF9933] text-xl font-bold shadow-inner" value={adminUser} onChange={e => setAdminUser(e.target.value)} placeholder="यूज़रनाम" />
                 <input type="password" className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-[#FF9933] text-xl font-bold shadow-inner" value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="पासवर्ड" />
                 {loginError && <p className="text-red-600 font-black text-sm">{loginError}</p>}
                 <button type="submit" className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black text-2xl shadow-lg hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest">प्रवेश</button>
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