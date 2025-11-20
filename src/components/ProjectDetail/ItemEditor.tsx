import React, { useEffect, useRef } from 'react';
import { Drawer, Button, Space, message } from 'antd';
import { useAppStore } from '../../store/useAppStore';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';
import { IChangeEvent } from '@rjsf/core';
import TagInputWidget from '../FormEngine/widgets/TagInputWidget';
import TransferWidget from '../FormEngine/widgets/TransferWidget';
import JsonStringWidget from '../FormEngine/widgets/JsonStringWidget';
import MultiSelectWidget from '../FormEngine/widgets/MultiSelectWidget';

const widgets = {
    TagInputWidget,
    TransferWidget,
    JsonStringWidget,
    MultiSelectWidget
};

interface ItemEditorProps {
    open: boolean;
    onClose: () => void;
}

const ItemEditor: React.FC<ItemEditorProps> = ({ open, onClose }) => {
    const {
        projects,
        currentProjectId,
        currentEditingItemId,
        updateConfigItem,
        addConfigItem
    } = useAppStore();

    const project = projects.find(p => p.id === currentProjectId);
    const editingItem = project?.items.find(i => i.id === currentEditingItemId);

    // Local state for form data to handle edits before save
    const [formData, setFormData] = React.useState<any>({});
    const formRef = useRef<any>(null);

    useEffect(() => {
        if (open) {
            if (currentEditingItemId && editingItem) {
                setFormData(editingItem.data);
            } else {
                setFormData({});
            }
        }
    }, [open, currentEditingItemId, editingItem]);

    const handleSubmit = (data: IChangeEvent<any>) => {
        if (!project) return;

        // Data is already validated by RJSF at this point
        if (currentEditingItemId) {
            updateConfigItem(project.id, currentEditingItemId, data.formData);
            message.success('配置项更新成功');
        } else {
            addConfigItem(project.id, data.formData);
            message.success('配置项添加成功');
        }
        onClose();
    };

    const handleSave = () => {
        // Trigger form submission which will validate
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    if (!project) return null;

    // Build UI schema dynamically based on schema properties
    const uiSchema: any = {};
    if (project.schema.properties) {
        Object.entries(project.schema.properties).forEach(([key, value]: [string, any]) => {
            // Check if this field should use MultiSelectWidget
            if (value._uiWidget) {
                uiSchema[key] = {
                    'ui:widget': value._uiWidget
                };
            }
        });
    }

    return (
        <Drawer
            title={currentEditingItemId ? "编辑配置项" : "新建配置项"}
            width={720}
            onClose={onClose}
            open={open}
            extra={
                <Space>
                    <Button onClick={onClose}>取消</Button>
                    <Button type="primary" onClick={handleSave}>
                        保存
                    </Button>
                </Space>
            }
        >
            <Form
                ref={formRef}
                schema={project.schema}
                uiSchema={uiSchema}
                formData={formData}
                validator={validator}
                onChange={(e) => setFormData(e.formData)}
                onSubmit={handleSubmit}
                widgets={widgets}
                liveValidate={false}
                showErrorList={false}
                transformErrors={(errors) => {
                    return errors.map(error => {
                        // Customize error messages in Chinese
                        if (error.name === 'pattern') {
                            return { ...error, message: '格式不正确，只能包含字母和数字' };
                        }
                        if (error.name === 'required') {
                            return { ...error, message: '此项为必填项' };
                        }
                        if (error.name === 'type') {
                            return { ...error, message: '类型不正确' };
                        }
                        if (error.name === 'enum') {
                            return { ...error, message: '请选择有效的选项' };
                        }
                        if (error.name === 'minLength') {
                            return { ...error, message: `长度不能少于 ${error.params?.limit} 个字符` };
                        }
                        if (error.name === 'maxLength') {
                            return { ...error, message: `长度不能超过 ${error.params?.limit} 个字符` };
                        }
                        return error;
                    });
                }}
            >
                {/* Hide default submit button */}
                <div style={{ display: 'none' }}>
                    <button type="submit">Submit</button>
                </div>
            </Form>
        </Drawer>
    );
};

export default ItemEditor;
