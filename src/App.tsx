import React from 'react';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useAppStore } from './store/useAppStore';
import ProjectList from './components/ProjectList/ProjectList';
import ProjectDetail from './components/ProjectDetail/ProjectDetail';

function App() {
    const { currentProjectId } = useAppStore();

    return (
        <ConfigProvider locale={zhCN}>
            <Layout style={{ minHeight: '100vh' }}>
                {currentProjectId ? <ProjectDetail /> : <ProjectList />}
            </Layout>
        </ConfigProvider>
    );
}

export default App;
