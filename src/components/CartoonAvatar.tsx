import { motion } from 'framer-motion';

export type AvatarGender = 'boy' | 'girl';
export type HairColorId = 'brown' | 'blonde' | 'black' | 'red' | 'blue';

export const hairColorMap: Record<HairColorId, string> = {
  brown: '#8B4513',
  blonde: '#F5C518',
  black: '#1a1a1a',
  red: '#C0392B',
  blue: '#2E86C1',
};

interface CartoonAvatarProps {
  gender: AvatarGender;
  hairColor: HairColorId;
  size?: number;
  animate?: boolean;
  expression?: 'happy' | 'nervous' | 'excited' | 'calm' | 'proud';
  className?: string;
}

export default function CartoonAvatar({
  gender,
  hairColor,
  size = 120,
  animate = true,
  expression = 'happy',
  className = '',
}: CartoonAvatarProps) {
  const hair = hairColorMap[hairColor];
  const skinTone = '#FDBCB4';
  const skinDark = '#F0A090';
  const outlineColor = '#2D1B0E';

  // Clothes colors by gender
  const shirtColor = gender === 'boy' ? '#4A90D9' : '#E91E8C';
  const shirtDark = gender === 'boy' ? '#2E70B8' : '#C0157A';
  const pantsColor = gender === 'boy' ? '#3D5A80' : '#9C27B0';

  // Eye expressions
  const eyeExpression = {
    happy: { scaleY: 0.6, eyebrowY: 0 },
    nervous: { scaleY: 0.8, eyebrowY: -2 },
    excited: { scaleY: 0.5, eyebrowY: -3 },
    calm: { scaleY: 0.7, eyebrowY: 1 },
    proud: { scaleY: 0.55, eyebrowY: -2 },
  }[expression];

  // Mouth expressions
  const mouthPath = {
    happy: 'M 38 68 Q 50 78 62 68',
    nervous: 'M 38 70 Q 50 70 62 70',
    excited: 'M 35 66 Q 50 82 65 66',
    calm: 'M 40 69 Q 50 75 60 69',
    proud: 'M 38 67 Q 50 76 62 67',
  }[expression];

  const bodyFloat = { y: [0, -6, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } };

  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={animate ? bodyFloat : undefined}
      style={{ width: size, height: size * 1.4 }}
    >
      <svg
        viewBox="0 0 100 140"
        width={size}
        height={size * 1.4}
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
      >
        {/* === BODY === */}

        {/* Legs */}
        {gender === 'boy' ? (
          <>
            <rect x="36" y="108" width="12" height="22" rx="6" fill={pantsColor} stroke={outlineColor} strokeWidth="1.5" />
            <rect x="52" y="108" width="12" height="22" rx="6" fill={pantsColor} stroke={outlineColor} strokeWidth="1.5" />
            {/* Shoes */}
            <ellipse cx="42" cy="130" rx="8" ry="5" fill="#2C3E50" stroke={outlineColor} strokeWidth="1.2" />
            <ellipse cx="58" cy="130" rx="8" ry="5" fill="#2C3E50" stroke={outlineColor} strokeWidth="1.2" />
          </>
        ) : (
          <>
            {/* Skirt */}
            <path d="M 30 105 Q 50 118 70 105 L 65 120 Q 50 125 35 120 Z" fill="#E91E8C" stroke={outlineColor} strokeWidth="1.5" />
            {/* Legs */}
            <rect x="38" y="118" width="9" height="16" rx="4.5" fill={skinTone} stroke={outlineColor} strokeWidth="1.2" />
            <rect x="53" y="118" width="9" height="16" rx="4.5" fill={skinTone} stroke={outlineColor} strokeWidth="1.2" />
            {/* Shoes */}
            <ellipse cx="42" cy="134" rx="7" ry="4" fill="#C0157A" stroke={outlineColor} strokeWidth="1.2" />
            <ellipse cx="57" cy="134" rx="7" ry="4" fill="#C0157A" stroke={outlineColor} strokeWidth="1.2" />
          </>
        )}

        {/* Torso / Shirt */}
        <rect x="28" y="78" width="44" height="32" rx="10" fill={shirtColor} stroke={outlineColor} strokeWidth="1.8" />
        {/* Shirt shadow */}
        <path d="M 28 90 Q 50 96 72 90 L 72 110 Q 50 108 28 110 Z" fill={shirtDark} opacity="0.4" />
        {/* Shirt details */}
        {gender === 'boy' ? (
          <line x1="50" y1="80" x2="50" y2="108" stroke={outlineColor} strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
        ) : (
          <>
            <circle cx="50" cy="86" r="2" fill="white" opacity="0.6" />
            <circle cx="50" cy="94" r="2" fill="white" opacity="0.6" />
            <circle cx="50" cy="102" r="2" fill="white" opacity="0.6" />
          </>
        )}

        {/* Arms */}
        {/* Left arm */}
        <path d="M 28 82 Q 14 88 16 102" stroke={shirtColor} strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M 28 82 Q 14 88 16 102" stroke={outlineColor} strokeWidth="13.5" strokeLinecap="round" fill="none" opacity="0.15" />
        {/* Left hand */}
        <circle cx="16" cy="104" r="7" fill={skinTone} stroke={outlineColor} strokeWidth="1.5" />

        {/* Right arm */}
        <path d="M 72 82 Q 86 88 84 102" stroke={shirtColor} strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M 72 82 Q 86 88 84 102" stroke={outlineColor} strokeWidth="13.5" strokeLinecap="round" fill="none" opacity="0.15" />
        {/* Right hand */}
        <circle cx="84" cy="104" r="7" fill={skinTone} stroke={outlineColor} strokeWidth="1.5" />

        {/* Neck */}
        <rect x="44" y="70" width="12" height="12" rx="4" fill={skinTone} stroke={outlineColor} strokeWidth="1.5" />

        {/* === HEAD === */}
        {/* Head base */}
        <ellipse cx="50" cy="48" rx="26" ry="28" fill={skinTone} stroke={outlineColor} strokeWidth="2" />
        {/* Cheeks */}
        <circle cx="28" cy="58" r="6" fill="#FFB3A7" opacity="0.5" />
        <circle cx="72" cy="58" r="6" fill="#FFB3A7" opacity="0.5" />
        {/* Chin shadow */}
        <ellipse cx="50" cy="72" rx="14" ry="4" fill={skinDark} opacity="0.3" />

        {/* === HAIR === */}
        {gender === 'boy' ? (
          <>
            {/* Boy hair */}
            <ellipse cx="50" cy="24" rx="26" ry="14" fill={hair} />
            <path d="M 24 30 Q 20 22 26 18 Q 32 12 50 20 Q 68 12 74 18 Q 80 22 76 30" fill={hair} stroke={outlineColor} strokeWidth="1.5" strokeLinejoin="round" />
            {/* Hair spikes */}
            <path d="M 44 20 Q 46 12 50 20 Q 52 10 56 20" fill={hair} stroke={outlineColor} strokeWidth="1" />
            {/* Side hairs */}
            <path d="M 24 30 Q 20 42 22 54" stroke={hair} strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 76 30 Q 80 42 78 54" stroke={hair} strokeWidth="6" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            {/* Girl hair - top */}
            <ellipse cx="50" cy="22" rx="27" ry="15" fill={hair} />
            <path d="M 23 32 Q 18 20 28 16 Q 38 10 50 18 Q 62 10 72 16 Q 82 20 77 32" fill={hair} stroke={outlineColor} strokeWidth="1.5" strokeLinejoin="round" />
            {/* Long hair sides */}
            <path d="M 24 30 Q 18 55 22 78" stroke={hair} strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M 76 30 Q 82 55 78 78" stroke={hair} strokeWidth="10" strokeLinecap="round" fill="none" />
            {/* Hair shine */}
            <path d="M 40 18 Q 50 14 60 18" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            {/* Hair clip / bow */}
            <g transform="translate(68, 28) rotate(15)">
              <ellipse cx="-5" cy="0" rx="5" ry="3.5" fill="#FF69B4" stroke={outlineColor} strokeWidth="1" />
              <ellipse cx="5" cy="0" rx="5" ry="3.5" fill="#FF69B4" stroke={outlineColor} strokeWidth="1" />
              <circle cx="0" cy="0" r="3" fill="#FF1493" stroke={outlineColor} strokeWidth="1" />
            </g>
          </>
        )}

        {/* === FACE === */}
        {/* Eyes */}
        <motion.g
          animate={animate ? { scaleY: [1, 0.05, 1], transition: { duration: 0.15, delay: 3, repeat: Infinity, repeatDelay: 4 } } : {}}
          style={{ transformOrigin: '36px 50px' }}
        >
          <ellipse cx="36" cy="50" rx="6" ry={6 * eyeExpression.scaleY} fill="white" stroke={outlineColor} strokeWidth="1.5" />
          <ellipse cx="36" cy={50 + (1 - eyeExpression.scaleY) * 2} rx="3.5" ry={3.5 * eyeExpression.scaleY} fill="#3D2B1F" />
          <circle cx="37.5" cy={49 + (1 - eyeExpression.scaleY) * 2} r="1" fill="white" />
        </motion.g>

        <motion.g
          animate={animate ? { scaleY: [1, 0.05, 1], transition: { duration: 0.15, delay: 3, repeat: Infinity, repeatDelay: 4 } } : {}}
          style={{ transformOrigin: '64px 50px' }}
        >
          <ellipse cx="64" cy="50" rx="6" ry={6 * eyeExpression.scaleY} fill="white" stroke={outlineColor} strokeWidth="1.5" />
          <ellipse cx="64" cy={50 + (1 - eyeExpression.scaleY) * 2} rx="3.5" ry={3.5 * eyeExpression.scaleY} fill="#3D2B1F" />
          <circle cx="65.5" cy={49 + (1 - eyeExpression.scaleY) * 2} r="1" fill="white" />
        </motion.g>

        {/* Eyebrows */}
        <path
          d={`M 30 ${44 + eyeExpression.eyebrowY} Q 36 ${41 + eyeExpression.eyebrowY} 42 ${44 + eyeExpression.eyebrowY}`}
          stroke={hair === '#F5C518' ? '#B8860B' : hair}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M 58 ${44 + eyeExpression.eyebrowY} Q 64 ${41 + eyeExpression.eyebrowY} 70 ${44 + eyeExpression.eyebrowY}`}
          stroke={hair === '#F5C518' ? '#B8860B' : hair}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Nose */}
        <path d="M 50 56 Q 47 60 50 62 Q 53 60 50 56" fill={skinDark} opacity="0.5" />

        {/* Mouth */}
        <motion.path
          d={mouthPath}
          stroke={outlineColor}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={animate ? { d: [mouthPath, expression === 'happy' ? 'M 38 70 Q 50 80 62 70' : mouthPath, mouthPath], transition: { duration: 4, repeat: Infinity, repeatDelay: 5 } } : {}}
        />

        {/* Teeth for happy/excited */}
        {(expression === 'happy' || expression === 'excited' || expression === 'proud') && (
          <path d="M 40 69 Q 50 76 60 69 L 60 72 Q 50 76 40 72 Z" fill="white" />
        )}

        {/* Ears */}
        <ellipse cx="24" cy="52" rx="5" ry="7" fill={skinTone} stroke={outlineColor} strokeWidth="1.5" />
        <ellipse cx="76" cy="52" rx="5" ry="7" fill={skinTone} stroke={outlineColor} strokeWidth="1.5" />
        <ellipse cx="24" cy="52" rx="3" ry="4.5" fill={skinDark} opacity="0.3" />
        <ellipse cx="76" cy="52" rx="3" ry="4.5" fill={skinDark} opacity="0.3" />
      </svg>
    </motion.div>
  );
}
