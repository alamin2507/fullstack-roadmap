import React, { ReactNode, useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface BallSurfaceSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export default function BallSurfaceSection({ children, id, className }: BallSurfaceSectionProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      id={id}
      className={`${className || ''} overflow-visible`}
      initial={{ 
        opacity: 0.3, 
        y: isMobile ? 15 : 30, 
        scale: 1, // Keep scale constant to prevent layout bounding box changes
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1 
      }}
      viewport={{ 
        once: true, // Crucial: only animate once to prevent infinite height shifting on scroll
        margin: "-100px 0px"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 80, 
        damping: 20, 
        mass: 0.8
      }}
      style={{
        transformOrigin: "center top",
        willChange: "transform, opacity"
      }}
    >
      {children}
    </motion.div>
  );
}
