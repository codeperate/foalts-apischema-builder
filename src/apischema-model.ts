import { IApiDiscriminator, IApiExternalDocumentation, IApiReference, IApiSchema, IApiXML } from "@foal/core";

export class ApiSchemaModel implements IApiSchema {
    title?: string;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    enum?: any[];
    type?: 'null' | 'boolean' | 'object' | 'array' | 'number' | 'string' | 'integer';
    allOf?: (IApiSchema | IApiReference)[];
    oneOf?: (IApiSchema | IApiReference)[];
    anyOf?: (IApiSchema | IApiReference)[];
    not?: IApiSchema | IApiReference;
    items?: IApiSchema | IApiReference;
    properties?: {
        [key: string]: IApiSchema | IApiReference;
    };
    additionalProperties?: boolean | (IApiSchema | IApiReference);
    description?: string;
    format?: string;
    default?: any;
    /**
     * Allows sending a null value for the defined schema. Default value is false.
     *
     * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
     *
     * @type {boolean}
     * @memberof IApiSchema
     */
    nullable?: boolean;
    /**
     * Adds support for polymorphism. The discriminator is an object name that is used
     * to differentiate between other schemas which may satisfy the payload description.
     * See Composition and Inheritance for more details.
     *
     * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
     *
     * @type {boolean}
     * @memberof IApiSchema
     */
    discriminator?: IApiDiscriminator;
    /**
     * Relevant only for Schema "properties" definitions. Declares the property as "read only".
     * This means that it MAY be sent as part of a response but SHOULD NOT be sent as part of
     * the request. If the property is marked as readOnly being true and is in the required list,
     * the required will take effect on the response only. A property MUST NOT be marked as both
     * readOnly and writeOnly being true. Default value is false.
     *
     * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
     *
     * @type {boolean}
     * @memberof IApiSchema
     */
    readOnly?: boolean;
    /**
     * Relevant only for Schema "properties" definitions. Declares the property as "write only".
     * Therefore, it MAY be sent as part of a request but SHOULD NOT be sent as part of the response.
     * If the property is marked as writeOnly being true and is in the required list, the required
     * will take effect on the request only. A property MUST NOT be marked as both readOnly and
     * writeOnly being true. Default value is false.
     *
     * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
     *
     * @type {boolean}
     * @memberof IApiSchema
     */
    writeOnly?: boolean;
    /**
     * This MAY be used only on properties schemas. It has no effect on root schemas. Adds
     * additional metadata to describe the XML representation of this property.
     *
     * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
     *
     * @type {IApiXML}
     * @memberof IApiSchema
     */
    xml?: IApiXML;
    /**
     * Additional external documentation for this schema.
     *
     * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
     *
     * @type {IApiExternalDocumentation}
     * @memberof IApiSchema
     */
    externalDocs?: IApiExternalDocumentation;
    /**
     * A free-form property to include an example of an instance for this schema. To represent
     * examples that cannot be naturally represented in JSON or YAML, a string value can be used
     * to contain the example with escaping where necessary.
     *
     * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
     *
     * @type {*}
     * @memberof IApiSchema
     */
    example?: any;
    /**
     * Specifies that a schema is deprecated and SHOULD be transitioned out of usage. Default
     * value is false.
     *
     * Source: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md
     *
     * @type {boolean}
     * @memberof IApiSchema
     */
    deprecated?: boolean;

}