import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "too short user name"],
      maxlength: [20, "too long user name"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "too short user name"],
      maxlength: [20, "too long user name"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: {
        name: "idx_email_unique",
        unique: [false, "email already exists"],
      },
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: { values: ["male", "female"], default: "male" },
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
      required: true,
      index: {
        name: "idx_age",
        unique: false,
      },
    },
    isConfirmed: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    otps: {
      reset: { type: String, default: null },
      confirm: { type: String, default: null },
      createdAt: { type: Date, default: null },
    },
    phone: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    virtuals: {
      fullName: {
        get() {
          return this.firstName + " " + this.lastName;
        },
      },
    },
    methods: {
      getFullName() {
        return this.firstName + " " + this.lastName;
      },
    },
  }
);

userSchema.index(
  { firstName: 1, lastName: 1 },
  { name: "idx_first_last_unique", unique: true }
);

userSchema.virtual("Messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "receiverId",
});

const User = model("User", userSchema);

export default User;
