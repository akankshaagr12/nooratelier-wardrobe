
import React, { useState } from 'react';
import { useWardrobe } from '../contexts/WardrobeContext';
import AddItemModal from '../components/AddItemModal';

const Wardrobe: React.FC = () => {
  const { items, addItem, removeItem, getItemsByCategory } = useWardrobe();
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const categories = ['All Items', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Jewelry', 'Bags', 'Outerwear'];
  const displayedItems = getItemsByCategory(activeCategory);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      removeItem(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addItem}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-deep-text dark:text-white">Digital Closet</h2>
          <p className="text-muted-text dark:text-white/50 font-medium">{items.length} items cataloged in your personal collection.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white dark:bg-white/5 text-deep-text dark:text-white border border-soft-pink dark:border-white/10 px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-soft-pink dark:hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-sm">tune</span>
            Filters
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/10"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            Add Item
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat
              ? 'bg-primary text-white shadow-md'
              : 'bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 text-muted-text dark:text-white/60 hover:border-primary/50'
              }`}
          >
            {cat}
            {cat !== 'All Items' && (
              <span className="ml-2 text-xs opacity-60">
                ({items.filter(i => i.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {displayedItems.length === 0 ? (
        <div className="text-center py-20">
          <div className="size-24 mx-auto rounded-full bg-soft-pink/50 dark:bg-white/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-muted-text dark:text-white/40">checkroom</span>
          </div>
          <h3 className="text-xl font-bold text-deep-text dark:text-white mb-2">No items yet</h3>
          <p className="text-muted-text dark:text-white/50 mb-6">Start building your digital wardrobe</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-all"
          >
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayedItems.map((item) => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 transition-all hover:shadow-xl hover:shadow-primary/5">
              <div className="aspect-[3/4] overflow-hidden bg-soft-pink/20 dark:bg-white/5 relative">
                {item.imageUrl ? (
                  <img
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={item.imageUrl}
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      el.parentElement?.querySelector('.img-fallback')?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`img-fallback absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-soft-pink/40 dark:from-primary/10 dark:to-white/5 ${item.imageUrl ? 'hidden' : ''}`}>
                  <span className="material-symbols-outlined text-5xl text-primary/40 mb-2">checkroom</span>
                  <p className="text-sm font-bold text-deep-text/50 dark:text-white/30 text-center px-4">{item.name}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end gap-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${deleteConfirm === item.id
                      ? 'bg-red-600 text-white'
                      : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    {deleteConfirm === item.id ? 'Click Again to Confirm' : 'Delete'}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                  {item.category}
                </p>
                <h5 className="font-bold text-sm text-deep-text dark:text-white truncate">
                  {item.name}
                </h5>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="size-4 rounded-full border border-black/10"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-[10px] text-muted-text dark:text-white/40">{item.season.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setIsModalOpen(true)}
            className="aspect-[3/4] rounded-2xl border-2 border-dashed border-soft-pink dark:border-white/20 hover:border-primary/40 transition-colors flex flex-col items-center justify-center bg-white/50 dark:bg-white/5 group"
          >
            <div className="size-14 rounded-full bg-soft-pink dark:bg-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
            <span className="text-sm font-bold text-muted-text dark:text-white/50 uppercase tracking-widest">Add Item</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Wardrobe;
