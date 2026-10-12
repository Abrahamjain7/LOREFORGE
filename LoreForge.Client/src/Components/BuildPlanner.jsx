import { useState } from 'react';
import { BUILD_TEMPLATES } from '../data/mockGuides';
import { Sparkles, Shield, Sword, Zap, Copy, Check, Save, Award } from 'lucide-react';

export default function BuildPlanner() {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const currentTemplate = BUILD_TEMPLATES[selectedTemplateIndex] || BUILD_TEMPLATES[0];

  const [buildName, setBuildName] = useState(currentTemplate.name);
  const [characterLevel, setCharacterLevel] = useState(currentTemplate.level);
  const [stats, setStats] = useState({ ...currentTemplate.stats });
  const [primaryWeapon, setPrimaryWeapon] = useState(currentTemplate.primaryWeapon);
  const [armorSet, setArmorSet] = useState(currentTemplate.armorSet);
  const [copied, setCopied] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [savedBuilds, setSavedBuilds] = useState(() => {
    const loaded = localStorage.getItem('loreforge_saved_builds');
    if (loaded) {
      try {
        return JSON.parse(loaded);
      } catch (e) {
        console.error('Failed to parse saved builds', e);
      }
    }
    return [];
  });

  const handleSelectTemplate = (idx) => {
    setSelectedTemplateIndex(idx);
    const tmpl = BUILD_TEMPLATES[idx] || BUILD_TEMPLATES[0];
    setBuildName(tmpl.name);
    setCharacterLevel(tmpl.level);
    setStats({ ...tmpl.stats });
    setPrimaryWeapon(tmpl.primaryWeapon);
    setArmorSet(tmpl.armorSet);
  };

  const handleStatChange = (statName, delta) => {
    setStats(prev => {
      const currentVal = typeof prev[statName] === 'number' ? prev[statName] : parseInt(prev[statName], 10) || 10;
      const newVal = Math.max(1, Math.min(99, currentVal + delta));
      return { ...prev, [statName]: newVal };
    });
  };

  const handleCopyCode = () => {
    const buildExport = {
      name: buildName,
      game: currentTemplate.game,
      level: characterLevel,
      stats,
      primaryWeapon,
      armorSet,
      talismans: currentTemplate.talismans,
      spells: currentTemplate.spellsOrSkills
    };
    navigator.clipboard.writeText(JSON.stringify(buildExport, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveBuild = () => {
    const newBuild = {
      id: Date.now(),
      name: buildName,
      game: currentTemplate.game,
      level: characterLevel,
      stats,
      primaryWeapon,
      armorSet
    };
    const updated = [newBuild, ...savedBuilds.filter(b => b.name !== buildName)];
    setSavedBuilds(updated);
    localStorage.setItem('loreforge_saved_builds', JSON.stringify(updated));
    setSavedMsg('Build saved to your personal forge!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const calculateEffectivePower = () => {
    let sum = 0;
    Object.values(stats).forEach(val => {
      if (typeof val === 'number') sum += val;
      else {
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed)) sum += parsed;
      }
    });
    return Math.min(999, Math.round(sum * 2.8));
  };

  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-indigo-500/30 bg-gradient-to-r from-indigo-950/50 via-slate-950 to-slate-950 p-8 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-serif tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Loadout Forge
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-slate-100">
            Combat Theory & Build Calculator
          </h1>
          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            Customize attributes, simulate weapon scaling, and craft tournament-ready loadouts for Elden Ring, Cyberpunk 2077, Baldur's Gate 3, and more.
          </p>
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" /> Choose Loadout Blueprint
          </h3>
          <span className="text-xs text-slate-500">{BUILD_TEMPLATES.length} Archetypes Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BUILD_TEMPLATES.map((tmpl, idx) => (
            <button
              key={tmpl.id}
              onClick={() => handleSelectTemplate(idx)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                selectedTemplateIndex === idx
                  ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300">
                  {tmpl.game}
                </span>
                <span className="text-xs text-slate-400 font-serif">Lvl {tmpl.level}</span>
              </div>
              <h4 className="text-sm font-serif font-semibold text-slate-100 mb-1">{tmpl.name}</h4>
              <p className="text-xs text-slate-400 line-clamp-1">{tmpl.role}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stat Matrix & Sliders */}
        <div className="lg:col-span-2 space-y-6 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <input
                type="text"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                className="text-xl sm:text-2xl font-serif text-slate-100 bg-transparent border-b border-dashed border-indigo-500/50 focus:border-indigo-400 outline-none pb-1 w-full"
                title="Click to rename build"
              />
              <span className="text-xs text-slate-400 font-serif block mt-1">
                {currentTemplate.game} • {currentTemplate.role}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveBuild}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-serif flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save Build
              </button>
              <button
                onClick={handleCopyCode}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-serif flex items-center gap-1.5 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied JSON!' : 'Export Build'}
              </button>
            </div>
          </div>

          {savedMsg && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center justify-between">
              <span>{savedMsg}</span>
            </div>
          )}

          {/* Level Slider */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between text-xs font-serif text-slate-300">
              <span>Character Level</span>
              <span className="text-indigo-400 font-mono font-bold text-sm">Lvl {characterLevel}</span>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={characterLevel}
              onChange={(e) => setCharacterLevel(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Stats Tuning Table */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-serif tracking-widest text-slate-400">
              Primary Attributes Distribution
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(stats).map(([statKey, val]) => {
                const numericVal = typeof val === 'number' ? val : parseInt(val, 10) || 10;
                return (
                  <div
                    key={statKey}
                    className="flex items-center justify-between bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-xl hover:border-slate-700 transition"
                  >
                    <div>
                      <span className="text-xs font-mono font-semibold uppercase text-slate-300 block">{statKey}</span>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (numericVal / 99) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatChange(statKey, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-sm text-indigo-300">
                        {val}
                      </span>
                      <button
                        onClick={() => handleStatChange(statKey, 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gear Slot Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="space-y-1.5">
              <label className="text-xs font-serif text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sword className="w-3.5 h-3.5 text-indigo-400" /> Primary Weapon / Chrome
              </label>
              <input
                type="text"
                value={primaryWeapon}
                onChange={(e) => setPrimaryWeapon(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-serif text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400" /> Armor Set / Nanoweave
              </label>
              <input
                type="text"
                value={armorSet}
                onChange={(e) => setArmorSet(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Efficacy & Synergies */}
        <div className="space-y-6">
          {/* Efficacy Card */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
            <h3 className="text-sm font-serif text-slate-200 uppercase tracking-widest border-b border-slate-800 pb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Calculated Combat Efficacy
            </h3>

            <div className="text-center py-4 space-y-1 bg-slate-950/60 rounded-2xl border border-indigo-500/20">
              <span className="text-[10px] uppercase font-serif tracking-widest text-indigo-400">Total Combat Rating</span>
              <div className="text-4xl font-serif font-bold text-amber-300">
                {calculateEffectivePower()}
              </div>
              <p className="text-[11px] text-slate-400 font-serif">Optimal for End-Game Boss Trials</p>
            </div>

            <div className="space-y-3 text-xs font-serif">
              <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Offensive Rating</span>
                <span className="text-emerald-400 font-mono font-bold">{currentTemplate.damageRating}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Defensive Resilience</span>
                <span className="text-cyan-400 font-mono font-bold">{currentTemplate.defenseRating}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Weight Class / Agility</span>
                <span className="text-amber-400 font-mono font-bold">Medium Roll (54% Load)</span>
              </div>
            </div>

            {/* Synergies */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <h4 className="text-xs uppercase font-serif tracking-wider text-slate-300">Equipped Synergies</h4>
              <div className="flex flex-wrap gap-1.5">
                {currentTemplate.talismans?.map((tal, i) => (
                  <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-300">
                    {tal}
                  </span>
                ))}
              </div>
            </div>

            {/* Tactical Note */}
            <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl text-[11px] text-slate-300 leading-relaxed font-sans">
              <span className="font-semibold text-indigo-300 block mb-1">Tactical Directive:</span>
              {currentTemplate.description}
            </div>
          </div>

          {/* Saved Builds Shelf */}
          {savedBuilds.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
              <h4 className="text-xs font-serif uppercase tracking-widest text-slate-300 flex items-center justify-between">
                <span>My Saved Builds ({savedBuilds.length})</span>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-none">
                {savedBuilds.map(sb => (
                  <div key={sb.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-serif text-slate-200 block">{sb.name}</span>
                      <span className="text-[10px] text-indigo-400">{sb.game} • Lvl {sb.level}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Saved</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
