
import { GoogleGenAI } from "@google/genai";

// Gemini API key – injected at build time via vite.config.ts define block.
// On Vercel, set GEMINI_API_KEY in Project Settings → Environment Variables and redeploy.
const API_KEY: string = (process.env.GEMINI_API_KEY as string) || '';

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const getStylingAdvice = async (outfitDescription: string, userTone: string, bodyFrame: string): Promise<string> => {
  if (!ai) {
    return "AI features require a Gemini API key. Add VITE_GEMINI_API_KEY to your .env.local file.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Provide styling advice for this outfit: ${outfitDescription}. 
                 The user has a ${userTone} skin tone and a ${bodyFrame} frame. 
                 Focus on color theory and body architecture. Return in short, punchy paragraphs.`,
      config: {
        maxOutputTokens: 250,
        temperature: 0.7,
      }
    });
    return response.text || "I couldn't generate advice right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Noor's AI is currently resting. Please check back for styling tips later!";
  }
};

export const getAIStyleAdvice = async (userQuestion: string, userContext: string, wardrobeItems: string): Promise<string> => {
  if (!ai) {
    return "✨ To enable AI features, please add your Gemini API key:\n\n1. Get a free key at aistudio.google.com\n2. Add VITE_GEMINI_API_KEY=your_key to .env.local\n3. Restart the dev server";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are Noor, a friendly and expert AI fashion stylist. You help users with outfit suggestions, style advice, and wardrobe decisions.

Context about the user: ${userContext}
Items in their wardrobe: ${wardrobeItems}

User's question: ${userQuestion}

Respond in a friendly, encouraging tone. Keep responses concise (2-3 short paragraphs max). Use emojis sparingly for warmth. Give specific, actionable advice.`,
      config: {
        maxOutputTokens: 300,
        temperature: 0.8,
      }
    });
    return response.text || "I'm thinking... could you ask that again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a moment! 💫 Try asking me again in a bit.";
  }
};

export const getOutfitRecommendation = async (occasion: string, weather: string, userProfile: string, wardrobeItems: string): Promise<string> => {
  if (!ai) {
    return "Enable AI by adding your Gemini API key to get personalized outfit recommendations!";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an AI fashion stylist. Create an outfit recommendation.

Occasion: ${occasion}
Weather: ${weather}
User profile: ${userProfile}
Available wardrobe items: ${wardrobeItems}

Provide a specific outfit recommendation using items from the wardrobe. Explain why this combination works for the occasion and the user's body type. Keep it to 2-3 sentences, be enthusiastic but concise.`,
      config: {
        maxOutputTokens: 200,
        temperature: 0.7,
      }
    });
    return response.text || "Check back soon for your personalized recommendation!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Your style recommendation is being crafted... check back soon!";
  }
};

export const generateTryOnImage = async (userPhotoBase64: string, clothingDescription: string, bodyType: string): Promise<{ imageUrl: string; description: string }> => {
  if (!ai) {
    return {
      imageUrl: userPhotoBase64,
      description: "⚠️ No Gemini API key found. Make sure GEMINI_API_KEY is set in Vercel Environment Variables and redeploy."
    };
  }

  // Compress the photo to reduce size before sending to API
  const compressPhoto = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 800;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
        else { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  try {
    // Compress the user's photo
    let photoToSend = userPhotoBase64;
    if (userPhotoBase64.startsWith('data:')) {
      photoToSend = await compressPhoto(userPhotoBase64);
    }

    // Extract base64 data and mime type
    let imageData = photoToSend;
    let mimeType = 'image/jpeg';
    if (photoToSend.startsWith('data:')) {
      const matches = photoToSend.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        imageData = matches[2];
      }
    }

    // Use gemini-2.0-flash-preview-image-generation for image generation/editing
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Edit this photo of a person. Change ONLY their clothes/outfit to: ${clothingDescription}. Keep the exact same person, face, hair, pose, and background. The person has a ${bodyType}. Make the new outfit look natural and realistic on their body.`
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: imageData,
              }
            }
          ]
        }
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    // Extract generated image and text from response
    let generatedImageUrl = userPhotoBase64;
    let description = "✨ Here's how you look in your selected outfit!";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
        if (part.text) {
          description = part.text;
        }
      }
    }

    // If no text description came back, get one separately
    if (description === "✨ Here's how you look in your selected outfit!") {
      try {
        const textResponse = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: `You are Noor, an expert fashion stylist. A user is trying on: ${clothingDescription}. Body type: ${bodyType}. Give 2-3 short, enthusiastic sentences about how this outfit looks. Be specific and encouraging. Use 1-2 emojis.`,
          config: { maxOutputTokens: 150, temperature: 0.8 }
        });
        if (textResponse.text) description = textResponse.text;
      } catch { /* text fallback is fine */ }
    }

    return { imageUrl: generatedImageUrl, description };

  } catch (error) {
    console.error("Gemini Try-On Error:", error);

    const errMsg = (error as any)?.message || String(error);
    const isQuota = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota');

    // Fallback: return original photo with friendly text styling advice
    let fallbackDescription = "✨ Your selected pieces create a stunning combination!";
    try {
      const textResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are Noor, a fashion stylist. Describe how these items would look together: ${clothingDescription}. Body type: ${bodyType}. Give 2-3 short, enthusiastic sentences. Use 1-2 emojis.`,
        config: { maxOutputTokens: 150, temperature: 0.8 }
      });
      if (textResponse.text) fallbackDescription = textResponse.text;
    } catch { /* fallback text is fine */ }

    if (isQuota) {
      fallbackDescription += "\n\n⚠️ Image generation requires a paid Gemini API plan. Enable billing at aistudio.google.com to see yourself in the outfit!";
    }

    return {
      imageUrl: userPhotoBase64,
      description: fallbackDescription
    };
  }
};

export const generateWeeklyNotes = async (weather: string[]): Promise<string[]> => {
  if (!ai) {
    return Array(7).fill("Add your Gemini API key for AI-powered daily style notes!");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate 7 short, punchy daily outfit notes based on these weather forecasts: ${weather.join(', ')}. 
                 Style should be 'Effortless Chic'. Each note should be 1 sentence max. Return as JSON array of 7 strings.`,
      config: {
        responseMimeType: "application/json",
      }
    });
    const parsed = JSON.parse(response.text || '[]');
    return Array.isArray(parsed) ? parsed : Array(7).fill("Chosen for your effortless vibe today.");
  } catch (error) {
    return Array(7).fill("Chosen for your effortless vibe today.");
  }
};
