import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    quizId: {
      type: String, // أو ObjectId لو هتعدّل frontend
      required: true
    },

    answers: {
      type: [String],
      required: true
    },

    resultKey: {
      type: String, // wolf / lion
      required: true
    },

    resultTitle: String,
    resultDescription: String,
    resultImage: String,

    timeSpent: Number
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);