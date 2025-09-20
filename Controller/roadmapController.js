import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import Roadmap from "../Model/Roadmap.js";
import dotenv from "dotenv";
import PDFDocument from "pdfkit";

dotenv.config();

// Initialize Google Generative AI with your API Key
const genAI = new GoogleGenerativeAI("AIzaSyAYZVfrOFjgj2sBPOkU9lfbLAmzdY-bY1I");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// ===== GENERATE ROADMAP =====
// const generateRoadmap = async (req, res) => {
//   const { careerAspiration, industryField, userId } = req.body;

//   // Validation
//   if (!careerAspiration?.trim())
//     return res.status(400).json({ message: "Career Aspiration is required." });

//   if (!industryField?.trim())
//     return res.status(400).json({ message: "Industry Field is required." });

//   if (!userId?.trim())
//     return res.status(400).json({ message: "User ID is required." });

//   try {
//     const prompt = `
// Analyze the user's career aspiration and industry field:
// ${JSON.stringify({ careerAspiration, industryField })}

// Generate a career roadmap from beginner to advanced.
// Each node must have:
// - id, title, description, resources (official docs/YouTube/blogs), x, y, color
// Include at least 10 nodes.
// Connections array should use "source" and "target".
// Output JSON only: { "nodes": [...], "connections": [...] }
// `;

//     // Call Gemini
//     const result = await model.generateContent({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     const text = result.response.text();

//     // Extract JSON safely
//     let jsonString = text;
//     if (text.startsWith("```json")) {
//       jsonString = text.substring(7, text.lastIndexOf("```")).trim();
//     } else {
//       const jsonStart = text.indexOf("{");
//       const jsonEnd = text.lastIndexOf("}");
//       if (jsonStart !== -1 && jsonEnd !== -1) {
//         jsonString = text.slice(jsonStart, jsonEnd + 1);
//       }
//     }

//     let parsed;
//     try {
//       parsed = JSON.parse(jsonString);
//     } catch (err) {
//       console.error("❌ Failed to parse AI response:", err.message);
//       return res.status(500).json({ message: "Invalid AI response format." });
//     }

//     // Normalize nodes
//     parsed.nodes = (parsed.nodes || []).map((node, i) => ({
//       id: node.id || `node-${i + 1}`,
//       title: node.title || `Step ${i + 1}`,
//       description: node.description || "",
//       x: node.x ?? i * 200, // fallback layout
//       y: node.y ?? 100,
//       color: node.color || "#3498db",
//       resources: (node.resources || []).map((r) =>
//         typeof r === "string" ? { url: r, description: "Official resource" } : r
//       ),
//     }));

//     // Normalize + filter connections
//     parsed.connections = (parsed.connections || [])
//       .map((c) => ({
//         source: c.source || c.from,
//         target: c.target || c.to,
//       }))
//       .filter((c) => c.source && c.target);

//     // Save roadmap
//     const newRoadmap = new Roadmap({
//       _id: uuidv4(),
//       careerAspiration,
//       industryField,
//       userId,
//       nodes: parsed.nodes,
//       connections: parsed.connections,
//     });

//     await newRoadmap.save();

//     res.status(201).json({
//       message: "Roadmap generated and saved successfully!",
//       roadmapId: newRoadmap._id,
//       nodes: parsed.nodes,
//       connections: parsed.connections,
//     });
//   } catch (error) {
//     console.error("❌ Error generating roadmap:", error);
//     if (error.response) {
//       console.error("Gemini API Error:", await error.response.text());
//     }
//     res.status(500).json({
//       message: "Failed to generate or save roadmap. Please try again later.",
//     });
//   }
// };



// const generateRoadmap = async (req, res) => {
//   const { careerAspiration, industryField, userId } = req.body;

//   // Validation
//   if (!careerAspiration?.trim())
//     return res.status(400).json({ message: "Career Aspiration is required." });

//   if (!industryField?.trim())
//     return res.status(400).json({ message: "Industry Field is required." });

//   if (!userId?.trim())
//     return res.status(400).json({ message: "User ID is required." });

//   try {
//     const prompt = `
// Analyze the user's career aspiration and industry field:
// ${JSON.stringify({ careerAspiration, industryField })}

// Generate a career roadmap from beginner to advanced.

// Each node must include:
// - id
// - title
// - description
// - resources: include ONLY free and official resources 
//   (official docs, YouTube channels like freeCodeCamp, blogs, or open-course platforms). 
//   Each resource must be in this exact format:
//   { "url": "https://...", "description": "..." }
// - x
// - y
// - color

