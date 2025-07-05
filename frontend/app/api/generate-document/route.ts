import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPTS = {
  'employment-contract': `You are a skilled legal document expert specializing in employment contracts. Based on the provided business context and natural language description, create a comprehensive, legally sound employment contract.

EXTRACT INFORMATION FROM CONTEXT:
- Company details (name, address, CIN, directors, etc.)
- Employee information (name, position, salary, etc.)
- Business nature and industry specifics
- Compliance requirements based on company type

GENERATE A COMPLETE EMPLOYMENT CONTRACT including:
1. PARTIES section with proper identification
2. EMPLOYMENT TERMS (position, start date, probation period)
3. COMPENSATION & BENEFITS (salary, benefits, pay schedule)
4. WORKING CONDITIONS (hours, location, reporting structure)
5. CONFIDENTIALITY & NON-DISCLOSURE clauses
6. INTELLECTUAL PROPERTY rights
7. TERMINATION conditions (notice period, severance)
8. NON-COMPETE and NON-SOLICITATION clauses (if applicable)
9. DISPUTE RESOLUTION mechanisms
10. GENERAL PROVISIONS (governing law, amendments, severability)

Use actual company details from the context. If specific details are missing, use industry-standard defaults appropriate for the company type. Make the document professional, legally compliant with Indian labor laws, and include all necessary legal language while remaining clear and readable.`,

  'gst-return': `You are an expert in Indian tax law and GST compliance. Based on the provided business context and natural language description, generate a comprehensive GST return filing document.

EXTRACT INFORMATION FROM CONTEXT:
- Company details (GSTIN, business name, address, turnover, etc.)
- Tax information (previous filings, TDS details, tax payments)
- Business nature and HSN/SAC codes
- Compliance status and filing history

GENERATE A COMPLETE GST RETURN DOCUMENT including:
1. BUSINESS IDENTIFICATION (GSTIN, business name, address)
2. RETURN PERIOD details
3. OUTWARD SUPPLIES summary
4. INWARD SUPPLIES and ITC details
5. TAX PAYMENT calculations
6. COMPLIANCE CHECKLIST
7. SUPPORTING DOCUMENTS required
8. FILING INSTRUCTIONS
9. PENALTY AVOIDANCE tips
10. RECORD KEEPING requirements

Use actual company data from the context. Ensure all calculations are accurate and include proper HSN/SAC codes, tax rates, and compliance dates.`,

  'legal-notice': `You are a skilled legal practitioner specializing in drafting legal notices. Based on the provided business context and natural language description, create a formal, legally sound notice.

EXTRACT INFORMATION FROM CONTEXT:
- Company details (name, address, CIN, directors, etc.)
- Business relationship or dispute details
- Legal grounds and applicable laws
- Specific requirements or demands

GENERATE A COMPLETE LEGAL NOTICE including:
1. PROPER HEADING with notice type
2. PARTIES identification (sender and recipient)
3. FACTUAL BACKGROUND
4. LEGAL GROUNDS and applicable laws
5. SPECIFIC DEMANDS or requirements
6. CONSEQUENCES of non-compliance
7. TIME LIMITS for response/compliance
8. LEGAL REMEDIES available
9. DECLARATION of good faith
10. SIGNATURE and service details

Use actual company information from the context. The notice should be formal, legally enforceable, and clearly communicate the sender's position and requirements.`,

  'compliance-status': `You are a compliance expert specializing in regulatory requirements across multiple domains. Based on the provided business context and natural language description, generate a comprehensive compliance status report.

EXTRACT INFORMATION FROM CONTEXT:
- Company details (name, type, industry, incorporation date, etc.)
- Current compliance status (filings, registrations, etc.)
- Business operations and regulatory requirements
- Past compliance history and any defaults

GENERATE A COMPLETE COMPLIANCE STATUS REPORT covering:
1. REGULATORY FRAMEWORK applicable
2. COMPLIANCE AREAS (tax, labor, environmental, industry-specific)
3. CURRENT STATUS assessment
4. PENDING REQUIREMENTS identification
5. RISK ASSESSMENT matrix
6. REMEDIAL ACTIONS required
7. TIMELINE for compliance
8. COST IMPLICATIONS
9. MONITORING MECHANISMS
10. DOCUMENTATION requirements

Use actual company information from the context. Provide actionable insights and prioritize compliance activities based on risk and legal requirements.`
};

