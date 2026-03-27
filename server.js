const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const envConfig = loadDotEnv(path.join(__dirname, ".env"));
const PORT = Number(process.env.PORT || 3000);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || envConfig.OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || envConfig.OPENROUTER_MODEL || "openrouter/free";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

const forecastDetailSchema = {
  type: "object",
  properties: {
    headline: { type: "string" },
    body: { type: "string" },
    directives: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string" },
    },
  },
  required: ["headline", "body", "directives"],
};

const lifeCardSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    eyebrow: { type: "string" },
    body: { type: "string" },
    list: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string" },
    },
  },
  required: ["title", "eyebrow", "body", "list"],
};

const issueSchema = {
  type: "object",
  properties: {
    chart: {
      type: "object",
      properties: {
        lede: { type: "string" },
        paragraphs: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: { type: "string" },
        },
      },
      required: ["lede", "paragraphs"],
    },
    forecast: {
      type: "object",
      properties: {
        daily: forecastDetailSchema,
        weekly: forecastDetailSchema,
        yearly: forecastDetailSchema,
      },
      required: ["daily", "weekly", "yearly"],
    },
    life: {
      type: "object",
      properties: {
        lede: { type: "string" },
        cards: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: lifeCardSchema,
        },
      },
      required: ["lede", "cards"],
    },
    sanctuary: {
      type: "object",
      properties: {
        theme: { type: "string" },
        starters: {
          type: "array",
          minItems: 2,
          maxItems: 2,
          items: {
            type: "object",
            properties: {
              dateLabel: { type: "string" },
              body: { type: "string" },
            },
            required: ["dateLabel", "body"],
          },
        },
      },
      required: ["theme", "starters"],
    },
    oracleWelcome: {
      type: "object",
      properties: {
        question: { type: "string" },
        answer: { type: "string" },
      },
      required: ["question", "answer"],
    },
  },
  required: ["chart", "forecast", "life", "sanctuary", "oracleWelcome"],
};

const oracleAnswerSchema = {
  type: "object",
  properties: {
    answer: { type: "string" },
  },
  required: ["answer"],
};

http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);

      if (req.method === "POST" && url.pathname === "/api/generate-issue") {
        return handleGenerateIssue(req, res);
      }

      if (req.method === "POST" && url.pathname === "/api/oracle") {
        return handleOracle(req, res);
      }

      if (req.method === "GET") {
        return serveStatic(url.pathname, res);
      }

      return sendJson(res, 405, { error: "Method not allowed" });
    } catch (error) {
      console.error("[server] Unhandled request error:", error);
      return sendJson(res, 500, { error: error.message || "Internal server error" });
    }
  })
  .listen(PORT, () => {
    console.log(`The Aspect server listening on port ${PORT}`);
  });

async function handleGenerateIssue(req, res) {
  if (!OPENROUTER_API_KEY) {
    return sendJson(res, 500, { error: "Missing OPENROUTER_API_KEY environment variable." });
  }

  const body = await readJsonBody(req);
  if (!body?.profile) {
    return sendJson(res, 400, { error: "Missing profile payload." });
  }

  try {
    const data = await askOpenRouterJSON(buildIssuePrompt(body.profile), issueSchema, 3200, "editorial_issue");
    return sendJson(res, 200, { data });
  } catch (error) {
    console.error("[api/generate-issue] Request failed:", {
      statusCode: error.statusCode || 500,
      message: error.message,
      details: error.details || null,
    });
    return sendJson(res, error.statusCode || 500, { error: error.message || "OpenRouter request failed." });
  }
}

