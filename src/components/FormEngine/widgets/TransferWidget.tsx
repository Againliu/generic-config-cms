import React from 'react';
import { WidgetProps } from '@rjsf/utils';
import { Transfer } from 'antd';
import { TransferDirection } from 'antd/es/transfer';

const TransferWidget: React.FC<WidgetProps> = ({ value, onChange, disabled, readonly, options }) => {
    const targetKeys = value || [];
    const dataSource = (options.enumOptions || []).map((opt: any) => ({
        key: opt.value,
        title: opt.label,
    }));

    const handleChange = (newTargetKeys: React.Key[], _direction: TransferDirection, _moveKeys: React.Key[]) => {
        onChange(newTargetKeys);
    };

    return (
        <Transfer
            dataSource={dataSource}
            titles={['源列表', '已选列表']}
            targetKeys={targetKeys}
            onChange={handleChange}
            render={(item) => item.title}
            disabled={disabled || readonly}
            listStyle={{
                width: 250,
                height: 300,
            }}
        />
    );
};

export default TransferWidget;
