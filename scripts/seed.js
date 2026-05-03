import mongoose from "mongoose";
import dotenv from "dotenv";
import Quiz from "../api/models/quiz.model.js";

dotenv.config({ path: "../.env" });

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Quiz.deleteMany();

  await Quiz.create({
    title: "أي حيوان يشبهك؟",
    slug: "animal",
    questions: [
      {
        text: "كيف تقضي وقت فراغك؟",
        options: [
          { text: "المغامرة", value: "lion" },
          { text: "الأصدقاء", value: "dolphin" },
          { text: "القراءة", value: "owl" },
          { text: "الوحدة", value: "wolf" }
        ]
      }
    ],
    results: [
      { key: "lion", title: "الأسد", description: "قائد", image: "" },
      { key: "dolphin", title: "الدلفين", description: "مرح", image: "" },
      { key: "owl", title: "البومة", description: "ذكي", image: "" },
      { key: "wolf", title: "الذئب", description: "غامض", image: "" }
    ]
  });

  console.log("✅ Seeded");
  process.exit();
};

seed();