// Analysis prompt for extracting structured data from user input
const ANALYSIS_PROMPT = `You are an expert legal document analyst. Your job is to extract structured information from user requests for legal documents.

Analyze the user's request and extract the following information in JSON format. If any information is not provided, use "NOT_PROVIDED" as the value.

For Employment Contract requests, extract:
- companyName: Name of the company/employer
- candidateName: Name of the employee/candidate
- position: Job title/role
- salary: Salary amount (include currency and format)
- startDate: Employment start date
- workLocation: Where the person will work
- employmentType: Full-time, Part-time, Contract, Internship, etc.
- probationPeriod: Probation duration if mentioned
- benefits: Any specific benefits mentioned
- workingHours: Working hours or schedule
- reportingTo: Manager or reporting structure
- specialClauses: Any special terms, non-compete, IP clauses, etc.

For GST Return requests, extract:
- businessName: Name of the business
- gstNumber: GST registration number
- returnPeriod: Period for the return (month/quarter/year)
- turnover: Business turnover amount
- taxableSupplies: Details of taxable supplies
- inputTaxCredit: ITC details if mentioned
- businessType: Type of business operations
- hsn_sac_codes: HSN or SAC codes mentioned

For Legal Notice requests, extract:
- senderName: Name of the notice sender
- recipientName: Name of the notice recipient
- noticeType: Type of legal notice (payment default, breach, etc.)
- amount: Money amount involved if any
- deadline: Response or action deadline
- subjectMatter: Main issue or dispute
- legalGrounds: Legal basis mentioned
- consequences: What happens if notice is ignored

For Compliance Status requests, extract:
- businessName: Name of the business
- complianceAreas: Specific compliance areas mentioned
- reviewPeriod: Time period for review
- businessType: Type of business entity
- industry: Industry sector
- specificConcerns: Particular compliance issues mentioned

Return ONLY a valid JSON object with the extracted information.`;

