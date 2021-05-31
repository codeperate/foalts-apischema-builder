import { IApiReference, IApiSchema } from "@foal/core";
import { classToClass, classToPlain, plainToClass } from "class-transformer";
import { ApiSchemaModel } from "./apischema-model";
export class ApiSchema<T = any> extends ApiSchemaModel {
    static parse<T>(plainObj: IApiSchema): ApiSchema<T> {
        return plainToClass(ApiSchema, plainObj)
    }
    copy(): ApiSchema<T> {
        return classToClass(this);
    }
    toPlain(): IApiSchema {
        return classToPlain(this);
    }
    pick(props: (keyof T)[] | RegExp, removeRequired: boolean = true): ApiSchema<T> {
        const schema = classToClass(this);
        if (!schema.properties)
            return schema;
        let required: string[] = [];
        for (const key in schema.properties) {
            const condition = Array.isArray(props) ? props.includes(key as keyof T) : key.match(props);
            if (!condition) {
                delete schema.properties[key];
                continue;
            }
            required.push(key);
        }
        if (schema.required && removeRequired)
            schema.required = required;
        return schema;
    }
    omit(props: (keyof T)[] | RegExp, removeRequired: boolean = true): ApiSchema<T> {
        const schema = classToClass(this);
        if (!schema.properties)
            return schema;
        const required: string[] = [];
        for (const key in schema.properties) {
            const condition = Array.isArray(props) ? props.includes(key as keyof T) : key.match(props);
            if (condition) {
                delete schema.properties[key];
                continue;
            }
            required.push(key);
        }
        if (schema.required && removeRequired)
            schema.required = required;
        return schema;
    }
    noRef(removeRequired: boolean = true): ApiSchema<T> {
        const schema = classToClass(this);
        const keyArr: string[] = [];
        if (!schema.properties)
            return schema;
        schema.properties = Object.keys(schema.properties).reduce((reducer, key) => {
            if (JSON.stringify(schema.properties![key]).indexOf("$ref") == -1)
                return { ...reducer, [key]: schema.properties![key] }
            keyArr.push(key);
            return reducer;
        }, {} as any)
        if (schema.required && removeRequired)
            schema.required = schema.required.filter((str) => !keyArr.includes(str))
        return schema
    }
    set(key: keyof ApiSchemaModel, value: any | ((curVal: any) => any)): ApiSchema<T> {
        const schema = classToClass(this);
        if (typeof value === "function")
            schema[key] = value(schema[key])
        else
            schema[key] = value;
        return schema;
    }
    setProp(key: keyof T, value: (IApiReference | IApiSchema) | ((curVal: IApiSchema | IApiReference) => (IApiReference | IApiSchema))): ApiSchema<T> {
        const schema = classToClass(this);
        if (typeof value === "function")
            schema.properties![(key as string)] = value(schema.properties![(key as any)])
        else
            schema.properties![(key as string)] = value
        return schema;
    }
    props(): (keyof T)[] {
        if (this.properties)
            return Object.keys(this.properties) as (keyof T)[];
        return [];
    }

}