import React, { useEffect, useRef, useState } from 'react';

// @ts-expect-error Vite raw import
import landingHtml from '../../super-productive-landing-page.html?raw';

function extractStyleAndBody(html: string): { style: string; body: string } {
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const style = styleMatch ? styleMatch[1].trim() : '';
  let body = bodyMatch ? bodyMatch[1].trim() : '';
  // Remove the inline script so we can run the reveal logic in React (scripts don't run in innerHTML)
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '');
  return { style, body };
}

const { style, body } = extractStyleAndBody(landingHtml as string);

export function BookLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Re-run the landing page's reveal animation (IntersectionObserver for .reveal)
  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    containerRef.current.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen overflow-x-hidden"
      style={{ background: 'var(--off-white, #F7F6FC)' }}
    >
      <style dangerouslySetInnerHTML={{ __html: style }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
