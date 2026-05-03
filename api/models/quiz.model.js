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
        key: { type: String, required: true },
        title: String,
        description: String,
        image: String
      }
    ],

    shares: {
      type: Number,
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
quizSchema.index({ shares: -1 });
quizSchema.index({ isTrending: -1 });

export default mongoose.model("Quiz", quizSchema);