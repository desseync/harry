import { useEffect, useCallback } from 'react';

export function useIntersectionObserver(options = {
  threshold: 0.1,
  rootMargin: '50px'
}) {
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement;
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
        observer.unobserve(target);
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, options);
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [handleIntersection, options]);
}