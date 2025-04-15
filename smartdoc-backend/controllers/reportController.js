import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateReport = async (req, res) => {
  try {
    const { fileType, prompt, pageLimit } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Define formatting instructions for each file type
    const formatInstructions = {
      pdf: `
          You are creating a professional PDF document. Follow these guidelines:
          1. Structure with clear hierarchical headings (H1, H2, H3)
          2. Use formal, business-appropriate language
          3. Include proper spacing between sections (1.5 line spacing)
          4. Add page numbers in footer
          5. Use a clean, readable font style in your markdown
          6. Include these sections:
             - Title Page (Document title, author, date)
             - Table of Contents
             - Introduction (10-15% of content)
             - Main Content (60-70% divided into logical sections)
             - Conclusion/Recommendations (15-20%)
             - References (if applicable)
        `,
      docx: `
          You are creating a Microsoft Word document. Follow these guidelines:
          1. Use heading styles (Heading 1, Heading 2, etc.)
          2. Apply consistent formatting (font: Calibri 11pt or Times New Roman 12pt)
          3. Include bullet points for lists
          4. Use tables for data presentation when appropriate
          5. Add page breaks between major sections
          6. Structure with:
             - Cover page (title, subtitle, author)
             - Executive summary (1 paragraph)
             - Detailed content with sub-sections
             - Conclusion with actionable items
             - Appendices if needed
        `,
      pptx: `
          You are creating a PowerPoint presentation. Follow these guidelines:
          1. Create content for approximately ${Math.max(
            1,
            Math.floor(pageLimit / 2)
          )} slides
          2. Each slide should have:
             - A clear title (Title Case)
             - 4-6 bullet points maximum
             - Concise text (no full sentences)
             - Suggested visuals in notes (e.g., [INSERT CHART HERE])
          3. Structure:
             - Title slide (presentation title, subtitle, author)
             - Agenda/Outline slide
             - Content slides (1 concept per slide)
             - Summary slide
             - Q&A/Thank You slide
          4. Include speaker notes with additional details
          5. Use professional color schemes and layouts
        `,
    };

    const fullPrompt = `
        DOCUMENT CREATION REQUEST
        ========================
        Client needs: A ${fileType.toUpperCase()} document about "${prompt}"
        Target length: ${pageLimit} pages (approx. ${pageLimit * 350} words)
        Document purpose: Professional/business use
        
        FORMATTING INSTRUCTIONS:
        ${formatInstructions[fileType] || formatInstructions.pdf}
        
        CONTENT REQUIREMENTS:
        1. Use accurate, up-to-date information
        2. Maintain consistent tone throughout
        3. Include relevant examples/case studies
        4. Cite sources where appropriate
        5. Avoid jargon unless defined
        
        OUTPUT FORMAT:
        Please provide the complete document content ready for conversion to ${fileType.toUpperCase()}.
        Use appropriate markdown formatting for:
        - Headings
        - Lists
        - Emphasis
        - Section breaks
        - Any special elements
        
        SPECIAL NOTES:
        - The client will convert this to final ${fileType.toUpperCase()} format
        - Focus on content quality and structure
        - Include all necessary elements for professional presentation
      `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const generatedText = response.text();

    res.status(200).json({
      content: generatedText,
      fileType,
      suggestedFileName: `${prompt
        .replace(/[^a-zA-Z0-9]/g, "_")
        .slice(0, 30)}_${new Date().toISOString().split("T")[0]}.${fileType}`,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      error: "Failed to generate report",
      details: error.message,
      suggestion:
        "Please try again with a more specific prompt or adjust page length",
    });
  }
};

export const editReport = async (req, res) => {
  try {
    const { content, fileType } = req.body;
    res.status(200).json({
      content,
      fileType,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to edit report",
      details: error.message,
    });
  }
};
