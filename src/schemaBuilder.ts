import { IApiSchema } from '@foal/core';
import { plainToClass } from 'class-transformer';
import { ApiSchema } from './apischema';
export type IApiSchemaCollection = Record<string, IApiSchema>;
export type SchemaCollection<T extends Record<any, any> = any> = {
    [K in keyof T]: ApiSchema<T[K]>;
};
export type SchemaCollectionNS<T extends Record<any, any> = any> = {
    [K in keyof T]: ApiSchema<InstanceType<T[K]>>;
};
export type PrimaryKeyCollection = Record<string, string[]>;

export function parse(schema: IApiSchemaCollection): SchemaCollection {
    let res: SchemaCollection = {};
    for (const [key, value] of Object.entries(schema)) {
        res[key] = plainToClass(ApiSchema, value);
    }
    return res;
}

export function postParse(schema: IApiSchemaCollection, primaryKeys: PrimaryKeyCollection, omitFields: string[]): SchemaCollection {
    let res: SchemaCollection = {};
    for (const [key, value] of Object.entries(schema)) {
        const primaryKey = primaryKeys[key];
        res[key] = ApiSchema.parse(value).omit([...omitFields, ...(primaryKey ? primaryKey : [])]) as any;
    }
    return res;
}

export function patchParse(schema: IApiSchemaCollection, primaryKeys: PrimaryKeyCollection, omitFields: string[]): SchemaCollection {
    let res: SchemaCollection = {};
    for (const [key, value] of Object.entries(schema)) {
        const primaryKey = primaryKeys[key];
        res[key] = ApiSchema.parse(value)
            .set('required', [])
            .omit([...omitFields, ...(primaryKey ? primaryKey : [])]);
    }
    return res;
}
