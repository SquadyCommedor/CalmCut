import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Volume2, VolumeX, Play, Pause,
  Home, Heart, Sparkles, CheckCircle2,
} from 'lucide-react';
import CartoonAvatar, { AvatarGender, HairColorId } from './CartoonAvatar';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SceneProps {
  gender: AvatarGender;
  hairColor: HairColorId;
}

export interface StoryScene {
  id: number;
  emoji: string;
  title: string;
  narrationBoy: string;
  narrationGirl: string;
  feeling: string;
  soundDescription: string;
  tip: string;
  duration: number;
  expression: 'happy' | 'nervous' | 'excited' | 'calm' | 'proud';
  bgGradient: string;
  Scene: React.FC<SceneProps>;
}

// Keep old export for backward compat
export const storyScenes_legacy: never[] = [];

// ─── Scene Components ─────────────────────────────────────────────────────────

function Scene1({ gender, hairColor }: SceneProps) {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full">
      <rect width="400" height="260" fill="#FFF9F0" />
      <rect x="0" y="210" width="400" height="50" fill="#E8D5B0" />
      <rect x="0" y="208" width="400" height="4" fill="#C4A882" />
      <rect x="20" y="30" width="90" height="110" rx="8" fill="#B3E5FC" stroke="#7B9FAE" strokeWidth="3" />
      <line x1="65" y1="30" x2="65" y2="140" stroke="#7B9FAE" strokeWidth="2" />
      <line x1="20" y1="85" x2="110" y2="85" stroke="#7B9FAE" strokeWidth="2" />
      <circle cx="50" cy="60" r="18" fill="#FFD700" opacity="0.7" />
      {[...Array(8)].map((_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        return <line key={i} x1={50+Math.cos(a)*20} y1={60+Math.sin(a)*20} x2={50+Math.cos(a)*27} y2={60+Math.sin(a)*27} stroke="#FFD700" strokeWidth="2" opacity="0.7" />;
      })}
      <rect x="255" y="120" width="130" height="90" rx="10" fill="#FF8A65" stroke="#E64A19" strokeWidth="2" />
      <rect x="255" y="120" width="130" height="25" rx="10" fill="#FFCCBC" stroke="#E64A19" strokeWidth="2" />
      <ellipse cx="305" cy="133" rx="28" ry="12" fill="white" stroke="#FFCCBC" strokeWidth="1.5" />
      <rect x="155" y="145" width="50" height="60" rx="10" fill="#7C4DFF" stroke="#512DA8" strokeWidth="2" />
      <rect x="168" y="165" width="24" height="20" rx="5" fill="#651FFF" />
      <foreignObject x="195" y="110" width="75" height="105">
        <div style={{transform:'scaleX(-1)'}}>
          <CartoonAvatar gender={gender} hairColor={hairColor} size={55} expression="excited" animate={true} />
        </div>
      </foreignObject>
      <rect x="110" y="65" width="120" height="40" rx="12" fill="white" stroke="#FFB300" strokeWidth="2" />
      <path d="M 210 105 L 222 116 L 207 105 Z" fill="white" stroke="#FFB300" strokeWidth="2" />
      <text x="170" y="83" textAnchor="middle" fontSize="10" fill="#5D4037" fontFamily="Arial, sans-serif">Vou ao</text>
      <text x="170" y="98" textAnchor="middle" fontSize="10" fill="#5D4037" fontFamily="Arial, sans-serif">cabeleireiro! 🎉</text>
    </svg>
  );
}

