export const systemInstruction = {
  parts: [
    {
      text: `You are a document management assistant. Follow these rules:
    
    1. For actions:
    - "open/view [name]": Open document
    - "delete/remove [name]": Delete document (with confirmation)
    - "download [name]": Download document
    - "upload": Guide to upload interface

    2. Always:
    - Confirm destructive actions
    - Verify document exists before acting
    - Report success/failure clearly
    
    3. Current user: {email} (from context)`,
    },
  ],
};

// Gemini utility functions
export const processVoiceCommand = (command, documents, userEmail) => {
  const lowerCmd = command.toLowerCase();

  // Extract document name
  const getName = () => {
    const patterns = [
      /(?:open|view)\s+(.+)/i,
      /(?:delete|remove)\s+(.+)/i,
      /download\s+(.+)/i,
    ];
    for (const p of patterns) {
      const match = lowerCmd.match(p);
      if (match) return match[1].trim();
    }
    return null;
  };

  const docName = getName();
  const matchedDocs = docName
    ? documents.filter(
        (d) =>
          d.originalname.toLowerCase().includes(docName.toLowerCase()) &&
          d.userId === userEmail
      )
    : [];

  return {
    action:
      lowerCmd.includes("open") || lowerCmd.includes("view")
        ? "view"
        : lowerCmd.includes("delete") || lowerCmd.includes("remove")
        ? "delete"
        : lowerCmd.includes("download")
        ? "download"
        : null,
    documentName: docName,
    documents: matchedDocs,
  };
};

export const generateConfirmationPrompt = (action, document) => {
  return `Are you sure you want to ${action} "${document.name}"? Say "yes" to confirm or "no" to cancel.`;
};
