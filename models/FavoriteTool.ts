import mongoose, { Schema, Model } from 'mongoose';

export interface IFavoriteTool {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  toolId: string;
  toolName: string;
  addedAt: Date;
}

const FavoriteToolSchema = new Schema<IFavoriteTool>(
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
    },
    toolName: {
      type: String,
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index to ensure unique favorites per user
FavoriteToolSchema.index({ userId: 1, toolId: 1 }, { unique: true });

const FavoriteTool: Model<IFavoriteTool> = 
  mongoose.models.FavoriteTool || mongoose.model<IFavoriteTool>('FavoriteTool', FavoriteToolSchema);

export default FavoriteTool;