function Scene2({ gender, hairColor }: SceneProps) {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full">
      <defs>
        <linearGradient id="s2sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" /><stop offset="100%" stopColor="#E0F7FA" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#s2sky)" />
      <rect x="0" y="190" width="400" height="70" fill="#607D8B" />
      {[0,80,160,240,320].map(x=><rect key={x} x={x+30} y="218" width="40" height="6" rx="3" fill="#FFEB3B" opacity="0.7" />)}
      <ellipse cx="70" cy="190" rx="90" ry="55" fill="#B0BEC5" opacity="0.4" />
      <ellipse cx="330" cy="190" rx="90" ry="55" fill="#B0BEC5" opacity="0.4" />
      {[[50,35],[200,22],[350,42]].map(([cx,cy],i)=>(
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx="35" ry="20" fill="white" opacity="0.9" />
          <ellipse cx={cx-20} cy={cy+5} rx="22" ry="15" fill="white" opacity="0.9" />
          <ellipse cx={cx+20} cy={cy+5} rx="22" ry="15" fill="white" opacity="0.9" />
        </g>
      ))}
      <g>
        <rect x="80" y="148" width="240" height="58" rx="14" fill="#E53935" stroke="#B71C1C" strokeWidth="2.5" />
        <path d="M 120 148 Q 140 110 178 106 L 268 106 Q 308 108 318 148 Z" fill="#EF5350" stroke="#B71C1C" strokeWidth="2.5" />
        <rect x="133" y="112" width="58" height="34" rx="6" fill="#B3E5FC" stroke="#0288D1" strokeWidth="1.5" />
        <rect x="203" y="112" width="58" height="34" rx="6" fill="#B3E5FC" stroke="#0288D1" strokeWidth="1.5" />
        <circle cx="140" cy="210" r="21" fill="#212121" stroke="#424242" strokeWidth="3" />
        <circle cx="140" cy="210" r="11" fill="#616161" />
        <circle cx="260" cy="210" r="21" fill="#212121" stroke="#424242" strokeWidth="3" />
        <circle cx="260" cy="210" r="11" fill="#616161" />
        <ellipse cx="317" cy="173" rx="8" ry="6" fill="#FFEB3B" />
      </g>
      <foreignObject x="133" y="108" width="55" height="77">
        <div>
          <CartoonAvatar gender={gender} hairColor={hairColor} size={38} expression="happy" animate={true} />
        </div>
      </foreignObject>
    </svg>
  );
}

function Scene3({ gender, hairColor }: SceneProps) {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full">
      <rect width="400" height="260" fill="#FFF3E0" />
      <rect x="0" y="215" width="400" height="45" fill="#F5F5DC" />
      <rect x="55" y="55" width="285" height="165" rx="8" fill="white" stroke="#E0E0E0" strokeWidth="3" />
      <rect x="85" y="25" width="230" height="38" rx="8" fill="#FF7043" stroke="#E64A19" strokeWidth="2" />
      <text x="200" y="50" textAnchor="middle" fontSize="15" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold">✂ SALÃO ✂</text>
      <rect x="75" y="85" width="100" height="80" rx="6" fill="#B3E5FC" stroke="#0288D1" strokeWidth="2" />
      <rect x="225" y="85" width="100" height="80" rx="6" fill="#B3E5FC" stroke="#0288D1" strokeWidth="2" />
      <line x1="85" y1="89" x2="85" y2="160" stroke="white" strokeWidth="3" opacity="0.5" />
      <line x1="235" y1="89" x2="235" y2="160" stroke="white" strokeWidth="3" opacity="0.5" />
      <rect x="160" y="150" width="80" height="70" rx="6" fill="#FFCCBC" stroke="#E64A19" strokeWidth="2" />
      <circle cx="232" cy="187" r="4" fill="#FF7043" />
      <rect x="348" y="72" width="14" height="100" rx="7" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
      {[90,105,120,135,150].map(y=><rect key={y} x="348" y={y} width="14" height="8" rx="2" fill="#E53935" opacity="0.7" />)}
      <foreignObject x="90" y="142" width="75" height="105">
        <div>
          <CartoonAvatar gender={gender} hairColor={hairColor} size={54} expression="nervous" animate={true} />
        </div>
      </foreignObject>
      <circle cx="160" cy="138" r="5" fill="white" stroke="#90CAF9" strokeWidth="1.5" opacity="0.8" />
      <circle cx="168" cy="128" r="7" fill="white" stroke="#90CAF9" strokeWidth="1.5" opacity="0.8" />
      <circle cx="178" cy="115" r="9" fill="white" stroke="#90CAF9" strokeWidth="1.5" opacity="0.8" />
      <text x="178" y="119" textAnchor="middle" fontSize="8" fill="#1565C0">1 2 3</text>
    </svg>
  );
}

