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
const defaultAuthor = "2233";
const defaultDuration = "??:??";
const defaultText = "???";
const defaultProxy = "https://images.weserv.nl/?url=";

class BilibiliCard extends HTMLElement {
    static get observedAttributes() {
        return ["vid", "title", "author", "cover", "duration", "views", "danmakus", "image-proxy"];
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
        const shadowRoot = this.attachShadow({ mode: "open" });

        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = script.src.substring(0, script.src.lastIndexOf('.')) + ".css";
        shadowRoot.appendChild(css);

        const card = document.createElement("div");
        card.className = "default-flex video-holder normal-card";
        shadowRoot.appendChild(card);

        const link = document.createElement('a');
        link.className = "default-flex full-width";
        link.target = "_blank";
        card.appendChild(link);
        this.contents.link = link;

        const cover_box = document.createElement("div");
        cover_box.className = "disable-event cover-box";
        cover_box.innerHTML =
        `<i class="iconfont default-cover">
            <svg viewBox="0 0 1093 1023">
                <path
                    d="M653 665C651 667 647.667 671.333 643 678C638.333 685.333 634.667 690.667 632 694C626.667 698.667 621.667 701 617 701C608.333 701 599.667 698.833 591 694.5C582.333 690.167 575 684.333 569 677L561 667C557 661.667 554 658.167 552 656.5C550 654.833 547.667 654 545 654C542.333 654 534.667 661.667 522 677C517.333 683 509.667 688.5 499 693.5C488.333 698.5 480.167 701 474.5 701C468.833 701 462.333 697 455 689C451 683.667 445.333 675.667 438 665C427.333 649 415.333 645.333 402 654C395.333 658.667 392 665.833 392 675.5C392 685.167 395.333 693.667 402 701L438 737C442 740.333 447.167 743.167 453.5 745.5C459.833 747.833 466.667 749 474 749C481.333 749 487.333 748.167 492 746.5C496.667 744.833 502.667 741.667 510 737C518 730.333 529.667 722.333 545 713C550.333 719 556.667 725 564 731C579.333 743 593.167 749 605.5 749C617.833 749 631 745 645 737C655.667 731 666 723 676 713C684 705 689 696.667 691 688C693 679.333 692 671.667 688 665C683.333 660.333 677.5 658 670.5 658C663.5 658 657.667 660.333 653 665ZM984 737C984 758.333 978.667 778 968 796C957.333 814 942.833 828.5 924.5 839.5C906.167 850.5 886 856 864 856H226C204.667 856 185 850.667 167 840C149 829.333 134.5 814.833 123.5 796.5C112.5 778.167 107 758.333 107 737V382C107 360.667 112.333 340.833 123 322.5C133.667 304.167 148.167 289.667 166.5 279C184.833 268.333 204.667 263 226 263H867C889 263 909 268.333 927 279C945 289.667 959.333 304 970 322C980.667 340 986 360 986 382V737H984ZM900 156H714L807 63C814.333 55.6667 818 47.3333 818 38C818 28.6667 814.5 20.3333 807.5 13C800.5 5.66667 792.167 2 782.5 2C772.833 2 764.333 5.66667 757 13L614 156H491L345 11C338.333 3.66667 330.167 0 320.5 0C310.833 0 302.5 3.5 295.5 10.5C288.5 17.5 285 25.8333 285 35.5C285 45.1667 288.333 53.6667 295 61L391 156H191C156.333 156 124.333 164.5 95 181.5C65.6667 198.5 42.5 221.667 25.5 251C8.5 280.333 0 312 0 346V773C0 807 8.5 838.667 25.5 868C42.5 897.333 65.6667 920.5 95 937.5C124.333 954.5 156.333 963 191 963H214C214 979.667 219.833 993.833 231.5 1005.5C243.167 1017.17 257.333 1023 274 1023C290.667 1023 304.667 1017.17 316 1005.5C327.333 993.833 333 979.667 333 963H760C760 979.667 765.667 993.833 777 1005.5C788.333 1017.17 802.333 1023 819 1023C835.667 1023 849.833 1017.17 861.5 1005.5C873.167 993.833 879 979.667 879 963H903C937 963 968.667 954.5 998 937.5C1027.33 920.5 1050.5 897.333 1067.5 868C1084.5 838.667 1093 807 1093 773V346C1092.33 312 1083.17 280.333 1065.5 251C1047.83 221.667 1024.5 198.5 995.5 181.5C966.5 164.5 934.667 156 900 156ZM653 499L879 546L891 451L676 403L653 499ZM414 406L200 453L212 549L438 501L414 406Z" />
            </svg>
        </i>;`
        link.appendChild(cover_box);

        const cover = document.createElement("div");
        cover.className = "cover-img";
        cover_box.appendChild(cover);
        this.contents.cover = cover;

        const video_subtitle = document.createElement("div");
        video_subtitle.className = "video-subtitle";
        cover_box.appendChild(video_subtitle);

        const duration = document.createElement("div");
        duration.className = "video-duration";
        video_subtitle.appendChild(duration);
        this.contents.duration = duration;

        const content = document.createElement("div");
        content.className = "disable-event video-content-container";
        link.appendChild(content);

        const title = document.createElement('p');
        title.className = "double-ellipsis video-title";
        content.appendChild(title);
        this.contents.title = title;

        const info = document.createElement("div");
        info.className = "video-card-info";
        content.appendChild(info);

        const views_box = document.createElement("div");
        views_box.className = "cover-info-item";
        views_box.innerHTML =
        `<i class="iconfont">
            <svg viewBox="0 0 896 768">
                <path
                    d="M832 160V608C832 635.333 822.833 658.167 804.5 676.5C786.167 694.833 763.333 704 736 704H160C132.667 704 109.833 694.833 91.5 676.5C73.1667 658.167 64 635.333 64 608V160C64 132.667 73.1667 109.833 91.5 91.5C109.833 73.1667 132.667 64 160 64H736C763.333 64 786.167 73.1667 804.5 91.5C822.833 109.833 832 132.667 832 160ZM736 768C765.333 768 792.167 760.833 816.5 746.5C840.833 732.167 860.167 712.833 874.5 688.5C888.833 664.167 896 637.333 896 608V160C896 130.667 888.833 103.833 874.5 79.5C860.167 55.1667 840.833 35.8333 816.5 21.5C792.167 7.16667 765.333 0 736 0H160C130.667 0 103.833 7.16667 79.5 21.5C55.1667 35.8333 35.8333 55.1667 21.5 79.5C7.16667 103.833 0 130.667 0 160V608C0 637.333 7.16667 664.167 21.5 688.5C35.8333 712.833 55.1667 732.167 79.5 746.5C103.833 760.833 130.667 768 160 768H736ZM621 413C629 409.667 634.5 404 637.5 396C640.5 388 640.5 380 637.5 372C634.5 364 629 358.333 621 355L365 243C353.667 238.333 343.333 239.167 334 245.5C324.667 251.833 320 260.667 320 272V496C320 507.333 324.667 516.167 334 522.5C343.333 528.833 353.667 529.667 365 525L621 413Z" />
            </svg>
        </i>`;
        info.appendChild(views_box);

        const views = document.createElement("span");
        views.className = "single-ellipsis num-info";
        views_box.appendChild(views);
        this.contents.views = views;

        const danmakus_box = document.createElement("div");
        danmakus_box.className = "cover-info-item";
        danmakus_box.innerHTML =
        `<i class="iconfont">
            <svg viewBox="0 0 896 768">
                <path
                    d="M736 0C765.333 0 792.167 7.16667 816.5 21.5C840.833 35.8333 860.167 55.1667 874.5 79.5C888.833 103.833 896 130.667 896 160V608C896 637.333 888.833 664.167 874.5 688.5C860.167 712.833 840.833 732.167 816.5 746.5C792.167 760.833 765.333 768 736 768H160C130.667 768 103.833 760.833 79.5 746.5C55.1667 732.167 35.8333 712.833 21.5 688.5C7.16667 664.167 0 637.333 0 608V160C0 130.667 7.16667 103.833 21.5 79.5C35.8333 55.1667 55.1667 35.8333 79.5 21.5C103.833 7.16667 130.667 0 160 0H736ZM736 64H160C134.667 64 113 72.1667 95 88.5C77 104.833 66.6667 125.667 64 151V160V608C64 633.333 72.1667 655 88.5 673C104.833 691 125.667 701.333 151 704H160H736C761.333 704 783 695.833 801 679.5C819 663.167 829.333 642.333 832 617V608V160C832 132.667 822.833 109.833 804.5 91.5C786.167 73.1667 763.333 64 736 64ZM304 448V512H240V448H304ZM720 448V512H368V448H720ZM240 256V320H176V256H240ZM688 256V320H304V256H688Z" />
            </svg>
        </i>`;
        info.appendChild(danmakus_box);

        const danmakus = document.createElement("span");
        danmakus.className = "single-ellipsis num-info";
        danmakus_box.appendChild(danmakus);
        this.contents.danmakus = danmakus;

        const bottom = document.createElement("div");
        bottom.className = "video-card-bottom";
        bottom.innerHTML = `<label class="card-text-label">视频</label>`;
        content.appendChild(bottom);

        const author_box = document.createElement("div");
        author_box.className = "view-flex default-flex align-center author-info";
        author_box.innerHTML =
        `<i class="iconfont up-icon">
            <svg viewBox="0 0 896 768">
                <path
                    d="M832 608V160C832 132.667 822.833 109.833 804.5 91.5C786.167 73.1667 763.333 64 736 64H160C132.667 64 109.833 73.1667 91.5 91.5C73.1667 109.833 64 132.667 64 160V608C64 635.333 73.1667 658.167 91.5 676.5C109.833 694.833 132.667 704 160 704H736C763.333 704 786.167 694.833 804.5 676.5C822.833 658.167 832 635.333 832 608ZM736 0C765.333 0 792.167 7.16667 816.5 21.5C840.833 35.8333 860.167 55.1667 874.5 79.5C888.833 103.833 896 130.667 896 160V608C896 637.333 888.833 664.167 874.5 688.5C860.167 712.833 840.833 732.167 816.5 746.5C792.167 760.833 765.333 768 736 768H160C130.667 768 103.833 760.833 79.5 746.5C55.1667 732.167 35.8333 712.833 21.5 688.5C7.16667 664.167 0 637.333 0 608V160C0 130.667 7.16667 103.833 21.5 79.5C35.8333 55.1667 55.1667 35.8333 79.5 21.5C103.833 7.16667 130.667 0 160 0H736ZM355 416V198H416V438C416 485.333 403 521.167 377 545.5C351 569.833 315 582 269 582C223 582 188 570.333 164 547C140 523.667 128 488.667 128 442V198H189V416C189 438 190.333 455 193 467C196.333 485 203.667 498.667 215 508C228.333 519.333 247.333 525 272 525C296.667 525 315.667 519.333 329 508C340.333 498.667 347.667 485 351 467C353.667 455 355 438 355 416ZM643 378C659.667 378 673.333 373.333 684 364C697.333 353.333 704 337.667 704 317C704 295 698 278.667 686 268C676 260 661.667 256 643 256H550V378H643ZM646 198C692 198 725.333 211.667 746 239C760.667 259 768 284.167 768 314.5C768 344.833 760.667 369.667 746 389C725.333 415.667 692 429 646 429H550V576H490V198H646Z" />
            </svg>
        </i>`;
        bottom.appendChild(author_box);

        const author = document.createElement("span");
        author.className = "view-flex single-ellipsis author-name";
        author_box.appendChild(author);
        this.contents.author = author;
    }

