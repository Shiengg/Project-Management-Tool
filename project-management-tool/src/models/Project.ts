import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 1,
    },
    member: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    due: {
      type: Date,
      default: null,
    },
    theme: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const taskListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  list: [taskSchema],
});

const logSchema = new Schema(
  {
    email: String,
    action: String,
  },
  { timestamps: true }
);

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    member: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    list: [taskListSchema],
    state: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    theme: String,
    log: [logSchema],
  },
  { timestamps: true }
);

if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
