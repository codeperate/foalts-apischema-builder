import { ApiDefineSchema, Class, IApiSchema } from "@foal/core";
import { plainToClass } from "class-transformer";
const defaultMetadataStorage = require("class-transformer/cjs/storage");
import { ValidationTypes } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { ApiSchema } from "./apischema";
export type SchemaCollection = { [key: string]: ApiSchema }
export type SchemaCollections = {
    [key: string]: SchemaCollection
}
export class SchemaService {
    schemas: SchemaCollections = {}
    constructor(public ref: string = "#/components/schemas/") {

    }
    async boot(schemas: { [key: string]: IApiSchema }) {
        if (!schemas) {
            schemas = validationMetadatasToSchemas({
                classTransformerMetadataStorage: defaultMetadataStorage,
                refPointerPrefix: this.ref,
                additionalConverters: {
                    [ValidationTypes.CONDITIONAL_VALIDATION]: {
                        nullable: true
                    }
                }
            }) as { [key: string]: IApiSchema }
        }
        for (const [key, value] of Object.entries(schemas)) {
            this.schemas["entity"]![key] = plainToClass(ApiSchema, value);
        }
    }
    transform(fn: (key: string, value: ApiSchema) => ApiSchema, path: string = "entity") {
        for (const [key, value] of Object.entries(this.schemas["entity"]!)) {
            this.schemas[path]![key] = fn(key, value.copy())
        }
    }
    get<T>(ClassOrString: Class<T> | string, path: string = "entity"): ApiSchema<T> {
        if (typeof ClassOrString == "string")
            return this.schemas[path]![ClassOrString]
        else
            return this.schemas[path]![ClassOrString.name]
    }
    getAll(path: string = "entity"): SchemaCollection {
        return this.schemas[path]!;
    }
    deRef<T>(ref: string, path: string = "entity"): ApiSchema<T> {
        return this.schemas[path]![ref.replace(this.ref, "")]
    }
    defineAllSchemas(target: Class, path: string = "entity") {
        for (const key in this.schemas[path]) {
            ApiDefineSchema(key, this.schemas[path][key])(target)
        }
    }
}