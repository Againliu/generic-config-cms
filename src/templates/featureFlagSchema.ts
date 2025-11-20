import { RJSFSchema, UiSchema } from '@rjsf/utils';

export const featureFlagSchema: RJSFSchema = {
    title: "功能开关配置",
    type: "object",
    properties: {
        features: {
            type: "array",
            title: "功能列表",
            items: {
                type: "object",
                properties: {
                    name: { type: "string", title: "功能名称" },
                    enabled: { type: "boolean", title: "是否启用", default: false },
                    solutions: {
                        type: "array",
                        title: "策略方案",
                        items: {
                            type: "object",
                            properties: {
                                solutionName: { type: "string", title: "方案名称" },
                                conditions: {
                                    type: "object",
                                    title: "生效条件",
                                    properties: {
                                        countries: {
                                            type: "array",
                                            title: "国家/地区",
                                            items: { type: "string" },
                                            uniqueItems: true
                                        },
                                        endpoints: {
                                            type: "array",
                                            title: "端点 (Endpoints)",
                                            items: { type: "string" },
                                            uniqueItems: true
                                        }
                                    }
                                },
                                config: {
                                    type: "string",
                                    title: "Configuration (JSON)",
                                    default: "{}"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const featureFlagUiSchema: UiSchema = {
    features: {
        items: {
            solutions: {
                items: {
                    conditions: {
                        countries: {
                            "ui:widget": "TagInputWidget"
                        }
                    },
                    config: {
                        "ui:widget": "JsonStringWidget"
                    }
                }
            }
        }
    }
};
