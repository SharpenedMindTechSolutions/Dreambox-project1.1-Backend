
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  url: { type: String, required: true },
  description: { type: String, default: "resource" },
});

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  resources: [resourceSchema],
  color: { type: String },
});

const connectionSchema = new mongoose.Schema({
  source: { type: String, required: true },
  target: { type: String, required: true },
});

const roadmapSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  careerAspiration: { type: String, required: true },
  industryField: { type: String, required: true },
  nodes: [nodeSchema],
  connections: [connectionSchema],
  createdAt: { type: Date, default: Date.now },
});

const Roadmap = mongoose.model("Roadmap", roadmapSchema);
export default Roadmap;
