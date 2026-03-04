
import React from 'react';

const SocialFeed: React.FC = () => {
  const posts = [
    { 
      user: 'Sarah Jenkins', loc: 'Paris, FR', time: '2h ago', 
      caption: "Feeling the spring vibes today with this light floral layer. Can't wait for warmer days!", 
      img: 'https://picsum.photos/seed/post1/600/800', likes: 128, cmts: 14 
    },
    { 
      user: 'Chloe Chen', loc: 'Tokyo, JP', time: '5h ago', 
      caption: "Tokyo Nights 🌃 Just curated this look for dinner. Thoughts?", 
      img: 'https://picsum.photos/seed/post2/600/800', likes: 45, cmts: 8 
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-2xl mx-auto space-y-10 pb-10">
          {posts.map((post, idx) => (
            <article key={idx} className="bg-white rounded-3xl overflow-hidden border border-soft-pink shadow-sm">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-cover bg-center border border-soft-pink" style={{ backgroundImage: `url('https://picsum.photos/seed/user${idx}/100/100')` }}></div>
                  <div>
                    <h4 className="text-sm font-bold text-deep-text">{post.user}</h4>
                    <p className="text-[10px] text-muted-text font-medium">{post.loc} • {post.time}</p>
                  </div>
                </div>
                <button className="text-muted-text hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
              <div className="relative aspect-[4/5] bg-soft-pink/20">
                <img alt="Post" className="w-full h-full object-cover" src={post.img} />
                <div className="absolute bottom-4 right-4">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full font-bold">3 items tagged</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-5">
                  <button className="flex items-center gap-1.5 text-muted-text hover:text-primary transition-all group">
                    <span className="material-symbols-outlined group-hover:font-variation-fill">favorite</span>
                    <span className="text-xs font-bold">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-muted-text hover:text-primary transition-all">
                    <span className="material-symbols-outlined">chat_bubble</span>
                    <span className="text-xs font-bold">{post.cmts}</span>
                  </button>
                  <button className="ml-auto text-muted-text hover:text-primary transition-all">
                    <span className="material-symbols-outlined">bookmark</span>
                  </button>
                </div>
                <p className="text-sm text-deep-text leading-relaxed">
                  <span className="font-extrabold mr-2">{post.user}</span>
                  {post.caption}
                </p>
                <div className="pt-4 border-t border-soft-pink">
                  <input 
                    className="w-full bg-transparent border-none p-0 text-xs focus:ring-0 placeholder:text-muted-text/50" 
                    placeholder="Add a style tip..." 
                    type="text" 
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="w-80 border-l border-soft-pink bg-white/30 hidden xl:flex flex-col">
        <div className="p-6 border-b border-soft-pink">
          <h3 className="text-lg font-bold text-deep-text flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            My Closet Feed
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
           <button className="w-full bg-primary text-white py-3.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-4">
              <span className="material-symbols-outlined text-base">share</span>
              Share Today's Look
           </button>
           
           <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-muted-text uppercase tracking-widest">Shared History</h4>
              {[1, 2, 3].map(i => (
                <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-sm">
                  <img alt="History" className="w-full h-full object-cover transition-transform group-hover:scale-105" src={`https://picsum.photos/seed/hist${i}/300/400`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-4">
                    <div className="flex gap-3 text-white text-xs font-bold">
                       <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm font-variation-fill">favorite</span> 24</span>
                       <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">chat_bubble</span> 2</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </aside>
    </div>
  );
};

export default SocialFeed;
