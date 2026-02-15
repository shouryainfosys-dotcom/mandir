
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Menu, Home, Image as ImageIcon, Calendar, Heart, Phone, Lock, LogOut, Plus, Trash2, Edit, Save, X, Upload, Info, Sparkles, Settings, Eye } from 'lucide-react';
import { AppState, AartiTiming, TempleEvent, GalleryImage } from './types';
import { getData, saveData, checkAdminAuth } from './datastore';
import { getDivineThought } from './gemini';
import { INITIAL_DATA } from './constants';

// --- Components ---

const ScrollingBanner = ({ message }: { message: string }) => (
  <div className="bg-[#FF9933] text-white py-1 overflow-hidden border-y border-[#FFD700] shadow-sm">
    <div className="animate-marquee whitespace-nowrap text-lg font-bold">
      <span className="mx-4">ॐ {message} ॐ</span>
      <span className="mx-4">ॐ {message} ॐ</span>
      <span className="mx-4">ॐ {message} ॐ</span>
      <span className="mx-4">ॐ {message} ॐ</span>
    </div>
  </div>
);

const Navbar = ({ onNavigate, currentPage, mainHeading }: { onNavigate: (page: string) => void, currentPage: string, mainHeading: string }) => (
  <nav className="sticky top-0 z-50 bg-[#800000] text-white shadow-lg border-b-4 border-[#FFD700]">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
          <span className="text-3xl mr-2">ॐ</span>
          <h1 className="devotional-font text-xl md:text-3xl font-bold tracking-wider text-[#FFD700]">
            {mainHeading}
          </h1>
        </div>
        
        <div className="hidden md:flex space-x-8 font-medium">
          {['home', 'gallery', 'events', 'donation', 'contact'].map(page => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`capitalize transition-colors duration-200 hover:text-[#FFD700] ${currentPage === page ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : ''}`}
            >
              {page === 'home' ? 'मुख्य' : page === 'gallery' ? 'गैलरी' : page === 'events' ? 'कार्यक्रम' : page === 'donation' ? 'दान' : 'संपर्क'}
            </button>
          ))}
          <button onClick={() => onNavigate('admin')} className="text-[#FFD700] flex items-center">
            <Lock size={16} className="mr-1" /> एडमिन
          </button>
        </div>

        <div className="md:hidden flex items-center" onClick={() => onNavigate('admin')}>
          <Menu className="text-[#FFD700]" />
        </div>
      </div>
    </div>
  </nav>
);

