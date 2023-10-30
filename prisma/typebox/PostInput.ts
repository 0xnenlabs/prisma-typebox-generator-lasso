import { Type, Static, TSchema } from "@sinclair/typebox";
import { Role } from "./Role";
import { DateString } from "./dateString";

export const PostInput = Type.Object({
  id: Type.Union([Type.Null(), Type.Number()]),
  user: Type.Union([
    Type.Null(),
    Type.Object(
      {
        id: Type.Union([Type.Null(), Type.Number()]),
        createdAt: Type.Union([Type.Null(), DateString]),
        email: Type.String(),
        weight: Type.Union([Type.Null(), Type.Number()]),
        is18: Type.Union([Type.Null(), Type.Boolean()]),
        name: Type.Union([Type.Null(), Type.String()]),
        successorId: Type.Union([Type.Null(), Type.Number()]),
        role: Type.Union([Type.Null(), Role]),
        keywords: Type.Array(Type.String({ minLength: 3 }), { maxItems: 10 }),
        biography: Type.String({ description: "field description" }),
        decimal: Type.Number({ description: "used description" }),
        biginteger: Type.Integer({ description: "multiline\ndescription" }),
        unsigned: Type.Integer({ minimum: 0 }),
      },
      { description: "model description" }
    ),
  ]),
  userId: Type.Union([Type.Null(), Type.Number()]),
});

export type PostInputType = Static<typeof PostInput>;
