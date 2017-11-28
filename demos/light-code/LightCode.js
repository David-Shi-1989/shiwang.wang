$(function(){
    var html =
        '<!DOCTYPE html>'+
        '<html lang="en">'+
        '<head>'+
        '<meta charset="utf-8" />'+
        '<title>LightCode</title>'+
        '<link rel="stylesheet" href="__USER_CSS__/demo/LightCode.css" />'+
        '<script src="__USER_VENDOR__/jquery/jquery-1.10.2.min.js"></script>'
    '<'+'script src="__USER_JS__/demo/LightCode.min.js"></script>'+
    '<head/>';
    $("#ta_input").text(html);
});
var utility = {
    codeType: {
        html: { unknow: -1, tag: 1, comment: 2, script: 3, style: 4 },
    },
    symbol: {
        html: {
            html5_begin: '&lt;!',
            comment_begin: '&lt;!--', comment_end: '--&gt;',
            tag_begin_1: '&lt;/', tag_begin_2: '&lt;', tag_end_1: '/&gt;', tag_end_2: '&gt;',
            equal: '=',
            normal_script1_begin: "&lt;%=", normal_script1_end: "%&gt;",
        },
    },
    getMinIndexOf: function (str, searchStrArr) {
        var arr = new Array();
        for (var i = 0; i < searchStrArr.length; i++) {
            str.includes(searchStrArr[i]) ? arr.push({ value: str.indexOf(searchStrArr[i]), str: searchStrArr[i], index: i }) : "";
        }

        if (arr.length > 1) {
            var compare = function (v1, v2) {
                if (v1.value == v2.value) {
                    return ((v1.index - v2.index) > 0 ? 1 : -1);
                } else {
                    return v1.value - v2.value
                }
            };
            arr.sort(compare);
        }

        if (arr.length > 0) return [arr[0].str, arr[0].value];
        else return null;
    },

    regex: {
        tagName_close_1: /^&lt;\/\w+&gt;/,
        attrbute_newName: /[a-zA-Z0-9-]+\s*=\s*["']/
    },

    tagCanWithoutCloseEnum: ["input", "meta","br","img","link"],
}

var stringParser = {
    isTagInclude: function (str) {
        return utility.getMinIndexOf(str, [
            utility.symbol.html.comment_begin, utility.symbol.html.comment_end,
            utility.symbol.html.html5_begin,
            utility.symbol.html.tag_begin_1, utility.symbol.html.tag_begin_2,
            utility.symbol.html.tag_end_1, utility.symbol.html.tag_end_2,
        ]);
    }
}

function CodeTree(sumContent) {
    var obj = new Object();
    obj.sumContent = sumContent;
    obj.lineArr = new Array();
    obj.tagArr = new Array();
    obj.nodeArr = new Array();
    obj.nodeIndex = 0;
    obj.lightCode = "";

    obj.rootNode = new NodeElement("");
    obj.cursorState = new CursorState;

    obj.normalizeContent2Arr = function () {
        var tmpArr = this.sumContent.split("\n");
        for (var i = 0; i < tmpArr.length; i++) {
            var curStr = tmpArr[i].trim();
            if (curStr.length > 0) this.lineArr.push(curStr);
        }
    }
    obj.getNodeByIndex = function (index) {
        if (typeof (index) == "number" && this.nodeArr.length > parseInt(index) && parseInt(index) >= 0) {
            return this.nodeArr[parseInt(index)];
        } else {
            return null;
        }
    }

    obj.transferHTML = function () {
        var text = this.sumContent.trim();
        var result = "";
        var arr = text.split("\n");
        if (arr != null && arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].length > 0) {
                    var _cur = arr[i].replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
                    _cur.replace(/^\d+\s*/i, " ");
                    result += _cur + "\n";
                }
            }
        }
        this.sumContent = result;
    }

    obj.parseCode = function () {
        this.transferHTML();
        this.normalizeContent2Arr();
        var parentNodeIndex = -1;
        this.cursorState.currentNodeIndex = 0;
        this.rootNode.index = 0, this.rootNode.parentIndex = -1;
        this.nodeArr.push(this.rootNode);
        for (var i = 0; i < this.lineArr.length; i++) {
            var curLineStr = this.lineArr[i];
            //for debug
            if (curLineStr.includes('&lt;br&gt;')) {
                var oo = 0;
            }

            while (curLineStr.length > 0) {
                if (curLineStr.indexOf('&lt;br&gt;') == 0) {
                    var oos = 1;
                }
                if (this.cursorState.isInComment) {
                    var a = curLineStr.indexOf(utility.symbol.html.comment_end);
                    if (this.getNodeByIndex(this.cursorState.currentNodeIndex).hasClosed()) {
                        this.cursorState.currentNodeIndex = this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex;
                        parentNodeIndex = this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex;
                    }
                    if (a < 0) {
                        //all comment
                        this.getNodeByIndex(this.cursorState.currentNodeIndex).appendHTML(curLineStr, true);
                        curLineStr = "";
                    } else {
                        this.getNodeByIndex(this.cursorState.currentNodeIndex).appendHTML(curLineStr.substr(0, a + utility.symbol.html.comment_end.length), true);
                        this.cursorState.isInComment = false;
                        curLineStr = curLineStr.substr(a + utility.symbol.html.comment_end.length);
                    }
                } else if (this.cursorState.isInHTML) {
                    var minIndex = stringParser.isTagInclude(curLineStr);
                    if (minIndex) {
                        this.getNodeByIndex(this.cursorState.currentNodeIndex).appendHTML(curLineStr.substr(0, minIndex[1]));
                        curLineStr = curLineStr.substr(minIndex[1]);
                        this.cursorState.isInHTML = false;
                    } else {
                        this.getNodeByIndex(this.cursorState.currentNodeIndex).appendHTML(curLineStr);
                        curLineStr = "";
                    }
                } else if (this.cursorState.isInTag) {
                    //div class="123" data-id="1">123...
                    //input type="text" />123...
                    //br/>
                    var tagStr = "";
                    var minIndex = utility.getMinIndexOf(curLineStr, [utility.symbol.html.tag_end_1, utility.symbol.html.tag_end_2]);
                    if (minIndex) {
                        var type = minIndex[0], value = minIndex[1];
                        tagStr = curLineStr.substr(0, value);
                        curLineStr = curLineStr.substr(value);
                        this.cursorState.isInTag = false;
                    } else {
                        tagStr = curLineStr;
                        curLineStr = "";
                    }
                    if (tagStr.length > 0) {
                        //div class="123"...
                        //div
                        var tagStrArr = tagStr.trim().split(" ");
                        if (tagStrArr.length > 0) {
                            this.getNodeByIndex(this.cursorState.currentNodeIndex).tagName = tagStrArr[0];
                            var attrsArr = new Array();
                            for (var t = 1; t < tagStrArr.length; t++) {
                                //attribute
                                var attrStr = tagStrArr[t];
                                if (attrStr.includes("=")) {
                                    var quotes = attrStr.replace(/\s+/g, "")[attrStr.replace(/\s+/g, "").indexOf("=") + 1];
                                    if (attrStr[attrStr.length - 1] == quotes) {
                                        //close normally
                                        attrsArr.push(attrStr);
                                    } else {
                                        //when class="123 456 789",may split into 3 pices
                                        var forwardsAttr = "";
                                        var d = 1;
                                        do {
                                            if (t + d < tagStrArr.length) {
                                                forwardsAttr += " " + tagStrArr[t + d];
                                            } else {
                                                break;
                                            }
                                        } while ((++d > 0) && !(tagStrArr[t + d] && tagStrArr[t + d].length > 0 && tagStrArr[t + d].match(utility.regex.attrbute_newName)))
                                        t += (d - 1);
                                        attrsArr.push(attrStr + forwardsAttr);
                                    }
                                } else {
                                    //some attribute has no value
                                    attrsArr.push(attrStr);
                                }
                            }

                            for (var t = 0; t < attrsArr.length; t++) {
                                var curItem = attrsArr[t];
                                var a = curItem.indexOf("=");
                                if (a > 0) {
                                    var attrName = curItem.substr(0, a);
                                    var attrValue = curItem.substr(a + 1).trim();
                                    attrValue = attrValue.substr(1, attrValue.length - 2);
                                    if (attrName.length > 0 && attrValue.length > 0) {
                                        this.getNodeByIndex(this.cursorState.currentNodeIndex).attributeArr.push({ name: attrName, value: attrValue });
                                    }
                                } else {
                                    this.getNodeByIndex(this.cursorState.currentNodeIndex).attributeArr.push({ name: curItem, value: "" });
                                }
                            }
                        }
                    }

                } else {
                    var minIndex = stringParser.isTagInclude(curLineStr);
                    if (minIndex) {
                        var type = minIndex[0], value = minIndex[1], normalWordsForwards = value == 0 ? false : true;

                        if (!normalWordsForwards) {
                            //begin with symbol
                            switch (type) {
                                case utility.symbol.html.html5_begin:
                                    //only 1 case:<!DOCTYPE html>
                                    var newNode = new NodeElement("", this);
                                    newNode.index = this.nodeArr.length;
                                    if (this.getNodeByIndex(this.cursorState.currentNodeIndex).hasClosed()) {
                                        //currentNode has already closed
                                        newNode.setParentIndex(this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex);
                                    } else {
                                        newNode.setParentIndex(this.cursorState.currentNodeIndex);
                                    }
                                    this.getNodeByIndex(newNode.parentIndex).appendChild(newNode.index);
                                    this.nodeArr.push(newNode);
                                    this.cursorState.currentNodeIndex = newNode.index;
                                    parentNodeIndex = newNode.parentIndex;

                                    this.getNodeByIndex(this.cursorState.currentNodeIndex).leftBracketType = utility.symbol.html.html5_begin;
                                    this.cursorState.isInTag = true;
                                    curLineStr = curLineStr.substr(utility.symbol.html.html5_begin.length);
                                    break;
                                case utility.symbol.html.tag_begin_1:
                                    //</div>
                                    //1.end current Node
                                    var closeTagName = curLineStr.match(utility.regex.tagName_close_1)[0];
                                    if (closeTagName && closeTagName.length > 0) {
                                        curLineStr = curLineStr.substr(closeTagName.length - utility.symbol.html.tag_begin_2.length);
                                        closeTagName = closeTagName.substr(utility.symbol.html.tag_begin_1.length, closeTagName.length - utility.symbol.html.tag_begin_1.length - utility.symbol.html.tag_begin_2.length);
                                        if (!this.getNodeByIndex(this.cursorState.currentNodeIndex).hasClosed() && closeTagName == this.getNodeByIndex(this.cursorState.currentNodeIndex).tagName) {
                                            //success close a tag
                                            //console.log("success close a tag:" + closeTagName);
                                        } else if (this.getNodeByIndex(this.cursorState.currentNodeIndex).getParent() && closeTagName == this.getNodeByIndex(this.cursorState.currentNodeIndex).getParent().tagName && !this.getNodeByIndex(this.cursorState.currentNodeIndex).getParent().hasClosed()) {
                                            //close parent's tag
                                            this.cursorState.currentNodeIndex = parentNodeIndex;
                                            parentNodeIndex = this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex;
                                            //console.log("success close parent's tag:" + closeTagName);
                                        }
                                        else {
                                            //fail close a tag
                                            console.log("fail close a tag:" + closeTagName + " of " + this.getNodeByIndex(this.cursorState.currentNodeIndex).tagName);
                                        }
                                        this.getNodeByIndex(this.cursorState.currentNodeIndex).rightBracketType = utility.symbol.html.tag_begin_1;
                                    } else {
                                        console.log("should not hit.close tagName is none:" + curLineStr);
                                    }
                                    this.cursorState.isInTag = !(curLineStr.substr(0, utility.symbol.html.tag_end_2.length) == utility.symbol.html.tag_end_2);
                                    break;
                                case utility.symbol.html.tag_begin_2:
                                    //<div class="oo">
                                    //<div>
                                    /******************************************
                                     * Create a Node Here
                                     ******************************************/
                                    //this.nodeArr.push(this.cursorState.currentNode);
                                    //parentNodeIndex = this.cursorState.currentNode.index;

                                    var newNode = new NodeElement("", this);
                                    newNode.index = this.nodeArr.length;
                                    if (this.getNodeByIndex(this.cursorState.currentNodeIndex).hasClosed()) {
                                        //currentNode has already closed
                                        newNode.setParentIndex(this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex);
                                    } else {
                                        newNode.setParentIndex(this.cursorState.currentNodeIndex);
                                    }
                                    this.getNodeByIndex(newNode.parentIndex).appendChild(newNode.index);
                                    this.nodeArr.push(newNode);
                                    this.cursorState.currentNodeIndex = newNode.index;
                                    parentNodeIndex = newNode.parentIndex;
                                    this.cursorState.isInTag = true;
                                    curLineStr = curLineStr.substr(utility.symbol.html.tag_begin_2.length);
                                    break;
                                case utility.symbol.html.tag_end_1:
                                    // />
                                    /******************************************
                                     * Close a Node Here
                                     ******************************************/
                                    this.getNodeByIndex(this.cursorState.currentNodeIndex).rightBracketType = utility.symbol.html.tag_end_1;
                                    //this.cursorState.isInHTML = true;
                                    curLineStr = curLineStr.substr(utility.symbol.html.tag_end_1.length);
                                    parentNodeIndex = this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex;
                                    break;
                                case utility.symbol.html.tag_end_2:
                                    // >
                                    if (this.getNodeByIndex(this.cursorState.currentNodeIndex).leftBracketType == "&lt;!" || utility.tagCanWithoutCloseEnum.includes(this.getNodeByIndex(this.cursorState.currentNodeIndex).tagName)) {
                                        //<!DOCTYPE html> can close with >
                                        //<input > can close with >
                                        this.getNodeByIndex(this.cursorState.currentNodeIndex).rightBracketType = "&gt;";
                                        curLineStr = curLineStr.substr(utility.symbol.html.tag_end_2.length);
                                        break;
                                    }

                                    if (this.getNodeByIndex(this.cursorState.currentNodeIndex).tagName.length > 0 && this.getNodeByIndex(this.cursorState.currentNodeIndex).rightBracketType.length == 0) {
                                        //<div>
                                        //this.cursorState.isInHTML = true;
                                        curLineStr = curLineStr.substr(utility.symbol.html.tag_end_2.length);
                                        parentNodeIndex = this.cursorState.currentNodeIndex;
                                    } else if (this.getNodeByIndex(this.cursorState.currentNodeIndex).tagName.length > 0 && this.getNodeByIndex(this.cursorState.currentNodeIndex).hasClosed()) {
                                        //</div>
                                        curLineStr = curLineStr.substr(utility.symbol.html.tag_end_2.length);
                                        //console.log("success close tag (/>) :" + this.getNodeByIndex(this.cursorState.currentNodeIndex).tagName);
                                        this.cursorState.currentNodeIndex = this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex;
                                        parentNodeIndex = this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex;
                                    }
                                    break;
                                case utility.symbol.html.comment_begin:
                                    // <!--
                                    //if (this.getNodeByIndex(this.cursorState.currentNodeIndex).hasClosed()) {
                                    //    this.cursorState.currentNodeIndex = this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex;
                                    //    parentNodeIndex = this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex;
                                    //}
                                    //this.getNodeByIndex(this.cursorState.currentNodeIndex).appendHTML(utility.symbol.html.comment_begin, true);
                                    this.cursorState.isInComment = true;
                                    //curLineStr = curLineStr.substr(utility.symbol.html.comment_begin.length);
                                    break;
                                case utility.symbol.html.comment_end:
                                    // -->
                                    //if (this.getNodeByIndex(this.cursorState.currentNodeIndex).hasClosed()) {
                                    //    this.cursorState.currentNodeIndex = this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex;
                                    //    parentNodeIndex = this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex;
                                    //}
                                    //this.getNodeByIndex(this.cursorState.currentNodeIndex).appendHTML(utility.symbol.html.comment_end, true);
                                    this.cursorState.isInComment = false;
                                    //curLineStr = curLineStr.substr(utility.symbol.html.comment_end.length);
                                    break;
                            }
                        }//end !normalWordsForwards
                        else {
                            this.getNodeByIndex(this.cursorState.currentNodeIndex).appendHTML(curLineStr.substr(0, value));
                            curLineStr = curLineStr.substr(value);
                        }
                    }// end minIndex
                    else {
                        if (this.getNodeByIndex(this.cursorState.currentNodeIndex).hasClosed()) {
                            this.cursorState.currentNodeIndex = this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex;
                        } else {
                            //do nothing
                        }
                        parentNodeIndex = this.getNodeByIndex(this.cursorState.currentNodeIndex).parentIndex;
                        this.getNodeByIndex(this.cursorState.currentNodeIndex).appendHTML(curLineStr);
                        curLineStr = "";
                    }
                }
            }// end while
        }//- end for

        this.calculateLevel();
    }

    obj.calculateLevel = function () {
        //calculate level
        if (this.nodeArr.length > 0) {
            this.assignNodeChildrenLevel(0, -1, this);
        }
    }
    obj.assignNodeChildrenLevel = function (nodeIndex, level, that) {
        var curNode = that.nodeArr[nodeIndex];
        if (curNode.childrenIndexArr.length > 0) {
            for (var i = 0; i < curNode.childrenIndexArr.length; i++) {
                arguments.callee(curNode.childrenIndexArr[i], level + 1, that);
                curNode.level = level;
            }
        } else {
            curNode.level = level;
        }
    }
    obj.getIndentStr = function (nodeIndex, d) {
        if (typeof (nodeIndex) != "number" || parseInt(nodeIndex) < 0 || parseInt(nodeIndex) > this.nodeArr.length) return;
        var level = this.getNodeByIndex(nodeIndex).level, result = "";
        if (typeof (d) == "number" && !isNaN(parseInt(d))) { level += parseInt(d); }
        for (var i = 0; i < level; i++) {
            result += "&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        return result;
    }
    obj.outputLightCode = function ($selector) {
        if ($selector) {
            this.outputNodeLightCode(0);
            this.lightCode = '<table class="cl-tb">' + this.lightCode + '</table>';
            $selector.html(this.lightCode);
            this.outputBindEvent();
        }

    }
    obj.lineIndex = 0;
    obj.outputNodeLightCode = function (index) {
        if (typeof (index) != "number" || parseInt(index) < 0 || parseInt(index) > this.nodeArr.length) return;

        var curNode = this.getNodeByIndex(index);
        //tagName
        if (curNode.tagName.length > 0)
            this.lightCode += '<tr data-id="' + curNode.index + '" data-line="' + (++this.lineIndex) + '"><td class="lc-l-num">' + this.lineIndex + '</td><td class="lc-l-code"><p>' + this.getIndentStr(index) + '<span class="lc-html-bracket">' + curNode.leftBracketType + '</span>' +
                '<span class="lc-html-tagName" data-beginid="' + curNode.index + '">' + curNode.tagName + ' </span>';
        //attribute
        for (var t = 0; t < curNode.attributeArr.length; t++) {
            var item = curNode.attributeArr[t]
            if (item.name.length > 0) this.lightCode += '<span class="lc-html-attrName">' + item.name + '</span>';
            if (item.value.length > 0) {
                var spacingStr = t == (curNode.attributeArr.length - 1) ? "" : " ";
                this.lightCode += '<span class="lc-html-attrValue">="' + item.value + '"' + spacingStr + '</span>';
            }
        };
        if (curNode.attributeArr.length == 0) this.lightCode = this.lightCode.substr(0, this.lightCode.lastIndexOf(" ")) + "</span>";

        if (curNode.rightBracketType != utility.symbol.html.tag_end_1 && curNode.tagName.length > 0 && !utility.tagCanWithoutCloseEnum.includes(curNode.tagName))
            this.lightCode += '<span class="lc-html-bracket">' + utility.symbol.html.tag_end_2 + '</span>';

        if (curNode.childrenIndexArr.length > 0) {
            //append HTML position = -1
            for (var t = 0; t < curNode.HTML.length; t++) {
                var item = curNode.HTML[t];
                if (item[1] == -1) {
                    var className = item[2] ? "lc-html-comment" : "lc-html-normal";
                    this.lightCode += '<tr data-id="' + curNode.index + '" data-line="' + (++this.lineIndex) + '"><td class="lc-l-num">' + this.lineIndex + '</td><td class="lc-l-code"><p>' + this.getIndentStr(index, 1) + '<span class="' + className + '">' + item[0] + '</span></p></td></tr>';
                }
            };
            for (var i = 0; i < curNode.childrenIndexArr.length; i++) {
                var curChildIndex = curNode.childrenIndexArr[i];
                this.outputNodeLightCode(curChildIndex);
                for (var t = 0; t < curNode.HTML.length; t++) {
                    var item = curNode.HTML[t];
                    if (item[1] == curChildIndex) {
                        var className = item[2] ? "lc-html-comment" : "lc-html-normal";
                        this.lightCode += '<tr data-id="' + curNode.index + '" data-line="' + (++this.lineIndex) + '"><td class="lc-l-num">' + this.lineIndex + '</td><td class="lc-l-code"><p>' + this.getIndentStr(index, 1) + '<span class="' + className + '">' + item[0] + '</span></p></td></tr>';
                    }
                };
            }

            if (curNode.rightBracketType == utility.symbol.html.tag_begin_1 && curNode.tagName.length > 0) {
                this.lightCode += '<tr data-id="' + curNode.index + '" data-line="' + (++this.lineIndex) + '"><td class="lc-l-num">' + this.lineIndex + '</td><td class="lc-l-code"><p>' + this.getIndentStr(index) + '<span class="lc-html-bracket">' + utility.symbol.html.tag_begin_1 + '</span>' +
                    '<span class="lc-html-tagName" data-closeid="' + curNode.index + '">' + curNode.tagName + '</span>' +
                    '<span class="lc-html-bracket">' + utility.symbol.html.tag_end_2 + '</span></p></td></tr>';
            }
        } else {
            if (curNode.rightBracketType == utility.symbol.html.tag_end_2) {
                // >
                this.lightCode += '<span class="lc-html-bracket">' + utility.symbol.html.tag_end_2 + '</span>';
            } else {
                //HTML
                if (curNode.HTML.length == 1) {
                    var item = curNode.HTML[0];
                    var className = item[2] ? "lc-html-comment" : "lc-html-normal";
                    this.lightCode += '<span class="' + className + '">' + item[0] + '</span>';
                } else if (curNode.HTML.length > 1) {
                    for (var t = 0; t < curNode.HTML.length; t++) {
                        var item = curNode.HTML[t];
                        var className = item[2] ? "lc-html-comment" : "lc-html-normal";
                        this.lightCode += '<tr data-id="' + curNode.index + '" data-line="' + (++this.lineIndex) + '"><td class="lc-l-num">' + this.lineIndex + '</td><td class="lc-l-code"><p>' + this.getIndentStr(index, 1) + '<span class="' + className + '">' + item[0] + '</span></p></td></tr>';
                    };
                }

                //close tag
                switch (curNode.rightBracketType) {
                    case utility.symbol.html.tag_begin_1:
                        //</
                        var isContainContent = curNode.HTML.length > 1;
                        if (isContainContent) this.lightCode += '<tr data-id="' + curNode.index + '" data-line="' + (++this.lineIndex) + '"><td class="lc-l-num">' + this.lineIndex + '</td><td class="lc-l-code"><p>';
                        this.lightCode += (isContainContent ? this.getIndentStr(index) : "") + '<span class="lc-html-bracket"  data-closeid="' + curNode.index + '">' + utility.symbol.html.tag_begin_1 + '</span>' +
                            '<span class="lc-html-tagName">' + curNode.tagName + '</span>' +
                            '<span class="lc-html-bracket">' + utility.symbol.html.tag_end_2 + '</span>';
                        if (isContainContent) this.lightCode += '</p></td></tr>';
                        break;
                    case utility.symbol.html.tag_end_1:
                        // />
                        this.lightCode += '<span class="lc-html-bracket" data-closeid="' + curNode.index + '">' + utility.symbol.html.tag_end_1 + '</span>';
                        break;
                }
            }
        }
    }
    obj.outputBindEvent = function () {
        $("table.cl-tb tr").dblclick(function () {
            var id = $(this).data("id");

            var pre_hl_id = $($("table.cl-tb tr.highLight")[0]).data("id");

            //first clear previous highLight
            $("table.cl-tb tr.highLight").removeClass("highLight");

            //cancel current highLight
            if (!isNaN(id) && !isNaN(pre_hl_id) && id == pre_hl_id) return;

            //begin new highLight
            var beginLine = -1, endLine = -1;
            if ($("span[data-closeid='" + id + "']").length > 0) {
                $p = $($("span[data-closeid='" + id + "']")[0]);
                var attempTimes = 10;
                while (!$p.is("tr") && attempTimes > 0) { $p = $p.parent(); attempTimes--; }
                endLine = $p.data("line");
            }

            if ($("span[data-beginid='" + id + "']").length > 0) {
                $p = $($("span[data-beginid='" + id + "']")[0]);
                var attempTimes = 10;
                while (!$p.is("tr") && attempTimes > 0) { $p = $p.parent(); attempTimes--; }
                beginLine = $p.data("line");
            }
            if (beginLine <= endLine && beginLine > 0) {
                for (var i = beginLine; i <= endLine; i++) {
                    $($("table.cl-tb tr")[i - 1]).addClass("highLight");
                }
            }
        });
    }

    obj.parseCode();

    return obj;
}

