import React from 'react';
import Form from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';
import { useAppStore } from '../../store/useAppStore';
import { ArrayFieldTemplateProps, RegistryWidgetsType } from '@rjsf/utils';
import { Button, Space, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import TagInputWidget from './widgets/TagInputWidget';
import TransferWidget from './widgets/TransferWidget';
import JsonStringWidget from './widgets/JsonStringWidget';
import MultiSelectWidget from './widgets/MultiSelectWidget';

const widgets: RegistryWidgetsType = {
    TagInputWidget: TagInputWidget,
    TransferWidget: TransferWidget,
    JsonStringWidget: JsonStringWidget,
    MultiSelectWidget: MultiSelectWidget
};

function ArrayFieldTemplate(props: ArrayFieldTemplateProps) {
    return (
        <div>
            {props.items.map((element) => (
                <div key={element.key} style={{ marginBottom: 10, border: '1px solid #eee', padding: 10, borderRadius: 4 }}>
                    <div style={{ marginBottom: 10 }}>{element.children}</div>
                    <Space>
                        <Button
                            icon={<ArrowUpOutlined />}
                            onClick={element.onReorderClick(element.index, element.index - 1)}
                            disabled={!element.hasMoveUp}
                            size="small"
                        >
                            上移
                        </Button>
                        <Button
                            icon={<ArrowDownOutlined />}
                            onClick={element.onReorderClick(element.index, element.index + 1)}
                            disabled={!element.hasMoveDown}
                            size="small"
                        >
                            下移
                        </Button>
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={element.onDropIndexClick(element.index)}
                            disabled={!element.hasRemove}
                            size="small"
                        >
                            删除
                        </Button>
                    </Space>
                </div>
            ))}
            {props.canAdd && (
                <div style={{ marginTop: 10 }}>
                    <Button type="dashed" onClick={props.onAddClick} icon={<PlusOutlined />} block>
                        添加项
                    </Button>
                </div>
            )}
        </div>
    );
}

const FormEngine: React.FC = () => {
    const { schema, uiSchema, formData, setFormData } = useAppStore();

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Form
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                validator={validator}
                onChange={(e) => setFormData(e.formData)} // Changed onChange handler
                widgets={widgets}
                templates={{ ArrayFieldTemplate }}
            >
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <Button type="primary" htmlType="submit">保存配置</Button> {/* Custom submit button */}
                </div>
            </Form>
        </div>
    );
};

export default FormEngine;
