
import React from 'react';

const WeeklyPlanner: React.FC = () => {
  const weekDays = [
    { day: 'Monday', temp: '18°C Sunny', img: 'https://picsum.photos/seed/m/300/400', note: 'Chosen for your 10 AM meeting. The light linen ensures comfort.' },
    { day: 'Tuesday', temp: '16°C Cloudy', img: 'https://picsum.photos/seed/t/300/400', note: 'Layered textures for a day in the studio. Pairs with gold hoops.' },
    { day: 'Wednesday', temp: '15°C Rainy', img: 'https://picsum.photos/seed/w/300/400', note: 'Rain-friendly boots selected. Darker palette matches the mood.' },
    { day: 'Thursday', temp: '19°C Sunny', img: 'https://picsum.photos/seed/th/300/400', note: 'Elevated casual for your dinner date. Effortless transition.' },
    { day: 'Friday', temp: '21°C Clear', img: 'https://picsum.photos/seed/f/300/400', note: 'Casual Friday! Light trench is perfect for the commute.' },
    { day: 'Saturday', temp: '22°C Warm', img: 'https://picsum.photos/seed/sa/300/400', note: 'Weekend leisure look. Vibrant colors for social brunch.' },
    { day: 'Sunday', temp: '20°C Breezy', img: 'https://picsum.photos/seed/su/300/400', note: 'Relaxed silhouette for a slow Sunday. Maximum comfort.' },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-black tracking-tight text-deep-text">Weekly Planner</h2>
          <p className="text-muted-text font-medium">Let AI design your week based on weather, schedule, and vibes.</p>
        </div>
        <div className="flex flex-wrap items-center gap-6 bg-white p-4 rounded-3xl border border-soft-pink">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-muted-text uppercase tracking-wider">Settings</span>
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-soft-pink text-primary text-[10px] font-bold rounded-full">No Repeat</span>
               <span className="px-3 py-1 bg-soft-pink text-primary text-[10px] font-bold rounded-full">Full Accessories</span>
            </div>
          </div>
          <button className="bg-primary text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-[1.02] transition-all">
            <span className="material-symbols-outlined text-base">magic_button</span>
            Generate New Week
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
        {weekDays.map((item, idx) => (
          <div key={item.day} className="flex flex-col gap-3 group">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-muted-text uppercase tracking-widest">{item.day}</span>
              <span className="text-[10px] font-medium bg-soft-pink px-2 py-0.5 rounded-full">{item.temp}</span>
            </div>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-soft-pink bg-white p-2 transition-all hover:shadow-xl hover:shadow-primary/10">
              <img 
                alt={item.day} 
                className="w-full h-full object-cover rounded-2xl" 
                src={item.img} 
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-primary/10 shadow-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <div className="flex items-center gap-1.5 mb-1.5 text-primary">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">AI Logic Note</span>
                </div>
                <p className="text-[11px] leading-relaxed text-deep-text font-medium">{item.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: 'analytics', label: 'Utilization', val: '84%', sub: 'Of wardrobe used' },
          { icon: 'eco', label: 'Eco Score', val: 'High', sub: 'Rewearing patterns' },
          { icon: 'wash', label: 'Laundry Day', val: 'Friday', sub: 'Optimal timing' },
          { icon: 'savings', label: 'CPW Savvy', val: '$4.20', sub: 'Avg cost per wear' }
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-soft-pink shadow-sm">
            <div className="flex items-center gap-3 mb-3 text-primary">
              <span className="material-symbols-outlined">{stat.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-3xl font-black text-deep-text">{stat.val}</p>
            <p className="text-xs text-muted-text font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPlanner;
