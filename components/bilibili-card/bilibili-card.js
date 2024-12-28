(() => {
    /**
     * @typedef {"video" | "article" | "user" | "live" | "bangumi" | "audio" | "dynamic" | "favorite" | "album"} cardType
     * @typedef {"views" | "danmakus" | "comments" | "favorites" | "coins" | "likes" | "time"} infoType
     * @typedef {"system" | "light" | "dark"} themeType
     * @typedef {{vid: string, type: cardType, title: string, author: string, cover: string, duration: string, views: string | number, danmakus: string | number, comments: string | number, favorites: string | number, coins: string | number, likes: string | number}} cardInfo
     */

    if (customElements.get("bilibili-card")) { return; }

    function getLocation() {
        const scripts = document.scripts;
        for (let i = scripts.length; i > 0;) {
            const script = scripts[--i];
            if (script.src.substring(script.src.lastIndexOf('/') + 1) === "bilibili-card.js") {
                const src = script.src;
                return src.substring(0, src.lastIndexOf('.'));
            }
        }
    }

    let baseUrl = getLocation();

    if (typeof Array.prototype.includes !== "function") {
        Array.prototype.includes = function (value) { return this.indexOf(value) !== -1; }
    }

    if (typeof String.prototype.trimStart !== "function") {
        if (typeof String.prototype.trimLeft !== "function") {
            String.prototype.trimLeft = function () { return this.replace(/^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/, ''); }
        }
        String.prototype.trimStart = String.prototype.trimLeft;
    }

    if (typeof String.prototype.trimEnd !== "function") {
        if (typeof String.prototype.trimRight !== "function") {
            String.prototype.trimRight = function () { return this.replace(/[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+$/, ''); }
        }
        String.prototype.trimEnd = String.prototype.trimRight;
    }

    /**
     * @param {string} id
     */
    function getVid(id) {
        const type = id.slice(0, 2).toUpperCase();
        if (type === "BV" || type === "AV") {
            return id;
        }
        else {
            const num = Number(id);
            if (isNaN(num)) {
                return `BV${id}`;
            }
            else {
                return `av${num}`;
            }
        }
    }

    /**
     * @param {cardType} type
     */
    function canPlay(type) {
        return type === "video" || type === "live" || type === "bangumi" || type === "audio";
    }

    /**
     * @param {cardType} type
     */
    function hasDuration(type) {
        return type === "video" || type === "audio";
    }

    /**
     * @param {infoType} type
     */
    function getIcon(type, isVideo = true) {
        switch (type) {
            case "views":
                return isVideo
                    ? {
                        path: "M832 160V608C832 635.333 822.833 658.167 804.5 676.5C786.167 694.833 763.333 704 736 704H160C132.667 704 109.833 694.833 91.5 676.5C73.1667 658.167 64 635.333 64 608V160C64 132.667 73.1667 109.833 91.5 91.5C109.833 73.1667 132.667 64 160 64H736C763.333 64 786.167 73.1667 804.5 91.5C822.833 109.833 832 132.667 832 160ZM736 768C765.333 768 792.167 760.833 816.5 746.5C840.833 732.167 860.167 712.833 874.5 688.5C888.833 664.167 896 637.333 896 608V160C896 130.667 888.833 103.833 874.5 79.5C860.167 55.1667 840.833 35.8333 816.5 21.5C792.167 7.16667 765.333 0 736 0H160C130.667 0 103.833 7.16667 79.5 21.5C55.1667 35.8333 35.8333 55.1667 21.5 79.5C7.16667 103.833 0 130.667 0 160V608C0 637.333 7.16667 664.167 21.5 688.5C35.8333 712.833 55.1667 732.167 79.5 746.5C103.833 760.833 130.667 768 160 768H736ZM621 413C629 409.667 634.5 404 637.5 396C640.5 388 640.5 380 637.5 372C634.5 364 629 358.333 621 355L365 243C353.667 238.333 343.333 239.167 334 245.5C324.667 251.833 320 260.667 320 272V496C320 507.333 324.667 516.167 334 522.5C343.333 528.833 353.667 529.667 365 525L621 413Z",
                        viewBox: "0 0 896 768"
                    }
                    : {
                        path: "M486 224C509.333 224 530.833 229.667 550.5 241C570.167 252.333 585.667 267.833 597 287.5C608.333 307.167 614 328.667 614 352C614 375.333 608.333 396.833 597 416.5C585.667 436.167 570.167 451.667 550.5 463C530.833 474.333 509.333 480 486 480C462.667 480 441.167 474.333 421.5 463C401.833 451.667 386.333 436.167 375 416.5C363.667 396.833 358 375.333 358 352C358 328.667 363.667 307.167 375 287.5C386.333 267.833 401.833 252.333 421.5 241C441.167 229.667 462.667 224 486 224ZM486 544C520.667 544 552.667 535.333 582 518C611.333 500.667 634.667 477.333 652 448C669.333 418.667 678 386.667 678 352C678 317.333 669.333 285.333 652 256C634.667 226.667 611.333 203.333 582 186C552.667 168.667 520.667 160 486 160C451.333 160 419.333 168.667 390 186C360.667 203.333 337.333 226.667 320 256C302.667 285.333 294 317.333 294 352C294 386.667 302.667 418.667 320 448C337.333 477.333 360.667 500.667 390 518C419.333 535.333 451.333 544 486 544ZM486 640C428.667 634.667 374.667 619 324 593C273.333 567 229.333 532.333 192 489C159.333 455.667 129.333 420.333 102 383L76 352L102 321C129.333 283.667 159.333 248.333 192 215C229.333 171.667 273.333 137 324 111C374.667 85 428.667 69.3333 486 64C543.333 69.3333 597.333 85 648 111C698.667 137 742.667 171.667 780 215C814 248.333 845 283.667 873 321L896 352L873 383C845 420.333 814 455.667 780 489C742.667 532.333 698.667 567 648 593C597.333 619 543.333 634.667 486 640ZM486 704C551.333 699.333 613.333 682.333 672 653C730.667 623.667 781.667 584.333 825 535C861 499.667 894 461.667 924 421C930.667 413 939 401.667 949 387L972 352L949 317C939 302.333 930.667 291 924 283C894 242.333 861 204.333 825 169C781.667 119.667 730.667 80.3333 672 51C613.333 21.6667 551.333 4.66667 486 0C420.667 4.66667 358.667 21.6667 300 51C241.333 80.3333 190.333 119.667 147 169C111 204.333 78 242.333 48 283L21 320L0 352L23 387C33 401.667 41.3333 413 48 421C78 461.667 111 499.667 147 535C190.333 584.333 241.333 623.667 300 653C358.667 682.333 420.667 699.333 486 704Z",
                        viewBox: "0 0 972 704"
                    };
            case "danmakus":
                return {
                    path: "M736 0C765.333 0 792.167 7.16667 816.5 21.5C840.833 35.8333 860.167 55.1667 874.5 79.5C888.833 103.833 896 130.667 896 160V608C896 637.333 888.833 664.167 874.5 688.5C860.167 712.833 840.833 732.167 816.5 746.5C792.167 760.833 765.333 768 736 768H160C130.667 768 103.833 760.833 79.5 746.5C55.1667 732.167 35.8333 712.833 21.5 688.5C7.16667 664.167 0 637.333 0 608V160C0 130.667 7.16667 103.833 21.5 79.5C35.8333 55.1667 55.1667 35.8333 79.5 21.5C103.833 7.16667 130.667 0 160 0H736ZM736 64H160C134.667 64 113 72.1667 95 88.5C77 104.833 66.6667 125.667 64 151V160V608C64 633.333 72.1667 655 88.5 673C104.833 691 125.667 701.333 151 704H160H736C761.333 704 783 695.833 801 679.5C819 663.167 829.333 642.333 832 617V608V160C832 132.667 822.833 109.833 804.5 91.5C786.167 73.1667 763.333 64 736 64ZM304 448V512H240V448H304ZM720 448V512H368V448H720ZM240 256V320H176V256H240ZM688 256V320H304V256H688Z",
                    viewBox: "0 0 896 768"
                }
            case "comments":
                return {
                    path: "M320 0C262 0 208.333 14.6667 159 44C110.333 72 72 110.333 44 159C14.6667 208.333 0 262 0 320C0 378 14.6667 431.667 44 481C72 529.667 110.333 568 159 596C208.333 625.333 262 640 320 640H345L391 800L558 640H576C634 640 687.667 625.333 737 596C785.667 568 824 529.667 852 481C881.333 431.667 896 378 896 320C896 262 881.333 208.333 852 159C824 110.333 785.667 72 737 44C687.667 14.6667 634 0 576 0H320ZM832 320C832 366 820.5 408.667 797.5 448C774.5 487.333 743.333 518.5 704 541.5C664.667 564.5 622 576 576 576H533L423 681L393 576H320C274 576 231.333 564.5 192 541.5C152.667 518.5 121.5 487.333 98.5 448C75.5 408.667 64 366 64 320C64 274 75.5 231.333 98.5 192C121.5 152.667 152.667 121.5 192 98.5C231.333 75.5 274 64 320 64H576C622 64 664.667 75.5 704 98.5C743.333 121.5 774.5 152.667 797.5 192C820.5 231.333 832 274 832 320Z",
                    viewBox: "0 0 896 800"
                }
            case "favorites":
                return {
                    path: "M383.59 59.0333L314.59 210.033V209.033C307.257 223.7 297.757 235.533 286.09 244.533C274.423 253.533 261.59 259.367 247.59 262.033L84.59 287.033C58.59 290.367 37.7567 301.867 22.09 321.533C6.42333 341.2 -0.91 363.7 0.09 389.033C1.09 414.367 10.9233 436.367 29.59 455.033L151.59 581.033C161.59 591.033 168.757 602.867 173.09 616.533C177.423 630.2 178.59 644.7 176.59 660.033L147.59 835.033C142.923 861.7 147.923 885.533 162.59 906.533C177.257 927.533 197.09 941.367 222.09 948.033C247.09 954.7 271.59 951.7 295.59 939.033L433.59 864.033C446.923 856.033 461.257 852.033 476.59 852.033C491.923 852.033 506.257 855.7 519.59 863.033L658.59 939.033C682.59 951.7 706.757 954.867 731.09 948.533C755.423 942.2 774.923 928.7 789.59 908.033C804.257 887.367 809.923 863.7 806.59 837.033L774.59 659.033C772.59 644.367 773.757 630.2 778.09 616.533C782.423 602.867 789.59 591.033 799.59 581.033L921.59 455.033C940.257 437.033 950.09 415.533 951.09 390.533C952.09 365.533 945.257 343.2 930.59 323.533C915.923 303.867 896.257 291.7 871.59 287.033L703.59 262.033C690.257 260.033 677.923 254.867 666.59 246.533C655.257 238.2 646.59 228.367 640.59 217.033L564.59 59.0333C553.923 33.6999 536.59 16.3666 512.59 7.03326C488.59 -2.30007 464.09 -2.30007 439.09 7.03326C414.09 16.3666 395.59 33.6999 383.59 59.0333ZM498.59 89.0333L571.59 241.033C580.923 265.033 596.757 285.533 619.09 302.533C641.423 319.533 665.923 330.033 692.59 334.033L855.59 359.033C862.257 359.7 867.757 362.7 872.09 368.033C876.423 373.367 878.423 379.367 878.09 386.033C877.757 392.7 874.923 398.7 869.59 404.033L747.59 530.033C728.923 548.033 715.757 569.367 708.09 594.033C700.423 618.7 698.59 644.367 702.59 671.033L734.59 847.033C735.257 852.367 734.423 857.367 732.09 862.033C729.757 866.7 726.423 870.533 722.09 873.533C717.757 876.533 713.09 878.033 708.09 878.033C703.09 878.033 698.257 877.033 693.59 875.033L555.59 799.033C532.923 785.7 508.257 778.7 481.59 778.033C454.923 777.367 429.59 783.367 405.59 796.033L260.59 875.033C253.923 878.367 247.09 879.2 240.09 877.533C233.09 875.867 227.757 872.2 224.09 866.533C220.423 860.867 219.257 854.367 220.59 847.033L248.59 671.033C252.59 644.367 250.59 618.7 242.59 594.033C234.59 569.367 221.59 547.7 203.59 529.033L81.59 404.033C76.9233 398.7 74.2567 392.7 73.59 386.033C72.9233 379.367 74.59 373.367 78.59 368.033C82.59 362.7 87.9233 359.7 94.59 359.033L258.59 334.033C283.257 330.033 305.757 320.7 326.09 306.033C346.423 291.367 362.923 272.7 375.59 250.033L380.59 241.033L449.59 90.0333C452.923 82.6999 457.923 77.8666 464.59 75.5333C471.257 73.1999 477.757 73.1999 484.09 75.5333C490.423 77.8666 495.257 82.3666 498.59 89.0333Z",
                    viewBox: "0 0 952 952"
                }
            case "coins":
                return {
                    path: "M475 0C561 0 641 21.3333 715 64C787 106 844 163 886 235C928.667 309 950 389 950 475C950 561 928.667 641 886 715C844 787 787 844 715 886C641 928.667 561 950 475 950C389 950 309 928.667 235 886C163 844 106 787 64 715C21.3333 641 0 561 0 475C0 389 21.3333 309 64 235C106 163 163 106 235 64C309 21.3333 389 0 475 0ZM475 73C402.333 73 334.667 91.3333 272 128C211.333 163.333 163.333 211.333 128 272C91.3333 334.667 73 402.333 73 475C73 547.667 91.3333 615.333 128 678C163.333 738.667 211.333 786.667 272 822C334.667 858.667 402.333 877 475 877C547.667 877 615.333 858.667 678 822C738.667 786.667 786.667 738.667 822 678C858.667 615.333 877 547.667 877 475C877 402.333 858.667 334.667 822 272C786.667 211.333 738.667 163.333 678 128C615.333 91.3333 547.667 73 475 73ZM328 203C322 203 316.333 204.5 311 207.5C305.667 210.5 301.5 214.667 298.5 220C295.5 225.333 294 231 294 237C294 243 295.5 248.667 298.5 254C301.5 259.333 305.667 263.5 311 266.5C316.333 269.5 322 271 328 271H622C631.333 271 639.333 267.667 646 261C652.667 254.333 656 246.333 656 237C656 227.667 652.667 219.667 646 213C639.333 206.333 631.333 203 622 203H328ZM509 271H441V329C403.667 331 369.5 341.833 338.5 361.5C307.5 381.167 282.833 407 264.5 439C246.167 471 237 505.667 237 543V588C237.667 597.333 241.167 605.167 247.5 611.5C253.833 617.833 261.667 621 271 621C280.333 621 288.333 617.833 295 611.5C301.667 605.167 305 597.333 305 588V543C305 517.667 311 494.167 323 472.5C335 450.833 351.333 433.333 372 420C392.667 406.667 415.667 399 441 397V714C441 723.333 444.333 731.333 451 738C457.667 744.667 465.667 748 475 748C484.333 748 492.333 744.667 499 738C505.667 731.333 509 723.333 509 714V397C534.333 399 557.333 406.667 578 420C598.667 433.333 615 450.833 627 472.5C639 494.167 645 517.667 645 543V588C645 597.333 648.333 605.167 655 611.5C661.667 617.833 669.667 621 679 621C688.333 621 696.167 617.833 702.5 611.5C708.833 605.167 712.333 597.333 713 588V543C713 505.667 703.833 471 685.5 439C667.167 407 642.5 381.167 611.5 361.5C580.5 341.833 546.333 331 509 329V271Z",
                    viewBox: "0 0 950 950"
                }
            case "likes":
                return {
                    path: "M890 272.585C870.667 247.252 845 234.585 813 234.585H570L576 106.585C576 87.2516 575 72.5849 573 62.5849C569 44.5849 561.333 31.5849 550 23.5849C530.667 6.91823 508.5 -0.9151 483.5 0.0848999C458.5 1.0849 438 10.9182 422 29.5849L262 228.585H115C95.6667 228.585 76.6667 234.918 58 247.585C40.6667 257.585 27 271.252 17 288.585C5.66667 307.918 0 328.252 0 349.585V695.585C0 704.252 1.33333 713.918 4 724.585C5.33333 730.585 8.33333 739.918 13 752.585C22.3333 771.918 36 786.418 54 796.085C72 805.752 92.3333 810.585 115 810.585H653C687.667 807.252 717.333 795.418 742 775.085C766.667 754.752 784 728.252 794 695.585L896 356.585C899.333 342.585 900.667 328.585 900 314.585C899.333 299.252 896 285.252 890 272.585ZM224 752.585H122C108.667 752.585 98.3333 750.752 91 747.085C83.6667 743.418 76.6667 736.918 70 727.585C66.6667 724.252 63.8333 719.585 61.5 713.585C59.1667 707.585 58 701.585 58 695.585V349.585C58 340.252 60.8333 331.252 66.5 322.585C72.1667 313.918 80 307.918 90 304.585C92 304.585 95.1667 303.585 99.5 301.585C103.833 299.585 107 298.585 109 298.585H224V752.585ZM838 336.585L749 676.585C745.667 689.918 739.333 703.252 730 716.585C720.667 730.585 710 740.585 698 746.585C692 749.252 686.667 751.252 682 752.585H666H282V298.585H301L467 80.5849C470.333 77.9182 474.667 75.2516 480 72.5849C485.333 69.9182 489.667 68.5849 493 68.5849C509.667 72.5849 518 83.2516 518 100.585L506 221.585L499 292.585H800C806 292.585 812 293.752 818 296.085C824 298.418 828.833 301.418 832.5 305.085C836.167 308.752 838.833 313.585 840.5 319.585C842.167 325.585 841.333 331.252 838 336.585Z",
                    viewBox: "0 0 901 811"
                }
            case "time":
                return {
                    path: "M448 832C378.667 832 314.333 814.333 255 779C197 745 151 699 117 641C81.6667 581.667 64 517.333 64 448C64 378.667 81.6667 314.333 117 255C151 197 197 151 255 117C314.333 81.6667 378.667 64 448 64C517.333 64 581.667 81.6667 641 117C699 151 745 197 779 255C814.333 314.333 832 378.667 832 448C832 517.333 814.333 581.667 779 641C745 699 699 745 641 779C581.667 814.333 517.333 832 448 832ZM448 0C368.667 0 294 20.6667 224 62C156 102 102 156 62 224C20.6667 294 0 368.667 0 448C0 527.333 20.6667 602 62 672C102 740 156 794 224 834C294 875.333 368.833 896 448.5 896C528.167 896 602.667 875.667 672 835C740 795.667 794 742.333 834 675C875.333 605 896 529.167 896 447.5C896 365.833 875.667 290.333 835 221C795.667 153.667 742.333 100.333 675 61C605.667 20.3333 530 0 448 0ZM480 435V192C480 182.667 477 175 471 169C465 163 457.5 160 448.5 160C439.5 160 431.833 163.5 425.5 170.5C419.167 177.5 416 184.667 416 192V448C416 454 417.333 459 420 463C421.333 465.667 424.333 469.333 429 474L608 653C614.667 659 622.167 662 630.5 662C638.833 662 646.167 658.833 652.5 652.5C658.833 646.167 662 638 662 628C662 618 659 611.333 653 608L480 435Z",
                    viewBox: "0 0 896 896"
                }
            default:
                return {
                    path: "M581.25 293C581.25 271.667 589.083 253.167 604.75 237.5C620.417 221.833 639.25 214 661.25 214C683.25 214 702.083 221.833 717.75 237.5C733.417 253.167 741.25 271.833 741.25 293.5C741.25 315.167 733.417 333.833 717.75 349.5C702.083 365.167 683.25 373 661.25 373C639.25 373 620.417 365.167 604.75 349.5C589.083 333.833 581.25 315 581.25 293ZM578.25 0C550.917 0 523.583 5.33333 496.25 16C468.917 26.6667 446.25 41 428.25 59L42.25 443C23.5833 461 11.0833 482.333 4.75 507C-1.58333 531.667 -1.58333 556.167 4.75 580.5C11.0833 604.833 23.5833 626.333 42.25 645L307.25 909C321.25 922.333 336.917 932.667 354.25 940C371.583 947.333 389.917 951 409.25 951C428.583 951 447.083 947.333 464.75 940C482.417 932.667 497.917 922.333 511.25 909L897.25 526C946.583 476.667 965.583 417.667 954.25 349L926.25 169C920.917 135 904.917 104.833 878.25 78.5C851.583 52.1667 820.917 36.3333 786.25 31L605.25 2C596.583 0.666667 587.583 0 578.25 0ZM578.25 79C582.917 79 587.917 79.3333 593.25 80L774.25 109C791.583 111.667 807.417 120.167 821.75 134.5C836.083 148.833 844.583 164.667 847.25 182L875.25 362C878.583 381.333 878.25 399 874.25 415C868.917 434.333 857.583 452.667 840.25 470L455.25 853C442.583 865.667 427.417 872 409.75 872C392.083 872 376.917 865.667 364.25 853L98.25 589C86.25 576.333 80.25 561.333 80.25 544C80.25 526.667 86.25 511.667 98.25 499L484.25 115C494.917 104.333 509.083 95.6667 526.75 89C544.417 82.3333 561.583 79 578.25 79Z",
                    viewBox: "0 0 958 951"
                }
        }
    }

    /**
     * @param {infoType} type
     * @param {string} text
     */
    function createInfoItem(type, text, isVideo = true) {
        const icon = getIcon(type, isVideo);
        if (typeof icon !== "object") { return; }
        const item = document.createElement("div");
        item.className = `cover-info-item ${type}`;
        item.innerHTML =
            `<i class="iconfont">
                <svg viewBox="${icon.viewBox}" style="width: 16px; height: 16px;">
                    <path
                        d="${icon.path}" />
                </svg>
            </i>
            <span class="single-ellipsis num-info">${text}</span>`;
        item.style.display = "flex";
        return item;
    }

    /**
     * @param {Element} info
     * @param {infoType} type
     * @param {string} text
     */
    function addInfoItem(info, type, text, isVideo = true) {
        if (!(info instanceof Element)) { return; }
        let item = info.querySelector(`.cover-info-item.${type}`);
        if (item) {
            item.querySelector(".num-info").innerText = text;
            return;
        }
        item = createInfoItem(type, text, isVideo);
        if (item instanceof Element) {
            info.appendChild(item);
        }
    }

    /**
     * @param {Element} info
     * @param {infoType[]} types
     * @param {BiliBiliCard} card
     */
    function addInfoItems(info, types, card) {
        if (!Array.isArray(types)) { return; }
        if (!(card instanceof BiliBiliCard)) { return; }
        const isVideo = canPlay(card.type);
        types.forEach(type => addInfoItem(info, type, card.getInfo(type), isVideo));
    }

    /**
     * @param {Element} cover
     * @param {cardType} type
     */
    function setCoverType(cover, type) {
        if (!(cover instanceof Element)) { return; }
        if (canPlay(type)) {
            cover.classList.add("video-cover-img");
        }
        else {
            cover.classList.remove("video-cover-img");
        }
    }

    /**
     * @param {cardType} type
     */
    function getTypeName(type) {
        switch (type) {
            case "video":
                return "视频";
            case "article":
                return "专栏";
            case "user":
                return "用户";
            case "live":
                return "直播";
            case "bangumi":
                return "番剧";
            case "audio":
                return "音频";
            case "dynamic":
                return "动态";
            case "favorite":
                return "收藏夹";
            case "album":
                return "相簿";
            default:
                return type;
        }
    }

    /**
     * @param {string} id
     * @param {cardType} type
     */
    function getUrl(id, type) {
        if (typeof id !== "string" || !id.length) { return; }
        switch (type) {
            case "video":
                return `https://www.bilibili.com/video/${getVid(id)}`;
            case "article":
                return `https://www.bilibili.com/read/${id.slice(0, 2).toLowerCase() === "cv" ? id : `cv${id}`}`;
            case "user":
                return `https://space.bilibili.com/${id}`;
            case "live":
                return `https://live.bilibili.com/${id}`;
            case "bangumi":
                return `https://www.bilibili.com/bangumi/play/${id.slice(0, 2).toLowerCase() === "ss" ? id : `ss${id}`}`;
            case "audio":
                return `https://www.bilibili.com/audio/${id.slice(0, 2).toLowerCase() === "au" ? id : `au${id}`}`;
            case "dynamic":
                return `https://t.bilibili.com/${id}`;
            case "favorite":
                return `https://www.bilibili.com/medialist/detail/${id.slice(0, 2).toLowerCase() === "ml" ? id : `ml${id}`}`;
            case "album":
                return `https://h.bilibili.com/${id}`;
            default:
                return id;
        }
    }

    /**
     * @param {cardType} value
     */
    function getDefaultInfoTypes(value) {
        switch (value) {
            case "video":
                return ["views", "danmakus"];
            case "user":
                return ["views", "likes"];
            case "live":
                return ["views"];
            case "bangumi":
                return ["favorites"];
            case "favorite":
                return ["views", "favorites"];
            case "article":
            case "audio":
            case "dynamic":
            case "album":
            default:
                return ["views", "comments"];
        }
    }

    /**
     * @param {themeType} theme
     */
    function getTheme(theme) {
        if (baseUrl) {
            switch (theme.toLowerCase()) {
                case '1':
                case "light":
                    return `${baseUrl}.light.css`;
                case '2':
                case "dark":
                    return `${baseUrl}.dark.css`;
                case '0':
                case "auto":
                case "system":
                case "default":
                    return `${baseUrl}.css`;
                case "fd":
                case "fd2":
                case "fluent":
                case "fluentui":
                    return `${baseUrl}.fluent.css`;
                case "windose":
                    return `${baseUrl}.windose.css`;
                case "-1":
                case "none":
                    return '';
                default:
                    return theme;
            }
        }
        return theme;
    }

    /**
     * @param {string} proxy
     * @param {string} url
     */
    function getBackgroundUrl(proxy, url) {
        if (typeof _wb_wombat === "undefined") {
            return `${proxy}${url}`
        }
        else {
            return _wb_wombat.rewrite_url(`${proxy}${_wb_wombat.extract_orig(url)}`);
        }
    }

    const defaultTitle = "哔哩哔哩 (゜-゜)つロ 干杯~";
    const defaultAuthor = "2233";
    const defaultDuration = "??:??";
    const defaultProxy = typeof _wb_wombat === "undefined" ? "https://images.weserv.nl/?url=" : '';
    const defaultTheme = "default";

    class BiliBiliCard extends HTMLElement {
        /**
         * @param {string} value
         */
        static set baseUrl(value) {
            baseUrl = value;
        }

        static get observedAttributes() {
            return ["vid", "type", "title", "author", "cover", "duration", "views", "danmakus", "comments", "favorites", "coins", "likes", "info-types", "image-proxy", "theme"];
        }

        constructor() {
            super();

            this.isLoaded = false;
            const shadowRoot = this.attachShadow({ mode: "open" });

            const theme = document.createElement("link");
            theme.rel = "stylesheet";
            shadowRoot.appendChild(theme);

            const card = document.createElement("div");
            card.className = "video-holder";
            shadowRoot.appendChild(card);

            const link = document.createElement('a');
            link.className = "default-flex full-width";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.style.maxHeight = "92px";
            link.style.display = "flex";
            link.style.alignItems = "center";
            card.appendChild(link);

            const cover_box = document.createElement("div");
            cover_box.className = "disable-event cover-box";
            cover_box.innerHTML =
                `<i class="iconfont default-cover">
                    <svg viewBox="0 0 1093 1023" style="width: 42px; height: 42px;">
                        <path
                            d="M653 665C651 667 647.667 671.333 643 678C638.333 685.333 634.667 690.667 632 694C626.667 698.667 621.667 701 617 701C608.333 701 599.667 698.833 591 694.5C582.333 690.167 575 684.333 569 677L561 667C557 661.667 554 658.167 552 656.5C550 654.833 547.667 654 545 654C542.333 654 534.667 661.667 522 677C517.333 683 509.667 688.5 499 693.5C488.333 698.5 480.167 701 474.5 701C468.833 701 462.333 697 455 689C451 683.667 445.333 675.667 438 665C427.333 649 415.333 645.333 402 654C395.333 658.667 392 665.833 392 675.5C392 685.167 395.333 693.667 402 701L438 737C442 740.333 447.167 743.167 453.5 745.5C459.833 747.833 466.667 749 474 749C481.333 749 487.333 748.167 492 746.5C496.667 744.833 502.667 741.667 510 737C518 730.333 529.667 722.333 545 713C550.333 719 556.667 725 564 731C579.333 743 593.167 749 605.5 749C617.833 749 631 745 645 737C655.667 731 666 723 676 713C684 705 689 696.667 691 688C693 679.333 692 671.667 688 665C683.333 660.333 677.5 658 670.5 658C663.5 658 657.667 660.333 653 665ZM984 737C984 758.333 978.667 778 968 796C957.333 814 942.833 828.5 924.5 839.5C906.167 850.5 886 856 864 856H226C204.667 856 185 850.667 167 840C149 829.333 134.5 814.833 123.5 796.5C112.5 778.167 107 758.333 107 737V382C107 360.667 112.333 340.833 123 322.5C133.667 304.167 148.167 289.667 166.5 279C184.833 268.333 204.667 263 226 263H867C889 263 909 268.333 927 279C945 289.667 959.333 304 970 322C980.667 340 986 360 986 382V737H984ZM900 156H714L807 63C814.333 55.6667 818 47.3333 818 38C818 28.6667 814.5 20.3333 807.5 13C800.5 5.66667 792.167 2 782.5 2C772.833 2 764.333 5.66667 757 13L614 156H491L345 11C338.333 3.66667 330.167 0 320.5 0C310.833 0 302.5 3.5 295.5 10.5C288.5 17.5 285 25.8333 285 35.5C285 45.1667 288.333 53.6667 295 61L391 156H191C156.333 156 124.333 164.5 95 181.5C65.6667 198.5 42.5 221.667 25.5 251C8.5 280.333 0 312 0 346V773C0 807 8.5 838.667 25.5 868C42.5 897.333 65.6667 920.5 95 937.5C124.333 954.5 156.333 963 191 963H214C214 979.667 219.833 993.833 231.5 1005.5C243.167 1017.17 257.333 1023 274 1023C290.667 1023 304.667 1017.17 316 1005.5C327.333 993.833 333 979.667 333 963H760C760 979.667 765.667 993.833 777 1005.5C788.333 1017.17 802.333 1023 819 1023C835.667 1023 849.833 1017.17 861.5 1005.5C873.167 993.833 879 979.667 879 963H903C937 963 968.667 954.5 998 937.5C1027.33 920.5 1050.5 897.333 1067.5 868C1084.5 838.667 1093 807 1093 773V346C1092.33 312 1083.17 280.333 1065.5 251C1047.83 221.667 1024.5 198.5 995.5 181.5C966.5 164.5 934.667 156 900 156ZM653 499L879 546L891 451L676 403L653 499ZM414 406L200 453L212 549L438 501L414 406Z" />
                    </svg>
                </i>`;
            link.appendChild(cover_box);

            const cover = document.createElement("div");
            cover.className = "cover-img";
            cover.style.display = "none";
            cover_box.appendChild(cover);

            const video_subtitle = document.createElement("div");
            video_subtitle.className = "video-subtitle";
            cover_box.appendChild(video_subtitle);

            const duration = document.createElement("div");
            duration.className = "video-duration";
            video_subtitle.appendChild(duration);

            const content = document.createElement("div");
            content.className = "disable-event video-content-container";
            link.appendChild(content);

            const title = document.createElement('p');
            title.className = "double-ellipsis video-title";
            title.style.marginBottom = '0';
            content.appendChild(title);

            const info = document.createElement("div");
            info.className = "video-card-info";
            info.style.display = "flex";
            content.appendChild(info);

            const bottom = document.createElement("div");
            bottom.className = "video-card-bottom";
            bottom.style.display = "flex";
            content.appendChild(bottom);

            const type = document.createElement("label");
            type.className = "card-text-label";
            bottom.appendChild(type);

            const author_box = document.createElement("div");
            author_box.className = "view-flex default-flex align-center author-info";
            author_box.innerHTML =
                `<i class="iconfont up-icon">
                    <svg viewBox="0 0 896 768" style="width: 14px; height: 14px;">
                        <path
                            d="M832 608V160C832 132.667 822.833 109.833 804.5 91.5C786.167 73.1667 763.333 64 736 64H160C132.667 64 109.833 73.1667 91.5 91.5C73.1667 109.833 64 132.667 64 160V608C64 635.333 73.1667 658.167 91.5 676.5C109.833 694.833 132.667 704 160 704H736C763.333 704 786.167 694.833 804.5 676.5C822.833 658.167 832 635.333 832 608ZM736 0C765.333 0 792.167 7.16667 816.5 21.5C840.833 35.8333 860.167 55.1667 874.5 79.5C888.833 103.833 896 130.667 896 160V608C896 637.333 888.833 664.167 874.5 688.5C860.167 712.833 840.833 732.167 816.5 746.5C792.167 760.833 765.333 768 736 768H160C130.667 768 103.833 760.833 79.5 746.5C55.1667 732.167 35.8333 712.833 21.5 688.5C7.16667 664.167 0 637.333 0 608V160C0 130.667 7.16667 103.833 21.5 79.5C35.8333 55.1667 55.1667 35.8333 79.5 21.5C103.833 7.16667 130.667 0 160 0H736ZM355 416V198H416V438C416 485.333 403 521.167 377 545.5C351 569.833 315 582 269 582C223 582 188 570.333 164 547C140 523.667 128 488.667 128 442V198H189V416C189 438 190.333 455 193 467C196.333 485 203.667 498.667 215 508C228.333 519.333 247.333 525 272 525C296.667 525 315.667 519.333 329 508C340.333 498.667 347.667 485 351 467C353.667 455 355 438 355 416ZM643 378C659.667 378 673.333 373.333 684 364C697.333 353.333 704 337.667 704 317C704 295 698 278.667 686 268C676 260 661.667 256 643 256H550V378H643ZM646 198C692 198 725.333 211.667 746 239C760.667 259 768 284.167 768 314.5C768 344.833 760.667 369.667 746 389C725.333 415.667 692 429 646 429H550V576H490V198H646Z" />
                    </svg>
                </i>`;
            author_box.style.display = "flex";
            bottom.appendChild(author_box);

            const author = document.createElement("span");
            author.className = "view-flex single-ellipsis author-name";
            author_box.appendChild(author);

            this.contents = {
                link: link,
                cover: cover,
                duration: duration,
                title: title,
                info: info,
                type: type,
                author: author,
                theme: theme
            };
        }

        get vid() {
            return this.getAttribute("vid");
        }
        set vid(value) {
            this.setAttribute("vid", value);
        }

        get type() {
            return this.getAttribute("type") || "video";
        }
        set type(value) {
            this.setAttribute("type", value);
        }

        get title() {
            return this.getAttribute("title") || defaultTitle;
        }
        set title(value) {
            this.setAttribute("title", value);
        }

        get author() {
            return this.getAttribute("author") || defaultAuthor;
        }
        set author(value) {
            this.setAttribute("author", value);
        }

        get cover() {
            const value = this.getAttribute("cover");
            if (typeof value === "string") {
                return value.trimStart();
            }
        }
        set cover(value) {
            this.setAttribute("cover", typeof value === "string" ? value.trimStart() : value);
        }

        get duration() {
            return this.getAttribute("duration") || defaultDuration;
        }
        set duration(value) {
            this.setAttribute("duration", value);
        }

        get views() {
            return this.getAttribute("views") || '0';
        }
        set views(value) {
            this.setAttribute("views", value);
        }

        get danmakus() {
            return this.getAttribute("danmakus") || '0';
        }
        set danmakus(value) {
            this.setAttribute("danmakus", value);
        }

        get comments() {
            return this.getAttribute("comments") || '0';
        }
        set comments(value) {
            this.setAttribute("comments", value);
        }

        get favorites() {
            return this.getAttribute("favorites") || '0';
        }
        set favorites(value) {
            this.setAttribute("favorites", value);
        }

        get coins() {
            return this.getAttribute("coins") || '0';
        }
        set coins(value) {
            this.setAttribute("coins", value);
        }

        get likes() {
            return this.getAttribute("likes") || '0';
        }
        set likes(value) {
            this.setAttribute("likes", value);
        }

        get infoTypes() {
            const value = this.getAttribute("info-types");
            if (typeof value === "string") {
                const types = value.split(/[,|\s+]/).filter(x => x != '');
                if (types.length) {
                    return types;
                }
            }
            return getDefaultInfoTypes(this.type);
        }
        set infoTypes(value) {
            this.setAttribute("info-types", Array.isArray(value) ? value.join(' ') : value);
        }

        get imageProxy() {
            return (this.getAttribute("image-proxy") || defaultProxy).trimEnd();
        }
        set imageProxy(value) {
            this.setAttribute("image-proxy", typeof value === "string" ? value.trimEnd() : value);
        }

        get theme() {
            return this.getAttribute("theme") || defaultTheme;
        }
        set theme(value) {
            this.setAttribute("theme", value);
        }

        connectedCallback() {
            this.contents.theme.href = getTheme(this.theme);
            const type = this.type;
            this.contents.link.href = getUrl(this.vid, type);
            const cover = this.cover;
            setCoverType(this.contents.cover, type);
            if (cover) {
                this.contents.cover.style.display = '';
                this.contents.cover.style.backgroundImage = `url(${getBackgroundUrl(this.imageProxy, cover)})`;
            }
            const duration = this.contents.duration;
            duration.innerText = this.duration;
            duration.parentElement.style.display = hasDuration(type) ? '' : "none";
            this.contents.title.innerText = this.title;
            addInfoItems(this.contents.info, this.infoTypes, this);
            this.contents.type.innerText = getTypeName(type);
            this.contents.author.innerText = this.author;
            this.isLoaded = true;
        }

        /**
         * @param {string} name
         * @param {string} oldValue
         * @param {string} newValue
         */
        attributeChangedCallback(name, oldValue, newValue) {
            if (!this.isLoaded || oldValue === newValue) { return; }
            switch (name) {
                case "vid":
                    this.contents.link.href = getUrl(newValue, this.type);
                    break;
                case "type":
                    const type = newValue || "video";
                    this.contents.link.href = getUrl(this.vid, type);
                    setCoverType(this.contents.cover, type);
                    this.contents.duration.parentElement.style.display = hasDuration(type) ? '' : "none";
                    this.contents.type.innerText = getTypeName(type);
                    break;
                case "title":
                    this.contents.title.innerText = newValue || defaultTitle;
                    break;
                case "author":
                    this.contents.author.innerText = newValue || defaultAuthor;
                    break;
                case "cover":
                    const value = typeof newValue === "string" ? newValue.trimStart() : undefined;
                    if (value) {
                        this.contents.cover.style.display = '';
                        this.contents.cover.style.backgroundImage = `url(${getBackgroundUrl(this.imageProxy, value)})`;
                    }
                    else {
                        this.contents.cover.style.display = "none";
                        this.contents.cover.style.backgroundImage = '';
                    }
                    break;
                case "duration":
                    this.contents.duration.innerText = newValue || defaultDuration;
                    break;
                case "views":
                    if (this.infoTypes.includes("views")) {
                        addInfoItem(this.contents.info, "views", newValue || 0, canPlay(this.type));
                    }
                    break;
                case "danmakus":
                    if (this.infoTypes.includes("danmakus")) {
                        addInfoItem(this.contents.info, "danmakus", newValue || 0);
                    }
                    break;
                case "comments":
                    if (this.infoTypes.includes("comments")) {
                        addInfoItem(this.contents.info, "comments", newValue || 0);
                    }
                    break;
                case "favorites":
                    if (this.infoTypes.includes("favorites")) {
                        addInfoItem(this.contents.info, "favorites", newValue || 0);
                    }
                    break;
                case "coins":
                    if (this.infoTypes.includes("coins")) {
                        addInfoItem(this.contents.info, "coins", newValue || 0);
                    }
                    break;
                case "likes":
                    if (this.infoTypes.includes("likes")) {
                        addInfoItem(this.contents.info, "likes", newValue || 0);
                    }
                    break;
                case "info-types":
                    const info = this.contents.info;
                    info.innerHTML = '';
                    let types = typeof newValue === "string" ? newValue.split(/[,|\s+]/).filter(x => x != '') : [];
                    if (!types.length) {
                        types = getDefaultInfoTypes(this.type);
                    }
                    addInfoItems(this.contents.info, types, this);
                    break;
                case "image-proxy":
                    const cover = this.cover;
                    if (cover) {
                        const imageProxy = (newValue || defaultProxy).trimEnd();
                        this.contents.cover.style.display = '';
                        this.contents.cover.style.backgroundImage = `url(${getBackgroundUrl(imageProxy, cover)})`;
                    }
                    break;
                case "theme":
                    this.contents.theme.href = getTheme(newValue || defaultTheme);
                    break;
            }
        }

        /**
         * @param {infoType} name
         */
        getInfo(name) {
            /** @type {string | null} */
            let info = this[name];
            if (typeof info === "undefined") {
                info = this.getAttribute(name);
            }
            return info;
        }
    }

    customElements.define("bilibili-card", BiliBiliCard);

    if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = BiliBiliCard;
    }
    else if (typeof this === "undefined") {
        const global =
            typeof globalThis !== "undefined" ? globalThis
                : typeof window !== "undefined" ? window : {};
        global.$BiliBiliCard = BiliBiliCard;
    }
    else {
        this.BiliBiliCard = BiliBiliCard;
    }
})();
