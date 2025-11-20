import React, { useEffect } from 'react';
import { Form, Input, Select, Card } from 'antd';

interface FieldEditorProps {
    fieldKey: string;
    fieldSchema: any;
    onChange: (key: string, data: any) => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ fieldKey, fieldSchema, onChange }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            key: fieldKey,
            title: fieldSchema.title,
            type: fieldSchema.type,
            description: fieldSchema.description,
            // TODO: Handle required
        });
    }, [fieldKey, fieldSchema]);

    const handleValuesChange = (_changedValues: any, allValues: any) => {
        const { key, ...schemaData } = allValues;
        onChange(key, schemaData);
    };

    return (
        <Card title="字段属性" bordered={false}>
            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
            >
                <Form.Item
                    name="key"
                    label="字段名称 (Key)"
                    rules={[{ required: true, message: '请输入字段名称' }]}
                >
                    <Input placeholder="例如: userName" />
                </Form.Item>
                <Form.Item name="title" label="显示标题 (Title)">
                    <Input placeholder="例如: 用户名" />
                </Form.Item>
                <Form.Item name="type" label="字段类型">
                    <Select>
                        <Select.Option value="string">字符串 (String)</Select.Option>
                        <Select.Option value="number">数字 (Number)</Select.Option>
                        <Select.Option value="boolean">布尔值 (Boolean)</Select.Option>
                        <Select.Option value="object">对象 (Object)</Select.Option>
                        <Select.Option value="array">数组 (Array)</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="description" label="描述">
                    <Input.TextArea rows={3} />
                </Form.Item>
            </Form>
        </Card>
    );
};

export default FieldEditor;
