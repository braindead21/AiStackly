import { Schema, model, models } from "mongoose";

export interface ItemDoc {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<ItemDoc>({
  name: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 2000 },
}, { timestamps: true });

export const ItemModel = models.Item || model<ItemDoc>("Item", ItemSchema);