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
    }
},
);

const BlackListedToken = mongoose.model('BlackListedToken', blackListedTokenModel);
export default BlackListedToken;