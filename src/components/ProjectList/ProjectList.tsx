import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography, Empty, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';
import CreateProjectModal from './CreateProjectModal';

const { Title, Paragraph } = Typography;

const ProjectList: React.FC = () => {
    const { projects, addProject, deleteProject, setCurrentProject } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreate = (values: { name: string; description?: string }) => {
        addProject(values.name, values.description);
        setIsModalOpen(false);
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0 }}>项目列表</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    新建项目
                </Button>
            </div>

            {projects.length === 0 ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无项目，请点击右上角创建"
                >
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>
                        创建第一个项目
                    </Button>
                </Empty>
            ) : (
                <Row gutter={[16, 16]}>
                    {projects.map((project) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={project.id}>
                            <Card
                                hoverable
                                actions={[
                                    <Button type="link" icon={<FolderOpenOutlined />} onClick={() => setCurrentProject(project.id)}>
                                        打开
                                    </Button>,
                                    <Popconfirm
                                        title="确认删除"
                                        description="删除后无法恢复，确定要删除该项目吗？"
                                        onConfirm={() => deleteProject(project.id)}
                                        okText="删除"
                                        cancelText="取消"
                                    >
                                        <Button type="link" danger icon={<DeleteOutlined />}>
                                            删除
                                        </Button>
                                    </Popconfirm>
                                ]}
                            >
                                <Card.Meta
                                    title={project.name}
                                    description={
                                        <Paragraph ellipsis={{ rows: 2 }} style={{ height: 44, marginBottom: 0 }}>
                                            {project.description || '暂无描述'}
                                        </Paragraph>
                                    }
                                />
                                <div style={{ marginTop: 12, color: '#888', fontSize: 12 }}>
                                    配置项数量: {project.items.length}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <CreateProjectModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onCreate={handleCreate}
            />
        </div>
    );
};

export default ProjectList;
