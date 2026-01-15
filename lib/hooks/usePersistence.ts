"use client";

import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const usePersistence = () => {
  const setExpression = useStore(state => state.setExpression);
  const updateVariable = useStore(state => state.updateVariable);

  // Hydrate from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const expr = params.get('expr');
    if (expr) {
      // Assuming single expression for now
      useStore.getState().setExpression('expr-1', expr);
    }

    const vars = params.get('vars');
    if (vars) {
      try {
        const parsedVars = JSON.parse(atob(vars));
        Object.entries(parsedVars).forEach(([name, value]) => {
          useStore.getState().updateVariable(name, value as number);
        });
      } catch (e) {
        console.error('Failed to parse variables from URL', e);
      }
    }
  }, []);

  // Sync to URL on state change with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const sync = () => {
      const state = useStore.getState();
      const params = new URLSearchParams();
      
      if (state.expressions[0]?.raw) {
        params.set('expr', state.expressions[0].raw);
      }

      const varValues = Object.fromEntries(
        Object.values(state.variables).map(v => [v.name, v.value])
      );
      if (Object.keys(varValues).length > 0) {
        params.set('vars', btoa(JSON.stringify(varValues)));
      }

      const newRelativePathQuery = window.location.pathname + '?' + params.toString();
      window.history.replaceState(null, '', newRelativePathQuery);
    };

    const debouncedSync = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(sync, 500); // 500ms debounce
    };

    const unsubscribe = useStore.subscribe(debouncedSync);
    return () => {
        unsubscribe();
        clearTimeout(timeoutId);
    };
  }, []);
};
