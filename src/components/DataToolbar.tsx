import React from 'react';
import { Button, Space, Upload, message, Dropdown, MenuProps } from 'antd';
import { UploadOutlined, DownloadOutlined, FileTextOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';
import { featureFlagSchema, featureFlagUiSchema } from '../templates/featureFlagSchema';
import { environmentSchema, environmentUiSchema } from '../templates/environmentSchema';

const DataToolbar: React.FC = () => {
  const { formData, schema, setFormData, setSchema, setUiSchema } = useAppStore();

  const handleImportConfig = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setFormData(json);
        message.success('Configuration imported successfully');
      } catch (error) {
        message.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    return false; // Prevent upload
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSchema = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setSchema(json);
        message.success('Schema imported successfully');
      } catch (error) {
        message.error('Invalid JSON Schema file');
      }
    };
    reader.readAsText(file);
    return false;
  };

  const handleExportSchema = () => {
    const dataStr = JSON.stringify(schema, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schema.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const templateItems: MenuProps['items'] = [
    {
      key: 'feature-flag',
      label: '功能开关策略 (Feature Flag)',
      onClick: () => {
        setSchema(featureFlagSchema);
        setUiSchema(featureFlagUiSchema);
        setFormData({});
        message.success('已加载功能开关模板');
      }
    },
    {
      key: 'environment',
      label: '环境管理 (Environment)',
      onClick: () => {
        setSchema(environmentSchema);
        setUiSchema(environmentUiSchema);
        setFormData({});
        message.success('已加载环境管理模板');
      }
    }
  ];

  return (
    <Space>
      <Dropdown menu={{ items: templateItems }}>
        <Button icon={<AppstoreAddOutlined />}>加载模板</Button>
      </Dropdown>
      <Upload beforeUpload={handleImportConfig} showUploadList={false} accept=".json">
        <Button icon={<UploadOutlined />}>导入配置</Button>
      </Upload>
      <Button icon={<DownloadOutlined />} onClick={handleExportConfig}>导出配置</Button>

      <Upload beforeUpload={handleImportSchema} showUploadList={false} accept=".json">
        <Button icon={<FileTextOutlined />}>导入模型</Button>
      </Upload>
      <Button icon={<DownloadOutlined />} onClick={handleExportSchema}>导出模型</Button>
    </Space>
  );
};

export default DataToolbar;
