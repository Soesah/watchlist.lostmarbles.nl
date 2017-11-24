
class UUIDUtil {

  static maxFromBits (bits) {
    return Math.pow(2, bits);
  }

  static getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomUI06 () {
    return UUIDUtil.getRandomInt(0, UUIDUtil.maxFromBits(6) - 1);
  }

  static randomUI08 () {
    return UUIDUtil.getRandomInt(0, UUIDUtil.maxFromBits(8) - 1);
  }

  static randomUI12 () {
    return UUIDUtil.getRandomInt(0, UUIDUtil.maxFromBits(12) - 1);
  }

  static randomUI16 () {
    return UUIDUtil.getRandomInt(0, UUIDUtil.maxFromBits(16) - 1);
  }

  static randomUI32 () {
    return UUIDUtil.getRandomInt(0, UUIDUtil.maxFromBits(32) - 1);
  }

  static randomUI48 () {
    return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 48 - 30)) * (1 << 30);
  }

  static paddedString (string, length, z) {
    string = String(string);
    z = !z ? '0' : z;
    var i = length - string.length;
    for (; i > 0; i >>>= 1, z += z) {
      if (i & 1) {
        string = z + string;
      }
    }
    return string;
  }

  static fromParts (timeLow, timeMid, timeHiAndVersion, clockSeqHiAndReserved, clockSeqLow, node) {
    var hex = UUIDUtil.paddedString(timeLow.toString(16), 8)
               + '-'
               + UUIDUtil.paddedString(timeMid.toString(16), 4)
               + '-'
               + UUIDUtil.paddedString(timeHiAndVersion.toString(16), 4)
               + '-'
               + UUIDUtil.paddedString(clockSeqHiAndReserved.toString(16), 2)
               + UUIDUtil.paddedString(clockSeqLow.toString(16), 2)
               + '-'
               + UUIDUtil.paddedString(node.toString(16), 12);
    return hex;
  }

  static uuid4 () {
    return UUIDUtil.fromParts(
      UUIDUtil.randomUI32(),
      UUIDUtil.randomUI16(),
      0x4000 | UUIDUtil.randomUI12(),
      0x80   | UUIDUtil.randomUI06(),
      UUIDUtil.randomUI08(),
      UUIDUtil.randomUI48()
    );
  }

  // addition by Ka-Jan to test for validity
  // Based on: http://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
  static validate (uuid) {
    var testPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return testPattern.test(uuid);
  }
};