const BinaryReader = require('../lib/BinaryReader');
const CameraObject = require('./CameraObject');
const CubeObject = require('./CubeObject');
const CubeCollection = require('./CubeCollection');
const MoveObject = require('./MoveObject');

class Block {

    constructor(id, ws) {
        this.id = id;
        this.socket = ws;
        this.camID = new CameraObject(0, 0, 4);
        this.cubeID = new CubeObject(0, 0, 0, 5, 5, 5, "rgb(174, 129, 255)");
        this.uID = new CubeCollection(id, this.getCamID(id), this.getCubeID(id));
    }

    str2ab(str) {
        var escstr = encodeURIComponent(str);
        var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
        });
        var ua = new Uint8Array(binstr.length);
        Array.prototype.forEach.call(binstr, function (ch, i) {
            ua[i] = ch.charCodeAt(0);
        });
        return ua;
    }

    uintIfy(obj) {
    	var stringifiedObj = JSON.stringify(obj); // "{'x': '1'}"
    	var abObj = this.str2ab(stringifiedObj); // Uint8Array[xyx, yzx, yxz, zyx]
      var objUArr = new Uint8Array(abObj);
    	return objUArr;
    }

    ab2str(ab) {
        var binstr = Array.prototype.map.call(ab, function (ch) {
            return String.fromCharCode(ch);
        }).join('');
        var escstr = binstr.replace(/(.)/g, function (m, p) {
            var code = p.charCodeAt(0).toString(16).toUpperCase();
            if (code.length < 2) {
                code = '0' + code;
            }
            return '%' + code;
        });
        return decodeURIComponent(escstr);
    }

    onMessage(msg) {

        var objUArr = new Uint8Array(msg);
        //console.log(objUArr);
        var objStr = this.ab2str(objUArr);
        //console.log(objStr);
        var parsed = JSON.parse(objStr);
        var mID = parsed.id;

        if (mID == 'sendJSONObject') {
          var jsonObj = parsed.data;
          //console.log(jsonObj.x); // 1
        }

        if (mID == 'updatePos') {

          var xx = 0;
          var zz = 0;
          var speed = 4;
          var key = parsed.key;

          if (key == 'w') {
            zz -= speed;
          }

          if (key == 's') {
            zz += speed;
          }

          if (key == 'a') {
            xx -= speed;
          }

          if (key == 'd') {
            xx += speed;
          }

          var id = parsed.id;
          var camId = id + "Cam";
          var cubeId = id + "Cube";
          var uId = "user" + id;

          this.camID.x += xx;
          this.camID.z += zz;

          this.cubeID.x += xx;
          this.cubeID.z += zz;

          var camPos = "gridPos[ x: {" + this.camID.x + "}|| y:{ " + this.camID.y + "}|| z: {" + this.camID.z + "} ]";
          var camDebug = "Camera" + ": " + camPos;

          var cubePos = "gridPos[ x: {" + this.cubeID.x + "}|| y:{ " + this.cubeID.y + "}|| z: {" + this.cubeID.z + "} ]";
          var cubeDebug = "Cube" + ": color{" + this.cubeID.color + "} || " + cubePos;

         // console.log(camDebug + "\n" + cubeDebug);

         var moveObj = new MoveObject('move', this.uID);
         var u = this.uintIfy(moveObj);
         this.socket.send(u);
         console.log("Sending... " + u);
        }
    }

    getCamID(id) {
      return id + "Cam";
    }

    getCubeID(id) {
      return id + "Cube";
    }

    getUID(id) {
      return "user" + id;
    }

}

module.exports = Block;