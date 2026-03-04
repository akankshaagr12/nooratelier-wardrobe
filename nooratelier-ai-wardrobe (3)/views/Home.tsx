
import React from 'react';
import { View as ViewType } from '../App';

interface HomeProps {
  onSwitchView: (view: ViewType) => void;
}

const Home: React.FC<HomeProps> = ({ onSwitchView }) => {
  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
        {/* Main Outfit Section */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-white border border-soft-pink/20">
            <img 
              alt="Outfit of the Day" 
              className="w-full h-[650px] object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://picsum.photos/seed/outfit1/800/1200" 
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8 flex items-end justify-between">
              <div className="text-white">
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Today's Selection</p>
                <h3 className="text-3xl font-black">Morning Galette</h3>
                <p className="text-white/80 text-sm font-medium">Silk Midi + Trench Coat • Efforless Chic</p>
              </div>
              <div className="flex gap-2">
                <button className="size-12 rounded-full glass-effect flex items-center justify-center text-white hover:bg-primary transition-all">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
                <button className="size-12 rounded-full glass-effect flex items-center justify-center text-white hover:bg-primary transition-all">
                  <span className="material-symbols-outlined">bookmark</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">refresh</span> Change Outfit
            </button>
            <button className="px-6 py-4 rounded-2xl bg-soft-pink font-bold text-sm flex items-center gap-2 hover:bg-soft-pink/80 transition-all">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>

        {/* AI Sidebar Section */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="p-8 rounded-3xl bg-white border border-primary/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="material-symbols-outlined text-primary/10 text-6xl">psychology</span>
            </div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">auto_awesome</span> AI Styling Logic
            </h4>
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-bold text-muted-text uppercase mb-2 tracking-wider">Color Palette</p>
                <p className="text-sm text-deep-text leading-relaxed font-medium">
                  The <span className="text-primary font-bold">Pastel Rose</span> and <span className="font-bold">Cream</span> hues complement your <span className="underline decoration-primary/30">Cool Undertone</span> skin, adding a natural glow.
                </p>
              </div>
              <div className="h-px bg-soft-pink w-1/2"></div>
              <div>
                <p className="text-[11px] font-bold text-muted-text uppercase mb-2 tracking-wider">Body Architecture</p>
                <p className="text-sm text-deep-text leading-relaxed font-medium">
                  The cinched waist of the <span className="italic">Silk Floral Dress</span> balances your <span className="underline decoration-primary/30">Hourglass Frame</span>, while the trench adds vertical structure.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-muted-text uppercase tracking-widest flex items-center gap-2 px-1">
              Look Components
            </h4>
            {[
              { name: 'Floral Silk Dress', brand: 'Sezane', cat: 'Clothing', img: 'https://picsum.photos/seed/item1/200/200' },
              { name: 'Horsebit Loafers', brand: 'Gucci', cat: 'Shoes', img: 'https://picsum.photos/seed/item2/200/200' },
              { name: 'Gold Hoop Duo', brand: 'Mejuri', cat: 'Jewelry', img: 'https://picsum.photos/seed/item3/200/200' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white transition-all cursor-pointer group border border-transparent hover:border-soft-pink">
                <div 
                  className="size-16 rounded-xl bg-cover bg-center border border-soft-pink shrink-0" 
                  style={{ backgroundImage: `url(${item.img})` }}
                ></div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold group-hover:text-primary transition-colors">{item.name}</h5>
                  <p className="text-[10px] text-muted-text font-medium uppercase">{item.cat} • {item.brand}</p>
                </div>
                <span className="material-symbols-outlined text-muted-text/30 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Preview Slider */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="text-xl font-extrabold text-deep-text flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">calendar_view_week</span>
            Weekly Preview
          </h3>
          <button onClick={() => onSwitchView('planner')} className="text-xs font-bold text-primary hover:underline transition-all">Full Schedule</button>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-6 custom-scrollbar px-1">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => (
            <div key={day} className="min-w-[180px] flex flex-col gap-3 group cursor-pointer">
              <div className="aspect-[3/4] rounded-3xl bg-white overflow-hidden border border-soft-pink relative shadow-sm group-hover:shadow-md transition-all">
                <img 
                  alt={`${day} Look`} 
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" 
                  src={`https://picsum.photos/seed/preview${idx}/300/400`} 
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black shadow-sm">{day}</div>
                {idx > 4 && (
                   <div className="absolute inset-0 bg-primary/10 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="material-symbols-outlined text-primary text-3xl">add</span>
                   </div>
                )}
              </div>
              <div className="px-1">
                <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">
                  {idx > 4 ? 'Plan Weekend' : idx === 0 ? 'Office Chic' : 'Smart Casual'}
                </p>
                <p className="text-[10px] text-muted-text font-medium">Cloudy • 18°C</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
