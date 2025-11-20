import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { COUNTRY_CODE_OPTIONS, ICC_OPTIONS } from '../../constants/predefinedOptions';

interface FieldModalProps {
    open: boolean;
    onCancel: () => void;
    onOk: (values: any) => void;
    initialValues?: any;
    existingKeys: string[];
    isEdit: boolean;
}

const FieldModal: React.FC<FieldModalProps> = ({ open, onCancel, onOk, initialValues, existingKeys, isEdit }) => {
    const [form] = Form.useForm();
    const [fieldType, setFieldType] = useState<string>('string');

    useEffect(() => {
        if (open) {
            form.resetFields();
            if (initialValues) {
                // Detect alphanumeric type
                const displayType = initialValues.pattern === '^[a-zA-Z0-9]+$'
                    ? 'alphanumeric'
                    : initialValues.type || 'string';

                // Prepare object properties for editing
                const objectProperties = initialValues.type === 'object' && initialValues.properties
                    ? Object.entries(initialValues.properties).map(([key, value]: [string, any]) => ({
                        key,
                        title: value.title || '',
                        propType: value.type || 'string'
                    }))
                    : [];

                // Get array item type
                const arrayItemType = initialValues.type === 'array' && initialValues.items
                    ? initialValues.items.type || 'string'
                    : 'string';

                form.setFieldsValue({
                    ...initialValues,
                    type: displayType,
                    options: initialValues.enum?.map((value: string, index: number) => ({
                        key: value,
                        label: initialValues.enumNames?.[index] || value
                    })) || [],
                    objectProperties,
                    arrayItemType
                });
                setFieldType(displayType);
            } else {
                setFieldType('string');
            }
        }
    }, [open, initialValues, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const { options, objectProperties, arrayItemType, ...restValues } = values;

            // Handle enum type
            if (values.type === 'enum' && options && options.length > 0) {
                const enumValues = options.map((opt: any) => opt.key);
                const enumNames = options.map((opt: any) => opt.label);
                onOk({
                    ...restValues,
                    type: 'string',
                    enum: enumValues,
                    enumNames: enumNames
                });
            }
            // Handle alphanumeric type
            else if (values.type === 'alphanumeric') {
                onOk({
                    ...restValues,
                    type: 'string',
                    pattern: '^[a-zA-Z0-9]+$'
                });
            }
            // Handle country code type
            else if (values.type === 'countryCode') {
                const enumValues = COUNTRY_CODE_OPTIONS.map(opt => opt.value);
                const enumNames = COUNTRY_CODE_OPTIONS.map(opt => opt.label);
                onOk({
                    ...restValues,
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: enumValues,
                        enumNames: enumNames
                    },
                    uniqueItems: true,
                    // Add UI schema hint
                    _uiWidget: 'MultiSelectWidget'
                });
            }
            // Handle ICC type
            else if (values.type === 'icc') {
                const enumValues = ICC_OPTIONS.map(opt => opt.value);
                const enumNames = ICC_OPTIONS.map(opt => opt.label);
                onOk({
                    ...restValues,
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: enumValues,
                        enumNames: enumNames
                    },
                    uniqueItems: true,
                    // Add UI schema hint
                    _uiWidget: 'MultiSelectWidget'
                });
            }
            // Handle object type
            else if (values.type === 'object') {
                const properties: any = {};
                if (objectProperties && objectProperties.length > 0) {
                    objectProperties.forEach((prop: any) => {
                        properties[prop.key] = {
                            type: prop.propType || 'string',
                            title: prop.title || prop.key
                        };
                    });
                }
                onOk({
                    ...restValues,
                    type: 'object',
                    properties: properties
                });
            }
            // Handle array type
            else if (values.type === 'array') {
                onOk({
                    ...restValues,
                    type: 'array',
                    items: {
                        type: arrayItemType || 'string'
                    }
                });
            }
            else {
                onOk(restValues);
            }
        });
    };

    return (
        <Modal
            title={isEdit ? "编辑字段" : "添加字段"}
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            okText="确定"
            cancelText="取消"
            width={600}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="key"
                    label="字段名称 (Key)"
                    rules={[
                        { required: true, message: '请输入字段名称' },
                        { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线' },
                        () => ({
                            validator(_, value) {
                                if (!value || isEdit || !existingKeys.includes(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('字段名称已存在'));
                            },
                        }),
                    ]}
                >
                    <Input placeholder="例如: userName" disabled={isEdit} />
                </Form.Item>
                <Form.Item name="title" label="显示标题 (Title)">
                    <Input placeholder="例如: 用户名" />
                </Form.Item>
                <Form.Item name="type" label="字段类型" initialValue="string">
                    <Select onChange={(value) => setFieldType(value)}>
                        <Select.Option value="string">字符串 (String)</Select.Option>
                        <Select.Option value="alphanumeric">仅字母数字 (Alphanumeric)</Select.Option>
                        <Select.Option value="number">数字 (Number)</Select.Option>
                        <Select.Option value="boolean">布尔值 (Boolean)</Select.Option>
                        <Select.Option value="enum">选项 (Enum)</Select.Option>
                        <Select.Option value="countryCode">国家码 (Country Code)</Select.Option>
                        <Select.Option value="icc">ICC</Select.Option>
                        <Select.Option value="object">对象 (Object)</Select.Option>
                        <Select.Option value="array">数组 (Array)</Select.Option>
                    </Select>
                </Form.Item>

                {fieldType === 'enum' && (
                    <Form.Item label="选项配置">
                        <Form.List name="options">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'key']}
                                                rules={[{ required: true, message: '请输入选项值' }]}
                                                style={{ marginBottom: 0, width: 200 }}
                                            >
                                                <Input placeholder="选项值 (key)" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'label']}
                                                rules={[{ required: true, message: '请输入显示文案' }]}
                                                style={{ marginBottom: 0, width: 200 }}
                                            >
                                                <Input placeholder="显示文案 (label)" />
                                            </Form.Item>
                                            <DeleteOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        添加选项
                                    </Button>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>
                )}

                {fieldType === 'object' && (
                    <Form.Item label="对象属性配置">
                        <Form.List name="objectProperties">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'key']}
                                                rules={[{ required: true, message: '请输入属性名' }]}
                                                style={{ marginBottom: 0, width: 150 }}
                                            >
                                                <Input placeholder="属性名" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'title']}
                                                style={{ marginBottom: 0, width: 150 }}
                                            >
                                                <Input placeholder="显示名称" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'propType']}
                                                initialValue="string"
                                                style={{ marginBottom: 0, width: 120 }}
                                            >
                                                <Select placeholder="类型">
                                                    <Select.Option value="string">字符串</Select.Option>
                                                    <Select.Option value="number">数字</Select.Option>
                                                    <Select.Option value="boolean">布尔值</Select.Option>
                                                </Select>
                                            </Form.Item>
                                            <DeleteOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f' }} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        添加属性
                                    </Button>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>
                )}

                {fieldType === 'array' && (
                    <Form.Item label="数组元素类型" name="arrayItemType" initialValue="string">
                        <Select>
                            <Select.Option value="string">字符串</Select.Option>
                            <Select.Option value="number">数字</Select.Option>
                            <Select.Option value="boolean">布尔值</Select.Option>
                            <Select.Option value="object">对象</Select.Option>
                        </Select>
                    </Form.Item>
                )}

                <Form.Item name="description" label="描述">
                    <Input.TextArea rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FieldModal;
