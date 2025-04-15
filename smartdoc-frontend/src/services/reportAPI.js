import API from "./Api";

export const generateReport = async (fileType, prompt, pageLimit) => {
  const response = await API.post("/api/report/generate", {
    fileType,
    prompt,
    pageLimit,
  });
  return response.data;
};
