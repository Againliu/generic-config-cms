import React from 'react';
import { Layout, Tabs, Button, Breadcrumb, Space, message } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';
import SchemaDesigner from '../SchemaDesigner/SchemaDesigner';
import DataList from './DataList';

const { Content } = Layout;

const ProjectDetail: React.FC = () => {
    const { projects, currentProjectId, setCurrentProject } = useAppStore();
    const project = projects.find(p => p.id === currentProjectId);

    if (!project) return <div>项目未找到</div>;

    const handleExport = () => {
        try {
            if (!project.items || project.items.length === 0) {
                message.warning('当前项目没有配置项，无法导出');
                return;
            }

            const exportData = project.items.map(item => item.data);
            const dataStr = JSON.stringify(exportData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });

            // Generate safe filename
            const safeName = project.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const fileName = `${safeName}_config_${timestamp}.json`;

            // Try modern download API first
            if ((window as any).showSaveFilePicker) {
                // Modern File System Access API (Chrome/Edge)
                (window as any).showSaveFilePicker({
                    suggestedName: fileName,
                    types: [{
                        description: 'JSON Files',
                        accept: { 'application/json': ['.json'] }
                    }]
                }).then(async (handle: any) => {
                    const writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                    message.success({
                        content: `成功导出 ${project.items.length} 条配置到: ${fileName}`,
                        duration: 5
                    });
                }).catch((err: any) => {
                    if (err.name !== 'AbortError') {
                        console.error('Save file picker error:', err);
                        fallbackDownload();
                    }
                });
            } else {
                // Fallback for other browsers
                fallbackDownload();
            }

            function fallbackDownload() {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.style.display = 'none';

                document.body.appendChild(link);
                link.click();

                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, 100);

                message.success({
                    content: (
                        <div>
                            <div>已触发下载: {fileName}</div>
                            <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
                                请检查浏览器下载栏或下载文件夹
                            </div>
                        </div>
                    ),
                    duration: 8
                });

                console.log('Export triggered:', {
                    fileName,
                    itemCount: project?.items?.length || 0,
                    downloadPath: '浏览器默认下载目录'
                });
            }
        } catch (error) {
            console.error('Export failed:', error);
            message.error({
                content: (
                    <div>
                        <div>导出失败</div>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>
                            错误: {(error as Error).message}
                        </div>
                    </div>
                ),
                duration: 5
            });
        }
    };

    const items = [
        {
            key: 'data',
            label: '数据管理',
            children: <DataList />,
        },
        {
            key: 'schema',
            label: '字段管理',
            children: <SchemaDesigner />,
        },
    ];

    return (
        <Layout style={{ height: '100%', background: '#fff' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Breadcrumb items={[
                        { title: <a onClick={() => setCurrentProject(null)}>项目列表</a> },
                        { title: project.name }
                    ]} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Button icon={<ArrowLeftOutlined />} onClick={() => setCurrentProject(null)} />
                            <h2 style={{ margin: 0 }}>{project.name}</h2>
                        </div>
                        <Button icon={<DownloadOutlined />} onClick={handleExport}>
                            导出项目配置
                        </Button>
                    </div>
                </Space>
            </div>
            <Content style={{ padding: '0 24px', height: 'calc(100vh - 120px)', overflow: 'auto' }}>
                <Tabs defaultActiveKey="data" items={items} />
            </Content>
        </Layout>
    );
};

export default ProjectDetail;
