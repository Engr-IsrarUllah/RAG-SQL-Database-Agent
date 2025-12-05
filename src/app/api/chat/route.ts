import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

const SYSTEM_PROMPT = `
  You are a helpful and intelligent assistant specialized in database queries. 
  
  You have two modes:
  1. General Chat: Answer general questions directly.
  2. Database Assistant: If the user asks about data, users, roles, professions, or cities, you MUST use the 'db_query' tool.

  You have access to a PostgreSQL database with this schema:
  Table: "User"
  Columns: 
  - id (Int): Primary key.
  - email (String): The user's email address.
  - name (String): The user's full name.
  - role (String): The user's role. Possible values are: 'admin', 'user', 'manager'.
  - profession (String): The user's job title. Possible values include: 'CTO', 'Senior Developer', 'UX Designer', 'Engineering Manager', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'HR Manager', 'QA Engineer', 'Intern', 'Data Scientist', 'Data Analyst', 'Project Manager', 'Content Writer', 'Marketing Specialist', 'CEO', 'Sales Executive'.
  - city (String): The user's location. Possible values are: 'Islamabad', 'Lahore', 'Multan', 'Karachi'.
  
  Rules for the 'db_query' tool:
  - Generate valid PostgreSQL SQL.
  - ONLY use SELECT queries.
  - Return the requested data and then answer the user's question based on that data.
  
  **IMPORTANT RESPONSE RULE: When listing specific data, use plain text and do not use Markdown for bolding, lists, or asterisks to ensure clean output.**
  `;

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    tools: {
      db_query: tool({
        description: 'Execute a SQL query to fetch data from the database',
        inputSchema: z.object({
          query: z.string().describe('The PostgreSQL SELECT query to execute'),
        }),
        execute: async ({ query }) => {
          console.log("AI Generated SQL:", query);
          try {
            const result = await prisma.$queryRawUnsafe(query);
            return JSON.stringify(result, (key, value) => 
  typeof value === 'bigint' ? value.toString() : value
);
          } catch (error: any) {
            console.error("DB Error:", error);
            return `Error executing query: ${error.message}`;
          }
        },
      }),
    },
    // maxSteps: 5, <--- This was causing the error
    stopWhen: stepCountIs(6), // <--- This is the correct property for your version
  });

  return result.toUIMessageStreamResponse();
}