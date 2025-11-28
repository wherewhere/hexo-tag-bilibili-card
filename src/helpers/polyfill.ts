if (!Array.prototype.includes) {
    Array.prototype.includes = function (value) { return this.indexOf(value) !== -1; }
}

if (!String.prototype.trimStart) {
    if (!String.prototype.trimLeft) {
        String.prototype.trimLeft = function () { return this.replace(/^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/, ''); }
    }
    String.prototype.trimStart = String.prototype.trimLeft;
}

if (!String.prototype.trimEnd) {
    if (!String.prototype.trimRight) {
        String.prototype.trimRight = function () { return this.replace(/[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+$/, ''); }
    }
    String.prototype.trimEnd = String.prototype.trimRight;
}