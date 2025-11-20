import React from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';
import ItemEditor from './ItemEditor';

const DataList: React.FC = () => {
    const {
        projects,
        currentProjectId,
        deleteConfigItem,
        setCurrentEditingItem
    } = useAppStore();

    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const project = projects.find(p => p.id === currentProjectId);

    if (!project) return null;

    const handleEdit = (id: string) => {
        setCurrentEditingItem(id);
        setIsDrawerOpen(true);
    };

    const handleCreate = () => {
        setCurrentEditingItem(null);
        setIsDrawerOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteConfigItem(project.id, id);
    };

    // Generate columns based on all schema properties
    const schemaProps = project.schema.properties || {};
    const columns = Object.keys(schemaProps).map(key => ({
        title: (schemaProps[key] as any).title || key,
        dataIndex: ['data', key],
        key: key,
        ellipsis: true,
        render: (text: any) => {
            if (text === undefined || text === null) return '-';
            if (typeof text === 'boolean') return text ? '是' : '否';
            if (typeof text === 'object') return JSON.stringify(text);
            if (typeof text === 'string' && text.length > 50) {
                return text.substring(0, 50) + '...';
            }
            return text;
        }
    }));

    columns.push({
        title: '操作',
        key: 'action',
        fixed: 'right' as const,
        width: 150,
        // @ts-ignore
        render: (_, record: any) => (
            <Space size="middle">
                <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>
                    编辑
                </Button>
                <Popconfirm
                    title="确认删除"
                    onConfirm={() => handleDelete(record.id)}
                    okText="删除"
                    cancelText="取消"
                >
                    <Button type="link" danger icon={<DeleteOutlined />}>
                        删除
                    </Button>
                </Popconfirm>
            </Space>
        ),
    });

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    添加配置项
                </Button>
            </div>
            <Table
                dataSource={project.items}
                columns={columns}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{ pageSize: 10 }}
            />
            <ItemEditor
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
};

export default DataList;
