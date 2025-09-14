import crypto from 'crypto';

const IV_LENGTH = 16;
const encryption = Buffer.from(process.env.ENCRYPTION_KEY)

export function encrypt(data) {
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv('aes-256-cbc', encryption, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}