import React from 'react';
import { Globe, MapPin } from 'lucide-react';

export const WorldMapCard: React.FC = () => {
  const attackOrigins = [
    { city: 'Frankfurt (DE)', ip: '10.0.4.12', type: 'SQLi Probe', status: 'High Risk' },
    { city: 'Ashburn (US)', ip: '192.168.1.105', type: 'Brute Force', status: 'Critical' },
    { city: 'Tokyo (JP)', ip: '172.16.0.44', type: 'API Flood', status: 'High Risk' },
  ];

  return (
    <div className="glass-dark p-6 flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-2 relative overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-white" />
            <h3 className="text-sm md:text-base font-semibold tracking-normal text-white">
              Traffic Geolocation & Origin IPs
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/10">
            Live Geo-Telemetry
          </span>
        </div>
        <p className="text-[11px] text-neutral-400 mb-4">
          Visualized origin networks for suspicious API event clusters.
        </p>

        {/* Dotted monochrome world map SVG with pulsing markers */}
        <div className="relative w-full h-32 rounded-2xl bg-white/[0.03] border border-white/10 p-2 overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full opacity-65" viewBox="0 0 500 240" fill="none">
            {/* Minimalist Dotted Grid Map */}
            <g fill="rgba(255, 255, 255, 0.2)">
              {/* North America */}
              <circle cx="110" cy="70" r="2.5" />
              <circle cx="125" cy="75" r="2.5" />
              <circle cx="140" cy="80" r="2.5" />
              <circle cx="95" cy="85" r="2.5" />
              <circle cx="110" cy="90" r="2.5" />
              <circle cx="125" cy="95" r="2.5" />
              <circle cx="140" cy="100" r="2.5" />
              <circle cx="155" cy="85" r="2.5" />
              <circle cx="120" cy="110" r="2.5" />
              <circle cx="130" cy="120" r="2.5" />

              {/* South America */}
              <circle cx="170" cy="145" r="2.5" />
              <circle cx="180" cy="160" r="2.5" />
              <circle cx="190" cy="175" r="2.5" />
              <circle cx="185" cy="190" r="2.5" />

              {/* Europe */}
              <circle cx="260" cy="65" r="2.5" />
              <circle cx="275" cy="70" r="2.5" />
              <circle cx="290" cy="68" r="2.5" />
              <circle cx="265" cy="80" r="2.5" />
              <circle cx="280" cy="82" r="2.5" />
              <circle cx="295" cy="85" r="2.5" />

              {/* Africa */}
              <circle cx="270" cy="115" r="2.5" />
              <circle cx="285" cy="130" r="2.5" />
              <circle cx="295" cy="145" r="2.5" />
              <circle cx="280" cy="160" r="2.5" />

              {/* Asia */}
              <circle cx="330" cy="70" r="2.5" />
              <circle cx="350" cy="75" r="2.5" />
              <circle cx="370" cy="80" r="2.5" />
              <circle cx="390" cy="85" r="2.5" />
              <circle cx="340" cy="90" r="2.5" />
              <circle cx="360" cy="95" r="2.5" />
              <circle cx="380" cy="100" r="2.5" />
              <circle cx="410" cy="95" r="2.5" />
              <circle cx="355" cy="115" r="2.5" />
              <circle cx="375" cy="125" r="2.5" />

              {/* Oceania */}
              <circle cx="410" cy="165" r="2.5" />
              <circle cx="425" cy="180" r="2.5" />
              <circle cx="440" cy="175" r="2.5" />
            </g>

            {/* Pulsing Marker 1: US East (130, 95) */}
            <g transform="translate(130, 95)">
              <circle cx="0" cy="0" r="8" className="animate-ping fill-white/40" />
              <circle cx="0" cy="0" r="4" fill="#ffffff" />
            </g>

            {/* Pulsing Marker 2: Europe Frankfurt (278, 76) */}
            <g transform="translate(278, 76)">
              <circle cx="0" cy="0" r="7" className="animate-ping fill-white/30" />
              <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
            </g>

            {/* Pulsing Marker 3: Asia Tokyo (410, 95) */}
            <g transform="translate(410, 95)">
              <circle cx="0" cy="0" r="7" className="animate-ping fill-white/30" />
              <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
            </g>
          </svg>

          {/* Quick origin IP pill overlay */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] font-mono text-white backdrop-blur-xs">
            <MapPin className="w-2.5 h-2.5" />
            <span>US-East: 192.168.1.105 (Postman)</span>
          </div>
        </div>

        {/* Origin listing */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {attackOrigins.map((origin) => (
            <div key={origin.ip} className="p-2 rounded-xl bg-white/[0.04] border border-white/5">
              <div className="text-[10px] font-semibold text-white truncate">{origin.city}</div>
              <div className="text-[9px] font-mono text-neutral-400 truncate">{origin.ip}</div>
              <div className="text-[9px] text-neutral-300 font-medium mt-0.5">{origin.type}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
        <span>X-Forwarded-For Logged</span>
        <span className="font-mono text-[10px] text-white">3 Hotspots Active</span>
      </div>
    </div>
  );
};
