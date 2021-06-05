# foalts-apischema-builder

A small library that helps you to build ApiSchema for foalTS with builder pattern.

## Getting Started
1. This library use class validator metadata storage to convert your database entity to json schema, therefore you need validation decorators in your entity. Although this lib is agnostic between orms, the examples below are using foalts with Mikro-orm.
```
import { IsDate, IsString } from 'class-validator';

export class SomeEntity {
    @PrimaryKey()
    @IsString()
    id: string = v4();

    @Property()
    @IsDate()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    @IsDate()
    updatedAt: Date = new Date();

}
```
2. Setup your the schema service before bootstrap your app  in ``index.ts``
  ``` 
  import { SchemaService } from '@codeperate/foalts-apischema-builder';
  ...
  async function main() {
    const schemaService = new SchemaService()
    serviceManager.set("schema", schemaService, { boot: true })
    await serviceManager.boot("schema");
    const app = await createApp(AppController, { serviceManager });
    ...
  }
  ```
3. Use it in your controller ``example.controller.ts``
  
  ```
  export class SomeController{
    @depdency('schema')
    ss:SchemaService
    @Get('/:id')
    @ValidatePathParam("id", { type: "string" })
    @JSONResponse(200, (c: SomeController) => (c.ss.get(SomeEntity)))
    async findById(ctx: Context): Promise<HttpResponse> {
        ...
    }
  }
  ```
  ``json-response.hook.ts``:
  ```
  import { ApiResponse, HookDecorator, IApiReference, IApiResponse, IApiSchema } from '@foal/core';
  export function JSONResponse(key: number | "default" | "1XX" | "2XX" | "3XX" | "4XX" | "5XX", schema: IApiSchema | IApiReference | ((controller: any) => IApiSchema | IApiReference), description: string = ""): HookDecorator {
      return (target, propertyKey?) => {
          function makeResponse(schema: IApiSchema | IApiReference): IApiResponse {
              return {
                  description: description,
                  content: {
                      "application/json": {
                          schema: schema
                      }
                  }
              }
          }
          const responseBody = (typeof schema == "function") ? (c: any) => makeResponse(schema(c)) : makeResponse(schema);
          return ApiResponse(key, responseBody)(target, propertyKey)
      }
  }
  ```
  4. Modify your APISchema Object easily with builder pattern:
  ```
    @JSONResponse(200, (c: SomeController) => c.ss.get(SomeEntity).pick(["prop1","prop2"]))
  ```

# More
You can add more predefined schema as you like, for example:
```
   schemaService.transform((key, value) => {
    if (orm.getMetadata().has(key)) {
      const primaryKeys = orm.getMetadata().get(key).primaryKeys
      return value.omit(primaryKeys)
    }
    return value;
  }, "post")
```
A schema for post body without primary key will be created and you can access it with:
```
    schemaService.get(SomeEntity,"post")
```
  