// Include at least 10 nodes.

// Connections array should use "source" and "target".

// Output JSON only in this exact structure:
// {
//   "nodes": [
//     {
//       "id": "node-1",
//       "title": "...",
//       "description": "...",
//       "resources": [
//         { "url": "https://official-link.com", "description": "Official Documentation" }
//       ],
//       "x": 0,
//       "y": 0,
//       "color": "#3498db"
//     }
//   ],
//   "connections": [
//     { "source": "node-1", "target": "node-2" }
//   ]
// }
// `;

//     // Call Gemini
//     const result = await model.generateContent({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     const text = result.response.text();

//     // Extract JSON safely
//     let jsonString = text;
//     if (text.startsWith("```json")) {
//       jsonString = text.substring(7, text.lastIndexOf("```")).trim();
//     } else {
//       const jsonStart = text.indexOf("{");
//       const jsonEnd = text.lastIndexOf("}");
//       if (jsonStart !== -1 && jsonEnd !== -1) {
//         jsonString = text.slice(jsonStart, jsonEnd + 1);
//       }
//     }

//     let parsed;
//     try {
//       parsed = JSON.parse(jsonString);
//     } catch (err) {
//       console.error("❌ Failed to parse AI response:", err.message);
//       return res.status(500).json({ message: "Invalid AI response format." });
//     }

//     // ✅ Validate nodes + resources
//     parsed.nodes = (parsed.nodes || []).map((node, i) => {
//       const resources =
//         (node.resources || []).filter(
//           (r) => r.url && r.description && r.url.startsWith("http")
//         );

//       if (resources.length === 0) {
//         throw new Error(`Node ${i + 1} is missing official resources.`);
//       }

//       return {
//         id: node.id || `node-${i + 1}`,
//         title: node.title || `Step ${i + 1}`,
//         description: node.description || "",
//         x: node.x ?? i * 200,
//         y: node.y ?? 100,
//         color: node.color || "#3498db",
//         resources,
//       };
//     });

//     // Normalize + filter connections
//     parsed.connections = (parsed.connections || [])
//       .map((c) => ({
//         source: c.source || c.from,
//         target: c.target || c.to,
//       }))
//       .filter((c) => c.source && c.target);

//     // Save roadmap
//     const newRoadmap = new Roadmap({
//       _id: uuidv4(),
//       careerAspiration,
//       industryField,
//       userId,
//       nodes: parsed.nodes,
//       connections: parsed.connections,
//     });

//     await newRoadmap.save();

//     res.status(201).json({
//       message: "Roadmap generated and saved successfully!",
//       roadmapId: newRoadmap._id,
//       nodes: parsed.nodes,
//       connections: parsed.connections,
//     });
//   } catch (error) {
//     console.error("❌ Error generating roadmap:", error.message);
//     if (error.response) {
//       console.error("Gemini API Error:", await error.response.text());
//     }
//     res.status(500).json({
//       message:
//         "Failed to generate or save roadmap. Please try again later.",
//     });
//   }
// };
 