async function handleOracle(req, res) {
  if (!OPENROUTER_API_KEY) {
    return sendJson(res, 500, { error: "Missing OPENROUTER_API_KEY environment variable." });
  }

  const body = await readJsonBody(req);
  if (!body?.profile || !body?.question) {
    return sendJson(res, 400, { error: "Missing oracle payload." });
  }

  try {
    const data = await askOpenRouterJSON(
      buildOraclePrompt(body.profile, body.question, body.generatedIssue),
      oracleAnswerSchema,
      700,
      "oracle_answer"
    );
    return sendJson(res, 200, { data });
  } catch (error) {
    console.error("[api/oracle] Request failed:", {
      statusCode: error.statusCode || 500,
      message: error.message,
      details: error.details || null,
    });
    return sendJson(res, error.statusCode || 500, { error: error.message || "OpenRouter request failed." });
  }
}

function serveStatic(requestPath, res) {
  const normalized = requestPath === "/" ? "/index.html" : requestPath;
  const safePath = path.normalize(normalized).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(ROOT, safePath);

  if (!filePath.startsWith(ROOT)) {
    return sendJson(res, 403, { error: "Forbidden" });
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (normalized !== "/index.html") {
        return fs.readFile(path.join(ROOT, "index.html"), (fallbackError, fallbackContent) => {
          if (fallbackError) {
            return sendJson(res, 404, { error: "Not found" });
          }

          res.writeHead(200, { "Content-Type": MIME_TYPES[".html"] });
          res.end(fallbackContent);
        });
      }

      return sendJson(res, 404, { error: "Not found" });
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(content);
  });
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

async function askOpenRouterJSON(prompt, schema, maxOutputTokens, schemaName) {
  let lastError = null;
  const schemaInstructions = buildSchemaInstructions(prompt, schema, schemaName);
  const backoffMs = [0, 2500, 6000];

  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (backoffMs[attempt] > 0) {
      await sleep(backoffMs[attempt]);
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a precise editorial astrology writer. Return valid JSON only. Do not use markdown fences or explanatory text. The response must be a single JSON object.",
          },
          {
            role: "user",
            content: attempt === 0
              ? schemaInstructions
              : `${schemaInstructions}\n\nReturn only a raw JSON object. Do not use markdown fences. Do not add any explanatory text before or after the JSON.`,
          },
        ],
        response_format: {
          type: "json_object",
        },
        temperature: 0.25,
        top_p: 0.8,
        max_tokens: maxOutputTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(formatOpenRouterApiError(errorText, response.status));
      error.statusCode = response.status;
      error.details = summarizeProviderError(errorText);
      if (response.status === 429) {
        lastError = error;
        continue;
      }
      throw error;
    }

    const payload = await response.json();
    const text = extractOpenRouterText(payload);

    try {
      return parseModelJson(text);
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError?.statusCode === 429) {
    throw lastError;
  }

  throw new Error(`OpenRouter returned invalid JSON for a structured response. ${lastError ? `Last parse error: ${lastError.message}` : ""}`.trim());
}

function buildSchemaInstructions(prompt, schema, schemaName) {
  return `${prompt}

Structured output requirements:
- Return exactly one JSON object.
- Do not wrap the response in markdown fences.
- Do not include commentary before or after the JSON.
- Follow this schema exactly for "${schemaName}":
${JSON.stringify(schema, null, 2)}`;
}

function summarizeProviderError(errorText) {
  const normalized = (errorText || "").replace(/\s+/g, " ").trim();
  return normalized.length > 800 ? `${normalized.slice(0, 800)}...` : normalized;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadDotEnv(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return raw.split(/\r?\n/).reduce((accumulator, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        return accumulator;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
      if (key) {
        accumulator[key] = value;
      }
      return accumulator;
    }, {});
  } catch (_error) {
    return {};
  }
}

function parseModelJson(text) {
  const cleaned = stripCodeFences(text);

  try {
    return JSON.parse(cleaned);
  } catch (_error) {
    const extracted = extractJSONObject(cleaned);
    if (extracted) {
      return JSON.parse(extracted);
    }
  }

  throw new Error("Unable to parse the model response as JSON.");
}

function extractOpenRouterText(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  const text = typeof content === "string"
    ? content.trim()
    : Array.isArray(content)
      ? content
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          if (item?.type === "text") {
            return item.text || "";
          }

          return "";
        })
        .join("")
        .trim()
      : "";

  if (!text) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return text;
}