// Function to create enhanced system prompt based on extracted data
function createEnhancedSystemPrompt(documentType: string, basePrompt: string, extractedData: any, userRequest: string): string {
  let enhancedInstructions = '';

  switch (documentType) {
    case 'Employment Contract':
      enhancedInstructions = `
ENHANCED INSTRUCTIONS BASED ON USER REQUEST:
- Company Name: ${extractedData.companyName !== 'NOT_PROVIDED' ? `Use "${extractedData.companyName}" as the employer` : 'Use the company name from business context'}
- Employee Name: ${extractedData.candidateName !== 'NOT_PROVIDED' ? `Use "${extractedData.candidateName}" as the employee` : 'Use [EMPLOYEE NAME] placeholder'}
- Position: ${extractedData.position !== 'NOT_PROVIDED' ? `Create contract for "${extractedData.position}" role` : 'Use [POSITION] placeholder'}
- Salary: ${extractedData.salary !== 'NOT_PROVIDED' ? `Set compensation as "${extractedData.salary}"` : 'Use [SALARY AMOUNT] placeholder'}
- Start Date: ${extractedData.startDate !== 'NOT_PROVIDED' ? `Employment begins on "${extractedData.startDate}"` : 'Use [START DATE] placeholder'}
- Work Location: ${extractedData.workLocation !== 'NOT_PROVIDED' ? `Employee will work at/from "${extractedData.workLocation}"` : 'Use company address from business context'}
- Employment Type: ${extractedData.employmentType !== 'NOT_PROVIDED' ? `This is a "${extractedData.employmentType}" position` : 'Use "Full-time" as default'}
- Probation Period: ${extractedData.probationPeriod !== 'NOT_PROVIDED' ? `Include "${extractedData.probationPeriod}" probation clause` : 'Use standard 90-day probation'}
- Benefits: ${extractedData.benefits !== 'NOT_PROVIDED' ? `Include these specific benefits: "${extractedData.benefits}"` : 'Include standard Indian employment benefits'}
- Working Hours: ${extractedData.workingHours !== 'NOT_PROVIDED' ? `Set working schedule as "${extractedData.workingHours}"` : 'Use standard 9 AM to 6 PM, Monday to Friday'}
- Reporting Structure: ${extractedData.reportingTo !== 'NOT_PROVIDED' ? `Employee reports to "${extractedData.reportingTo}"` : 'Use [MANAGER NAME] placeholder'}
- Special Clauses: ${extractedData.specialClauses !== 'NOT_PROVIDED' ? `Include these specific terms: "${extractedData.specialClauses}"` : 'Include standard IP and confidentiality clauses'}

USER'S SPECIFIC FOCUS: ${userRequest}

Generate a comprehensive employment contract that addresses all the specific details mentioned above.`;
      break;

    case 'GST Return Filing Document':
      enhancedInstructions = `
ENHANCED INSTRUCTIONS BASED ON USER REQUEST:
- Business Name: ${extractedData.businessName !== 'NOT_PROVIDED' ? `Use "${extractedData.businessName}" as the business entity` : 'Use company name from business context'}
- GST Number: ${extractedData.gstNumber !== 'NOT_PROVIDED' ? `Use "${extractedData.gstNumber}" as GSTIN` : 'Use [GST NUMBER] placeholder or derive from business context'}
- Return Period: ${extractedData.returnPeriod !== 'NOT_PROVIDED' ? `Generate return for "${extractedData.returnPeriod}"` : 'Use current quarter/month'}
- Turnover: ${extractedData.turnover !== 'NOT_PROVIDED' ? `Business turnover is "${extractedData.turnover}"` : 'Use turnover from business context'}
- Taxable Supplies: ${extractedData.taxableSupplies !== 'NOT_PROVIDED' ? `Include these supplies: "${extractedData.taxableSupplies}"` : 'Use business operations from context'}
- Input Tax Credit: ${extractedData.inputTaxCredit !== 'NOT_PROVIDED' ? `ITC details: "${extractedData.inputTaxCredit}"` : 'Calculate based on business context'}
- HSN/SAC Codes: ${extractedData.hsn_sac_codes !== 'NOT_PROVIDED' ? `Use these codes: "${extractedData.hsn_sac_codes}"` : 'Use codes from business context (84795000, 85176290)'}

USER'S SPECIFIC FOCUS: ${userRequest}

Generate a detailed GST return document addressing all the specific requirements mentioned above.`;
      break;

    case 'Legal Notice':
      enhancedInstructions = `
ENHANCED INSTRUCTIONS BASED ON USER REQUEST:
- Sender: ${extractedData.senderName !== 'NOT_PROVIDED' ? `Notice is from "${extractedData.senderName}"` : 'Use company name from business context'}
- Recipient: ${extractedData.recipientName !== 'NOT_PROVIDED' ? `Notice is to "${extractedData.recipientName}"` : 'Use [RECIPIENT NAME] placeholder'}
- Notice Type: ${extractedData.noticeType !== 'NOT_PROVIDED' ? `This is a "${extractedData.noticeType}" notice` : 'Determine from context of dispute'}
- Amount: ${extractedData.amount !== 'NOT_PROVIDED' ? `The matter involves "${extractedData.amount}"` : 'Use [AMOUNT] placeholder if money is involved'}
- Deadline: ${extractedData.deadline !== 'NOT_PROVIDED' ? `Response required by "${extractedData.deadline}"` : 'Use 15 days from notice date'}
- Subject Matter: ${extractedData.subjectMatter !== 'NOT_PROVIDED' ? `The dispute is about "${extractedData.subjectMatter}"` : 'Use user description of the issue'}
- Legal Grounds: ${extractedData.legalGrounds !== 'NOT_PROVIDED' ? `Base notice on "${extractedData.legalGrounds}"` : 'Use appropriate Indian contract/business law'}
- Consequences: ${extractedData.consequences !== 'NOT_PROVIDED' ? `If ignored: "${extractedData.consequences}"` : 'Standard legal action as per law'}

USER'S SPECIFIC FOCUS: ${userRequest}

Generate a formal legal notice addressing all the specific details mentioned above.`;
      break;

    case 'Compliance Status Report':
      enhancedInstructions = `
ENHANCED INSTRUCTIONS BASED ON USER REQUEST:
- Business Name: ${extractedData.businessName !== 'NOT_PROVIDED' ? `Report for "${extractedData.businessName}"` : 'Use company name from business context'}
- Compliance Areas: ${extractedData.complianceAreas !== 'NOT_PROVIDED' ? `Focus on "${extractedData.complianceAreas}"` : 'Cover tax, labor, corporate, and industry-specific compliance'}
- Review Period: ${extractedData.reviewPeriod !== 'NOT_PROVIDED' ? `Report covers "${extractedData.reviewPeriod}"` : 'Use current financial year'}
- Business Type: ${extractedData.businessType !== 'NOT_PROVIDED' ? `Entity is "${extractedData.businessType}"` : 'Use Private Limited Company from context'}
- Industry: ${extractedData.industry !== 'NOT_PROVIDED' ? `Business operates in "${extractedData.industry}"` : 'R&D in physical and engineering sciences'}
- Specific Concerns: ${extractedData.specificConcerns !== 'NOT_PROVIDED' ? `Address these issues: "${extractedData.specificConcerns}"` : 'General compliance review'}

USER'S SPECIFIC FOCUS: ${userRequest}

Generate a comprehensive compliance status report addressing all the specific requirements mentioned above.`;
      break;

    default:
      enhancedInstructions = '';
  }

  return basePrompt + enhancedInstructions;
}

