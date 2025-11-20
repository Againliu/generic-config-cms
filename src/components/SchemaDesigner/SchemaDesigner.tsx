import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';
import { RJSFSchema } from '@rjsf/utils';
import FieldModal from './FieldModal';

const SchemaDesigner: React.FC = () => {
    const { projects, currentProjectId, updateProjectSchema } = useAppStore();
    const project = projects.find(p => p.id === currentProjectId);

    // Local state for schema editing
    const [localSchema, setLocalSchema] = useState<RJSFSchema>(
        project?.schema || { type: 'object', properties: {} }
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKey, setEditingKey] = useState<string | null>(null);

    // Update local schema when project changes
    React.useEffect(() => {
        if (project) {
            setLocalSchema(project.schema);
        }
    }, [project?.id]);

    const handleAdd = () => {
        setEditingKey(null);
        setIsModalOpen(true);
    };

    const handleEdit = (key: string) => {
        setEditingKey(key);
        setIsModalOpen(true);
    };

    const handleDelete = (key: string) => {
        const newProperties = { ...localSchema.properties };
        delete newProperties[key];
        const updatedSchema = {
            ...localSchema,
            properties: newProperties
        };
        setLocalSchema(updatedSchema);

        // Auto-save to store immediately
        if (currentProjectId && project) {
            updateProjectSchema(currentProjectId, updatedSchema, project.uiSchema);
            message.success('字段删除成功');
        }
    };

    const handleMoveUp = (key: string) => {
        const keys = Object.keys(localSchema.properties || {});
        const index = keys.indexOf(key);

        if (index > 0) {
            // Swap with previous
            const newKeys = [...keys];
            [newKeys[index - 1], newKeys[index]] = [newKeys[index], newKeys[index - 1]];

            // Rebuild properties in new order
            const newProperties: any = {};
            newKeys.forEach(k => {
                newProperties[k] = localSchema.properties![k];
            });

            const updatedSchema = {
                ...localSchema,
                properties: newProperties
            };
            setLocalSchema(updatedSchema);

            // Auto-save
            if (currentProjectId && project) {
                updateProjectSchema(currentProjectId, updatedSchema, project.uiSchema);
                message.success('字段上移成功');
            }
        }
    };

    const handleMoveDown = (key: string) => {
        const keys = Object.keys(localSchema.properties || {});
        const index = keys.indexOf(key);

        if (index < keys.length - 1) {
            // Swap with next
            const newKeys = [...keys];
            [newKeys[index], newKeys[index + 1]] = [newKeys[index + 1], newKeys[index]];

            // Rebuild properties in new order
            const newProperties: any = {};
            newKeys.forEach(k => {
                newProperties[k] = localSchema.properties![k];
            });

            const updatedSchema = {
                ...localSchema,
                properties: newProperties
            };
            setLocalSchema(updatedSchema);

            // Auto-save
            if (currentProjectId && project) {
                updateProjectSchema(currentProjectId, updatedSchema, project.uiSchema);
                message.success('字段下移成功');
            }
        }
    };

    const handleModalOk = (values: any) => {
        const { key, ...fieldData } = values;
        const newProperties = { ...localSchema.properties };

        if (editingKey) {
            // Edit existing
            newProperties[key] = { ...newProperties[key], ...fieldData };
        } else {
            // Add new
            newProperties[key] = fieldData;
        }

        const updatedSchema = {
            ...localSchema,
            properties: newProperties
        };

        setLocalSchema(updatedSchema);

        // Auto-save to store immediately
        if (currentProjectId && project) {
            updateProjectSchema(currentProjectId, updatedSchema, project.uiSchema);
            message.success(editingKey ? '字段更新成功' : '字段添加成功');
        }

        setIsModalOpen(false);
    };

    const fieldKeys = Object.keys(localSchema.properties || {});

    const columns = [
        {
            title: '排序',
            key: 'order',
            width: 100,
            render: (_: any, record: any) => {
                const index = fieldKeys.indexOf(record.key);
                return (
                    <Space size="small">
                        <Button
                            type="text"
                            size="small"
                            icon={<ArrowUpOutlined />}
                            onClick={() => handleMoveUp(record.key)}
                            disabled={index === 0}
                            title="上移"
                        />
                        <Button
                            type="text"
                            size="small"
                            icon={<ArrowDownOutlined />}
                            onClick={() => handleMoveDown(record.key)}
                            disabled={index === fieldKeys.length - 1}
                            title="下移"
                        />
                    </Space>
                );
            },
        },
        {
            title: '字段名称 (Key)',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: '显示标题 (Title)',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '类型 (Type)',
            dataIndex: 'type',
            key: 'type',
            render: (type: string, record: any) => {
                // Check for special array types (countryCode, icc)
                if (type === 'array' && record.items?.enum) {
                    // Check if it matches country code or ICC by comparing enum length
                    if (record.items.enum.length === 249) {
                        return '国家码';
                    } else if (record.items.enum.length === 228) {
                        return 'ICC';
                    }
                    return '数组 (多选)';
                }
                if (record.enum) {
                    return '选项 (Enum)';
                }
                if (record.pattern === '^[a-zA-Z0-9]+$') {
                    return '仅字母数字';
                }
                const typeMap: Record<string, string> = {
                    string: '字符串',
                    number: '数字',
                    boolean: '布尔值',
                    object: '对象',
                    array: '数组'
                };
                return typeMap[type] || type;
            }
        },
        {
            title: '描述 (Description)',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.key)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="确认删除"
                        onConfirm={() => handleDelete(record.key)}
                        okText="删除"
                        cancelText="取消"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const dataSource = Object.entries(localSchema.properties || {}).map(([key, value]: [string, any]) => ({
        key,
        title: value.title || '-',
        type: value.type,
        description: value.description || '-',
        enum: value.enum,
        pattern: value.pattern,
        items: value.items
    }));

    const existingKeys = Object.keys(localSchema.properties || {});
    const currentField = editingKey ? { key: editingKey, ...localSchema.properties?.[editingKey] as any } : undefined;

    return (
        <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    添加字段
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                rowKey="key"
            />

            <FieldModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleModalOk}
                initialValues={currentField}
                existingKeys={existingKeys}
                isEdit={!!editingKey}
            />
        </div>
    );
};

export default SchemaDesigner;
