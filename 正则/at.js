/*
 * @Date: 2022-03-29 17:22:53
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-03-29 17:27:32
 * @FilePath: /react/正则/at.js
 * @Description:
 *
 */
// 匹配 '\n at '
const str = ` 
 at 
 wer
`;
// var str1 = str.match(/\n(*(at)?)/)
var str1 = str.match(/\n( *(at )?)/);
console.log("str1=", str1);
