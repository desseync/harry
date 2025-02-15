import React, { useEffect, useRef } from 'react';
import { Puzzle, LineChart, Workflow } from 'lucide-react';

interface FeatureProps {
  title: string;
  description: string;
  icon: 'puzzle' | 'chart' | 'workflow';
  delay?: number;
}

const FeatureContainer: React.FC<FeatureProps> = ({ title, description, icon, delay = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getIcon = () => {
    switch (icon) {
      case 'puzzle':
        return <Puzzle className="h-8 w-8" aria-hidden="true" />;
      case 'chart':
        return <LineChart className="h-8 w-8" aria-hidden="true" />;
      case 'workflow':
        return <Workflow className="h-8 w-8" aria-hidden="true" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="feature-container bg-white rounded-xl p-6 shadow-sm transition-shadow duration-300 opacity-20 hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.1)]"
      style={{ animationDelay: `${delay}ms` }}
      role="article"
      aria-live="polite"
      aria-labelledby={`feature-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
      tabIndex={0}
    >
      <div className="flex items-start space-x-4">
        <div 
          className="flex-shrink-0 p-3 bg-blue-50 rounded-lg text-blue-600"
          aria-hidden="true"
        >
          {getIcon()}
        </div>
        <div className="flex-grow">
          <h3
            id={`feature-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-xl font-semibold text-gray-900 mb-2 contrast-[1.0]"
          >
            {title}
          </h3>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="sr-only">Feature card end</div>
    </div>
  );
};

export default FeatureContainer;