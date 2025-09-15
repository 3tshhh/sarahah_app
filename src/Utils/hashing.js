import bcrypt from 'bcrypt';

export const hash = (data) => {
    return bcrypt.hashSync(data, parseInt(process.env.SALT_ROUNDS));
}

export const compareHash = (plainText, hashedPassword) => {
    return bcrypt.compareSync(plainText, hashedPassword);
}