"use client";

import { ComplexPlane } from "@/components/graph/ComplexPlane";
import { ExpressionInput } from "@/components/input/ExpressionInput";
import { VariableList } from "@/components/input/VariableList";
import { useAnimation } from "@/lib/hooks/useAnimation";
import { usePersistence } from "@/lib/hooks/usePersistence";
import { ViewControls } from "@/components/graph/ViewControls";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserProfile } from "@/components/auth/UserProfile";
import { AuthButton } from "@/components/auth/AuthButton";
import { SaveLoadControls } from "@/components/auth/SaveLoadControls";

export function ComplexGraphEditor() {
  useAnimation(); // Start animation loop
  usePersistence(); // Sync state with URL
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50 text-gray-900 overflow-hidden">
      {/* Sidebar: Input & Controls */}
      <aside className="w-full md:w-96 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200 bg-white p-6 overflow-y-auto max-h-[40vh] md:max-h-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Complex Graph</h1>
        
        <div className="mb-6 pb-6 border-b border-gray-100">
            <div className="flex flex-col gap-3">
                <UserProfile user={user} />
                <div className="flex justify-between items-center gap-2">
                    <AuthButton 
                        signIn={signInWithGoogle} 
                        signOut={signOut} 
                        user={user} 
                        loading={loading} 
                    />
                    <SaveLoadControls />
                </div>
            </div>
        </div>

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
