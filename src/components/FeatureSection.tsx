import React from 'react';
import FeatureContainer from './FeatureContainer';

const features = [
  {
    title: 'Seamless Compatibility',
    description: 'Integrate our AI solutions effortlessly with your existing systems, ensuring smooth operation and minimal disruption to your workflow.',
    icon: 'puzzle' as const,
  },
  {
    title: 'Enhanced Data Analysis',
    description: 'Leverage powerful analytics tools to gain actionable insights from your healthcare data, enabling better decision-making and improved patient outcomes.',
    icon: 'chart' as const,
  },
  {
    title: 'Optimized Workflow',
    description: 'Streamline your practice operations with intelligent automation, reducing manual tasks and increasing overall efficiency.',
    icon: 'workflow' as const,
  },
];

export default function FeatureSection() {
  return (
    <section 
      className="py-16 bg-gray-50" 
      aria-labelledby="features-heading"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          id="features-heading" 
          className="text-3xl font-bold text-center text-gray-900 mb-12 font-display contrast-[1.0]"
        >
          Key Integration Features
        </h2>
        <noscript>
          <div className="text-center text-gray-700 mb-8">
            Please enable JavaScript to see animated features
          </div>
        </noscript>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureContainer
              key={feature.title}
              {...feature}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
}