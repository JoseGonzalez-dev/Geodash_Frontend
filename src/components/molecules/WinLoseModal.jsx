
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Modal de Victoria
export const VictoryModal = ({ isOpen, gameStats = {} }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 100);
      setTimeout(() => setShowConfetti(true), 500);
    } else {
      setIsVisible(false);
      setShowConfetti(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const {
    score = 850,
    correctAnswers = 8,
    totalQuestions = 10,
    timeBonus = 150,
    streakBonus = 200,
    difficulty = "Explorador"
  } = gameStats;

  const handlePlayAgain = () => {
    window.location.reload();
  };

  const handleBackToMenu = () => {
    navigate('/game');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Confetti particles mejorado */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Confetti de diferentes formas y tamaños */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute opacity-90`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF9F43', '#A55EEA', '#26de81'][Math.floor(Math.random() * 8)],
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '20%',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                animationName: 'confettiFall',
                animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
          {/* Estrellas brillantes */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute text-2xl opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                animationName: 'starTwinkle',
                animationIterationCount: 'infinite'
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      <div className={`bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-500 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      }`}>
        
        {/* Header con corona */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">👑</div>
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            ¡VICTORIA!
          </h2>
          <p className="text-white/90 text-lg">
            ¡Conquistaste {difficulty}!
          </p>
        </div>

        {/* Estadísticas */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">Puntuación Final:</span>
            <span className="text-2xl font-bold text-yellow-200">{score.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white">Respuestas Correctas:</span>
            <span className="text-xl font-bold text-green-200">{correctAnswers}/{totalQuestions}</span>
          </div>
          
          <div className="h-px bg-white/30 my-3"></div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/80">
              <span>Bonus por Tiempo:</span>
              <span className="text-blue-200">+{timeBonus}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Bonus por Racha:</span>
              <span className="text-purple-200">+{streakBonus}</span>
            </div>
          </div>
        </div>

        {/* Progreso de experiencia */}
        <div className="mb-6">
          <div className="flex justify-between text-white text-sm mb-2">
            <span>Experiencia Ganada</span>
            <span>+{Math.floor(score / 10)} XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-2000 ease-out"
              style={{ width: '75%' }}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <button
            onClick={handlePlayAgain}
            className="w-full bg-white/90 hover:bg-white text-orange-600 font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Jugar de Nuevo
          </button>
          
          <button
            onClick={handleBackToMenu}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-white/30"
          >
            Regresar al Menú
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de Derrota
export const DefeatModal = ({ isOpen, gameStats = {} }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const {
    score = 420,
    correctAnswers = 4,
    totalQuestions = 10,
    bestScore = 850,
    difficulty = "aprendiz",
    encouragementMessage = "¡Cada error es un paso hacia la maestría!"
  } = gameStats;

  const handleTryAgain = () => {
    window.location.reload();
  };

  const handleBackToMenu = () => {
    navigate('/game');
  };

  const handlePracticeMode = () => {
    // Implementar modo práctica si es necesario
    navigate('/game');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-500 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      }`}>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            ¡Sigue Explorando!
          </h2>
          <p className="text-blue-100 text-base">
            {encouragementMessage}
          </p>
        </div>

        {/* Estadísticas */}
        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">Tu Puntuación:</span>
            <span className="text-2xl font-bold text-yellow-200">{score.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white">Respuestas Correctas:</span>
            <span className="text-xl font-bold text-green-200">{correctAnswers}/{totalQuestions}</span>
          </div>
          
          <div className="h-px bg-white/30 my-3"></div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-200">Tu Mejor Puntuación:</span>
            <span className="text-lg font-bold text-cyan-200">{bestScore.toLocaleString()}</span>
          </div>
        </div>

        {/* Progreso y motivación */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-400/30">
            <div className="text-center">
              <div className="text-3xl mb-2">📚</div>
              <p className="text-blue-100 text-sm">
                Necesitas {Math.ceil((totalQuestions * 0.7) - correctAnswers)} respuestas más para aprobar
              </p>
            </div>
          </div>
        </div>

        {/* Sugerencias */}
        <div className="mb-6 bg-white/10 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2 flex items-center">
            <span className="text-xl mr-2">💡</span>
            Consejo del Explorador:
          </h3>
          <p className="text-blue-100 text-sm leading-relaxed">
            Practica con el modo fácil para dominar los fundamentos antes de avanzar a niveles superiores.
          </p>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Intentar de Nuevo
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePracticeMode}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm border border-white/20"
            >
              Modo Práctica
            </button>
            
            <button
              onClick={handleBackToMenu}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm border border-white/20"
            >
              Menú Principal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};