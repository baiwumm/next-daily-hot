"use client"

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAvailableHeightOptions {
  elementIds: string[];
  debounceMs?: number;
}

export function useAvailableHeight({ elementIds, debounceMs = 100 }: UseAvailableHeightOptions) {
  const [availableHeight, setAvailableHeight] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const calculateHeight = useCallback(() => {
    if (typeof window === 'undefined') return 0;

    const totalElementsHeight = elementIds.reduce((sum, id) => {
      const element = document.getElementById(id);
      // 使用 getBoundingClientRect() 获取准确高度，包括 padding/border
      const rect = element?.getBoundingClientRect();
      return sum + (rect?.height || 0);
    }, 0);

    return Math.max(0, window.innerHeight - totalElementsHeight);
  }, [elementIds]);

  const updateHeight = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setAvailableHeight(calculateHeight());
    }, debounceMs);
  }, [calculateHeight, debounceMs]);

  useEffect(() => {
    // 初始计算
    updateHeight();

    // 监听窗口变化
    const handleResize = () => updateHeight();
    window.addEventListener('resize', handleResize);

    // 监听元素变化
    const observers: ResizeObserver[] = [];

    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new ResizeObserver(updateHeight);
        observer.observe(element);
        observers.push(observer);
      }
    });

    // 监听 DOM 结构变化
    const mutationObserver = new MutationObserver((mutations) => {
      // 检查是否涉及我们关心的元素
      const shouldUpdate = mutations.some(mutation => {
        if (mutation.type === 'childList') {
          return mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0;
        }
        if (mutation.type === 'attributes') {
          return elementIds.includes((mutation.target as Element).id);
        }
        return false;
      });

      if (shouldUpdate) updateHeight();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      observers.forEach(o => o.disconnect());
      mutationObserver.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [elementIds, updateHeight]);

  return availableHeight;
}
