import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const PORT = 3000;

// Lazy initialization of Gemini client
let geminiClientCache = null;
function getGeminiClient() {
  if (!geminiClientCache) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please set it in the Secrets panel.");
    }
    geminiClientCache = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClientCache;
}

// 1. API: Analyze problem and generate custom AI Agent workspace metadata
app.post("/api/generate-agent", async (req, res) => {
  try {
    const { problem, authorName, customPrice } = req.body;
    if (!problem || String(problem).trim().length < 5) {
      return res.status(400).json({ error: "Please enter a more detailed description of the problem (at least 5 characters)." });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are an elite AI Architect and Venture Designer.
The user is facing a specific problem. Your task is to design a personalized Micro-AI Agent / Specialized Workspace tailored to solve this exact problem.
You must return a highly crafted, structured plan for this Agent in JSON format.
Ensure the 'customInstructions' is a comprehensive, deep, system prompt directing another Gemini AI on how to interact like a world-class specialized expert. It should define output structure, tone, strategies, query-solving steps, and target answers.
The 'iconName' must be one of these valid Lucide icon names: 
["Search", "Wrench", "TrendingUp", "Globe", "MessageSquare", "Brain", "Briefcase", "Code", "PenTool", "FileText", "LineChart", "Database", "Music", "Compass", "MapPin", "ShoppingBag", "Users", "Zap", "Flame", "ShieldCheck", "Cpu", "Server"].
The 'promptTemplate' must be a user-friendly, highly practical starter query demonstrating the agent's direct function.
The 'interfaceType' MUST match the primary domain of the problem:
- Use 'clothing-fitter' if the problem contains terms related to try-on clothes, dressing, fashion style, outfits, showing how clothes look on a person, or virtual wardrobes.
- Use 'marketing-catalyst' if the problem is copy generation, growth hacks, outbound messages, email campaigns, media, or direct post creation.
- Use 'data-analyzer' if the problem involves document processing, spreadsheets, tabular analysis, risk auditing, legal clauses mapping, or structured audits.
- Use 'chatbot' as the general fallback for text conversational inquiries.`;

    const userPrompt = `Build an AI solution for this problem:
"${problem}"
Optional author details: Created by ${authorName || "Anonymous User"}. Suggested Price: $${customPrice || "Free"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["name", "description", "customInstructions", "iconName", "promptTemplate", "suggestedPrice", "interfaceType"],
          properties: {
            name: {
              type: Type.STRING,
              description: "A short, sharp, and highly memorable name for the specialized AI Solution (e.g. 'Stripe Sales Auditor' or 'Growth Hack Optimizer'). Do not use generic names.",
            },
            description: {
              type: Type.STRING,
              description: "A professional 1-2 sentence description detailing exactly how this AI solves the problem and what value it offers to subscribers.",
            },
            customInstructions: {
              type: Type.STRING,
              description: "The complete, detailed, step-by-step System Prompt for this direct agent. Instruct it on how to act, handle queries, build tables, validate answers, and deliver solutions.",
            },
            iconName: {
              type: Type.STRING,
              description: "A single string selecting the most appropriate icon from: Search, Wrench, TrendingUp, Globe, MessageSquare, Brain, Briefcase, Code, PenTool, FileText, LineChart, Database, Music, Compass, MapPin, ShoppingBag, Users, Zap, Flame, ShieldCheck, Cpu, Server.",
            },
            promptTemplate: {
              type: Type.STRING,
              description: "A highly clear, interactive prompt starter that showcases the capabilities of this agent.",
            },
            suggestedPrice: {
              type: Type.NUMBER,
              description: "Suggested monthly subscription fee for this AI app in USD. Must be a sensible value between $1.99 and $19.99 depending on the complexity of the solution.",
            },
            interfaceType: {
              type: Type.STRING,
              description: "Must be one of these exact values: chatbot, clothing-fitter, data-analyzer, marketing-catalyst.",
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Did not receive a text response from the model.");
    }

    const agentData = JSON.parse(text.trim());
    return res.json({ success: true, agent: agentData });

  } catch (error) {
    console.error("Error generating agent:", error);
    return res.status(500).json({ error: error.message || "Failed to generate custom AI agent workflow." });
  }
});

// 2. API: Query the custom agent with message history and optional search grounding
app.post("/api/agent-query", async (req, res) => {
  try {
    const { customInstructions, messages, useSearch } = req.body;
    
    if (!customInstructions) {
      return res.status(400).json({ error: "Custom instructions are required to run an agent." });
    }
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "A message history is required." });
    }

    const ai = getGeminiClient();

    // Map the client's friendly payload to standard content parameter values
    const contentsPayload = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const configPayload = {
      systemInstruction: customInstructions,
      tools: useSearch ? [{ googleSearch: {} }] : [],
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentsPayload,
      config: configPayload,
    });

    const responseText = response.text || "No response received.";
    
    // Extract grounding search metadata if available
    let groundingSources = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      groundingSources = chunks
        .filter((chunk) => chunk.web?.uri)
        .map((chunk) => ({
          title: chunk.web.title || "Web Search Result",
          uri: chunk.web.uri,
        }));
    }

    return res.json({
      success: true,
      text: responseText,
      groundingSources,
    });

  } catch (error) {
    console.error("Error querying agent:", error);
    return res.status(500).json({ error: error.message || "Failed to execute agent query." });
  }
});

// Serve static assets and hook up dev server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

startServer();
