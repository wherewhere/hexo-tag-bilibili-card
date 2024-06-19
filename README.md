| Issues | License |  NPM  |
|--------|---------|-------|
[![Github Issues](https://img.shields.io/github/issues/wherewhere/hexo-tag-bilibili-card)](https://github.com/wherewhere/hexo-tag-bilibili-card/issues)|[![License](https://img.shields.io/github/license/wherewhere/hexo-tag-bilibili-card)](https://github.com/wherewhere/hexo-tag-bilibili-card/blob/main/LICENSE)|[![NPM Status](https://img.shields.io/npm/dt/hexo-tag-bilibili-card.svg?style=flat)](https://www.npmjs.com/package/hexo-tag-bilibili-card)

# hexo-tag-bilibili-card

一个 Hexo 插件，在你的文章中插入哔哩哔哩卡片，样式模仿和借鉴自哔哩哔哩，基于 [hexo-bilibili-card](https://github.com/MaxChang3/hexo-bilibili-card)

[![NPM](https://nodei.co/npm/hexo-tag-bilibili-card.png)](https://www.npmjs.com/package/hexo-tag-bilibili-card)

## 安装

```sh
npm i hexo-tag-bilibili-card
```

## 预览

复制以下代码到 HTML 文件中查看

```html
<script src="https://unpkg.com/hexo-tag-bilibili-card/components/bilibili-card/bilibili-card.js" async></script>
<bilibili-card vid="BV1y54y1a768" type="video" title="【UWP】手把手教你安装 UWP 安装包" author="where-where"
    cover="http://i2.hdslb.com/bfs/archive/41bc750cb5011bb036e008a716a89158c7eb7bb5.jpg" duration="05:21" views="2.2万"
    danmakus="4" comments="75" favorites="253" coins="106" likes="287" info-types="views danmakus"></bilibili-card>
```

## 使用

### 使用插件

在你的文章中插入以下片段

```md
{% bilibili_card $id $type $info-types %}
```

其中

| 属性名 | 描述 | 可选值 | 默认值 | 示例 |
|-------|------|-------|-------|-----|
| $id | 媒体 ID | 视频：AV, BV；~~专栏：CV~~；番剧：MD；音频：AU | 空，将跳过生成 | BV1y54y1a768 |
| $type | 卡片类型 | video, ~~article~~, user, live, bangumi, audio, dynamic, favorite, album | 自动识别 AV, BV, CV, MD, AU，识别失败视为 video | video |
| $info-types | 显示信息 | views, danmakus, comments, favorites, coins, likes | 空，由 bilibili-card 分配默认值 | views danmakus |

完整示例

```md
{% bilibili_card BV1y54y1a768 video 'views danmakus' %}
```

然后你就可以看见文章中的卡片了

### 使用 Web Components

你也可以直接使用 Web Component 控件

在 Head 中引入

```html
<script src="https://unpkg.com/hexo-tag-bilibili-card/components/bilibili-card/bilibili-card.js" async></script>
```

在文章中插入

```html
<bilibili-card ...></bilibili-card>
```

其中

| 属性名 | 描述 | 默认值 |
|-------|------|-------|
| vid | 媒体 ID | 空 |
| type | 卡片类型 | video |
| title | 卡片标题 | 哔哩哔哩 (゜-゜)つロ 干杯~ |
| author | 作者 | 2233 |
| cover | 封面图片地址 | 空 |
| duration | 媒体时长 | ??:?? |
| views | 观看量 | 0 |
| danmakus | 弹幕数 | 0 |
| comments | 评论数 | 0 |
| favorites | 收藏数 | 0 |
| coins | 投币数 | 0 |
| likes | 点赞数 | 0 |
| info-types | 显示信息 | 根据卡片类型分配 |
| image-proxy | 图片代理地址 | https://images.weserv.nl/?url= |

## 配置

由于哔哩哔哩图片地址的跨域限制，因此需要配置图片代理，目前未找到大陆地区较为稳定的服务，默认使用的 `https://images.weserv.nl/?url=`，部分地区受到了 DNS 污染及反应过慢。建议参考 [rsstt-img-relay](https://github.com/Rongronggg9/rsstt-img-relay) 自建服务

```yaml
bilibili_card:
    enable: true # 是否启用
    image_proxy: https://images.weserv.nl/?url= # 图片代理
    inject_layouts: [default] # 需要注入的布局
```

## 引用及参考
- [hexo-fs](https://github.com/hexojs/hexo-fs "hexo-fs")
- [hexo-bilibili-card](https://github.com/MaxChang3/hexo-bilibili-card "hexo-bilibili-card")
- [哔哩哔哩-API收集整理](https://github.com/SocialSisterYi/bilibili-API-collect "BiliBili API Collect")

## 参与人员
[![Contributors](https://contrib.rocks/image?repo=wherewhere/hexo-tag-bilibili-card)](https://github.com/wherewhere/hexo-tag-bilibili-card/graphs/contributors)
