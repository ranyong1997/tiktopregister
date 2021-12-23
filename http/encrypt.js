/**
 * MD5
 * @param content
 * @returns {string}
 */
function md5(content) {
    return crypto.createHash('md5').update(content).digest("hex");
}

/**
 * SHA1
 * @param content
 * @returns {string}
 */
function sha1(content) {
    return crypto.createHash('sha1').update(content).digest("hex");
}

/**
 * Hmac
 * @param content
 * @param secretKey
 * @returns {string}
 */
function sha256(content, secretKey) {
    let hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(content);
    return hmac.digest('hex');
}

/**
 * aesEncrypt
 * @param data
 * @param key
 * @returns {*}
 */
function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

/**
 * aesDecrypt
 * @param encrypted
 * @param key
 * @returns {*}
 */
function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

/**
 * base64加密
 * @param content
 * @returns {string}
 */
function base64Encode(content) {
    return new Buffer.from(content).toString('base64');
}

/**
 * base64解码
 * @param encryptContent
 * @returns {string}
 */
function base64Decode(encryptContent) {
    return new Buffer.from(encryptContent, 'base64').toString();;
}

const iv_default = 'asdfjqiwoelkqjer';
/**
 * 加密方法
 * @param key 加密key
 * @param iv       向量
 * @param data     需要加密的数据
 * @returns string
 */
function appEncrypt(data, key, iv) {
    if (!iv) {
        iv = iv_default;
    }
    let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'binary');
    encrypted += cipher.final('binary');
    encrypted = new Buffer.from(encrypted, 'binary').toString('base64');
    return encrypted;
}

/**
 * 解密方法
 * @param key      解密的key
 * @param iv       向量
 * @param encrypted  密文
 * @returns string
 */
function appDecrypt(encrypted, key, iv) {
    if (!iv) {
        iv = iv_default;
    }
    encrypted = new Buffer.from(encrypted, 'base64').toString('binary');
    console.log(encrypted.length)
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decoded = decipher.update(encrypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
}

function generateUuid() {
    return uuid.v4();
}

function sha256HMAC(content, secret) {
    return new Buffer(
        crypto.createHmac('SHA256', secret).update(content).digest('hex')
    ).toString('base64');
}

function sha1HMAC(content, secret) {
    return new Buffer(
        crypto.createHmac('SHA1', secret).update(content).digest('hex')
    ).toString('base64');
}

// 导出
module.exports = {
    md5: md5,
    sha1: sha1,
    sha256: sha256,
    aesEncrypt: aesEncrypt,
    aesDecrypt: aesDecrypt,
    base64Encode: base64Encode,
    base64Decode: base64Decode,
    appEncrypt: appEncrypt,
    appDecrypt: appDecrypt,
    generateUuid: generateUuid,
    sha256HMAC: sha256HMAC,
    sha1HMAC: sha1HMAC,
};