function Scene4({ gender, hairColor }: SceneProps) {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full">
      <rect width="400" height="260" fill="#E8F5E9" />
      <rect x="0" y="215" width="400" height="45" fill="#F1F8E9" />
      <rect x="25" y="15" width="165" height="200" rx="10" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="4" />
      <rect x="34" y="24" width="147" height="182" rx="6" fill="#F8FBFF" stroke="#BBDEFB" strokeWidth="2" />
      <rect x="200" y="148" width="130" height="65" rx="10" fill="#C62828" stroke="#B71C1C" strokeWidth="2.5" />
      <rect x="200" y="92" width="130" height="65" rx="8" fill="#D32F2F" stroke="#B71C1C" strokeWidth="2.5" />
      <rect x="183" y="148" width="20" height="50" rx="8" fill="#D32F2F" stroke="#B71C1C" strokeWidth="2" />
      <rect x="317" y="148" width="20" height="50" rx="8" fill="#D32F2F" stroke="#B71C1C" strokeWidth="2" />
      <rect x="248" y="213" width="24" height="28" rx="4" fill="#9E9E9E" stroke="#757575" strokeWidth="2" />
      <rect x="225" y="236" width="70" height="10" rx="5" fill="#757575" />
      <foreignObject x="215" y="92" width="100" height="140">
        <div>
          <CartoonAvatar gender={gender} hairColor={hairColor} size={70} expression="excited" animate={true} />
        </div>
      </foreignObject>
      <text x="370" y="155" fontSize="22">⬆️</text>
      <text x="370" y="185" fontSize="22">⬇️</text>
      <rect x="25" y="55" width="145" height="42" rx="12" fill="white" stroke="#FFB300" strokeWidth="2" />
      <text x="97" y="73" textAnchor="middle" fontSize="10" fill="#5D4037" fontFamily="Arial, sans-serif">Up! Down!</text>
      <text x="97" y="89" textAnchor="middle" fontSize="10" fill="#5D4037" fontFamily="Arial, sans-serif">É divertido! 😄</text>
    </svg>
  );
}

function Scene5({ gender, hairColor }: SceneProps) {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full">
      <rect width="400" height="260" fill="#F3E5F5" />
      <rect x="0" y="215" width="400" height="45" fill="#EDE7F6" />
      <rect x="240" y="15" width="145" height="200" rx="10" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="3" />
      <foreignObject x="148" y="72" width="100" height="140">
        <div>
          <CartoonAvatar gender={gender} hairColor={hairColor} size={70} expression="happy" animate={true} />
        </div>
      </foreignObject>
      <path d="M 150 122 Q 118 142 108 215 L 250 215 Q 240 142 206 122 Z" fill="#7B1FA2" stroke="#4A148C" strokeWidth="2" opacity="0.85" />
      <path d="M 153 127 Q 148 158 146 190" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      {[[168,148],[193,162],[172,174],[202,143]].map(([x,y],i)=><text key={i} x={x} y={y} fontSize="14">⭐</text>)}
      <rect x="240" y="42" width="145" height="50" rx="12" fill="white" stroke="#CE93D8" strokeWidth="2" />
      <text x="312" y="63" textAnchor="middle" fontSize="9" fill="#6A1B9A" fontFamily="Arial, sans-serif">Sou um</text>
      <text x="312" y="78" textAnchor="middle" fontSize="9" fill="#6A1B9A" fontFamily="Arial, sans-serif">Super-Herói! 🦸</text>
    </svg>
  );
}

function Scene6({ gender, hairColor }: SceneProps) {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full">
      <defs>
        <linearGradient id="s6water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B3E5FC" /><stop offset="100%" stopColor="#E0F7FA" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#s6water)" />
      <rect x="0" y="215" width="400" height="45" fill="#E0F7FA" />
      <ellipse cx="200" cy="195" rx="120" ry="38" fill="#B0BEC5" stroke="#78909C" strokeWidth="3" />
      <ellipse cx="200" cy="190" rx="100" ry="28" fill="#90A4AE" />
      <ellipse cx="200" cy="187" rx="83" ry="20" fill="#81D4FA" opacity="0.8" />
      {[[178,75],[198,57],[218,72],[188,87],[208,82]].map(([x,y],i)=>(
        <motion.ellipse key={i} cx={x} cy={y} rx="3" ry="7" fill="#29B6F6" opacity="0.8"
          animate={{cy:[y,y+118],opacity:[0.8,0]}} transition={{duration:1.2,repeat:Infinity,delay:i*0.25}} />
      ))}
      {[[158,108],[198,98],[238,112],[173,93],[223,93]].map(([x,y],i)=>(
        <motion.circle key={i} cx={x} cy={y} r={5+i%3} fill="white" opacity="0.7"
          animate={{scale:[1,1.3,0.8,1],opacity:[0.7,0.9,0.5,0.7]}} transition={{duration:2,repeat:Infinity,delay:i*0.3}} />
      ))}
      <foreignObject x="153" y="95" width="95" height="133">
        <div>
          <CartoonAvatar gender={gender} hairColor={hairColor} size={67} expression="calm" animate={true} />
        </div>
      </foreignObject>
      <rect x="310" y="15" width="10" height="78" rx="5" fill="#B0BEC5" stroke="#78909C" strokeWidth="1.5" />
      <ellipse cx="315" cy="98" rx="20" ry="8" fill="#90A4AE" stroke="#78909C" strokeWidth="1.5" />
      {[[306,110],[312,107],[318,110],[324,107]].map(([x,y],i)=>(
        <motion.ellipse key={i} cx={x} cy={y} rx="2" ry="5" fill="#29B6F6" opacity="0.7"
          animate={{cy:[y,y+75],opacity:[0.7,0]}} transition={{duration:1,repeat:Infinity,delay:i*0.2}} />
      ))}
      <text x="75" y="95" fontSize="22" opacity="0.6">😌</text>
    </svg>
  );
}

