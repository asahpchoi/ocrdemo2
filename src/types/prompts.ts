export interface SystemPrompt {
  id: string;
  name: string;
  prompt: string;
  description: string;
}

export const systemPrompts: SystemPrompt[] = [
  {
    id: 'food-analysis',
    name: 'Food Analysis',
    description: 'Analyze food images for ingredients, nutritional information, and cuisine type',
    prompt: `Analyze this food image in detail. Please provide:
1. Dish identification and cuisine type
2. Main ingredients visible in the image
3. Estimated nutritional information
4. Preparation method (if visible)
5. Presentation and plating analysis
6. Any unique characteristics or special features`
  },
  {
    id: 'medical-document',
    name: 'Medical Document Extraction',
    description: 'Extract key information from medical documents and reports',
    prompt: `Extract and organize information from this medical document. Please identify:
1. Patient information (if present)
2. Document type and date
3. Key medical findings or test results
4. Diagnosis information
5. Treatment recommendations
6. Important values and measurements
7. Any critical alerts or warnings
Please format the information clearly and highlight any abnormal values.`
  },
  {
    id: 'table-extraction',
    name: 'Table Data Extraction',
    description: 'Extract and structure data from tables in images',
    prompt: `Extract the data from this table image. Please:
1. Identify column headers and row labels
2. Extract all cell values maintaining their relationships
3. Organize the data in a structured format
4. Note any merged cells or special formatting
5. Highlight any totals or summary rows
6. Indicate any footnotes or special notations
Present the extracted data in a clear, tabular format using markdown.`
  },
  {
    id: 'receipt-analysis',
    name: 'Receipt Analysis',
    description: 'Extract key information from receipts and invoices',
    prompt: `Analyze this receipt/invoice image and extract:
1. Merchant/Business name and details
2. Date and time of transaction
3. Individual items and their prices
4. Subtotal, tax, and total amounts
5. Payment method (if shown)
6. Any discounts or special charges
7. Receipt/Invoice number
Please organize the information in a clear, structured format.`
  },
  {
    id: 'document-ocr',
    name: 'General Document OCR',
    description: 'Extract text and structure from general documents',
    prompt: `Extract and analyze the content of this document. Please:
1. Extract all visible text while maintaining document structure
2. Identify document type and purpose
3. Note any headers, sections, or key divisions
4. Capture any signatures or stamps
5. Extract any dates, reference numbers, or key identifiers
6. Maintain formatting where relevant (lists, paragraphs, etc.)
Present the information in a well-organized, hierarchical structure.`
  },
  {
    id: 'business-card',
    name: 'Business Card Analysis',
    description: 'Extract contact information from business cards',
    prompt: `Extract all relevant information from this business card:
1. Full name and title/position
2. Company name and logo description
3. Contact information (phone, email, website)
4. Physical address
5. Social media handles (if present)
6. Any additional services or qualifications listed
7. Design elements and branding features
Present the information in a structured, easy-to-read format.`
  }
];
