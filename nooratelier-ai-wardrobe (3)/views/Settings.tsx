
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

const Settings: React.FC = () => {
  const { user, updateProfile } = useUser();
  const [showSaved, setShowSaved] = useState(false);

  const [measurements, setMeasurements] = useState({
    height: user.measurements.height,
    weight: user.measurements.weight,
    bodyShape: user.measurements.bodyShape,
  });

  const [colorPreferences, setColorPreferences] = useState({
    skinTone: user.colorPreferences.skinTone,
    avoidColors: [...user.colorPreferences.avoidColors],
  });

  const [repeatRules, setRepeatRules] = useState({
    topRepeatDays: user.repeatRules.topRepeatDays,
    outfitRepeatDays: user.repeatRules.outfitRepeatDays,
    weeklyBlazerLimit: user.repeatRules.weeklyBlazerLimit,
  });

  const [newAvoidColor, setNewAvoidColor] = useState('');

  const skinTones = ['#f9ebe0', '#f3d9c1', '#eec8a3', '#e3b58e', '#d1a277', '#b9885d', '#a26f46', '#8b5630', '#6d4022', '#4a2b15'];

  const handleSave = () => {
    updateProfile({
      measurements,
      colorPreferences,
      repeatRules,
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const addAvoidColor = () => {
    if (newAvoidColor.trim() && !colorPreferences.avoidColors.includes(newAvoidColor.trim())) {
      setColorPreferences(prev => ({
        ...prev,
        avoidColors: [...prev.avoidColors, newAvoidColor.trim()],
      }));
      setNewAvoidColor('');
    }
  };

  const removeAvoidColor = (color: string) => {
    setColorPreferences(prev => ({
      ...prev,
      avoidColors: prev.avoidColors.filter(c => c !== color),
    }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-10 pb-20">
      {/* Success Toast */}
      {showSaved && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right duration-300">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="font-bold text-sm">Settings saved successfully!</span>
        </div>
      )}

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-soft-pink pb-4">
          <span className="material-symbols-outlined text-primary">person</span>
          <h3 className="text-lg font-bold dark:text-white">Personal Measurements</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-text uppercase tracking-wider">Height (cm)</label>
            <input
              className="w-full bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-deep-text dark:text-white"
              type="number"
              value={measurements.height}
              onChange={(e) => setMeasurements(prev => ({ ...prev, height: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-text uppercase tracking-wider">Weight (kg)</label>
            <input
              className="w-full bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-deep-text dark:text-white"
              type="number"
              value={measurements.weight}
              onChange={(e) => setMeasurements(prev => ({ ...prev, weight: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-text uppercase tracking-wider">Body Shape</label>
            <select
              className="w-full bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-deep-text dark:text-white"
              value={measurements.bodyShape}
              onChange={(e) => setMeasurements(prev => ({ ...prev, bodyShape: e.target.value }))}
            >
              <option value="Hourglass">Hourglass</option>
              <option value="Pear">Pear</option>
              <option value="Rectangle">Rectangle</option>
              <option value="Inverted Triangle">Inverted Triangle</option>
              <option value="Apple">Apple</option>
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-soft-pink pb-4">
          <span className="material-symbols-outlined text-primary">palette</span>
          <h3 className="text-lg font-bold dark:text-white">Color Preferences</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-xs font-bold text-muted-text uppercase tracking-wider">Skin Tone Palette</label>
            <div className="grid grid-cols-5 gap-3">
              {skinTones.map((color, i) => (
                <div
                  key={color}
                  onClick={() => setColorPreferences(prev => ({ ...prev, skinTone: color }))}
                  className={`aspect-square rounded-xl cursor-pointer transition-all hover:scale-110 ${colorPreferences.skinTone === color ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-1 hover:ring-primary'}`}
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
            <p className="text-xs text-muted-text italic font-medium">Selected: {colorPreferences.skinTone}</p>
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-muted-text uppercase tracking-wider">Avoid Colors</label>
            <div className="flex flex-wrap gap-2">
              {colorPreferences.avoidColors.map(c => (
                <span key={c} className="px-4 py-2 bg-white dark:bg-white/10 border border-soft-pink dark:border-white/10 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm text-deep-text dark:text-white">
                  {c}
                  <span
                    onClick={() => removeAvoidColor(c)}
                    className="material-symbols-outlined text-xs cursor-pointer hover:text-primary"
                  >close</span>
                </span>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add color..."
                  value={newAvoidColor}
                  onChange={(e) => setNewAvoidColor(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAvoidColor()}
                  className="w-28 px-3 py-2 bg-soft-pink/30 dark:bg-white/5 rounded-full text-xs outline-none focus:ring-2 focus:ring-primary/20 text-deep-text dark:text-white"
                />
                <button
                  onClick={addAvoidColor}
                  className="px-4 py-2 bg-soft-pink dark:bg-white/10 rounded-full text-xs font-bold text-primary flex items-center gap-1 hover:bg-primary hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-xs">add</span> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-soft-pink pb-4">
          <span className="material-symbols-outlined text-primary">event_repeat</span>
          <h3 className="text-lg font-bold dark:text-white">Repeat Rules</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: 'topRepeatDays', label: 'Top Repeat Delay', desc: "Don't suggest same top within window", val: repeatRules.topRepeatDays, unit: 'Days', icon: 'apparel' },
            { key: 'outfitRepeatDays', label: 'Full Outfit Repeat', desc: 'Frequency of repeating exact combinations', val: repeatRules.outfitRepeatDays, unit: 'Days', icon: 'dry_cleaning' },
            { key: 'weeklyBlazerLimit', label: 'Workday Variety', desc: 'Maximum times to suggest blazers per week', val: repeatRules.weeklyBlazerLimit, unit: 'Per Week', icon: 'work' }
          ].map(rule => (
            <div key={rule.key} className="p-6 bg-white dark:bg-white/5 border border-soft-pink dark:border-white/10 rounded-3xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-full bg-soft-pink/50 dark:bg-white/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-2xl">{rule.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-deep-text dark:text-white">{rule.label}</h4>
                  <p className="text-xs text-muted-text font-medium">{rule.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  className="w-20 bg-soft-pink/30 dark:bg-white/10 border-none rounded-xl px-3 py-3 text-center font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20"
                  type="number"
                  value={rule.val}
                  onChange={(e) => setRepeatRules(prev => ({ ...prev, [rule.key]: Number(e.target.value) }))}
                />
                <span className="text-xs font-bold text-muted-text uppercase tracking-widest">{rule.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-end gap-4 pt-10 border-t border-soft-pink">
        <button className="px-8 py-3.5 rounded-full text-sm font-bold text-muted-text hover:bg-soft-pink transition-all">Cancel</button>
        <button
          onClick={handleSave}
          className="px-10 py-3.5 rounded-full text-sm font-bold bg-primary text-white shadow-xl shadow-primary/20 hover:opacity-95 transition-all"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
