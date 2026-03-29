import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

function getSessionId() {
  const key = 'nl_session_id';
  if (!sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, crypto.randomUUID());
  }
  return sessionStorage.getItem(key);
}

async function flushDwell(contentType, contentId, dwellMs) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('dwell_events').insert({
    user_id: user.id,
    session_id: getSessionId(),
    content_type: contentType,
    content_id: contentId,
    dwell_ms: dwellMs,
    was_visible: !document.hidden,
  });
}

export function useDwellTime(contentType, contentId) {
  const startRef = useRef(null);
  const dwellRef = useRef(0);
  const visibleRef = useRef(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visibleRef.current) {
        visibleRef.current = true;
        startRef.current = performance.now();
      } else if (!entry.isIntersecting && visibleRef.current) {
        visibleRef.current = false;
        dwellRef.current += performance.now() - startRef.current;
      }
    }, { threshold: 0.5 });

    if (elementRef.current) observer.observe(elementRef.current);

    const handleVisibility = () => {
      if (document.hidden && visibleRef.current) {
        dwellRef.current += performance.now() - startRef.current;
        visibleRef.current = false;
      } else if (!document.hidden) {
        visibleRef.current = true;
        startRef.current = performance.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      if (visibleRef.current) {
        dwellRef.current += performance.now() - startRef.current;
      }
      if (dwellRef.current > 500) {
        flushDwell(contentType, contentId, Math.round(dwellRef.current));
      }
    };
  }, [contentType, contentId]);

  return elementRef;
}
