import { Class, IApiSchema } from "@foal/core";
import { plainToClass } from "class-transformer";
const defaultMetadataStorage = require("class-transformer/cjs/storage");
import { ValidationTypes } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { ApiSchema } from "./apischema";
export type SchemaCollection = { [key: string]: ApiSchema<any> }
export class SchemaService {
    schemas: SchemaCollection = {}
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
            this.schemas[key] = plainToClass(ApiSchema, value);
        }
    }
    get<T>(ClassOrString: Class<T> | string): ApiSchema<T> {
        if (typeof ClassOrString == "string")
            return this.schemas[ClassOrString]
        else
            return this.schemas[ClassOrString.name]
    }
    getAll(): SchemaCollection {
        return this.schemas;
    }
    deRef<T>(ref: string): ApiSchema<T> {
        return this.schemas[ref.replace(this.ref, "")]
    }
}