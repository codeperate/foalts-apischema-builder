import { Class } from "@foal/core";
import { plainToClass } from "class-transformer";
const defaultMetadataStorage = require("class-transformer/cjs/storage");
import { ValidationTypes } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { ApiSchema } from "./apischema";

export class SchemaService {
    schemas: { [key: string]: ApiSchema } = {}
    constructor(public ref: string = "#/components/schemas/") { }
    async boot() {
        const schemas = validationMetadatasToSchemas({
            classTransformerMetadataStorage: defaultMetadataStorage,
            refPointerPrefix: this.ref,
            additionalConverters: {
                [ValidationTypes.CONDITIONAL_VALIDATION]: {
                    nullable: true
                }
            }
        })
        for (const [key, value] of Object.entries(schemas)) {
            this.schemas[key] = plainToClass(ApiSchema, value);
        }
    }
    get<T>(fnOrString: Class | string): ApiSchema<T> {
        if (typeof fnOrString == "string")
            return this.schemas[fnOrString]
        else
            return this.schemas[fnOrString.name]
    }
    getAll(): { [key: string]: ApiSchema<any> } {
        return this.schemas;
    }
    deRef<T>(ref: string,): ApiSchema<T> {
        return this.schemas[ref.replace(this.ref, "")]
    }
}