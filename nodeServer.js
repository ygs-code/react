const http = require('http')
const fs = require('fs');
const path = require('path');
const beautify = require('js-beautify').js
// querystring 模块提供用于解析和格式化 URL 查询字符串的实用工具
const querystring = require('querystring')

const promise = (fn) => new Promise(fn)
const mkdirCreateFile = async (codePath, content, lastPath) => {
    const reg = /\\/g;
    codePath = codePath.replace(reg, '/')
    // 截取目录
    const pathArr = codePath.split('/');
    let mkdirPath = ''
    lastPath = lastPath || '';
    if (pathArr.length > 1) {
        if (!lastPath) {
            mkdirPath = pathArr.shift();
            lastPath = mkdirPath;
        } else {
            mkdirPath = pathArr.shift();
            lastPath = `${lastPath}/${mkdirPath}`;
            mkdirPath = lastPath;
        }
        await promise((resolve, reject) => {
            // 创建目录
            fs.mkdir(path.join(__dirname, mkdirPath), async function (err) {
                // 递归创建目录
                resolve();
            })
        }).then(async () => {
            await mkdirCreateFile(pathArr.join('/'), content, lastPath)
        })

    } else {
        mkdirPath = pathArr.shift();
        mkdirPath = `${lastPath}/${mkdirPath}`;
        await promise((resolve, reject) => {
            // 写入文件
            fs.writeFile(path.join(__dirname, mkdirPath), content, async function (err) {
                if (err) {
                    // console.log('写入失败', err);
                    reject(err)
                } else {
                    resolve()
                    // console.log('写入成功');
                }
            })
        })

    }

}


// 路由配置
const routes = {
    createCode: {
        url: '/createCode',
        callback: function (request, response) {
            // 接收数据
            let postData = ''
            // chunk为一点点数据，逐渐积累
            request.on('data', chunk => {
                // console.log('chunk=', chunk)
                postData += chunk
            })

            request.on('end', () => {
                let {
                    path: codePath,
                    code
                } = querystring.parse(postData.toString())
                code=beautify(code, { indent_size: 4, space_in_empty_paren: true })
                console.log('codePath=', codePath)
                console.log('code=', code)
                mkdirCreateFile(codePath, code).then(() => {
                    console.log('文件写入成功');
                    // 在这里返回 因为是异步
                    response.end(
                        // 返回json字字符串
                        JSON.stringify({
                            message:'文件写入成功',
                            path: codePath,
                            code
                        })
                    )
                }).catch((err) => {
                     console.log('文件写入失败', err);
                    response.end(
                        // 返回json字字符串
                        JSON.stringify({
                            message: '文件写入失败'
                        })
                    )
                })

            })
        },
        type: 'post',
    },
    getCode: {
        url: '/getCode',
        callback: function (request, response) {
            // url路径
            const url = request.url
            const path = url.split('?')[0]
            // 解析  get请求的参数  为?后面  所以数组下标为1
            const getParams = querystring.parse(url.split('?')[1])
            response.end(
                // 返回json字字符串
                JSON.stringify({
                    ...getParams
                })
            )
        },
        type: 'get',
    }

}

const server = http.createServer((req, res) => {
    //  请求的方式
    const method = req.method
    // 获取完整请求url
    const url = req.url
    //设置跨域
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.setHeader("X-Powered-By", ' 3.2.1')

    for (let key in routes) {
        if (url.indexOf(routes[key].url) != '-1') {
            // 设置返回的格式  json格式
            res.setHeader('Content-type', 'application/json')
            if (method === 'POST' && routes[key].type == 'post') { // 0.如果是Post请求
                routes[key].callback(req, res)
            } else if (method === 'GET' && routes[key].type == 'get') { // get请求
                console.log('method', method)
                routes[key].callback(req, res)
            }
            return false;
        }
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello World\n')

})


server.listen(5000, () => {
    console.log('http://localhost:5000/')
})