import { Type, Static, TSchema } from "@sinclair/typebox";
import { Role } from "./Role";
import { DateString } from "./dateString";

export const User = Type.Object(
  {
    id: Type.Number(),
    createdAt: Type.Union([Type.Null(), DateString]),
    email: Type.String(),
    weight: Type.Union([Type.Null(), Type.Number()]),
    is18: Type.Union([Type.Null(), Type.Boolean()]),
    name: Type.Union([Type.Null(), Type.String()]),
    successorId: Type.Union([Type.Null(), Type.Number()]),
    role: Type.Union([Type.Null(), Role]),
    posts: Type.Array(
      Type.Object({
        id: Type.Number(),
        userId: Type.Union([Type.Null(), Type.Number()]),
      })
    ),
    keywords: Type.Array(Type.String({ minLength: 3 }), { maxItems: 10 }),
    biography: Type.String({ description: "field description" }),
    decimal: Type.Number({ description: "used description" }),
    biginteger: Type.Integer({ description: "multiline\ndescription" }),
    unsigned: Type.Integer({ minimum: 0 }),
  },
  { description: "model description" }
);

export type UserType = Static<typeof User>;