function Scene7({ gender, hairColor }: SceneProps) {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full">
      <rect width="400" height="260" fill="#FFFDE7" />
      <rect x="0" y="215" width="400" height="45" fill="#FFF9C4" />
      <rect x="140" y="148" width="130" height="67" rx="10" fill="#C62828" stroke="#B71C1C" strokeWidth="2.5" />
      <rect x="140" y="92" width="130" height="65" rx="8" fill="#D32F2F" stroke="#B71C1C" strokeWidth="2.5" />
      <foreignObject x="153" y="78" width="100" height="140">
        <div>
          <CartoonAvatar gender={gender} hairColor={hairColor} size={70} expression="calm" animate={true} />
        </div>
      </foreignObject>
      <path d="M 300 115 Q 280 105 265 115" stroke="#FDBCB4" strokeWidth="10" strokeLinecap="round" fill="none" />
      <g transform="translate(295,96) rotate(-30)">
        <path d="M 0 0 L 30 -5 L 35 0 L 30 5 L 0 0 Z" fill="#B0BEC5" stroke="#78909C" strokeWidth="1" />
        <path d="M 0 0 L 30 5 L 35 0 L 30 -5 L 0 0 Z" fill="#CFD8DC" stroke="#78909C" strokeWidth="1" opacity="0.8" />
        <circle cx="0" cy="0" r="4" fill="#9E9E9E" stroke="#616161" strokeWidth="1" />
        <ellipse cx="-12" cy="-10" rx="9" ry="6" fill="#FF7043" stroke="#E64A19" strokeWidth="1" />
        <ellipse cx="-12" cy="10" rx="9" ry="6" fill="#FF7043" stroke="#E64A19" strokeWidth="1" />
      </g>
      {[[198,96],[213,86],[223,101],[208,111],[228,91]].map(([x,y],i)=>(
        <motion.path key={i} d={`M ${x} ${y} Q ${x+5} ${y+10} ${x+2} ${y+20}`} stroke="#8D6E63" strokeWidth="2" fill="none" strokeLinecap="round"
          animate={{y:[0,55],opacity:[0.8,0]}} transition={{duration:1.5,repeat:Infinity,delay:i*0.3}} />
      ))}
      {[[318,75],[340,96],[323,57]].map(([x,y],i)=>(
        <motion.text key={i} x={x} y={y} fontSize="13" fill="#FF7043" fontFamily="Arial, sans-serif" fontWeight="bold"
          animate={{scale:[0,1.2,1],opacity:[0,1,0]}} transition={{duration:0.8,repeat:Infinity,delay:i*0.4}}>
          snip!
        </motion.text>
      ))}
      <rect x="22" y="44" width="105" height="40" rx="12" fill="white" stroke="#FFC107" strokeWidth="2" />
      <text x="74" y="62" textAnchor="middle" fontSize="10" fill="#5D4037" fontFamily="Arial, sans-serif">Sou Corajoso!</text>
      <text x="74" y="78" textAnchor="middle" fontSize="14">💪</text>
    </svg>
  );
}