    get vid() {
        return this.getAttribute("vid");
    }
    set vid(value) {
        this.setAttribute("vid", value);
    }

    get title() {
        return this.getAttribute("title") ?? defaultTitle;
    }
    set title(value) {
        this.setAttribute("title", value);
    }

    get author() {
        return this.getAttribute("author") ?? defaultAuthor;
    }
    set author(value) {
        this.setAttribute("author", value);
    }

    get cover() {
        return this.getAttribute("cover");
    }
    set cover(value) {
        this.setAttribute("cover", value);
    }

    get duration() {
        return this.getAttribute("duration") ?? defaultDuration;
    }
    set duration(value) {
        this.setAttribute("duration", value);
    }

    get views() {
        return this.getAttribute("views") ?? defaultText;
    }
    set views(value) {
        this.setAttribute("views", value);
    }

    get danmakus() {
        return this.getAttribute("danmakus") ?? defaultText;
    }
    set danmakus(value) {
        this.setAttribute("danmakus", value);
    }

    get imageProxy() {
        return this.getAttribute("image-proxy") ?? defaultProxy;
    }
    set imageProxy(value) {
        this.setAttribute("image-proxy", value);
    }

    connectedCallback() {
        this.contents.link.href ??= `https://www.bilibili.com/video/${this.vid}`;
        this.contents.cover.style.backgroundImage ??= `url(${this.imageProxy}${this.cover})`;
        this.contents.duration.textContent ??= this.duration;
        this.contents.title.textContent ??= this.title;
        this.contents.views.textContent ??= this.views;
        this.contents.danmakus.textContent ??= this.danmakus;
        this.contents.author.textContent ??= this.author;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) { return; }
        switch (name) {
            case "vid":
                this.contents.link.href = `https://www.bilibili.com/video/${newValue}`;
                break;
            case "title":
                this.contents.title.textContent = newValue ?? defaultTitle;
                break;
            case "author":
                this.contents.author.textContent = newValue ?? defaultAuthor;
                break;
            case "cover":
                this.contents.cover.style.backgroundImage = `url(${this.imageProxy}${newValue})`;
                break;
            case "duration":
                this.contents.duration.textContent = newValue ?? defaultDuration;
                break;
            case "views":
                this.contents.views.textContent = newValue ?? defaultText;
                break;
            case "danmakus":
                this.contents.danmakus.textContent = newValue ?? defaultText;
                break;
            case "image-proxy":
                this.imageProxy = newValue ?? defaultProxy;
                break;
        }
    }
}

if (!customElements.get("bilibili-card")) {
    customElements.define("bilibili-card", BilibiliCard);
}
