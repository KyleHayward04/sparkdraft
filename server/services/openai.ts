import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing required OpenAI API key: OPENAI_API_KEY');
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_SECRET_KEY || "default_key"
});

export interface GeneratedContent {
  outlines: Array<{
    title: string;
    wordCount: number;
    sections: string[];
  }>;
  titles: string[];
  promos: Array<{
    platform: string;
    content: string;
  }>;
}

export async function generateContent(
  topic: string,
  format: string,
  voiceProfile: string
): Promise<GeneratedContent> {
  const prompt = `Generate content for a ${format} about "${topic}" with a ${voiceProfile} voice profile.

Please provide:
1. 3 different outlines with titles, estimated word counts, and section breakdowns
2. 10 engaging titles/headlines
3. 5 promotional social media posts for different platforms

Format your response as JSON with this structure:
{
  "outlines": [
    {
      "title": "outline title",
      "wordCount": 1200,
      "sections": ["section 1", "section 2", "section 3"]
    }
  ],
  "titles": ["title 1", "title 2", "title 3"],
  "promos": [
    {
      "platform": "Twitter",
      "content": "promotional tweet content"
    }
  ]
}

Make sure all content is relevant to the topic and matches the ${voiceProfile} voice profile.`;

  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert content strategist and copywriter. Generate high-quality, engaging content outlines, titles, and promotional copy based on the user's requirements. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated");
    }

    const parsedContent = JSON.parse(content);
    
    // Validate the structure
    if (!parsedContent.outlines || !parsedContent.titles || !parsedContent.promos) {
      throw new Error("Invalid response structure from OpenAI");
    }

    return parsedContent as GeneratedContent;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate content: " + (error as Error).message);
  }
}