function Scene8({ gender, hairColor }: SceneProps) {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full">
      <rect width="400" height="260" fill="#E8EAF6" />
      <rect x="0" y="215" width="400" height="45" fill="#E8EAF6" />
      <rect x="140" y="143" width="130" height="72" rx="10" fill="#C62828" stroke="#B71C1C" strokeWidth="2.5" />
      <rect x="140" y="88" width="130" height="65" rx="8" fill="#D32F2F" stroke="#B71C1C" strokeWidth="2.5" />
      <foreignObject x="153" y="75" width="100" height="140">
        <div>
          <CartoonAvatar gender={gender} hairColor={hairColor} size={70} expression="nervous" animate={true} />
        </div>
      </foreignObject>
      <g transform="translate(290,88)">
        <rect x="0" y="0" width="50" height="28" rx="10" fill="#7C4DFF" stroke="#512DA8" strokeWidth="2" />
        <circle cx="8" cy="14" r="6" fill="#512DA8" />
        <rect x="-10" y="8" width="12" height="12" rx="4" fill="#9C27B0" stroke="#7B1FA2" strokeWidth="1.5" />
      </g>
      {[[-15,0],[-10,14],[-15,28]].map(([dx,dy],i)=>(
        <motion.path key={i} d={`M ${290+dx} ${102+dy} Q ${268+dx} ${102+dy} ${238+dx} ${112+dy}`}
          stroke="#90CAF9" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"
          animate={{opacity:[0,0.7,0]}} transition={{duration:0.8,repeat:Infinity,delay:i*0.25}} />
      ))}
      <rect x="22" y="38" width="120" height="14" rx="7" fill="#E0E0E0" />
      <motion.rect x="22" y="38" width="0" height="14" rx="7" fill="#66BB6A"
        animate={{width:[0,120]}} transition={{duration:3,repeat:Infinity}} />
      <text x="82" y="28" textAnchor="middle" fontSize="11" fill="#388E3C" fontFamily="Arial, sans-serif" fontWeight="bold">
        Quase pronto! 🌟
      </text>
    </svg>
  );
}

function Scene9({ gender, hairColor }: SceneProps) {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full">
      <defs>
        <linearGradient id="s9grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF9C4" /><stop offset="100%" stopColor="#F3E5F5" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#s9grad)" />
      <rect x="55" y="15" width="130" height="200" rx="15" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="4" />
      <rect x="65" y="25" width="110" height="180" rx="10" fill="#F8FBFF" stroke="#BBDEFB" strokeWidth="2" />
      <foreignObject x="67" y="48" width="100" height="140">
        <div style={{transform:'scaleX(-1)'}}>
          <CartoonAvatar gender={gender} hairColor={hairColor} size={70} expression="proud" animate={true} />
        </div>
      </foreignObject>
      <foreignObject x="228" y="70" width="100" height="140">
        <div>
          <CartoonAvatar gender={gender} hairColor={hairColor} size={70} expression="proud" animate={true} />
        </div>
      </foreignObject>
      <text x="340" y="55" fontSize="38">🏆</text>
      {[[28,28,'#FF7043'],[48,58,'#66BB6A'],[358,38,'#7C4DFF'],[378,78,'#FF4081'],[18,98,'#FFC107'],[368,118,'#29B6F6']].map(([x,y,fill],i)=>(
        <motion.rect key={i} x={Number(x)} y={Number(y)} width="10" height="10" rx="2" fill={String(fill)}
          animate={{y:[Number(y),Number(y)+28,Number(y)],rotate:[0,360],opacity:[1,0.5,1]}}
          transition={{duration:2+i*0.3,repeat:Infinity,delay:i*0.2}} />
      ))}
      {[[208,75],[338,85],[218,198],[342,195]].map(([x,y],i)=>(
        <motion.text key={i} x={x} y={y} fontSize="20"
          animate={{scale:[1,1.4,1],rotate:[0,18,-18,0]}} transition={{duration:2,repeat:Infinity,delay:i*0.4}}>
          ⭐
        </motion.text>
      ))}
      <rect x="198" y="22" width="145" height="44" rx="14" fill="white" stroke="#FFB300" strokeWidth="2.5" />
      <text x="270" y="42" textAnchor="middle" fontSize="11" fill="#E65100" fontFamily="Arial, sans-serif" fontWeight="bold">Consegui! 🎉</text>
      <text x="270" y="57" textAnchor="middle" fontSize="10" fill="#E65100" fontFamily="Arial, sans-serif">Sou Campeão/ã!</text>
    </svg>
  );
}

// ─── Story Data ───────────────────────────────────────────────────────────────

