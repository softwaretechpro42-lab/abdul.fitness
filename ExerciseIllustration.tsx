import React from 'react';

interface Props {
  iconType: string;
  className?: string;
}

export const ExerciseIllustration: React.FC<Props> = ({ iconType, className = 'w-full h-40' }) => {
  // SVG drawing based on exercise type with electric lime (#B7FF4A) and energetic orange (#FFAD5A)
  switch (iconType) {
    case 'jumping_jacks':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          {/* Motion arcs */}
          <path d="M 60 70 A 40 40 0 0 1 80 30" stroke="#FFAD5A" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M 140 70 A 40 40 0 0 0 120 30" stroke="#FFAD5A" strokeWidth="2" strokeDasharray="3 3" />
          {/* Head */}
          <circle cx="100" cy="38" r="10" fill="#B7FF4A" />
          {/* Torso */}
          <line x1="100" y1="48" x2="100" y2="92" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Arms upward spread */}
          <line x1="100" y1="60" x2="68" y2="35" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" />
          <line x1="100" y1="60" x2="132" y2="35" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" />
          {/* Legs spread */}
          <line x1="100" y1="92" x2="65" y2="132" stroke="#F4F7F4" strokeWidth="5" strokeLinecap="round" />
          <line x1="100" y1="92" x2="135" y2="132" stroke="#F4F7F4" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    case 'shoulder_stretches':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          {/* Arm rotation rings */}
          <circle cx="55" cy="70" r="24" stroke="#FFAD5A" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx="145" cy="70" r="24" stroke="#FFAD5A" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* Head */}
          <circle cx="100" cy="40" r="11" fill="#B7FF4A" />
          {/* Torso */}
          <line x1="100" y1="51" x2="100" y2="102" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Outstretched arms */}
          <line x1="100" y1="66" x2="45" y2="66" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" />
          <line x1="100" y1="66" x2="155" y2="66" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" />
          {/* Legs */}
          <line x1="100" y1="102" x2="84" y2="138" stroke="#9DAFA6" strokeWidth="5" strokeLinecap="round" />
          <line x1="100" y1="102" x2="116" y2="138" stroke="#9DAFA6" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    case 'leg_stretches':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          {/* Standing figure doing quad stretch */}
          <circle cx="75" cy="38" r="10" fill="#B7FF4A" />
          <line x1="75" y1="48" x2="75" y2="92" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Support leg */}
          <line x1="75" y1="92" x2="75" y2="136" stroke="#9DAFA6" strokeWidth="5" strokeLinecap="round" />
          {/* Bent leg held behind */}
          <path d="M 75 92 L 102 108 L 95 80" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Hand holding ankle */}
          <path d="M 75 64 L 95 80" stroke="#FFAD5A" strokeWidth="4" strokeLinecap="round" />
          {/* Floor ground line */}
          <line x1="30" y1="138" x2="170" y2="138" stroke="#29372F" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      );

    case 'wide_pushups':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          <line x1="20" y1="130" x2="180" y2="130" stroke="#29372F" strokeWidth="2" />
          {/* Head */}
          <circle cx="56" cy="74" r="9" fill="#B7FF4A" />
          {/* Straight body plank */}
          <line x1="56" y1="78" x2="155" y2="114" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Wide spread arms bent at 90 */}
          <path d="M 72 84 L 54 105 L 42 128" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 72 84 L 92 105 L 104 128" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Force tension indicator */}
          <circle cx="72" cy="84" r="14" stroke="#FFAD5A" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );

    case 'diamond_pushups':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          <line x1="20" y1="130" x2="180" y2="130" stroke="#29372F" strokeWidth="2" />
          {/* Diamond symbol on floor */}
          <polygon points="76,122 84,116 92,122 84,128" fill="#FFAD5A" />
          {/* Head */}
          <circle cx="62" cy="70" r="9" fill="#B7FF4A" />
          {/* Plank body */}
          <line x1="62" y1="74" x2="160" y2="112" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Close elbows driving inward */}
          <path d="M 78 80 L 72 104 L 84 122" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 78 80 L 92 104 L 84 122" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'cobra_stretch':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          <line x1="20" y1="130" x2="180" y2="130" stroke="#29372F" strokeWidth="2" />
          {/* Head looking upward */}
          <circle cx="58" cy="52" r="10" fill="#B7FF4A" />
          {/* Arched spine curve */}
          <path d="M 58 62 Q 80 82 110 118 L 165 128" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Arms supporting chest */}
          <line x1="72" y1="84" x2="68" y2="128" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" />
          {/* Chest opening aura */}
          <path d="M 50 64 Q 40 85 54 98" stroke="#FFAD5A" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      );

    case 'mountain_climbers':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          <line x1="20" y1="130" x2="180" y2="130" stroke="#29372F" strokeWidth="2" />
          <circle cx="55" cy="58" r="9" fill="#B7FF4A" />
          {/* Torso */}
          <line x1="55" y1="64" x2="105" y2="82" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Straight arms */}
          <line x1="68" y1="70" x2="58" y2="128" stroke="#9DAFA6" strokeWidth="5" strokeLinecap="round" />
          {/* Driven knee to chest */}
          <path d="M 105 82 L 80 98 L 74 122" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Extended back leg */}
          <line x1="105" y1="82" x2="160" y2="126" stroke="#FFAD5A" strokeWidth="5" strokeLinecap="round" />
          {/* Running speed arrows */}
          <line x1="76" y1="110" x2="92" y2="110" stroke="#B7FF4A" strokeWidth="2" />
        </svg>
      );

    case 'jump_squats':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          {/* Ground surface */}
          <line x1="30" y1="138" x2="170" y2="138" stroke="#29372F" strokeWidth="2" />
          {/* Vertical burst arrows */}
          <path d="M 75 125 L 75 95 M 75 95 L 70 102 M 75 95 L 80 102" stroke="#FFAD5A" strokeWidth="2" strokeLinecap="round" />
          <path d="M 125 125 L 125 95 M 125 95 L 120 102 M 125 95 L 130 102" stroke="#FFAD5A" strokeWidth="2" strokeLinecap="round" />
          {/* Mid-air jumper figure */}
          <circle cx="100" cy="32" r="10" fill="#B7FF4A" />
          <line x1="100" y1="42" x2="100" y2="78" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Arms reaching high */}
          <line x1="100" y1="52" x2="80" y2="30" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" />
          <line x1="100" y1="52" x2="120" y2="30" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" />
          {/* Flexed legs in air */}
          <path d="M 100 78 L 84 98 L 90 118" stroke="#F4F7F4" strokeWidth="5" strokeLinecap="round" />
          <path d="M 100 78 L 116 98 L 110 118" stroke="#F4F7F4" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );

    case 'plyo_pushups':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          <line x1="20" y1="130" x2="180" y2="130" stroke="#29372F" strokeWidth="2" />
          {/* Airborne hands clapped */}
          <circle cx="68" cy="95" r="5" fill="#FFAD5A" />
          <circle cx="76" cy="95" r="5" fill="#FFAD5A" />
          {/* Head */}
          <circle cx="60" cy="56" r="9" fill="#B7FF4A" />
          {/* Plank in air */}
          <line x1="60" y1="62" x2="155" y2="116" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Arms coming together for clap */}
          <path d="M 72 70 L 68 95" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" />
          <path d="M 84 74 L 76 95" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" />
          {/* Explosive flash */}
          <path d="M 58 118 L 68 105 L 78 118" stroke="#FFAD5A" strokeWidth="2" />
        </svg>
      );

    case 'fingertip_pushups':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          <line x1="20" y1="130" x2="180" y2="130" stroke="#29372F" strokeWidth="2" />
          {/* Fingertips splayed on floor */}
          <circle cx="68" cy="128" r="3" fill="#B7FF4A" />
          <circle cx="74" cy="128" r="3" fill="#B7FF4A" />
          <circle cx="80" cy="128" r="3" fill="#B7FF4A" />
          {/* Head */}
          <circle cx="62" cy="65" r="9" fill="#B7FF4A" />
          <line x1="62" y1="70" x2="158" y2="114" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Rigid arm pushing through fingertips */}
          <path d="M 78 78 L 74 105 L 74 126" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Grip strength star */}
          <circle cx="74" cy="126" r="10" stroke="#FFAD5A" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );

    case 'bodyweight_squats':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          <line x1="30" y1="138" x2="170" y2="138" stroke="#29372F" strokeWidth="2" />
          {/* Head */}
          <circle cx="112" cy="48" r="10" fill="#B7FF4A" />
          {/* Upright chest */}
          <line x1="110" y1="58" x2="98" y2="86" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Reaching arms for counter balance */}
          <line x1="108" y1="66" x2="148" y2="66" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" />
          {/* Deep 90 degree squat thighs parallel */}
          <path d="M 98 86 L 68 88 L 84 136" stroke="#F4F7F4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Quadriceps highlight */}
          <line x1="72" y1="84" x2="94" y2="84" stroke="#FFAD5A" strokeWidth="3" />
        </svg>
      );

    case 'pike_pushups':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          <line x1="20" y1="130" x2="180" y2="130" stroke="#29372F" strokeWidth="2" />
          {/* Inverted V apex at hips */}
          <circle cx="105" cy="50" r="4" fill="#FFAD5A" />
          {/* Legs straight down from hips */}
          <line x1="105" y1="50" x2="152" y2="128" stroke="#9DAFA6" strokeWidth="5" strokeLinecap="round" />
          {/* Torso dipping forward */}
          <line x1="105" y1="50" x2="72" y2="86" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Head dipping between hands */}
          <circle cx="62" cy="98" r="9" fill="#B7FF4A" />
          {/* Arms pressing vertical */}
          <path d="M 72 86 L 55 106 L 60 128" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'wrist_circles':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          {/* Two hands clasped with infinity mobility loop */}
          <path d="M 75 80 C 65 65, 65 95, 75 80 C 90 60, 110 100, 125 80 C 135 65, 135 95, 125 80" stroke="#FFAD5A" strokeWidth="2" strokeDasharray="3 3" />
          {/* Forearms */}
          <line x1="40" y1="95" x2="80" y2="82" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="95" x2="120" y2="82" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Interlaced knuckles */}
          <circle cx="100" cy="80" r="14" fill="#B7FF4A" />
          <circle cx="95" cy="78" r="4" fill="#111A17" />
          <circle cx="105" cy="78" r="4" fill="#111A17" />
        </svg>
      );

    case 'plank':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          <line x1="20" y1="130" x2="180" y2="130" stroke="#29372F" strokeWidth="2" />
          {/* Head aligned with spine */}
          <circle cx="48" cy="94" r="9" fill="#B7FF4A" />
          {/* Perfectly horizontal plank spine */}
          <line x1="50" y1="98" x2="155" y2="98" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Forearm on floor */}
          <path d="M 62 101 L 62 128 L 48 128" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Feet on floor */}
          <line x1="155" y1="98" x2="160" y2="128" stroke="#9DAFA6" strokeWidth="5" strokeLinecap="round" />
          {/* Abdominal core tension bracket */}
          <line x1="88" y1="106" x2="118" y2="106" stroke="#FFAD5A" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'standard_pushups':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          <line x1="20" y1="130" x2="180" y2="130" stroke="#29372F" strokeWidth="2" />
          <circle cx="54" cy="70" r="9" fill="#B7FF4A" />
          {/* Rigid full plank body */}
          <line x1="56" y1="74" x2="156" y2="114" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* 45 degree standard elbow position */}
          <path d="M 72 80 L 68 106 L 68 128" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Pectoral power glow */}
          <circle cx="70" cy="84" r="10" stroke="#FFAD5A" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );

    case 'reverse_lunges':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          <line x1="20" y1="138" x2="180" y2="138" stroke="#29372F" strokeWidth="2" />
          {/* Head & torso straight */}
          <circle cx="95" cy="42" r="10" fill="#B7FF4A" />
          <line x1="95" y1="52" x2="95" y2="88" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Front 90-degree leg */}
          <path d="M 95 88 L 124 90 L 124 136" stroke="#F4F7F4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Back lunging leg hovering 1 inch off ground */}
          <path d="M 95 88 L 70 108 L 60 134" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Balance hands on hips */}
          <path d="M 95 62 L 105 74 L 98 84" stroke="#FFAD5A" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'glute_bridges':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          <line x1="20" y1="130" x2="180" y2="130" stroke="#29372F" strokeWidth="2" />
          {/* Shoulders on floor */}
          <circle cx="48" cy="120" r="9" fill="#B7FF4A" />
          {/* Bridge line elevated straight to knees */}
          <line x1="56" y1="120" x2="114" y2="80" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Bent legs to heels on floor */}
          <path d="M 114 80 L 140 128" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" />
          {/* Glute squeeze focal ring */}
          <circle cx="106" cy="85" r="12" stroke="#FFAD5A" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );

    case 'side_plank':
      return (
        <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="160" rx="16" fill="#111A17" stroke="#29372F" strokeWidth="1.5" />
          <line x1="20" y1="130" x2="180" y2="130" stroke="#29372F" strokeWidth="2" />
          {/* Head */}
          <circle cx="56" cy="70" r="9" fill="#B7FF4A" />
          {/* Diagonal straight body line */}
          <line x1="60" y1="74" x2="155" y2="126" stroke="#F4F7F4" strokeWidth="6" strokeLinecap="round" />
          {/* Supporting forearm perpendicular to ground */}
          <line x1="72" y1="81" x2="68" y2="128" stroke="#B7FF4A" strokeWidth="5" strokeLinecap="round" />
          {/* Top arm raised for balance */}
          <line x1="72" y1="81" x2="72" y2="40" stroke="#FFAD5A" strokeWidth="4" strokeLinecap="round" />
          {/* Oblique core tension mark */}
          <path d="M 90 98 Q 102 102 110 100" stroke="#FFAD5A" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <div className={`flex items-center justify-center bg-[#111A17] border border-[#29372F] rounded-2xl ${className}`}>
          <div className="w-12 h-12 rounded-full border-2 border-[#B7FF4A] flex items-center justify-center">
            <span className="text-xs font-bold text-[#B7FF4A]">FIT</span>
          </div>
        </div>
      );
  }
};
