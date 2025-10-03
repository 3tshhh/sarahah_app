import { model, Schema } from "mongoose";
import {
  GenderEnum,
  ProvidersEnum,
  RoleEnum,
} from "../../Common/enums/user.enum.js";
import { decrypt } from "../../Utils/encrypt.symmetric.util.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: [3, "too short user name"],
      maxlength: [20, "too long user name"],
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
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
      enum: { values: Object.values(GenderEnum), default: GenderEnum.MALE },
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
      index: {
        name: "idx_age",
        unique: false,
      },
    },
    isConfirmed: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
    otps: {
      reset: { type: String, default: null },
      confirm: { type: String, default: null },
      createdAt: { type: Date, default: null },
    },
    phone: { type: String },
    provider: {
      type: String,
      enum: Object.values(ProvidersEnum),
      default: ProvidersEnum.LOCAL,
    },
    googleSub: String,
    profilePicture: {
      secure_url:String,
      public_id:String
    },
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
      phoneNumber: {
        get() {
          return this.phone ? decrypt(this.phone) : null;
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

export const User = model("User", userSchema);

