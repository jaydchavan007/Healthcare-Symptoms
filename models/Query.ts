import mongoose, { Schema, Document } from 'mongoose';

export interface IQuery extends Document {
  userId: mongoose.Types.ObjectId;
  symptoms: string;
  result: string;
  createdAt: Date;
}

const QuerySchema = new Schema<IQuery>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symptoms: { type: String, required: true },
  result: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Query || mongoose.model<IQuery>('Query', QuerySchema);