export const storyScenes: StoryScene[] = [
  { id:1, emoji:'🏠', title:'O Dia do Cabeleireiro', narrationBoy:'Hoje é um dia especial! O Rui vai ao cabeleireiro. Ele veste a roupa confortável e leva o brinquedo favorito!', narrationGirl:'Hoje é um dia especial! A Ana vai ao cabeleireiro. Ela veste a roupa confortável e leva o brinquedo favorito!', feeling:'Animado e preparado 😊', soundDescription:'Silêncio em casa 🏠', tip:'Escolhe roupa que não aperte nem coce', duration:8, expression:'excited', bgGradient:'from-orange-50 to-yellow-50', Scene:Scene1 },
  { id:2, emoji:'🚗', title:'A Viagem de Carro', narrationBoy:'O Rui vai de carro! Olha pela janela e vê árvores e casas a passar. Aperta a mão do pai ou mãe se precisar.', narrationGirl:'A Ana vai de carro! Olha pela janela e vê árvores e casas a passar. Aperta a mão do pai ou mãe se precisar.', feeling:'Curioso e seguro 🚗', soundDescription:'Som suave do motor 🚗', tip:'Música suave ajuda a relaxar', duration:8, expression:'happy', bgGradient:'from-blue-50 to-sky-50', Scene:Scene2 },
  { id:3, emoji:'✂️', title:'Chegar ao Salão', narrationBoy:'Chegaram! O salão tem luzes brilhantes. O Rui respira fundo: 1... 2... 3... Está bem!', narrationGirl:'Chegaram! O salão tem luzes brilhantes. A Ana respira fundo: 1... 2... 3... Está bem!', feeling:'Um pouco nervoso, mas seguro 💪', soundDescription:'Secadores ao longe ✂️', tip:'Respirar fundo acalma o corpo', duration:10, expression:'nervous', bgGradient:'from-amber-50 to-orange-50', Scene:Scene3 },
  { id:4, emoji:'💺', title:'A Cadeira Mágica', narrationBoy:'A cadeira sobe e desce como um elevador! O Rui ri muito. É divertido! Up! Down!', narrationGirl:'A cadeira sobe e desce como um elevador! A Ana ri muito. É divertido! Up! Down!', feeling:'Surpreso e divertido 😄', soundDescription:'Cadeira a subir e descer ⬆️⬇️', tip:'Pede ajuda se tiveres medo de altura', duration:10, expression:'excited', bgGradient:'from-green-50 to-emerald-50', Scene:Scene4 },
  { id:5, emoji:'🦸', title:'A Capa de Super-Herói', narrationBoy:'O cabeleireiro põe uma capa no Rui! É como uma capa de super-herói. Macia e quentinha!', narrationGirl:'A cabeleireira põe uma capa na Ana! É como uma capa de super-heroína. Macia e quentinha!', feeling:'Confortável e protegido 🦸', soundDescription:'Tecido a mexer 🦸', tip:'Diz se o tecido coçar ou incomodar', duration:8, expression:'happy', bgGradient:'from-purple-50 to-violet-50', Scene:Scene5 },
  { id:6, emoji:'💧', title:'Lavar o Cabelo', narrationBoy:'Água morna na cabeça! O Rui fecha os olhos e imagina que está na praia. Muito relaxante!', narrationGirl:'Água morna na cabeça! A Ana fecha os olhos e imagina que está na praia. Muito relaxante!', feeling:'Relaxado e fresco 💧', soundDescription:'Água a correr suavemente 💧', tip:'Pede uma toalha para a cara se precisares', duration:10, expression:'calm', bgGradient:'from-cyan-50 to-blue-50', Scene:Scene6 },
  { id:7, emoji:'✂️', title:'Snip Snip!', narrationBoy:'O cabeleireiro corta o cabelo. Faz "snip snip"! O Rui é muito corajoso. Não dói nada!', narrationGirl:'A cabeleireira corta o cabelo. Faz "snip snip"! A Ana é muito corajosa. Não dói nada!', feeling:'Corajoso e forte ✂️', soundDescription:'Tesoura: snip snip ✂️', tip:'Podes pedir uma pausa a qualquer momento!', duration:10, expression:'calm', bgGradient:'from-yellow-50 to-amber-50', Scene:Scene7 },
  { id:8, emoji:'💨', title:'O Secador', narrationBoy:'O secador sopra ar quente! O Rui pensa: é como vento no verão. Quase acabou!', narrationGirl:'O secador sopra ar quente! A Ana pensa: é como vento no verão. Quase acabou!', feeling:'Quase lá! 🌟', soundDescription:'Secador: som contínuo 🌬️', tip:'Tapo os ouvidos se o som for muito alto', duration:8, expression:'nervous', bgGradient:'from-indigo-50 to-purple-50', Scene:Scene8 },
  { id:9, emoji:'🏆', title:'O Resultado!', narrationBoy:'Uau! O Rui ficou tão giro! Olha no espelho e dá um grande sorriso. Conseguiu! É um campeão!', narrationGirl:'Uau! A Ana ficou tão gira! Olha no espelho e dá um grande sorriso. Conseguiu! É uma campeã!', feeling:'Feliz, orgulhosa e confiante! 🏆', soundDescription:'Aplausos! Parabéns! 🎉', tip:'Pede aos teus pais para tirarem uma foto!', duration:8, expression:'proud', bgGradient:'from-pink-50 to-yellow-50', Scene:Scene9 },
];

