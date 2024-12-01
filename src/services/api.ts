import axios from 'axios';
import { ChatResponse, APIProvider, APIConfig } from '../types/chat';

// Default configuration using environment variables
let apiConfig: APIConfig = {
  provider: 'azure',
  azure: {
    endpoint: import.meta.env.VITE_AZURE_ENDPOINT,
    apiKey: import.meta.env.VITE_AZURE_API_KEY,
    deploymentName: import.meta.env.VITE_AZURE_DEPLOYMENT_NAME
  },
  xai: {
    apiKey: import.meta.env.VITE_XAI_API_KEY,
    model: 'grok-vision-beta'
  }
};

export const setAPIProvider = (provider: APIProvider) => {
  apiConfig.provider = provider;
};

const makeAzureRequest = async (payload: any): Promise<ChatResponse> => {
 
  if (!apiConfig.azure) throw new Error('Azure configuration not found');
  console.log({ payload, model: "azure" })
  const { endpoint, apiKey, deploymentName } = apiConfig.azure;
  const response = await axios.post(
    `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-15-preview`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      }
    }
  );
 
  return response.data;
};

const makeXAIRequest = async (payload: any): Promise<ChatResponse> => {
  if (!apiConfig.xai) throw new Error('X.AI configuration not found');

  const { apiKey, model } = apiConfig.xai;
  console.log({ payload, model: "xai" })
   
  const xaiPayload = {
    ...payload,
    model, 
  };

  console.log({xaiPayload})


  const response = await axios.post(
    'https://api.x.ai/v1/chat/completions',
    xaiPayload,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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

export const analyzeImage = async (imageUrl: string, prompt: string): Promise<ChatResponse> => {
  try {
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          }
        ]
      }
    ];

    const payload = {
      messages,
      max_tokens: 800,
      temperature: 0.3,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 0.95,
      stream: false
    };

 
    return apiConfig.provider === 'azure'
      ? makeAzureRequest(payload)
      : makeXAIRequest(payload);
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze image');
  }
};

export const verifyExtraction = async (originalText: string, extractedText: string): Promise<ChatResponse> => {
  try {
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

    const payload = {
      messages,
      max_tokens: 500,
      temperature: 0.3,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 0.95,
      stream: false
    };

    return apiConfig.provider !== 'azure'
      ? makeAzureRequest(payload)
      : makeXAIRequest(payload);
  } catch (error) {
    console.error('Verification error:', error);
    throw new Error('Failed to verify extraction');
  }
};
