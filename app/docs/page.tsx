'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
});

export default function ApiDoc() {
  useEffect(() => {
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if ((node as HTMLElement).tagName === 'FORM') {
            (node as HTMLFormElement).addEventListener('submit', (e: Event) => {
              e.preventDefault();
            });
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => mutationObserver.disconnect();
  }, []);

  return (
    <section className="container mx-auto p-4">
      <SwaggerUI url="/api/swagger" />
    </section>
  );
}