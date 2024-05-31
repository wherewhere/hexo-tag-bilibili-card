const script = getScript("bilibili-card.js");

function getScript(scriptName) {
    const scripts = document.scripts;
    for (let i = scripts.length; i >= 0;) {
        const script = scripts[--i];
        if (script.src.substring(script.src.lastIndexOf('/') + 1) === scriptName) {
            return script;
        }
    }
}

const defaultTitle = "哔哩哔哩 (゜-゜)つロ 干杯~";
const defaultUpper = "2233";
const defaultDuration = "??:??";
const defaultText = "???";
const defaultProxy = "https://images.weserv.nl/?url=";

class BilibiliCard extends HTMLElement {
    static get observedAttributes() {
        return ['aid', 'title', 'upper', 'cover', 'duration', 'views', 'danmakus', 'image-proxy'];
    }

    contents = {
        link: null,
        cover: null,
        duration: null,
        title: null,
        views: null,
        danmakus: null,
        author: null
    }

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = script.src.substring(0, script.src.lastIndexOf('.')) + ".css";
        shadowRoot.appendChild(css);

        const awesome = document.createElement("link");
        awesome.rel = "stylesheet";
        awesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
        shadowRoot.appendChild(awesome);

        const card = document.createElement('div');
        card.className = 'default-flex video-holder normal-card';
        shadowRoot.appendChild(card);

        const link = document.createElement("a");
        link.className = "default-flex";
        link.target = "_blank";
        card.appendChild(link);
        this.contents.link = link;

        const cover_box = document.createElement('div');
        cover_box.className = 'disable-event cover-box';
        link.appendChild(cover_box);

        const cover = document.createElement("div");
        cover.className = "cover-img";
        cover_box.appendChild(cover);
        this.contents.cover = cover;

        const mask = document.createElement('div');
        mask.className = 'video-mask';
        mask.innerHTML = `<i class="video-icon fa-brands fa-bilibili"></i>`;
        cover_box.appendChild(mask);
        
        const video_sub = document.createElement('div');
        video_sub.className = 'video-sub';
        mask.appendChild(video_sub);

        const duration = document.createElement('div');
        duration.className = 'video-duration';
        video_sub.appendChild(duration);
        this.contents.duration = duration;

        const content = document.createElement('div');
        content.className = 'disable-event video-content-container';
        link.appendChild(content);

        const title = document.createElement('p');
        title.className = 'double-ellipsis video-title';
        content.appendChild(title);
        this.contents.title = title;

        const info = document.createElement('div');
        info.className = 'video-card-info';
        content.appendChild(info);

        const views_box = document.createElement('div');
        views_box.className = 'cover-info-item';
        views_box.innerHTML = `<i class="iconfont fa-brands fa-youtube"></i>`;
        info.appendChild(views_box);

        const views = document.createElement('span');
        views.className = 'single-ellipsis num-info';
        views_box.appendChild(views);
        this.contents.views = views;

        const danmakus_box = document.createElement('div');
        danmakus_box.className = 'cover-info-item';
        danmakus_box.innerHTML = `<i class="iconfont fa fa-list-alt"></i>`;
        info.appendChild(danmakus_box);

        const danmakus = document.createElement('span');
        danmakus.className = 'single-ellipsis num-info';
        danmakus_box.appendChild(danmakus);
        this.contents.danmakus = danmakus;

        const bottom = document.createElement('div');
        bottom.className = 'video-card-bottom';
        bottom.innerHTML = `<label class="card-text-label">视频</label>`;
        content.appendChild(bottom);

        const author_box = document.createElement('div');
        author_box.className = 'view-flex default-flex align-center slim-author-info';
        author_box.innerHTML = `<label class="icon-up">UP</label>`;
        bottom.appendChild(author_box);

        const author = document.createElement('span');
        author.className = 'view-flex single-ellipsis author-name';
        author_box.appendChild(author);
        this.contents.author = author;
    }

    connectedCallback() {
        this.contents.link.href = `//www.bilibili.com/video/${this.vid}`;
        this.contents.cover.style.backgroundImage = `url(${this.imageProxy}${this.cover})`;
        this.contents.duration.textContent = this.duration;
        this.contents.title.textContent = this.title;
        this.contents.views.textContent = this.views;
        this.contents.danmakus.textContent = this.danmakus;
        this.contents.author.textContent = this.upper;
    }

    get vid() {
        return this.getAttribute('vid');
    }
    set vid(value) {
        this.setAttribute('vid', value);
    }

    get title() {
        return this.getAttribute('title') ?? defaultTitle;
    }
    set title(value) {
        this.setAttribute('title', value);
    }

    get upper() {
        return this.getAttribute('upper') ?? defaultUpper;
    }
    set upper(value) {
        this.setAttribute('upper', value);
    }

    get cover() {
        return this.getAttribute('cover');
    }
    set cover(value) {
        this.setAttribute('cover', value);
    }

    get duration() {
        return this.getAttribute('duration') ?? defaultDuration;
    }
    set duration(value) {
        this.setAttribute('duration', value);
    }

    get views() {
        return this.getAttribute('views') ?? defaultText;
    }
    set views(value) {
        this.setAttribute('views', value);
    }

    get danmakus() {
        return this.getAttribute('danmakus') ?? defaultText;
    }
    set danmakus(value) {
        this.setAttribute('danmakus', value);
    }

    get imageProxy() {
        return this.getAttribute('image-proxy') ?? defaultProxy;
    }
    set imageProxy(value) {
        this.setAttribute('image-proxy', value);
    }
}

customElements.define('bilibili-card', BilibiliCard);
