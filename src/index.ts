import { generatorHandler } from '@prisma/generator-helper';
import { createTransformer } from './generator/transformDMMF';
import * as fs from 'fs';
import * as path from 'path';
import { parseEnvValue } from '@prisma/sdk';
import prettier from 'prettier';

generatorHandler({
  onManifest() {
    return {
      defaultOutput: './typebox',
      prettyName: 'Prisma Typebox Generator',
    };
  },
  async onGenerate(options) {
    const transformDMMF = createTransformer(options.generator.name);
    const payload = transformDMMF(options.dmmf);
    if (options.generator.output) {
      const outputDir =
        // This ensures previous version of prisma are still supported
        typeof options.generator.output === 'string'
          ? (options.generator.output as unknown as string)
          : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            parseEnvValue(options.generator.output);
      try {
        await fs.promises.mkdir(outputDir, {
          recursive: true,
        });
        const barrelFile = path.join(outputDir, 'index.ts');
        await fs.promises.writeFile(barrelFile, '', {
          encoding: 'utf-8',
        });
        const dateStringFile = path.join(outputDir, 'dateString.ts');

        const dateStringContent = `import { TSchema, Type } from '@sinclair/typebox';

export const TransformDateToString = Type.Transform(Type.Date({ format: "date-time" }))
  .Decode((value) => value.toISOString())
  .Encode((value) => new Date(value));

export const DateAsStringConverter = <T extends TSchema>(schema: T) =>
  Type.Unsafe<Date>({ ...schema, type: "string" });

export const DateString = DateAsStringConverter(TransformDateToString);
        `;

        await fs.promises.writeFile(dateStringFile, dateStringContent, {
          encoding: 'utf-8',
        });
        await Promise.all(
          payload.map((n) => {
            const fsPromises = [];
            fsPromises.push(
              fs.promises.writeFile(
                path.join(outputDir, n.name + '.ts'),
                prettier.format(n.rawString, {
                  parser: 'babel-ts',
                }),
                {
                  encoding: 'utf-8',
                },
              ),
            );

            fsPromises.push(
              fs.promises.appendFile(
                barrelFile,
                `export * from './${n.name}';\n`,
                { encoding: 'utf-8' },
              ),
            );
            if (n.inputRawString) {
              fsPromises.push(
                fs.promises.writeFile(
                  path.join(outputDir, n.name + 'Input.ts'),
                  prettier.format(n.inputRawString, {
                    parser: 'babel-ts',
                  }),
                  {
                    encoding: 'utf-8',
                  },
                ),
              );
              fsPromises.push(
                fs.promises.appendFile(
                  barrelFile,
                  `export * from './${n.name}Input';\n`,
                  { encoding: 'utf-8' },
                ),
              );
            }

            return Promise.all(fsPromises);
          }),
        );
      } catch (e) {
        console.error(
          'Error: unable to write files for Prisma Typebox Generator',
        );
        throw e;
      }
    } else {
      throw new Error('No output was specified for Prisma Typebox Generator');
    }
  },
});
