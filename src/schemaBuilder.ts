import { plainToClass } from 'class-transformer';
import { ApiSchema } from './apischema';

export type SchemaCollection = Record<string, ApiSchema>;
export type PrimaryKeyCollection = Record<string, string[]>;

export function parse(schema: SchemaCollection): SchemaCollection {
    let res: SchemaCollection = {};
    for (const [key, value] of Object.entries(schema)) {
        res[key] = plainToClass(ApiSchema, value);
    }
    return res;
}

export function postParse(schema: SchemaCollection, primaryKeys: PrimaryKeyCollection, omitFields: string[]): SchemaCollection {
    let res: SchemaCollection = {};
    for (const [key, value] of Object.entries(schema)) {
        const primaryKey = primaryKeys[key];
        res[key] = ApiSchema.parse<any>(value as any).omit([...omitFields, ...(primaryKey ? primaryKey : [])]) as any;
    }
    return res;
}

export function patchParse(schema: SchemaCollection, primaryKeys: PrimaryKeyCollection, omitFields: string[]): SchemaCollection {
    let res: SchemaCollection = {};
    for (const [key, value] of Object.entries(schema)) {
        const primaryKey = primaryKeys[key];
        res[key] = ApiSchema.parse<any>(value as any)
            .set('required', [])
            .omit([...omitFields, ...(primaryKey ? primaryKey : [])]);
    }
    return res;
}
