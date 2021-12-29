const REGISTER_STATUS = {
    DEFAULT: 0, // 系统生成
    ASSIGNMENT: 1, // 已分配
    SUCCESS: 2, // 成功
    FAIL: 3, // 注册失败
    BAN: 4, // 封号
    REGISTERED: 5, // 被注册
    TOOMANYATTEMPTS: 6, // 尝试太多次，稍后再试
    EMAIL_CODE_ERROR: 7, // 验证码错误
    EMAIL_CODE_TIMEOUT: 8,  // 获取邮箱验证码超过3分钟
    EMAIL_CODE_OPEN_FAILED: 9, // 获取验证码000500
    PHOTO_VERIFY_TIMEOUT: 10,  // 获取图片验证超时
    FACE_RECOGNITION: 11, // 人脸识别
    Content_Not_Found: 12   // 请求页失效
};

const REGISTER_APP_ID = {
    DEFAULT: 0,
    WHATSAPP: 1,
    FACEBOOK: 2,
    MESSAGE: 3,
    LINE: 4,
    INSTAGRAM: 5,
    TELEGRAM: 6,
    TWITTER: 7,
    SKYPE: 8,
    KAKAO: 9,
    GOOGLE_PLAY: 10,
    GMAIL: 11,
    TIKTOK: 12
}

const VPN_TYPE = {
    SOCKS: 0,
    HTTP: 1
}

const VPN_PROXY_TIMELINESS = {
    SHORT: 0,
    LONG: 1
}

const VPN_USE_ACTION_TAG = {
    COMMON: 0,
    REGISTER: 1,
    KEEP: 2
}

exports.REGISTER_STATUS = REGISTER_STATUS
exports.REGISTER_APP_ID = REGISTER_APP_ID
exports.VPN_TYPE = VPN_TYPE
exports.VPN_PROXY_TIMELINESS = VPN_PROXY_TIMELINESS
exports.VPN_USE_ACTION_TAG = VPN_USE_ACTION_TAG