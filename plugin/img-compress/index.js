const imgCompress = {};
// js压缩图片上传逻辑步骤：
// 1 FileReader.readAsDataURL将上传的图片文件转为Base64格式，如果是png，则不做处理
// 2 将img绘制到canvas上，canvas.toDataURL压缩图片
// 3 new Blob将压缩后的Base64转为Blob格式
// 4 FormData.append将图片文件数据存入formdata


// base64 => Blob
function dataURItoBlob(base64Data) {
  var byteString;
  if (base64Data.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(base64Data.split(',')[1]);
  else
    byteString = unescape(base64Data.split(',')[1]);
  var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], {
    type: mimeString
  });
}

imgCompress.install = function (Vue, options) {
  Vue.prototype.$imgCompress = (file, userConfig) => {
    // 压缩配置
    let config = Object.assign({
      // 压缩质量
      quality: 0.8,
      // 阈值，默认大于888K的图片才会压缩
      threshold: 888 * 1024,
      // 压缩宽度
      width: null,
      // 压缩高度
      height: null
    }, options)
    
    config = Object.assign(config, userConfig)
    return new Promise((reslove, reject) => {
      let width, height, base64
      let reader = new FileReader();
      reader.onload = function (e) {
        base64 = e.target.result;
        // 如果是png则不做处理
        let isPng = !!base64.match(/^.*;/)[0].match('png')
        if (isPng) {
          reslove(dataURItoBlob(base64));
          return
        }
        // 如果图片小于阈值，不做压缩
        if (file.size < config.threshold) {
          console.log(`原图大小：${file.size}小于阈值：${config.threshold}，不压缩。`);
          reslove(dataURItoBlob(base64));
          return
        }
        //加载图片获取图片真实宽度和高度      
        let image = new Image();
        image.onload = function () {
          width = image.width;
          height = image.height;
          compress(image)
        };
        image.src = base64;

      }
      reader.readAsDataURL(file)

      function compress(img) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        // 如果只设置了宽度
        if (config.width) {
          height = config.width * height / width
          width = config.width
        }
        // 同时设置宽高
        if (config.height && config.width) {
          height = config.height
        }
        // 只设置了高度
        if (config.height && !config.width) {
          width = width * config.height / height
          height = config.height
        }
        canvas.width = width;
        canvas.height = height;
        // 铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height);
        // 压缩处理
        // canvas压缩不支持png压缩，如果要对png图片进行压缩需要先toDataURL为jpeg格式，注意的是 绘制画布之前 需要为画布铺上一层底色。否则png透明区域就为黑色啦。
        let compressed = canvas.toDataURL("image/jpeg", config.quality);
        reslove(dataURItoBlob(compressed));
      }
    })


  };
}
module.exports = imgCompress;
