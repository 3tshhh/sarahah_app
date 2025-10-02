import mongoose from "mongoose";

const blackListedTokenModel = mongoose.Schema(
    {
        tokenId:{
        type: String,
        required: true,
        index:{
            unique: true,
            name: "idx_tokenId_unique"
        }
    },
    expirationDate:{
        type: Date,
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},
);

export const BlackListedToken = mongoose.model('BlackListedToken', blackListedTokenModel);
