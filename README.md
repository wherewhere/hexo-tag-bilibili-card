| Issues | License |  NPM  |
|--------|---------|-------|
[![Github Issues](https://img.shields.io/github/issues/wherewhere/hexo-tag-bilibili-card)](https://github.com/wherewhere/hexo-tag-bilibili-card/issues)|[![License](https://img.shields.io/github/license/wherewhere/hexo-tag-bilibili-card)](https://github.com/wherewhere/hexo-tag-bilibili-card/blob/main/LICENSE)|[![NPM Status](https://img.shields.io/npm/dt/hexo-tag-bilibili-card.svg?style=flat)](https://www.npmjs.com/package/hexo-tag-bilibili-card)

# hexo-tag-bilibili-card

一个Hexo插件，在你的文章中插入b站的视频卡片，样式模仿和借鉴自b站，基于 [hexo-bilibili-card](https://github.com/MaxChang3/hexo-bilibili-card)

[![NPM](https://nodei.co/npm/hexo-tag-bilibili-card.png)](https://nodei.co/npm/hexo-tag-bilibili-card)

## 安装

```sh
npm i hexo-tag-bilibili-card
```

## 预览

<p>
    <script src="https://unpkg.com/hexo-tag-bilibili-card/components/bilibili-card/bilibili-card.js"></script>
    <bilibili-card vid="BV1y54y1a768" title="【UWP】手把手教你安装 UWP 安装包" author="where-where" cover="http://i2.hdslb.com/bfs/archive/41bc750cb5011bb036e008a716a89158c7eb7bb5.jpg" duration="05:21" views="2.2万" danmakus="4" image-proxy="https://images.weserv.nl/?url="></bilibili-card>
</p>

如果这里什么也没有，可以复制以下代码到 HTML 文件中查看效果

```html
<script src="https://unpkg.com/hexo-tag-bilibili-card/components/bilibili-card/bilibili-card.js"></script>
<bilibili-card vid="BV1y54y1a768" title="【UWP】手把手教你安装 UWP 安装包" author="where-where" cover="http://i2.hdslb.com/bfs/archive/41bc750cb5011bb036e008a716a89158c7eb7bb5.jpg" duration="05:21" views="2.2万" danmakus="4" image-proxy="https://images.weserv.nl/?url="></bilibili-card>
```

## 使用

在你的 config 文件中插入以下片段

```md
{% bilibili_card your_video_id %}
```

`your_video_id` 是 B站 的 BV号 或 AV号

然后你就可以看见文章中的卡片了

## 配置

由于 B站 图片地址的跨域限制，因此需要配置图片代理，目前未找到大陆地区较为稳定的服务，默认使用的 `https://images.weserv.nl/?url=`，部分地区受到了 DNS 污染及反应过慢。建议参考 [rsstt-img-relay](https://github.com/Rongronggg9/rsstt-img-relay) 自建服务

```yaml
bilibili_card:
    enable: true # 是否启用
    image_proxy: https://images.weserv.nl/?url= # 图片代理
    inject_layouts: [default] # 需要注入的布局
```
