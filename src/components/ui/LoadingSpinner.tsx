import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  const textSizes = {
    small: 'text-lg',
    medium: 'text-3xl font-bold',
    large: 'text-6xl font-black'
  };

  const numberSize = {
    small: 'text-4xl',
    medium: 'text-8xl',
    large: 'text-9xl'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 min-h-screen">
      {/* Large animated number counter */}
      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className={`${numberSize[size]} font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent`}
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: '200% 200%'
          }}
        >
          <motion.span
            key="counter"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              >
                {Math.floor(Math.random() * 10)}
              </motion.span>
            ))}
            <motion.span
              animate={{
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              %
            </motion.span>
          </motion.span>
        </motion.div>

        {/* Glowing background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Animated loading rings */}
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizeClasses[size]} border-8 border-gray-800 border-t-indigo-500 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Middle ring */}
        <motion.div
          className={`absolute inset-4 border-6 border-gray-700 border-r-purple-500 rounded-full`}
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Inner ring */}
        <motion.div
          className={`absolute inset-8 border-4 border-gray-600 border-b-pink-500 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Center pulsing dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            animate={{ 
              scale: [1, 1.8, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      {/* Loading text with animation */}
      {text && (
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.p
            className={`${textSizes[size]} bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold`}
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% 200%'
            }}
          >
            {text}
          </motion.p>
          
          {/* Loading dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="w-4 h-4 bg-indigo-400 rounded-full"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Enhanced progress indicator */}
      <motion.div
        className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Glowing effect on progress bar */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-pink-400/30 rounded-full blur-sm"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Floating particles around loading */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-indigo-400 rounded-full opacity-60"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
          />
        ))}
      </div>
    </div>
  );
};