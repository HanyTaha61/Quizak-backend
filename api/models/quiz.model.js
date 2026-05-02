import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    questions: [
      {
        text: { type: String, required: true },

        options: [
          {
            text: String,
            value: String,
          },
        ],
      },
    ],

    results: [
      {
        title: String,
        description: String,
        image: String,

        // scoring logic (viral logic)
        minScore: Number,
        maxScore: Number,
      },
    ],

    category: {
      type: String,
      default: "general",
      index: true,
    },

    tags: [String],

    // 🔥 viral metrics (important)
    plays: {
      type: Number,
      default: 0,
    },

    shares: {
      type: Number,
      default: 0,
    },

    avgCompletionTime: {
      type: Number, // seconds
      default: 0,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 index for viral discovery
quizSchema.index({ plays: -1, shares: -1 });
quizSchema.index({ category: 1, isTrending: -1 });

export default mongoose.model("Quiz", quizSchema);