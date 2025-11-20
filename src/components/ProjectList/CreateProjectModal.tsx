import React from 'react';
import { Modal, Form, Input } from 'antd';

interface CreateProjectModalProps {
    open: boolean;
    onCancel: () => void;
    onCreate: (values: { name: string; description?: string }) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ open, onCancel, onCreate }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields().then((values) => {
            onCreate(values);
            form.resetFields();
        });
    };

    return (
        <Modal
            title="创建新项目"
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            okText="创建"
            cancelText="取消"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="项目名称"
                    rules={[{ required: true, message: '请输入项目名称' }]}
                >
                    <Input placeholder="例如: 支付系统配置" />
                </Form.Item>
                <Form.Item name="description" label="描述">
                    <Input.TextArea placeholder="项目描述..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateProjectModal;
