import mongoose, { Schema, Model } from 'mongoose';

export interface ISavedOutput {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  toolId: string;
  toolName: string;
  input: string;
  imageUrl?: string;
  fileName?: string;
  result: string;
  tokensUsed: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SavedOutputSchema = new Schema<ISavedOutput>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    toolId: {
      type: String,
      required: true,
      index: true,
    },
    toolName: {
      type: String,
      required: true,
    },
    input: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    result: {
      type: String,
      required: true,
    },
    tokensUsed: {
      promptTokens: {
        type: Number,
        required: true,
      },
      completionTokens: {
        type: Number,
        required: true,
      },
      totalTokens: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user + tool queries
SavedOutputSchema.index({ userId: 1, toolId: 1 });
SavedOutputSchema.index({ userId: 1, createdAt: -1 });

const SavedOutput: Model<ISavedOutput> = 
  mongoose.models.SavedOutput || mongoose.model<ISavedOutput>('SavedOutput', SavedOutputSchema);

export default SavedOutput;
