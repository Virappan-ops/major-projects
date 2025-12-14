const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAiResponse = async (req, res) => {
  const { prompt, image } = req.body; // Image ab base64 format me aayega

  try {
    // Use Flash model (Faster & Multimodal)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let result;
    
    if (image) {
      // Agar image hai (PDF page or Image file)
      const imageData = {
        inlineData: {
          data: image.split(",")[1], // Remove "data:image/png;base64," prefix
          mimeType: "image/png", // Assuming PNG/JPEG conversion on frontend
        },
      };
      result = await model.generateContent([prompt || "Analyze this image", imageData]);
    } else {
      // Text only
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "AI processing failed." });
  }
};

module.exports = { getAiResponse };