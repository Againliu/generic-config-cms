import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../useAppStore';

describe('useAppStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useAppStore.setState({
            projects: [],
            currentProjectId: null,
            currentEditingItemId: null,
        });
    });

    describe('Project Management', () => {
        it('should add a new project', () => {
            const { addProject } = useAppStore.getState();

            addProject('Test Project', 'Test Description');

            const state = useAppStore.getState();
            expect(state.projects).toHaveLength(1);
            expect(state.projects[0].name).toBe('Test Project');
            expect(state.projects[0].description).toBe('Test Description');
            expect(state.projects[0].schema).toEqual({ type: 'object', properties: {} });
            expect(state.projects[0].items).toEqual([]);
        });

        it('should set current project after adding', () => {
            const { addProject } = useAppStore.getState();

            addProject('Test Project');

            const state = useAppStore.getState();
            expect(state.currentProjectId).toBe(state.projects[0].id);
        });

        it('should delete a project', () => {
            const { addProject, deleteProject } = useAppStore.getState();

            addProject('Project 1');
            addProject('Project 2');

            const projectId = useAppStore.getState().projects[0].id;
            deleteProject(projectId);

            const state = useAppStore.getState();
            expect(state.projects).toHaveLength(1);
            expect(state.projects[0].name).toBe('Project 2');
        });

        it('should update project schema', () => {
            const { addProject, updateProjectSchema } = useAppStore.getState();

            addProject('Test Project');
            const projectId = useAppStore.getState().projects[0].id;

            const newSchema = {
                type: 'object',
                properties: {
                    name: { type: 'string', title: 'Name' }
                }
            };

            updateProjectSchema(projectId, newSchema);

            const state = useAppStore.getState();
            expect(state.projects[0].schema).toEqual(newSchema);
        });
    });

    describe('Config Item Management', () => {
        it('should add a config item to a project', () => {
            const { addProject, addConfigItem } = useAppStore.getState();

            addProject('Test Project');
            const projectId = useAppStore.getState().projects[0].id;

            const configData = { name: 'Test Config' };
            addConfigItem(projectId, configData);

            const state = useAppStore.getState();
            expect(state.projects[0].items).toHaveLength(1);
            expect(state.projects[0].items[0].data).toEqual(configData);
        });

        it('should update a config item', () => {
            const { addProject, addConfigItem, updateConfigItem } = useAppStore.getState();

            addProject('Test Project');
            const projectId = useAppStore.getState().projects[0].id;

            addConfigItem(projectId, { name: 'Original' });
            const itemId = useAppStore.getState().projects[0].items[0].id;

            updateConfigItem(projectId, itemId, { name: 'Updated' });

            const state = useAppStore.getState();
            expect(state.projects[0].items[0].data.name).toBe('Updated');
        });

        it('should delete a config item', () => {
            const { addProject, addConfigItem, deleteConfigItem } = useAppStore.getState();

            addProject('Test Project');
            const projectId = useAppStore.getState().projects[0].id;

            addConfigItem(projectId, { name: 'Item 1' });
            addConfigItem(projectId, { name: 'Item 2' });

            const itemId = useAppStore.getState().projects[0].items[0].id;
            deleteConfigItem(projectId, itemId);

            const state = useAppStore.getState();
            expect(state.projects[0].items).toHaveLength(1);
            expect(state.projects[0].items[0].data.name).toBe('Item 2');
        });
    });
});
