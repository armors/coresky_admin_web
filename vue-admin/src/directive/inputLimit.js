/**
 * 限制输入框只能输入n为小数
 */
export const inputLimitNew = {

  update(el, binding){
    var flag = true;
    var intStr;
    var decimalsStr = "";
    var ints = binding.value.substring(0, binding.value.indexOf(','));
    var decimals = binding.value.substring(binding.value.indexOf(',') + 1, binding.value.length);
    let rxpDecimal = new RegExp("(\\.\\d{"+ decimals +"})\\d*$","g"); //小数点后最多几位数
    let rxpInt = new RegExp("(\\d{" + ints + "})\\d*$","g"); // 最多几位整数
    const target = el instanceof HTMLInputElement ? el : el.querySelector("input");
      target.addEventListener("input", e => {
        setTimeout(function() {
          if(flag) {
            e.target.value = e.target.value.replace(/[^\d.]/g, "").replace(/\.{2,}/g, ".").replace(".", "$#$")
              .replace(/\./g, "")
              .replace("$#$", ".")
            if(e.target.value.indexOf('.') <= -1){
              intStr = e.target.value;
            } else {
              intStr = e.target.value.substring(0,e.target.value.indexOf('.'));
              decimalsStr = e.target.value.substring(e.target.value.indexOf('.'),e.target.value.length); // 匹配小数点后的数字
            }
            intStr = intStr.replace(rxpInt,'$1');
            decimalsStr = decimalsStr.replace(rxpDecimal, '$1');
            e.target.value = intStr + decimalsStr;
            flag = !flag;
          }
        },0)
       
      });
  }
}
