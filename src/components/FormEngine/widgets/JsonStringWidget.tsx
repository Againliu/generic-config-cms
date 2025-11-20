import React, { useState, useEffect } from 'react';
import { WidgetProps } from '@rjsf/utils';
import Editor from '@monaco-editor/react';
import { Alert } from 'antd';

const JsonStringWidget: React.FC<WidgetProps> = ({ value, onChange, disabled, readonly }) => {
    const [editorValue, setEditorValue] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            // If value is already a string, try to parse it to format it nicely
            // If it's not a string (e.g. initial null/undefined), default to empty object
            const parsed = value ? JSON.parse(value) : {};
            setEditorValue(JSON.stringify(parsed, null, 2));
            setError(null);
        } catch (e) {
            // If value is a string but not valid JSON, just show it as is
            setEditorValue(value || '');
        }
    }, [value]);

    const handleEditorChange = (newValue: string | undefined) => {
        if (newValue === undefined) return;

        setEditorValue(newValue);
        try {
            const parsed = JSON.parse(newValue);
            // Store as minified JSON string
            onChange(JSON.stringify(parsed));
            setError(null);
        } catch (e) {
            setError('JSON 格式错误');
            // Don't call onChange if invalid, or maybe call with raw string if you want to allow invalid intermediate states?
            // For now, let's not propagate invalid JSON to the form data to avoid breaking the schema validation if it expects a specific format.
            // But wait, if the schema expects a string, any string is valid?
            // Usually we want to ensure it IS valid JSON.
        }
    };

    return (
        <div>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', overflow: 'hidden' }}>
                <Editor
                    height="300px"
                    defaultLanguage="json"
                    value={editorValue}
                    onChange={handleEditorChange}
                    options={{
                        readOnly: disabled || readonly,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        formatOnPaste: true,
                        automaticLayout: true,
                    }}
                />
            </div>
            {error && <Alert message={error} type="error" showIcon style={{ marginTop: '8px' }} />}
        </div>
    );
};

export default JsonStringWidget;
