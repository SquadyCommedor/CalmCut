import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Check, Palette, Star, Save, User } from 'lucide-react';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';
import CartoonAvatar, { AvatarGender, HairColorId } from '../components/CartoonAvatar';

const hairColors: { id: HairColorId; label: string; hex: string }[] = [
  { id: 'brown',  label: 'Castanho', hex: '#8B4513' },
  { id: 'blonde', label: 'Loiro',    hex: '#F5C518' },
  { id: 'black',  label: 'Preto',    hex: '#1a1a1a' },
  { id: 'red',    label: 'Ruivo',    hex: '#C0392B' },
  { id: 'blue',   label: 'Azul',     hex: '#2E86C1' },
];

// Persiste as preferências do avatar no localStorage para a história as ler
function saveAvatarPrefs(gender: AvatarGender, hairColor: HairColorId) {
  localStorage.setItem('avatar_gender', gender);
  localStorage.setItem('avatar_hair', hairColor);
}

function loadAvatarPrefs(): { gender: AvatarGender; hairColor: HairColorId } {
  return {
    gender: (localStorage.getItem('avatar_gender') as AvatarGender) || 'boy',
    hairColor: (localStorage.getItem('avatar_hair') as HairColorId) || 'brown',
  };
}

export default function CharacterPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Inicializa com o que já estava guardado, se existir
  const saved0 = loadAvatarPrefs();
  const [gender, setGender] = useState<AvatarGender>(saved0.gender);
  const [hairColor, setHairColor] = useState<HairColorId>(saved0.hairColor);
  const [saved, setSaved] = useState(false);

  // Nome vem sempre da BD
  const displayName = profile?.name ?? '...';

  const handleSave = () => {
    saveAvatarPrefs(gender, hairColor);
    setSaved(true);
    toast.success(`Avatar do ${displayName} guardado! 🎉`);
    setTimeout(() => setSaved(false), 2500);
  };

  // Artigo correto consoante o género escolhido
  const article = gender === 'boy' ? 'o' : 'a';

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate('/child')}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-kid"
          >
            <ArrowLeft size={24} className="text-sky-400" />
          </motion.button>
          <div>
            <h1 className="font-comic font-bold text-2xl text-text">O Meu Avatar</h1>
            <p className="text-sm text-text-light font-comic">Personaliza o teu personagem!</p>
          </div>
        </div>
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.95 }}
          className={`px-5 py-3 rounded-2xl font-comic font-bold flex items-center gap-2 transition-all shadow-kid ${
            saved ? 'bg-mint-400 text-white' : 'bg-sky-400 text-white hover:bg-sky-500'
          }`}
        >
          {saved ? <Check size={20} /> : <Save size={20} />}
          {saved ? 'Guardado!' : 'Guardar'}
        </motion.button>
      </motion.div>

      <div className="max-w-4xl mx-auto">

        {/* Pré-visualização grande */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl px-8 pt-8 pb-6 shadow-kid-lg mb-8 text-center border-4 border-sky-100"
        >
          <div className="flex justify-center">
            <CartoonAvatar gender={gender} hairColor={hairColor} size={110} expression="happy" animate />
          </div>

          {/* Nome da BD com artigo correto */}
          <h2 className="font-comic font-bold text-2xl text-text mt-3">
            Olá, {article} <span className="text-sky-500">{displayName}</span>! 👋
          </h2>
          <p className="text-sm text-text-light font-comic mt-1">
            Este é o teu avatar na história
          </p>
          <div className="flex justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={16} className="text-peach-400 fill-peach-400" />
            ))}
          </div>
        </motion.div>

        {/* Seleção de género */}
        <div className="mb-8">
          <h3 className="font-comic font-bold text-xl text-text mb-4 flex items-center gap-2">
            <User size={20} className="text-sky-400" />
            O meu avatar é...
          </h3>
          <div className="flex gap-4">
            {(['boy', 'girl'] as AvatarGender[]).map(g => (
              <motion.button
                key={g}
                onClick={() => setGender(g)}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 flex flex-col items-center pt-5 pb-4 px-4 gap-2 rounded-2xl transition-all border-4 ${
                  gender === g
                    ? 'border-sky-400 bg-white shadow-kid-lg'
                    : 'border-transparent bg-white/50 hover:bg-white hover:shadow-kid'
                }`}
              >
                <CartoonAvatar gender={g} hairColor={hairColor} size={64} expression="happy" animate={false} />
                <span className={`font-comic font-bold text-base leading-tight ${gender === g ? 'text-sky-500' : 'text-text'}`}>
                  {g === 'boy' ? 'Menino 👦' : 'Menina 👧'}
                </span>
                {gender === g && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-mint-400 rounded-full flex items-center justify-center"
                  >
                    <Check size={14} className="text-white" />
                  </motion.div>
                )}
                {gender !== g && <div className="w-6 h-6" />}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cor do cabelo */}
        <div className="mb-8">
          <h3 className="font-comic font-bold text-xl text-text mb-4 flex items-center gap-2">
            <Palette size={20} className="text-peach-400" />
            Cor do Cabelo
          </h3>
          <div className="flex flex-wrap gap-3">
            {hairColors.map(c => (
              <motion.button
                key={c.id}
                onClick={() => setHairColor(c.id)}
                whileTap={{ scale: 0.9 }}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all ${
                  hairColor === c.id
                    ? 'bg-white shadow-kid ring-4 ring-sky-200'
                    : 'bg-white/50 hover:bg-white hover:shadow-kid'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-sm border-2 border-white"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="font-comic font-bold text-text">{c.label}</span>
                {hairColor === c.id && <Check size={16} className="text-mint-400" />}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Faixa de expressões */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-sky-50 to-mint-50 rounded-3xl p-6 border-2 border-sky-100 text-center"
        >
          <p className="font-comic font-bold text-sky-500 mb-1">
            Como {article} <span className="text-sky-600">{displayName}</span> vai aparecer na história
          </p>
          <p className="text-xs text-text-light font-comic mb-5">
            O avatar muda de expressão em cada cena!
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            {(['excited', 'nervous', 'calm', 'proud'] as const).map((expr, i) => (
              <div key={expr} className="flex flex-col items-center gap-2">
                <CartoonAvatar gender={gender} hairColor={hairColor} size={56} expression={expr} animate={false} />
                <span className="text-xs font-comic text-text-light">
                  {['Animado/a', 'Nervoso/a', 'Calmo/a', 'Orgulhoso/a'][i]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
