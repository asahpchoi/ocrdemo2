import axios from 'axios';
import { ChatResponse } from '../types/chat';

const API_URL = import.meta.env.VITE_AZURE_ENDPOINT;
const API_KEY = import.meta.env.VITE_AZURE_API_KEY;
const DEPLOYMENT_NAME = import.meta.env.VITE_AZURE_DEPLOYMENT_NAME;

export const analyzeImage = async (imageUrl: string, prompt: string): Promise<ChatResponse> => {
  try {
    const payload = {
      messages: [
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
      ],
      max_tokens: 800,
      temperature: 0.3,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 0.95
    };

    const response = await axios.post(
      `${API_URL}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to analyze image');
  }
};

export const verifyExtraction = async (originalText: string, extractedText: string): Promise<ChatResponse> => {
  try {
    const payload = {
      messages: [
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
      ],
      max_tokens: 500,
      temperature: 0.3,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 0.95
    };

    const response = await axios.post(
      `${API_URL}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to verify extraction');
  }
};