import React from 'react';
import { Tree } from 'antd';
import { RJSFSchema } from '@rjsf/utils';
import { DownOutlined } from '@ant-design/icons';

interface SchemaTreeProps {
    schema: RJSFSchema;
    onSelect: (key: string) => void;
    selectedKey: string | null;
}

const SchemaTree: React.FC<SchemaTreeProps> = ({ schema, onSelect, selectedKey }) => {
    const treeData = [
        {
            title: '根对象',
            key: 'root',
            children: Object.entries(schema.properties || {}).map(([key, value]) => ({
                title: (value as any).title ? `${(value as any).title} (${key})` : key,
                key: key,
                isLeaf: true // For now, treat all first-level properties as leaves for simplicity
            }))
        }
    ];

    return (
        <div style={{ padding: '12px' }}>
            <Tree
                showLine
                switcherIcon={<DownOutlined />}
                defaultExpandAll
                treeData={treeData}
                selectedKeys={selectedKey ? [selectedKey] : []}
                onSelect={(selectedKeys) => {
                    if (selectedKeys.length > 0 && selectedKeys[0] !== 'root') {
                        onSelect(selectedKeys[0] as string);
                    }
                }}
            />
        </div>
    );
};

export default SchemaTree;
