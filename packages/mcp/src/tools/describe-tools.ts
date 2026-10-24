/* @layer core @kind logic */
import type { StepCommand } from '../schema/step-command.type';
import { buildTools } from './build-tools';
import type { ToolDescriptor } from './tool-descriptor.type';
import { toolJsonSchema } from './tool-json-schema';

const describeTools = (commands: readonly StepCommand[]): readonly ToolDescriptor[] =>
  buildTools(commands).map((tool) => ({
    name: tool.name,
    title: tool.title,
    description: tool.description,
    inputSchema: toolJsonSchema(tool.input, 'input'),
    outputSchema: toolJsonSchema(tool.output, 'output'),
    annotations: tool.annotations,
  }));

export { describeTools };
