import axios from 'axios';
import { ChatResponse, APIProvider, APIConfig } from '../types/chat';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Default API configuration using environment variables
let apiConfig: APIConfig = {
  provider: 'azure', // Default provider is Azure
  azure: {
    endpoint: import.meta.env.VITE_AZURE_ENDPOINT, // Azure API endpoint
    apiKey: import.meta.env.VITE_AZURE_API_KEY, // Azure API key
    deploymentName: import.meta.env.VITE_AZURE_DEPLOYMENT_NAME // Azure deployment name
  },
  xai: {
    apiKey: import.meta.env.VITE_XAI_API_KEY, // X.AI API key
    model: 'grok-vision-beta' // X.AI model
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY, // Gemini API key
    model: 'gemini-2.0-flash-exp' // Gemini model
  }
};

/**
 * Sets the API provider to use for requests.
 * @param provider The API provider ('azure', 'xai', or 'gemini').
 */
export const setAPIProvider = (provider: APIProvider) => {
  apiConfig.provider = provider;
};

/**
 * Makes a request to the Azure OpenAI API.
 * @param payload The request payload.
 * @returns A promise that resolves to the chat response.
 */
const makeAzureRequest = async (payload: any): Promise<ChatResponse> => {
  // Check if Azure configuration is available
  if (!apiConfig.azure) throw new Error('Azure configuration not found');
  console.log({ payload, model: "azure" })
  // Destructure Azure configuration
  const { endpoint, apiKey, deploymentName } = apiConfig.azure;
  // Make a POST request to the Azure OpenAI API
  const response = await axios.post(
    `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey // Include API key in headers
      }
    }
  );
  // Return the response data
  return response.data;
};

/**
 * Makes a request to the X.AI API.
 * @param payload The request payload.
 * @returns A promise that resolves to the chat response.
 */
const makeXAIRequest = async (payload: any): Promise<ChatResponse> => {
  // Check if X.AI configuration is available
  if (!apiConfig.xai) throw new Error('X.AI configuration not found');

  // Destructure X.AI configuration
  const { apiKey, model } = apiConfig.xai;
  console.log({ payload, model: "xai" })
   
  // Add model to the payload
  const xaiPayload = {
    ...payload,
    model, 
  };

  console.log({xaiPayload})

  // Make a POST request to the X.AI API
  const response = await axios.post(
    'https://api.x.ai/v1/chat/completions',
    xaiPayload,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // Include API key in headers
      }
    }
  );

  // Transform X.AI response to match Azure format
  return {
    ...response.data,
    choices: response.data.choices.map((choice: any) => ({
      message: {
        content: choice.message.content
      }
    }))
  };
};

/**
 * Makes a request to the Gemini API.
 * @param payload The request payload.
 * @returns A promise that resolves to the chat response.
 */
const makeGeminiRequest = async (payload: any): Promise<ChatResponse> => {
 
  console.log({payload})
  if (!apiConfig.gemini) throw new Error('Gemini configuration not found');

  const { apiKey, model } = apiConfig.gemini;
  console.log({ payload, model: "gemini-2.0-flash-exp" })

  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({ model });
  console.log(geminiModel)

  const chat = geminiModel.startChat({
    history: payload.messages,
  });

  const result = await chat.sendMessageStream(payload.messages[0].content);

  let text = "";
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    text += chunkText;
  }

  return {
    choices: [{
      message: {
        content: text
      }
    }]
  };
};


/**
 * Analyzes an image using the configured API provider.
 * @param imageUrl The URL of the image to analyze.
 * @param prompt The prompt to use for analysis.
 * @returns A promise that resolves to the chat response.
 */
export const analyzeImage = async (imageUrl: string, prompt: string): Promise<ChatResponse> => {
  try {
    // Construct the messages payload for the API
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt // Include the prompt
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl // Include the image URL
            }
          }
        ]
      }
    ];

    // Construct the payload for the API request
    const payload = {
      messages,
      max_tokens: 800,
      temperature: 0.3,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 0.95,
      stream: false
    };

    // Make the request to the appropriate API provider
    if (apiConfig.provider === 'azure') {
      return makeAzureRequest(payload);
    } else if (apiConfig.provider === 'xai') {
      return makeXAIRequest(payload);
    } else if (apiConfig.provider === 'gemini') {
      return makeGeminiRequest(payload);
    } else {
      throw new Error(`Invalid API provider: ${apiConfig.provider}`);
    }
  } catch (error) {
    // Log and throw any errors
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze image');
  }
};

/**
 * Verifies the accuracy of extracted text using the configured API provider.
 * @param originalText The original text.
 * @param extractedText The extracted text to verify.
 * @returns A promise that resolves to the chat response.
 */
export const verifyExtraction = async (originalText: string, extractedText: string): Promise<ChatResponse> => {
  try {
    // Construct the messages payload for the API
    const messages = [
      {
        role: "user",
        content: `Please verify the accuracy of the following extraction. Compare the extracted information with the original text and provide a confidence score (0-100%).

Original text:
${originalText}

Extracted information:
${extractedText}

Please respond in the following format:
Confidence Score: [0-100]%
Verification Result: [Your detailed analysis of the accuracy, including any discrepancies or missing information]`
      }
    ];

    // Construct the payload for the API request
    const payload = {
      messages,
      max_tokens: 500,
      temperature: 0.3,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 0.95,
      stream: false
    };

     // Make the request to the appropriate API provider
    if (apiConfig.provider === 'azure') {
      return makeAzureRequest(payload);
    } else if (apiConfig.provider === 'xai') {
      return makeXAIRequest(payload);
    } else if (apiConfig.provider === 'gemini') {
      return makeGeminiRequest(payload);
    } else {
      throw new Error(`Invalid API provider: ${apiConfig.provider}`);
    }
  } catch (error) {
    // Log and throw any errors
    console.error('Verification error:', error);
    throw new Error('Failed to verify extraction');
  }
};
