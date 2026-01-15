"use client";

import { ComplexPlane } from "@/components/graph/ComplexPlane";
import { ExpressionInput } from "@/components/input/ExpressionInput";
import { VariableList } from "@/components/input/VariableList";
import { useAnimation } from "@/lib/hooks/useAnimation";
import { usePersistence } from "@/lib/hooks/usePersistence";
import { ViewControls } from "@/components/graph/ViewControls";

export default function Home() {
  useAnimation(); // Start animation loop
  usePersistence(); // Sync state with URL

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50 text-gray-900 overflow-hidden">
      {/* Sidebar: Input & Controls */}
      <aside className="w-full md:w-96 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200 bg-white p-6 overflow-y-auto max-h-[40vh] md:max-h-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Complex Graph</h1>
        
        <div className="space-y-6">
            <section>
                <ExpressionInput />
            </section>
            
            <section className="mt-8 pt-8 border-t border-gray-100">
                <VariableList />
            </section>
        </div>
      </aside>

      {/* Right Panel: Graph Canvas */}
      <main className="flex-1 p-4 relative">
        <ViewControls />
        <ComplexPlane />
      </main>
    </div>
  );
}
