import mongoose, { Schema, Model } from 'mongoose';

export interface IToolUsageStats {
  toolId: string;
  toolName: string;
  count: number;
  lastUsed: Date;
}

export interface IUserAnalytics {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  toolsUsed: IToolUsageStats[];
  totalRequests: number;
  totalTokens: number;
  createdAt: Date;
  updatedAt: Date;
}

const ToolUsageStatsSchema = new Schema<IToolUsageStats>(
  {
    toolId: { type: String, required: true },
    toolName: { type: String, required: true },
    count: { type: Number, default: 1 },
    lastUsed: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserAnalyticsSchema = new Schema<IUserAnalytics>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    toolsUsed: [ToolUsageStatsSchema],
    totalRequests: {
      type: Number,
      default: 0,
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user + date queries
UserAnalyticsSchema.index({ userId: 1, date: -1 });

const UserAnalytics: Model<IUserAnalytics> = 
  mongoose.models.UserAnalytics || mongoose.model<IUserAnalytics>('UserAnalytics', UserAnalyticsSchema);

export default UserAnalytics;