function stripCodeFences(text) {
  return text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
}

function extractJSONObject(text) {
  const startCandidates = [text.indexOf("{"), text.indexOf("[")].filter((index) => index >= 0);
  if (!startCandidates.length) {
    return null;
  }

  const start = Math.min(...startCandidates);
  const opening = text[start];
  const closing = opening === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "\"") {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === opening) {
      depth += 1;
    } else if (char === closing) {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }

  return null;
}

function promptContext(profile) {
  return [
    "You are writing for The Aspect, a high-end editorial astrology product.",
    "Tone: high-contrast editorial chic, psychologically sharp, elegant, not mystical fluff.",
    "Format rules: no markdown, no bullet markers inside prose fields, no emojis, no disclaimers.",
    `Name: ${profile.name}`,
    `Birthdate: ${profile.formattedDate}`,
    `Birth time: ${profile.birthtime}`,
    `Birth city: ${profile.city}`,
    `Sun sign: ${profile.sun}`,
    `Moon sign: ${profile.moon}`,
    `Rising sign: ${profile.rising}`,
    `Dominant element: ${profile.element}`,
    `Modality: ${profile.modality}`,
  ].join("\n");
}

function buildIssuePrompt(profile) {
  return `${promptContext(profile)}

Generate the entire issue in one response.
Return JSON matching the schema exactly.

Requirements:
- chart: one lede and exactly three paragraphs
- forecast: daily, weekly, yearly; each needs a headline, one body paragraph, and exactly three directives
- life: one lede and exactly three cards titled Profession, Family, and Romance
- sanctuary: one short transit theme phrase and exactly two starter journal entries
- oracleWelcome: one question and one answer

Writing direction:
- high-end editorial astrology
- psychologically precise, elegant, serious
- no mystical cliches, no filler, no disclaimers
- bespoke to this profile and internally consistent across all sections
- do not mention being an AI or model`;
}

function buildOraclePrompt(profile, question, generatedIssue) {
  const forecastHeadline = generatedIssue?.forecast?.daily?.headline || "No forecast generated yet";
  const lifeProfession = generatedIssue?.life?.cards?.[0]?.body || "No life path generated yet";

  return `${promptContext(profile)}

User question: ${question}
Current daily forecast headline: ${forecastHeadline}
Current profession note: ${lifeProfession}

Generate the Oracle answer only.
Return JSON with one field: answer.
Answer in 3 to 5 sentences.
Be specific to this profile and this question.`;
}

function formatOpenRouterApiError(errorText, statusCode) {
  try {
    const parsed = JSON.parse(errorText);
    const apiError = parsed?.error || parsed;
    if (!apiError) {
      return errorText || `HTTP ${statusCode}`;
    }

    if (statusCode === 429) {
      const retryDelay = extractRetryDelay(apiError);
      return retryDelay
        ? `OpenRouter rate limit reached. Please wait about ${retryDelay} and try again.`
        : "OpenRouter rate limit reached. Please wait a short while and try again.";
    }

    if (statusCode === 402) {
      return "OpenRouter credits or model access are unavailable for this request.";
    }

    return apiError.message || errorText || `HTTP ${statusCode}`;
  } catch (_error) {
    return errorText || `HTTP ${statusCode}`;
  }
}

function extractRetryDelay(apiError) {
  const retryInfo = apiError?.metadata?.retry_after || apiError?.retry_after;
  if (retryInfo) {
    return `${Math.ceil(Number(retryInfo))} seconds`;
  }

  const match = apiError?.message?.match(/(?:retry in|try again in|available in)\s+([0-9.]+)\s*s/i);
  if (match) {
    return `${Math.ceil(Number(match[1]))} seconds`;
  }

  const secondsMatch = apiError?.message?.match(/([0-9.]+)\s*seconds?/i);
  if (secondsMatch) {
    return `${Math.ceil(Number(secondsMatch[1]))} seconds`;
  }

  return null;
}
