import { useEffect, useState } from 'react';
import { fetchGraphs } from '@/lib/services/graphService';
import { SavedGraph } from '@/lib/types';

interface LoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (graph: SavedGraph) => void;
}

export function LoadModal({ isOpen, onClose, onLoad }: LoadModalProps) {
  const [graphs, setGraphs] = useState<SavedGraph[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setLoading(true);
        fetchGraphs()
            .then(setGraphs)
            .catch(console.error)
            .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md h-[80vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4">Load Graph</h2>
        
        <div className="flex-1 overflow-y-auto min-h-0 space-y-2 mb-4">
            {loading ? (
                <p>Loading...</p>
            ) : graphs.length === 0 ? (
                <p className="text-gray-500">No saved graphs found.</p>
            ) : (
                graphs.map(graph => (
                    <button
                        key={graph.id}
                        onClick={() => onLoad(graph)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors group"
                    >
                        <div className="font-medium text-gray-900 group-hover:text-blue-600">{graph.title}</div>
                        <div className="text-xs text-gray-500">{new Date(graph.updated_at).toLocaleString()}</div>
                    </button>
                ))
            )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