function NodeElement(content, codeTree) {
    var obj = new Object();
    obj.orignal_content = content;
    obj.codeTreeModel = codeTree;

    obj.tagName = "";
    obj.id = -1;
    obj.index = -1;//index in array
    obj.level = 0;
    obj.parentIndex = -1;
    obj.childrenIndexArr = new Array();

    obj.parsedHTML = "";
    obj.attributeArr = new Array();
    obj.HTML = new Array();

    obj.leftBracketType = "&lt;";//special for <!DOCTYPE html>
    obj.rightBracketType = "";//-1:hasn't close 1:<div></div>  2:<input />  3.<!DOCTYPE html>

    obj.hasClosed = function () {
        return (this.tagName.length > 0 && this.rightBracketType.length > 0);
    }

    obj.appendHTML = function (content, isComment) {
        if (typeof (content) == "undefined" || content.length == 0) return;
        var _isComment = false;
        if (typeof (isComment) == "boolean") _isComment = isComment;
        if (typeof (content) != "undefined") {
            this.HTML.push([content, this.childrenIndexArr.length > 0 ? this.childrenIndexArr[this.childrenIndexArr.length - 1] : -1, _isComment]);
        }
    }

    obj.setParentIndex = function (index) {
        if (typeof (index) != "undefined") {
            var _index = -1;
            if (typeof (index) == "number") _index = parseInt(index);
            else if (typeof (index) == "object" && typeof (index.index == "number")) _index = parseInt(index.index);
            if (this.parentIndex >= 0) {
                console.log("Parent already existed.");
            } else {
                this.parentIndex = _index;
            }
        } else {
            console.log("invalid index:" + index);
        }
    }

    obj.appendChild = function (index) {
        if (typeof (index) != "undefined" && !isNaN(parseInt(index))) {
            if (!this.childrenIndexArr.includes(parseInt(index)))
                this.childrenIndexArr.push(parseInt(index));
        } else {
            console.log("appendChild:invalid par:" + index);
        }
    }
    obj.getParent = function () {
        if (this.parentIndex >= 0 && this.codeTreeModel != null) {
            return this.codeTreeModel.nodeArr[this.parentIndex];
        } else {
            return null;
        }
    }
    return obj;
}

function CursorState() {
    var obj = new Object();
    obj.currentNodeIndex = 0;
    obj.isInComment = false, obj.isScript = false, obj.isStyle = false, obj.isInTag = false, obj.isInHTML = false;

    return obj;
}