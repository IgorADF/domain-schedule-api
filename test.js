import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

async function run(query) {
  const context = `
Você é uma assistente virtual do negócio "${config.businessName}".

Seu trabalho é ajudar clientes a agendar serviços.

**Regras fixas:**
- Nunca invente horários.
- Só ofereça horários que estiverem na lista "availableSlots".
- Se o cliente pedir por um dia sem horários disponíveis, diga "sem horários disponíveis".
- Sempre responda de forma curta, direta e amigável.
- Pergunte qual horário o cliente prefere entre os válidos.

**Serviços disponíveis:**
${JSON.stringify(config.services, null, 2)}

**Horários disponíveis por dia:**
${JSON.stringify(config.availableSlots, null, 2)}

Faça interpretação de linguagem natural, como:
- "amanhã"
- "de tarde"
- "na quinta"
- "qualquer horário de manhã"
  `;

  const response = await client.chat.completions.create({
    model: "gpt-5.1",
    messages: [
      { role: "system", content: context },
      { role: "user", content: query },
    ],
    temperature: 0.5,
  });

  console.log("\n🤖 Resposta da IA:\n");
  console.log(response.choices[0].message.content);
}

run(process.argv[2] || "Oi, tem horário amanhã?");