const generateRoadmap = async (req, res) => {
  const { careerAspiration, industryField, userId } = req.body;

  // Validation
  if (!careerAspiration?.trim())
    return res.status(400).json({ message: "Career Aspiration is required." });

  if (!industryField?.trim())
    return res.status(400).json({ message: "Industry Field is required." });

  if (!userId?.trim())
    return res.status(400).json({ message: "User ID is required." });

  try {
    const prompt = `
Analyze the user's career aspiration and industry field:
${JSON.stringify({ careerAspiration, industryField })}

Generate a career roadmap from beginner to advanced.

Each node must include:
- id
- title
- description
- resources: MUST include at least 1 real and valid free official link.
  - Every resource must be a valid live link starting with "https://"
  - Allowed sources: official documentation, YouTube educational channels (e.g., freeCodeCamp), blogs, or open-course platforms.
  - Format strictly as an array of objects:
    { "url": "https://...", "description": "..." }
- x
- y
- color

Include at least 10 nodes.

Connections array should use "source" and "target".

Output JSON only in this exact structure:
{
  "nodes": [
    {
      "id": "node-1",
      "title": "...",
      "description": "...",
      "resources": [
        { "url": "https://official-link.com", "description": "Official Documentation" }
      ],
      "x": 0,
      "y": 0,
      "color": "#3498db"
    }
  ],
  "connections": [
    { "source": "node-1", "target": "node-2" }
  ]
}
`;

    // Call Gemini
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text();

    // Extract JSON safely
    let jsonString = text;
    if (text.startsWith("```json")) {
      jsonString = text.substring(7, text.lastIndexOf("```")).trim();
    } else {
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonString = text.slice(jsonStart, jsonEnd + 1);
      }
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      console.error("❌ Failed to parse AI response:", err.message);
      return res.status(500).json({ message: "Invalid AI response format." });
    }

    // ✅ Validate nodes + enforce real links
    parsed.nodes = (parsed.nodes || []).map((node, i) => {
      const resources = (node.resources || []).filter(
        (r) =>
          typeof r === "object" &&
          r.url &&
          r.description &&
          r.url.startsWith("https://")
      );

      if (resources.length === 0) {
        throw new Error(
          `❌ Node ${i + 1} is missing valid official resources (must include https:// link).`
        );
      }

      return {
        id: node.id || `node-${i + 1}`,
        title: node.title || `Step ${i + 1}`,
        description: node.description || "",
        x: node.x ?? i * 200,
        y: node.y ?? 100,
        color: node.color || "#3498db",
        resources,
      };
    });

    // Normalize + filter connections
    parsed.connections = (parsed.connections || [])
      .map((c) => ({
        source: c.source || c.from,
        target: c.target || c.to,
      }))
      .filter((c) => c.source && c.target);

    // Save roadmap
    const newRoadmap = new Roadmap({
      _id: uuidv4(),
      careerAspiration,
      industryField,
      userId,
      nodes: parsed.nodes,
      connections: parsed.connections,
    });

    await newRoadmap.save();

    res.status(201).json({
      message: "Roadmap generated and saved successfully!",
      roadmapId: newRoadmap._id,
      nodes: parsed.nodes,
      connections: parsed.connections,
    });
  } catch (error) {
    console.error("❌ Error generating roadmap:", error.message);
    if (error.response) {
      console.error("Gemini API Error:", await error.response.text());
    }
    res.status(500).json({
      message:
        "Failed to generate or save roadmap. Please try again later.",
      error: error.message,
    });
  }
}



// ===== GET ROADMAP BY ID =====
const getRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId)
      return res.status(400).json({ message: "User ID is required." });

    const roadmap = await Roadmap.findOne({ _id: id, userId });

    if (!roadmap) {
      return res.status(404).json({
        message: "Roadmap not found or you do not have permission to view it.",
      });
    }

    res.status(200).json(roadmap);
  } catch (error) {
    console.error("❌ Error fetching roadmap:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ===== GET ROADMAPS BY USER =====
const getRoadmapsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res.status(400).json({ message: "User ID is required." });

    const roadmaps = await Roadmap.find({ userId });

    if (!roadmaps.length)
      return res
        .status(200)
        .json({ message: "No roadmaps found for this user." });

    res.status(200).json(roadmaps);
  } catch (error) {
    console.error("❌ Error fetching user roadmaps:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== DELETE ROADMAP BY ID =====
const deleteRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId)
      return res.status(400).json({ message: "User ID is required." });

    const deleted = await Roadmap.findOneAndDelete({ _id: id, userId });

    if (!deleted)
      return res
        .status(404)
        .json({ message: "Roadmap not found or unauthorized." });

    res.status(200).json({ message: "Roadmap deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting roadmap:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===== DOWNLOAD ROADMAP AS PDF =====
const downloadRoadmapAsPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId)
      return res.status(400).json({ message: "User ID is required." });

    const roadmap = await Roadmap.findOne({ _id: id, userId });
    if (!roadmap)
      return res
        .status(404)
        .json({ message: "Roadmap not found or unauthorized." });

    const doc = new PDFDocument();
    const filename = `Roadmap_${roadmap._id}.pdf`;

    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text(roadmap.careerAspiration, { underline: true });
    doc.moveDown();

    doc.fontSize(12).text("Roadmap Nodes:", { underline: true });
    doc.moveDown();

    roadmap.nodes?.forEach((node, index) => {
      doc.fontSize(12).text(`${index + 1}. ${node.title}`);
      node.resources?.forEach((r, i) => {
        doc.fontSize(10).text(`   ${i + 1}) ${r.description}: ${r.url}`);
      });
      doc.moveDown();
    });

    doc.fontSize(10).text("Created by Dream Box AI", { align: "center" });
    doc.end();
  } catch (error) {
    console.error("❌ PDF download error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  generateRoadmap,
  getRoadmapById,
  getRoadmapsByUser,
  deleteRoadmapById,
  downloadRoadmapAsPDF,
};
