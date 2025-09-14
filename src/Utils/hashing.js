import bcrypt from 'bcrypt';

export const hashPassword = (data) => {
    return bcrypt.hashSync(data, parseInt(process.env.SALT_ROUNDS));
}

export const comparePassword = (plainText, hashedPassword) => {
    return bcrypt.compareSync(plainText, hashedPassword);
}