const Footer = ({ data }: { data: AppState }) => (
  <footer className="bg-[#4a0000] text-white py-12 mt-20 border-t-4 border-[#FFD700] relative overflow-hidden min-h-[300px] flex flex-col justify-center">
    <img 
      src={data.homepage.footerLeftImage} 
      className="hidden xl:block absolute left-0 bottom-0 w-64 h-64 object-contain opacity-90 z-0 pointer-events-none transform -translate-x-6 translate-y-6 select-none" 
      alt="" 
    />
    <img 
      src={data.homepage.footerRightImage} 
      className="hidden xl:block absolute right-0 bottom-0 w-64 h-64 object-contain opacity-90 z-0 pointer-events-none transform translate-x-6 translate-y-6 select-none" 
      alt="" 
    />

    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left relative z-10">
      <div>
        <h3 className="devotional-font text-2xl text-[#FFD700] mb-4">{data.homepage.footerTitle}</h3>
        <p className="text-gray-300">{data.homepage.footerDescription}</p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-4 text-[#FFD700]">त्वरित संपर्क</h4>
        <p>Email: {data.homepage.footerEmail}</p>
        <p>Phone: {data.homepage.footerPhone}</p>
        <p>Address: {data.homepage.footerAddress}</p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-4 text-[#FFD700]">समय</h4>
        <p>प्रातःकाल: {data.homepage.footerMorningTime}</p>
        <p>संध्याकाल: {data.homepage.footerEveningTime}</p>
      </div>
    </div>
    <div className="text-center mt-10 pt-8 text-gray-400 relative z-10">
      <p>&copy; 2024 श्री गुरुदत्त विठ्ठल मन्दिर. समस्त अधिकार सुरक्षित।</p>
    </div>
  </footer>
);

// --- Pages ---

const HomeView = ({ data }: { data: AppState }) => (
  <div className="animate-fadeIn">
    <section className="relative h-[55vh] overflow-hidden">
      <img src={data.homepage.heroImage} alt="Temple" className="w-full h-full object-cover brightness-50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <h2 className="devotional-font text-4xl md:text-7xl text-[#FFD700] drop-shadow-lg mb-4">{data.homepage.heroTitle}</h2>
        <p className="text-white text-lg md:text-2xl max-w-2xl bg-black/30 p-4 rounded-lg backdrop-blur-sm">
          {data.homepage.welcomeMessage}
        </p>
      </div>
    </section>

    <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 space-y-6">
      {/* Top Section: Suvichar & Todays Darshan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thought of Day */}
        <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-2xl shadow-2xl border-l-8 border-[#FF9933] flex flex-col justify-center">
          <h3 className="text-[#800000] font-bold text-xl mb-4 flex items-center">
            <Heart className="mr-2 text-red-600" fill="currentColor" /> आज का विचार
          </h3>
          <p className="text-2xl md:text-4xl italic text-gray-700 leading-tight font-serif">
            "{data.homepage.dailyThought}"
          </p>
        </div>

        {/* Today's Darshan Section */}
        <div className="bg-white p-2 rounded-2xl shadow-2xl border-4 border-[#FFD700] group relative overflow-hidden min-h-[350px]">
          <h3 className="absolute top-4 left-4 z-10 bg-[#800000] text-[#FFD700] px-4 py-1 rounded-full text-sm font-bold shadow-lg border border-[#FFD700]">
            आज का दर्शन
          </h3>
          <img 
            src={data.homepage.todaysDarshanImage} 
            alt="Today's Darshan" 
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700" 
          />
        </div>
      </div>

      {/* Aarti Timings: New Horizontal Compact Strip */}
      <div className="bg-[#800000] p-6 rounded-2xl shadow-2xl text-white border-b-4 border-[#FFD700]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <div className="bg-[#FF9933] p-2 rounded-lg shadow-inner">
               <Calendar className="text-white" size={24} />
             </div>
             <h3 className="font-bold text-xl devotional-font text-[#FFD700] tracking-wide">आरती समय सारणी</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
            {data.aartiTimings.map(t => (
              <div key={t.id} className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 flex flex-col items-center">
                <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">{t.name}</span>
                <span className="text-lg font-black text-[#FFD700]">{t.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const GalleryView = ({ data }: { data: AppState }) => (
  <section className="max-w-7xl mx-auto px-4 py-12">
    <h2 className="devotional-font text-4xl text-center mb-12 text-[#800000]">दिव्य दर्शन गैलरी</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.gallery.map(img => (
        <div key={img.id} className="group relative overflow-hidden rounded-xl shadow-lg aspect-[4/3] bg-gray-200">
          <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <p className="text-white font-medium text-lg">{img.caption}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const EventsView = ({ data }: { data: AppState }) => (
  <section className="max-w-4xl mx-auto px-4 py-12">
    <h2 className="devotional-font text-4xl text-center mb-12 text-[#800000]">आगामी धार्मिक कार्यक्रम</h2>
    <div className="space-y-8">
      {data.events.map(event => (
        <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#FFD700]/30 flex flex-col md:flex-row">
          <div className="bg-[#800000] text-white p-6 md:w-48 flex flex-col items-center justify-center text-center">
            <Calendar size={40} className="mb-2" />
            <span className="text-lg font-bold">{new Date(event.date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="p-8 flex-1">
            <h3 className="text-2xl font-bold text-[#800000] mb-3">{event.title}</h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const DonationView = ({ data }: { data: AppState }) => (
  <section className="max-w-5xl mx-auto px-4 py-12">
    <div className="bg-[#FFFDD0] rounded-3xl border-2 border-[#FFD700] shadow-2xl p-8 md:p-12">
      <h2 className="devotional-font text-4xl text-center mb-8 text-[#800000]">दान सेवा</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 bg-white p-8 rounded-2xl shadow-inner border-l-8 border-[#FF9933]">
          <h3 className="text-2xl font-bold text-[#800000]">बैंक विवरण</h3>
          <div className="space-y-4">
            <div><label className="text-sm text-gray-500">बैंक का नाम</label><p className="text-lg font-medium">{data.donation.bankName}</p></div>
            <div><label className="text-sm text-gray-500">खाता संख्या</label><p className="text-xl font-bold text-[#800000]">{data.donation.accountNumber}</p></div>
            <div><label className="text-sm text-gray-500">IFSC कोड</label><p className="text-lg font-medium">{data.donation.ifscCode}</p></div>
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-[#FFD700]"><img src={data.donation.qrCodeUrl} alt="UPI QR" className="w-48 h-48" /></div>
          <p className="mt-6 text-[#800000] font-bold text-xl uppercase tracking-widest">Scan to Pay</p>
        </div>
      </div>
    </div>
  </section>
);

const ContactView = () => (
  <section className="max-w-6xl mx-auto px-4 py-12">
    <h2 className="devotional-font text-4xl text-center mb-12 text-[#800000]">हमसे संपर्क करें</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-[#800000]">
        <h3 className="text-2xl font-bold mb-6">संदेश भेजें</h3>
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="आपका नाम" />
          <input type="email" className="w-full px-4 py-2 border rounded-lg" placeholder="आपका ईमेल" />
          <textarea className="w-full px-4 py-2 border rounded-lg h-32" placeholder="संदेश..."></textarea>
          <button className="w-full bg-[#800000] text-white py-3 rounded-lg font-bold">भेजें</button>
        </form>
      </div>
      <div className="rounded-2xl overflow-hidden h-80 shadow-lg border-2 border-gray-200">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15082.937320496173!2d73.0182645!3d19.0759837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjUiTiA3M8KwMDEnMDcuNiJF!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy"></iframe>
      </div>
    </div>
  </section>
);

// --- Admin Panel ---

const AdminPanel = ({ data, onUpdateData, onLogout }: { data: AppState, onUpdateData: (newData: AppState) => void, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [isFetchingThought, setIsFetchingThought] = useState(false);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  const updateField = (section: keyof AppState, field: string, value: any) => {
    const newData = { ...data };
    (newData[section] as any)[field] = value;
    onUpdateData(newData);
  };

  const handleFetchThought = async () => {
    setIsFetchingThought(true);
    const thought = await getDivineThought();
    updateField('homepage', 'dailyThought', thought);
    setIsFetchingThought(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#800000]">
        <div className="bg-[#800000] p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center"><Lock className="mr-3" /> एडमिन डैशबोर्ड</h2>
          <button onClick={onLogout} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center"><LogOut size={18} className="mr-2" /> लॉगआउट</button>
        </div>
        <div className="flex flex-col md:flex-row h-[70vh]">
          <div className="w-full md:w-64 bg-gray-100 border-r p-4 space-y-2 overflow-y-auto">
            {[{ id: 'homepage', label: 'होम और दर्शन', icon: Home }, { id: 'gallery', label: 'गैलरी प्रबंधन', icon: ImageIcon }, { id: 'aarti', label: 'आरती समय', icon: Calendar }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left px-4 py-3 rounded-xl flex items-center ${activeTab === tab.id ? 'bg-[#FF9933] text-white' : 'hover:bg-gray-200'}`}><tab.icon size={18} className="mr-3" /> {tab.label}</button>
            ))}
          </div>
          <div className="flex-1 p-8 overflow-y-auto">
            {activeTab === 'homepage' && (
              <div className="space-y-6">
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <h4 className="font-bold mb-2 flex items-center gap-2"><Eye size={18} /> वर्तमान 'आज का दर्शन'</h4>
                  <img src={data.homepage.todaysDarshanImage} className="w-32 h-20 object-cover rounded-lg border" />
                  <p className="text-xs text-gray-500 mt-2">बदलने के लिए 'गैलरी' टैब में जाएँ।</p>
                </div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold">आज का विचार</label>
                  <button onClick={handleFetchThought} disabled={isFetchingThought} className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">{isFetchingThought ? '...' : 'Gemini AI'}</button>
                </div>
                <textarea className="w-full p-3 border rounded-lg h-24" value={data.homepage.dailyThought} onChange={e => updateField('homepage', 'dailyThought', e.target.value)} />
              </div>
            )}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">गैलरी प्रबंधन</h3>
                  <button onClick={() => galleryFileRef.current?.click()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"><Upload size={18} className="mr-2" /> अपलोड</button>
                  <input type="file" ref={galleryFileRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, base64 => onUpdateData({ ...data, gallery: [...data.gallery, { id: Date.now().toString(), url: base64, caption: 'नई फोटो' }] }))} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {data.gallery.map(img => (
                    <div key={img.id} className="relative group border-2 rounded-xl overflow-hidden">
                      <img src={img.url} className="w-full h-32 object-cover" />
                      <div className="p-2 space-y-2">
                        <button onClick={() => updateField('homepage', 'todaysDarshanImage', img.url)} className={`w-full text-[10px] py-1 rounded font-bold ${data.homepage.todaysDarshanImage === img.url ? 'bg-green-600 text-white' : 'bg-orange-100'}`}>आज का दर्शन</button>
                        <button onClick={() => onUpdateData({ ...data, gallery: data.gallery.filter(i => i.id !== img.id) })} className="w-full text-[10px] py-1 bg-red-50 text-red-600 rounded">हटाएँ</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'aarti' && (
              <div className="space-y-4">
                {data.aartiTimings.map((t, idx) => (
                  <div key={t.id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl">
                    <input className="flex-1 p-2 border rounded" value={t.name} onChange={e => {
                      const newT = [...data.aartiTimings]; newT[idx].name = e.target.value; onUpdateData({ ...data, aartiTimings: newT });
                    }} />
                    <input className="w-32 p-2 border rounded" value={t.time} onChange={e => {
                      const newT = [...data.aartiTimings]; newT[idx].time = e.target.value; onUpdateData({ ...data, aartiTimings: newT });
                    }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [page, setPage] = useState('home');
  const [data, setData] = useState<AppState | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const fetched = await getData();
        setData(fetched || INITIAL_DATA);
      } catch (err) {
        setData(INITIAL_DATA);
      }
    };
    init();
  }, []);

  if (!data) return <div className="min-h-screen divine-bg flex items-center justify-center text-2xl devotional-font text-[#800000]">ॐ श्री विठ्ठलाय नमः ॐ</div>;

  const renderContent = () => {
    if (page === 'admin') {
      if (!isAdmin) {
        return (
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl border-t-8 border-[#800000] w-full max-md">
              <h2 className="text-2xl font-bold mb-6 text-center text-[#800000]">एडमिन लॉगिन</h2>
              <form onSubmit={e => {
                e.preventDefault();
                if (checkAdminAuth(adminUser, adminPass)) setIsAdmin(true); else setLoginError('गलत विवरण!');
              }} className="space-y-4">
                <input type="text" className="w-full px-4 py-2 border rounded-lg" value={adminUser} onChange={e => setAdminUser(e.target.value)} placeholder="यूजरनाम" />
                <input type="password" className="w-full px-4 py-2 border rounded-lg" value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="पासवर्ड" />
                {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                <button type="submit" className="w-full bg-[#800000] text-white py-3 rounded-lg font-bold">लॉगिन</button>
              </form>
            </div>
          </div>
        );
      }
      return <AdminPanel data={data} onUpdateData={d => { setData(d); saveData(d); }} onLogout={() => setIsAdmin(false)} />;
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
    <div className="min-h-screen divine-bg flex flex-col">
      <Navbar onNavigate={setPage} currentPage={page} mainHeading={data.homepage.mainHeading} />
      <ScrollingBanner message={data.homepage.scrollingMessage} />
      <main className="flex-grow">{renderContent()}</main>
      {page !== 'admin' && <Footer data={data} />}
    </div>
  );
}
