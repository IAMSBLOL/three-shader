# react cli


## 在线发牌
[Create React App](https://iamsblol.github.io/three-shader-/build/index.html)

### `yarn start`

启动项目

### `yarn build`
打包

参数

名称 | 描述
---|---
--stats | 是否写构建信息（主要还是给BundleAnalyzerPlugin用，不过没做主动启动这个服务）
--profile | webpack分析打包

### `yarn lint`
eslint检测，但是没加fix，自己手动fix吧

### `yarn image`
构建镜像

参数

名称 | 描述
---|---
--tag \ --t | 镜像tag
--d | 镜像描述

==*备注：CICD或许是clone镜像方式问题，脚本.git文件不一致，所以不在cicd自动构建镜像*==

### `yarn bnp`
打包+构建镜像
参数同上

### `yarn test` 
暂未添加，正经前端搞啥自动化测试，是需求不够多吗

### 备注
项目中参考cra部分构建思维，我也懒得自己写部分脚本，直接使用react-dev-utils了，不过这个库有些不兼容webpack5，我改了放在==config-utils==文件夹

### 待处理事件
1. test
2. 打包优化体积
3. cdn （因为要钱所以放弃了）
4. babel macro (感觉没必要搞，坑队友)
5. 等cra升级了，部分脚本跟回cra走
6. stylelint
7. ci runner管理(目前挂在局域网某台主机，使用shell)


## 相关文档链接
 [Create React App](https://github.com/facebook/create-react-app)
 
 [babel](https://www.babeljs.cn/docs/)
 
 [WEBPACK 5.X](https://webpack.docschina.org/guides/getting-started/#creating-a-bundle).