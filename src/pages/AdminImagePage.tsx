import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { VEHICLES_DATA } from '../data/vehicles';
import { VehicleImage } from '../components/ui/VehicleImage';
import { Image, Code, Check, Copy, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

export const AdminImagePage: React.FC = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(VEHICLES_DATA[0]?.id || '');
  const [testUrl, setTestUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const vehicle = VEHICLES_DATA.find(v => v.id === selectedVehicleId) || VEHICLES_DATA[0];

  const generatedCode = `{
  id: '${vehicle.id}',
  name: '${vehicle.name}',
  brand: '${vehicle.brand}',
  // ... other specs ...
  images: {
    hero: '${testUrl || vehicle.images.hero}',
    front: '${vehicle.images.front || vehicle.images.hero}',
    side: '${vehicle.images.side || vehicle.images.hero}',
    interior: '${vehicle.images.interior || vehicle.images.hero}'
  }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            DriveIQ Internal Development Tool
          </span>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Image className="w-7 h-7 text-cyan-400" />
            Vehicle Image Management Studio
          </h1>
          <p className="text-xs text-slate-400">
            Preview, test, and generate transparent image configurations for <code className="text-cyan-300 font-mono">src/data/vehicles.ts</code>.
          </p>
        </div>

        <Link
          to="/cars"
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:text-white"
        >
          View Public Cars Catalog →
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Vehicle List Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
            Select Vehicle ({VEHICLES_DATA.length})
          </h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {VEHICLES_DATA.map(v => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVehicleId(v.id);
                  setTestUrl('');
                }}
                className={`w-full p-3 rounded-2xl text-left transition-all border flex items-center gap-3 ${
                  selectedVehicleId === v.id
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-800">
                  <VehicleImage src={v.images.hero} alt={v.name} />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-bold uppercase text-cyan-400 font-mono block">{v.brand}</span>
                  <span className="text-xs font-bold text-white block truncate">{v.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview & Editor */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Preview */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 font-mono uppercase">{vehicle.brand}</span>
                <h2 className="text-2xl font-black text-white">{vehicle.name}</h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                {vehicle.dataStatus?.toUpperCase() || 'VERIFIED'}
              </span>
            </div>

            {/* Image Preview Box */}
            <div className="h-72 w-full rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-950">
              <VehicleImage
                src={testUrl || vehicle.images.hero}
                alt={vehicle.name}
                loading="eager"
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-[11px] font-mono text-slate-300">
                Active Source: {testUrl ? 'Test URL Input' : 'src/data/vehicles.ts'}
              </div>
            </div>

            {/* Test Image URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 font-mono block">
                Test New Image URL / Path:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testUrl}
                  onChange={e => setTestUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... OR /images/cars/creta/hero.jpg"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                {testUrl && (
                  <button
                    onClick={() => setTestUrl('')}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Generated Code Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                  <Code className="w-4 h-4" /> Ready-to-Paste Code for src/data/vehicles.ts
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied Code!' : 'Copy Code'}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                {generatedCode}
              </pre>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