// ─── Sound Engine ─────────────────────────────────────────────────────────────

function useStorySound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = (freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.15) => {
    try {
      if (!ctxRef.current) ctxRef.current = new AudioContext();
      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.connect(env); env.connect(ctx.destination);
      osc.type = type; osc.frequency.value = freq;
      env.gain.setValueAtTime(0, ctx.currentTime);
      env.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.04);
      env.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
      osc.start(); osc.stop(ctx.currentTime + dur + 0.1);
    } catch(_) {}
  };

  const playSceneSound = (id: number) => {
    const d = (n: number, cb: ()=>void) => setTimeout(cb, n);
    switch(id) {
      case 1: [523,659,784,1047].forEach((f,i)=>d(i*130,()=>play(f,0.3)));break;
      case 2: play(80,1.5,'sawtooth',0.06);break;
      case 3: play(880,0.4);d(320,()=>play(660,0.4,'sine',0.1));break;
      case 4: [300,420,550,700].forEach((f,i)=>d(i*60,()=>play(f,0.15,'triangle',0.12)));break;
      case 5: play(200,0.6,'sawtooth',0.04);break;
      case 6: [880,1100,660].forEach((f,i)=>d(i*210,()=>play(f,0.25,'sine',0.1)));break;
      case 7: [[1200,0],[1000,160],[1200,500],[1000,660]].forEach(([f,t])=>d(t,()=>play(f,0.1,'square',0.08)));break;
      case 8: play(150,1.0,'sawtooth',0.05);play(300,1.0,'sawtooth',0.025);break;
      case 9: [523,523,784,784,1047,1047].forEach((f,i)=>d(i*160,()=>play(f,0.3,'sine',0.18)));break;
    }
  };

  return { playSceneSound };
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface AnimatedStoryProps {
  gender?: AvatarGender;
  hairColor?: HairColorId;
  characterName?: string;
  onComplete: () => void;
  onExit: () => void;
}

