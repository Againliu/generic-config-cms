import { create } from 'zustand';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { persist } from 'zustand/middleware';

export interface ConfigItem {
    id: string;
    data: any;
    createdAt: number;
    updatedAt: number;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    schema: RJSFSchema;
    uiSchema: UiSchema;
    items: ConfigItem[];
}

interface AppState {
    projects: Project[];
    currentProjectId: string | null;
    currentEditingItemId: string | null;

    // Actions
    addProject: (name: string, description?: string) => void;
    deleteProject: (id: string) => void;
    setCurrentProject: (id: string | null) => void;

    updateProjectSchema: (projectId: string, schema: RJSFSchema, uiSchema?: UiSchema) => void;

    addConfigItem: (projectId: string, data: any) => void;
    updateConfigItem: (projectId: string, itemId: string, data: any) => void;
    deleteConfigItem: (projectId: string, itemId: string) => void;

    setCurrentEditingItem: (itemId: string | null) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            projects: [],
            currentProjectId: null,
            currentEditingItemId: null,

            addProject: (name, description) => set((state) => {
                const newProject: Project = {
                    id: crypto.randomUUID(),
                    name,
                    description,
                    schema: { type: 'object', properties: {} },
                    uiSchema: {},
                    items: []
                };
                return { projects: [...state.projects, newProject], currentProjectId: newProject.id };
            }),

            deleteProject: (id) => set((state) => ({
                projects: state.projects.filter((p) => p.id !== id),
                currentProjectId: state.currentProjectId === id ? null : state.currentProjectId
            })),

            setCurrentProject: (id) => set({ currentProjectId: id }),

            updateProjectSchema: (projectId, schema, uiSchema) => set((state) => ({
                projects: state.projects.map((p) =>
                    p.id === projectId
                        ? { ...p, schema, uiSchema: uiSchema || p.uiSchema }
                        : p
                )
            })),

            addConfigItem: (projectId, data) => set((state) => ({
                projects: state.projects.map((p) => {
                    if (p.id !== projectId) return p;
                    const newItem: ConfigItem = {
                        id: crypto.randomUUID(),
                        data,
                        createdAt: Date.now(),
                        updatedAt: Date.now()
                    };
                    return { ...p, items: [...p.items, newItem] };
                })
            })),

            updateConfigItem: (projectId, itemId, data) => set((state) => ({
                projects: state.projects.map((p) => {
                    if (p.id !== projectId) return p;
                    return {
                        ...p,
                        items: p.items.map((item) =>
                            item.id === itemId
                                ? { ...item, data, updatedAt: Date.now() }
                                : item
                        )
                    };
                })
            })),

            deleteConfigItem: (projectId, itemId) => set((state) => ({
                projects: state.projects.map((p) => {
                    if (p.id !== projectId) return p;
                    return { ...p, items: p.items.filter((item) => item.id !== itemId) };
                })
            })),

            setCurrentEditingItem: (itemId) => set({ currentEditingItemId: itemId }),
        }),
        {
            name: 'generic-config-cms-storage',
        }
    )
);
