// @ts-nocheck
import { TSchema, Type } from '@sinclair/typebox';

export const TransformDateToString = Type.Transform(Type.Date({ format: "date-time" }))
  .Decode((value) => value.toISOString())
  .Encode((value) => new Date(value));

export const DateAsStringConverter = <T extends TSchema>(schema: T) =>
  Type.Unsafe<Date>({ ...schema, type: "string" });

export const DateString = DateAsStringConverter(TransformDateToString);