export default function AnimatedStory({ gender='boy', hairColor='brown', characterName, onComplete, onExit }: AnimatedStoryProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playSceneSound } = useStorySound();

  const scene = storyScenes[currentScene];
  const totalScenes = storyScenes.length;

  // Pick narration by gender, then replace the placeholder name with the real name from the DB
  const rawNarration = gender === 'girl' ? scene.narrationGirl : scene.narrationBoy;
  const narration = characterName
    ? rawNarration
        .replace(/\bO Rui\b/g, `O ${characterName}`)
        .replace(/\bA Ana\b/g, `A ${characterName}`)
        .replace(/\bo Rui\b/g, `o ${characterName}`)
        .replace(/\ba Ana\b/g, `a ${characterName}`)
    : rawNarration;

  useEffect(() => {
    if (soundEnabled) playSceneSound(scene.id);
    setShowTip(false);
    setProgress(0);
  }, [currentScene, soundEnabled]);

  useEffect(() => {
    if (!isPlaying) return;
    const iv = setInterval(() => {
      setProgress(p => { if (p >= 100) { handleNext(); return 0; } return p + (100 / (scene.duration * 10)); });
    }, 100);
    return () => clearInterval(iv);
  }, [isPlaying, currentScene]);

  const handleNext = useCallback(() => {
    setProgress(0);
    if (currentScene < totalScenes - 1) setCurrentScene(c => c + 1);
    else { setIsPlaying(false); onComplete(); }
  }, [currentScene, totalScenes, onComplete]);

  const handlePrev = () => { setProgress(0); if (currentScene > 0) setCurrentScene(c => c - 1); };
  const SceneComp = scene.Scene;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="glass border-b-2 border-sky-100 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.button onClick={onExit} whileTap={{scale:0.9}}
            className="flex items-center gap-2 text-text-light hover:text-sky-500 font-comic font-bold">
            <Home size={20}/><span className="hidden sm:inline">Sair</span>
          </motion.button>
          <div className="flex items-center gap-3">
            <span className="font-comic font-bold text-sky-500">{currentScene+1} / {totalScenes}</span>
            <div className="flex gap-1">
              {storyScenes.map((_,i)=>(
                <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i===currentScene?'bg-sky-400':i<currentScene?'bg-mint-400':'bg-sky-100'}`} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button onClick={()=>setSoundEnabled(s=>!s)} whileTap={{scale:0.9}}
              className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
              {soundEnabled?<Volume2 size={18} className="text-sky-400"/>:<VolumeX size={18} className="text-sky-300"/>}
            </motion.button>
            <motion.button onClick={()=>setIsPlaying(p=>!p)} whileTap={{scale:0.9}}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${isPlaying?'bg-coral-100 text-coral-400':'bg-sky-100 text-sky-400'}`}>
              {isPlaying?<Pause size={18}/>:<Play size={18}/>}
            </motion.button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-3">
          <div className="h-2 bg-sky-50 rounded-full overflow-hidden">
            <motion.div className="h-full bg-sky-400 rounded-full" animate={{width:`${progress}%`}} transition={{duration:0.1}} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <AnimatePresence mode="wait">
            <motion.div key={scene.id}
              initial={{opacity:0,scale:0.95,x:40}} animate={{opacity:1,scale:1,x:0}} exit={{opacity:0,scale:1.02,x:-40}}
              transition={{duration:0.45}}
              className={`bg-gradient-to-br ${scene.bgGradient} rounded-3xl shadow-kid-lg overflow-hidden border-4 border-sky-100`}
            >
              <div className="relative w-full" style={{aspectRatio:'16/9'}}>
                <SceneComp gender={gender} hairColor={hairColor} />
              </div>

              <div className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-3">
                  <motion.h2 initial={{y:10,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.2}}
                    className="font-comic font-bold text-2xl md:text-3xl text-text">{scene.title}
                  </motion.h2>
                  <div className="flex items-center gap-1.5 bg-sky-50 rounded-full px-3 py-1.5 shrink-0 ml-3">
                    <Heart size={14} className="text-sky-400"/>
                    <span className="text-xs text-sky-600 font-comic font-bold">{scene.feeling}</span>
                  </div>
                </div>

                <motion.p initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                  className="text-lg md:text-xl text-text font-comic leading-relaxed mb-4">{narration}
                </motion.p>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 text-sky-400">
                    <Volume2 size={14}/>
                    <span className="text-xs font-comic font-bold text-text-light">{scene.soundDescription}</span>
                  </div>
                  <motion.button onClick={()=>setShowTip(s=>!s)}
                    className="flex items-center gap-1.5 text-sky-400 hover:text-sky-500 font-comic font-bold text-sm">
                    <Sparkles size={16}/>{showTip?'Esconder dica':'Dica especial ✨'}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showTip&&(
                    <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden mt-3">
                      <div className="bg-peach-50 rounded-2xl p-4 border-2 border-peach-100">
                        <p className="text-sm text-text font-comic"><strong className="text-peach-500">💡 Dica:</strong> {scene.tip}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-6">
            <motion.button onClick={handlePrev} disabled={currentScene===0} whileTap={{scale:0.95}}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl font-comic font-bold text-text shadow-kid disabled:opacity-40 hover:bg-sky-50 border-2 border-sky-100">
              <ChevronLeft size={20}/>Anterior
            </motion.button>

            <div className="hidden md:flex items-center gap-2">
              {storyScenes.map((s,i)=>(
                <motion.button key={s.id} onClick={()=>{setCurrentScene(i);setProgress(0);}} whileTap={{scale:0.9}}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-comic font-bold text-sm transition-all ${i===currentScene?'bg-sky-400 text-white shadow-kid':i<currentScene?'bg-mint-100 text-mint-500':'bg-sky-50 text-sky-200'}`}>
                  {i<currentScene?<CheckCircle2 size={18}/>:i+1}
                </motion.button>
              ))}
            </div>

            <motion.button onClick={handleNext} whileTap={{scale:0.95}}
              className="flex items-center gap-2 px-6 py-3 bg-sky-400 text-white rounded-2xl font-comic font-bold shadow-kid hover:bg-sky-500">
              {currentScene===totalScenes-1?'Acabou! 🎉':'Próximo'}<ChevronRight size={20}/>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
