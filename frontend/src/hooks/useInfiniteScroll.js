import { useEffect, useRef, useState } from 'react';

export default function useInfiniteScroll({ hasMore, onLoadMore }) {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!ref.current || !enabled) return;
    const el = ref.current;
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMore) {
        onLoadMore && onLoadMore();
      }
    }, { rootMargin: '200px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref.current, hasMore, enabled]);

  return { sentinelRef: ref, setEnabled };
}





