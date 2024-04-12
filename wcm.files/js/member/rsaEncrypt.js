 

var publicKey  = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKpU9CWE70krlLAfdzPe/ItHEppcEJBFhIGQfxTMb7g/S8BGArqGYDdGz9KwSaSFVOddI/OFxeyWFkhgNng4xgn+A7Djx1fcRGfBZZBUKMp68lweIVKrt50z9O3FTqbhawWsYAu4wCT8BoD/DVbhiF5yIUOzyJBYN0u8MERKMGKwIDAQAB'
 

// 加密
function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}
 