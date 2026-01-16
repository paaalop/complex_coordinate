"use client";
import { useEffect } from 'react';
import { useStore } from '@/lib/store/useStore';
import { fetchGraphById } from '@/lib/services/graphService';
import { ComplexGraphEditor } from '@/components/graph/ComplexGraphEditor';
import { useRouter, useParams } from 'next/navigation';

export default function GraphPage() {
    const params = useParams();
    const id = params?.id as string;
    const loadState = useStore(state => state.loadState);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        
        fetchGraphById(id).then(graph => {
            if (graph) {
                loadState(graph.data);
            } else {
                // If not found, maybe just redirect to home or show error
                console.error('Graph not found');
                router.push('/');
            }
        });
    }, [id, loadState, router]);

    return <ComplexGraphEditor />;
}