export async function POST(request: NextRequest) {
  try {
    const { command, context, specificRequest } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Determine document type
    let documentType = '';
    let baseSystemPrompt = '';
    
    switch (command) {
      case '@Generate Employment Contract':
        documentType = 'Employment Contract';
        baseSystemPrompt = SYSTEM_PROMPTS['employment-contract'];
        break;
      case '@File GST Return':
        documentType = 'GST Return Filing Document';
        baseSystemPrompt = SYSTEM_PROMPTS['gst-return'];
        break;
      case '@Draft Legal Notice':
        documentType = 'Legal Notice';
        baseSystemPrompt = SYSTEM_PROMPTS['legal-notice'];
        break;
      case '@Check Compliance Status':
        documentType = 'Compliance Status Report';
        baseSystemPrompt = SYSTEM_PROMPTS['compliance-status'];
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid command' },
          { status: 400 }
        );
    }

    // STEP 1: Analyze user prompt to extract structured data
    const analysisCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: ANALYSIS_PROMPT },
        { role: "user", content: `Document Type: ${documentType}\n\nUser Request: ${specificRequest}\n\nBusiness Context: ${context}` }
      ],
      temperature: 0.1,
      max_tokens: 1000,
    });

    let extractedData = {};
    try {
      const analysisResult = analysisCompletion.choices[0]?.message?.content;
      if (analysisResult) {
        extractedData = JSON.parse(analysisResult);
      }
    } catch (parseError) {
      console.log('Could not parse analysis result, continuing with empty data');
    }

    // STEP 2: Create enhanced system prompt based on extracted data
    const enhancedSystemPrompt = createEnhancedSystemPrompt(documentType, baseSystemPrompt, extractedData, specificRequest);

    // STEP 3: Build comprehensive user message
    const userMessage = `Based on the following information, generate a ${documentType}:

BUSINESS CONTEXT:
${context}

EXTRACTED DETAILS:
${JSON.stringify(extractedData, null, 2)}

USER'S SPECIFIC REQUEST:
${specificRequest}

Please create a professional, legally compliant document that incorporates all the specific details mentioned by the user and utilizes the business context provided.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: enhancedSystemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.1,
      max_tokens: 4000,
    });

    const generatedDocument = completion.choices[0]?.message?.content;

    if (!generatedDocument) {
      return NextResponse.json(
        { error: 'Failed to generate document' },
        { status: 500 }
      );
    }

    // Generate a mock blockchain hash for document integrity
    const blockchainHash = `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`;

    return NextResponse.json({
      success: true,
      document: generatedDocument,
      documentType,
      blockchainHash,
      timestamp: new Date().toISOString(),
      extractedData,
      context,
      specificRequest
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    );
  }
} 