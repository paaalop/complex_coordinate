import { useState } from 'react';
import { SaveModal } from './SaveModal';
import { LoadModal } from './LoadModal';
import { saveGraph } from '@/lib/services/graphService';
import { useAuth } from '@/lib/hooks/useAuth';
import { useStore } from '@/lib/store/useStore';
import { SavedGraph } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function SaveLoadControls() {
  const { user } = useAuth();
  const loadState = useStore(state => state.loadState);
  const router = useRouter();
  
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (title: string) => {
    setLoading(true);
    try {
      const savedGraph = await saveGraph(title);
      setIsSaveOpen(false);
      // Update URL without full reload if possible, or use router to be safe
      // window.history.pushState(null, '', `/graph/${savedGraph.id}`);
      // Using router.push might trigger re-render of GraphPage if we were there, 
      // but since we are saving current state, we don't need to re-fetch.
      // However, cleanly, we just update URL.
      window.history.pushState(null, '', `/graph/${savedGraph.id}`);
    } catch (error) {
      console.error(error);
      alert('Failed to save graph: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };


  const handleLoad = (graph: SavedGraph) => {
      loadState(graph.data);
      setIsLoadOpen(false);
      // Optional: Update URL to match graph ID for sharing? 
      // router.push(`/graph/${graph.id}`); 
      // This would trigger a page reload or route change, potentially re-fetching.
      // If we just want to load the state, we can do it locally.
      // But for "User Story 3", deep linking is a goal (T024).
      // So pushing to router is good practice if we implement T024.
      router.push(`/graph/${graph.id}`);
  };

  if (!user) return null;

  return (
    <>
      <div className="flex gap-2">
        <button 
          onClick={() => setIsSaveOpen(true)}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Save
        </button>
        <button 
          onClick={() => setIsLoadOpen(true)}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Load
        </button>
      </div>

      <SaveModal 
        isOpen={isSaveOpen} 
        onClose={() => setIsSaveOpen(false)} 
        onSave={handleSave}
        loading={loading}
      />
      
      <LoadModal
        isOpen={isLoadOpen}
        onClose={() => setIsLoadOpen(false)}
        onLoad={handleLoad}
      />
    </>
  );
}
