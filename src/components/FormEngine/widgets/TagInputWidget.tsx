import React from 'react';
import { WidgetProps } from '@rjsf/utils';
import { Select } from 'antd';

const TagInputWidget: React.FC<WidgetProps> = ({ value, onChange, disabled, readonly, options }) => {
    const handleChange = (newValue: string[]) => {
        onChange(newValue);
    };

    return (
        <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="输入内容并按回车添加"
            value={value || []}
            onChange={handleChange}
            disabled={disabled || readonly}
            tokenSeparators={[',']}
            options={options.enumOptions?.map((opt: any) => ({ label: opt.label, value: opt.value }))}
        />
    );
};

export default TagInputWidget;
