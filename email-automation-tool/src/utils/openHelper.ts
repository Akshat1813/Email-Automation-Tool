// import { Configuration, OpenAIApi } from 'openai';
// import dotenv from 'dotenv';

// dotenv.config();

// const openai = new OpenAIApi(new Configuration({
//   apiKey: process.env.OPENAI_API_KEY
// }));

// export async function categorizeEmail(content: string) {
//   const response = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: `Label this email as Interested, Not Interested, or More Information: ${content}`,
//     max_tokens: 10
//   });

//   return response.data.choices[0].text?.trim();
// }
