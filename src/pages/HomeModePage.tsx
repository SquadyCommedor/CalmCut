import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Music, Home, Gamepad2 } from 'lucide-react';

const modes = [
  {
    id: 'story',
    title: 'A História',
    description: 'Segue o Rui/Ana ao cabeleireiro passo a passo',
    icon: BookOpen,
    emoji: '📖',
    path: '/child/story-game',
    color: 'bg-sky-100',
    iconColor: 'text-sky-400',
    borderColor: 'border-sky-200',
    image: 'https://ecdn.teacherspayteachers.com/thumbitem/Getting-a-Haircut-Social-Story-Haircut-Social-Story-for-Autism-9507887-1689351008/original-9507887-1.jpg',
  },
  {
    id: 'sounds',
    title: 'Sons do Cabeleireiro',
    description: 'Descobre de que instrumento vem o som!',
    icon: Music,
    emoji: '🎵',
    path: '/child/sound-game',
    color: 'bg-orange-100',
    iconColor: 'text-orange-400',
    borderColor: 'border-orange-200',
    image: 'https://cdn11.bigcommerce.com/s-dkxq2/products/1285/images/11836/Haircut_girl_00__93080.1592342386.380.500.jpg?c=2',
  },
];

export default function HomeModePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 pb-24">
      {/* Header — same pattern as ChildDashboard */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <motion.button
          onClick={() => navigate('/child')}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-kid"
        >
          <ArrowLeft size={24} className="text-sky-400" />
        </motion.button>

        <div className="flex items-center gap-4 flex-1">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-kid flex-shrink-0"
          >
            <img
              src="https://thumbs.dreamstime.com/b/cartoon-boy-getting-haircut-female-hairdresser-hairdryer-comb-child-barber-cute-sits-chair-wearing-yellow-cape-415640394.jpg"
              alt="Mascote"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div>
            <h1 className="font-comic font-bold text-2xl text-sky-500 flex items-center gap-2">
              Modo Casa <Home size={22} className="text-sky-400" />
            </h1>
            <p className="text-text-light text-sm font-comic">
              Olá{profile?.name ? `, ${profile.name}` : ''}! O que queres fazer hoje?
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cards — same pattern as quickActions in ChildDashboard */}
      <div className="max-w-2xl mx-auto">
        <h2 className="font-comic font-bold text-xl text-text mb-4 flex items-center gap-2">
          <Gamepad2 size={20} className="text-sky-400" />
          Escolhe uma atividade
        </h2>

        <div className="space-y-4">
          {modes.map((mode, i) => {
            const Icon = mode.icon;
            return (
              <motion.button
                key={mode.id}
                onClick={() => navigate(mode.path)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl ${mode.color} border-2 ${mode.borderColor} text-left transition-all relative`}
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                  <img
                    src={mode.image}
                    alt={mode.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="font-comic font-bold text-lg text-text">{mode.title}</h3>
                  <p className="text-sm text-text-light font-comic">{mode.description}</p>
                </div>

                {/* Icon button */}
                <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${mode.iconColor} shadow-sm flex-shrink-0`}>
                  <Icon size={20} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Dica do dia — same as ChildDashboard */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-2xl mx-auto mt-6 bg-mint-50 rounded-2xl p-5 border-2 border-mint-100"
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-mint-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="font-comic font-bold text-text mb-1">Dica do Dia</h3>
            <p className="text-sm text-text-light leading-relaxed font-comic">
              Praticar em casa ajuda a ficar mais tranquilo no cabeleireiro. 
              Ouve os sons com calma e conta até 3 se sentires nervoso!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
