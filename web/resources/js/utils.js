class Utils {

  constructor(socket) {
    this.socket = socket;
    this.conf = conf;
  }

  sendPacket(data) {
    this.socket.send(data.buffer);
  }

  preparePacket(length) {
    return new DataView(new ArrayBuffer(length));
  }

  sendChat() {

      var chatText = document.getElementById('chat-text').value;
      var len =  1 + chatText.length;
      var offset = 0;

      var msg = this.preparePacket(len);
      msg.setUint8(offset, 't'.charCodeAt(0));
      offset++;

      for (var i = 0; i < chatText.length; i++) {
          msg.setUint8(offset, chatText.charCodeAt(i));
          offset++;
      }

      this.sendPacket(msg);
  }

  lerp(a, b, f, dt) {
    return a + f * (b - a);
  }

  uintIfy(str) {
  	var abObj = this.str2ab(str);
  	return abObj;
  }

  sendDate(uid, date) {
    var dateObj = {'id': 'updateDate', 'uid': uid}
    var arr = this.uintIfy(dateObj);
  	this.socket.send(arr);
  }

  sendKey(key) {
    var msg = this.preparePacket(1);
    msg.setUint8(0, key.charCodeAt(0));
    this.sendPacket(msg);
  }

  sendName(name) {

      var len =  1 + name.length;
      var offset = 0;

      var msg = this.preparePacket(len);
      msg.setUint8(offset, 'n'.charCodeAt(0));
      offset++;

      for (var i = 0; i < name.length; i++) {
          msg.setUint8(offset, name.charCodeAt(i));
          offset++;
      }

      this.sendPacket(msg);
      return 1;
  }

  sendColor() {

      var colorObj = JSON.parse(document.getElementById('colorInputJSON').value);
      var len = 4;
      var offset = 0;

      var msg = this.preparePacket(len);
      msg.setUint8(offset, 'c'.charCodeAt(0));
      offset++;
      msg.setUint8(offset, colorObj.r, true);
      offset++;
      msg.setUint8(offset, colorObj.g, true);
      offset++;
      msg.setUint8(offset, colorObj.b, true);
      offset++;

      this.sendPacket(msg);
      return 1;
  }


  getUserList() {
    var msg = this.preparePacket(1);
    msg.setUint8(0, 'g'.charCodeAt(0));
    this.sendPacket(msg);
  }

}
