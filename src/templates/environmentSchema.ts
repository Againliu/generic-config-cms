import { RJSFSchema, UiSchema } from '@rjsf/utils';

export const environmentSchema: RJSFSchema = {
    title: "环境管理配置",
    type: "object",
    properties: {
        environments: {
            type: "array",
            title: "环境列表",
            items: {
                type: "object",
                properties: {
                    name: { type: "string", title: "环境名称", enum: ["dev", "staging", "prod"] },
                    nodes: {
                        type: "array",
                        title: "节点列表",
                        items: {
                            type: "object",
                            properties: {
                                region: { type: "string", title: "区域" },
                                url: { type: "string", title: "服务地址", format: "uri" },
                                capacity: { type: "number", title: "容量" }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const environmentUiSchema: UiSchema = {
    environments: {
        items: {
            nodes: {
                items: {
                    "ui:order": ["region", "url", "capacity"]
                }
            }
        }
    }
};
