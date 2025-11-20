import React from 'react';
import { Select } from 'antd';
import { WidgetProps } from '@rjsf/utils';

// Custom widget for multi-select with search showing both value and label
const MultiSelectWidget: React.FC<WidgetProps> = (props) => {
    const { value, onChange, options, placeholder } = props;

    const enumOptions = options.enumOptions || [];

    // Format options to show both value and label
    const selectOptions = enumOptions.map((opt: any) => ({
        value: opt.value,
        label: `${opt.value} - ${opt.label}`,
        // For search: include both value and label
        searchText: `${opt.value} ${opt.label}`.toLowerCase()
    }));

    const handleChange = (selectedValues: string[]) => {
        onChange(selectedValues);
    };

    return (
        <Select
            mode="multiple"
            showSearch
            placeholder={placeholder || '请选择'}
            value={value || []}
            onChange={handleChange}
            style={{ width: '100%' }}
            filterOption={(input, option) => {
                const searchInput = input.toLowerCase();
                const optionData = selectOptions.find(opt => opt.value === option?.value);
                return optionData?.searchText.includes(searchInput) || false;
            }}
            options={selectOptions}
            maxTagCount="responsive"
        />
    );
};

export default MultiSelectWidget;
