import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';

export function buildResolverAgent(modelName: string) {
  const systemMsg =
    'Your task is to resolve compiler errors from the provided Solidity code. You must generate complete smart contract code exclusively without any explanatory or conversational text. You must not change any other parts of the code that are not related to solving the compiler error. You must provide back full code that compiles, not only the parts that need to be fixed.';
  const question = `Resolve the compiler error "{compilerError}" from the following Solidity code: \n {code}`;

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(systemMsg),
      HumanMessagePromptTemplate.fromTemplate(question),
    ],
    inputVariables: ['code', 'compilerError'],
  });
  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName,
    temperature: 0.2,
    modelKwargs: { seed: 1337 },
  });

  return prompt.pipe(llm).pipe(new StringOutputParser());
}
