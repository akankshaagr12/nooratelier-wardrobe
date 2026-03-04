
import React, { useState } from 'react';

interface OnboardingProps {
  onFinish: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onFinish }) => {
  const [step, setStep] = useState(2);

  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      <header className="w-full py-8 px-12 flex items-center justify-between sticky top-0 bg-background-light/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="bg-primary size-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
          </div>
          <h1 className="text-deep-text text-xl font-black uppercase tracking-tighter">NoorAtelier</h1>
        </div>
        <div className="flex-1 max-w-lg mx-20">
          <div className="flex justify-between mb-2.5 px-1">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Step {step} of 3</span>
            <span className="text-[10px] font-black text-muted-text uppercase tracking-widest">Wardrobe Setup</span>
          </div>
          <div className="h-2 w-full bg-soft-pink rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(step/3)*100}%` }}></div>
          </div>
        </div>
        <button onClick={onFinish} className="text-sm font-bold text-muted-text hover:text-primary transition-colors">Exit Setup</button>
      </header>

      <main className="flex-1 flex items-center justify-center p-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="hidden lg:flex flex-col gap-10">
            <div className="relative">
              <div className="absolute -top-16 -left-16 size-80 bg-primary/10 rounded-full blur-[80px]"></div>
              <div className="absolute -bottom-16 -right-16 size-64 bg-soft-pink/60 rounded-full blur-[60px]"></div>
              <div className="relative z-10 rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-soft-pink">
                <img 
                  alt="Style Showcase" 
                  className="w-full h-full object-cover aspect-[4/5]" 
                  src="https://picsum.photos/seed/onboard/800/1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-text/80 via-transparent to-transparent flex items-end p-12">
                  <div className="text-white">
                    <h3 className="text-3xl font-black mb-3">Build your digital twin.</h3>
                    <p className="text-white/80 font-medium leading-relaxed">
                      Your AI stylist works best when it knows your real closet and unique skin profile.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="size-12 rounded-full border-4 border-white bg-cover shadow-sm" style={{ backgroundImage: `url('https://picsum.photos/seed/face${i}/100/100')` }}></div>
                ))}
              </div>
              <p className="text-sm text-muted-text font-semibold self-center">Join 12k+ users curating their unique style.</p>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-soft-pink">
            <div className="mb-12">
              <h2 className="text-4xl font-black text-deep-text mb-4 leading-tight">Upload your favorites</h2>
              <p className="text-muted-text font-medium leading-relaxed">
                To start your AI wardrobe, upload at least 3 items. We'll automatically remove backgrounds and tag them for you.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              {[
                'https://picsum.photos/seed/fav1/400/400',
                'https://picsum.photos/seed/fav2/400/400'
              ].map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-3xl overflow-hidden border-2 border-primary/20 bg-soft-pink/30 shadow-sm transition-transform hover:scale-[1.02]">
                  <img alt="Item" className="w-full h-full object-cover" src={img} />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white text-deep-text size-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-primary size-7 rounded-full flex items-center justify-center text-white shadow-lg">
                      <span className="material-symbols-outlined text-sm font-variation-fill">check</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="aspect-square rounded-3xl border-2 border-dashed border-soft-pink hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group bg-soft-pink/10">
                <div className="size-14 rounded-full bg-soft-pink flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                </div>
                <span className="text-[10px] font-black text-muted-text uppercase tracking-widest">Add Item</span>
              </div>
              
              <div className="aspect-square rounded-3xl border-2 border-dashed border-soft-pink hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group bg-soft-pink/10">
                <div className="size-14 rounded-full bg-soft-pink flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                </div>
                <span className="text-[10px] font-black text-muted-text uppercase tracking-widest">Add Item</span>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <button 
                onClick={() => step < 3 ? setStep(s => s + 1) : onFinish()}
                className="w-full bg-primary text-white py-5 rounded-full font-black shadow-2xl shadow-primary/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 transform hover:translate-y-[-2px]"
              >
                Continue to Style Quiz
                <span className="material-symbols-outlined font-bold">arrow_forward</span>
              </button>
              <div className="flex items-center gap-6 justify-center">
                <button onClick={() => setStep(s => Math.max(1, s-1))} className="text-xs font-black text-muted-text/60 hover:text-muted-text flex items-center gap-1 transition-colors uppercase tracking-widest">
                  <span className="material-symbols-outlined text-base">chevron_left</span> Previous
                </button>
                <span className="text-soft-pink">|</span>
                <button onClick={onFinish} className="text-xs font-black text-muted-text/60 hover:text-primary transition-colors uppercase tracking-widest">Skip for now</button>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-3xl bg-primary/5 border border-primary/10 flex gap-4 shadow-sm">
              <span className="material-symbols-outlined text-primary text-2xl">lightbulb</span>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Pro Tip</p>
                <p className="text-xs text-muted-text font-semibold leading-relaxed">
                  Clear, flat-lay photos or photos of you wearing the items work best for our AI silhouette analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-12 border-t border-soft-pink bg-white/50">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-12">
          {[
            { step: 1, label: 'Skin Tone Analysis', status: 'Completed', active: step > 1 },
            { step: 2, label: 'Initial Items', status: 'Current', active: step === 2 },
            { step: 3, label: 'Style Categories', status: 'Next', active: step === 3 }
          ].map((s, i) => (
            <div key={i} className={`flex items-center gap-4 transition-opacity ${s.active ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`size-10 rounded-full flex items-center justify-center text-xs font-black border-2 ${s.active ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'border-muted-text/30 text-muted-text'}`}>
                {s.step}
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${s.active && step === s.step ? 'text-primary' : 'text-muted-text'}`}>{s.status}</p>
                <p className="text-xs font-black text-deep-text">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;
