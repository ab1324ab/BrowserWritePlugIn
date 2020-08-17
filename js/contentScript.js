var response_success = "success";
var response_fail = "fail";
var requst_source = "content";
var dto = {code: "", msg: "", url: "", element: "", option: "", content: "", type: "", source: requst_source};
var response_dto = {code: response_success, source: requst_source};

// 启动事件
function addFocus() {
    $("body *").on("mouseover mouseout mousemove click contextmenu", function (event) {
        var top = event.pageY - $("html").scrollTop() + 20;
        var left = event.pageX - $("html").scrollLeft() - 10;
        if (event.type == 'mouseover') {
            $("#inputTitle").remove();
            selectElement(event.target);
            $('#inputTitle').css({
                'left': left + 'px',
                'top': top + 'px'
            }).show();
        } else if (event.type == 'mousemove') {
            $('#inputTitle').css({
                'left': left + 'px',
                'top': top + 'px'
            }).show();
        } else if (event.type == 'click') {
            //$('input[type=text]').unbind("mouseover");
            //$("#inputTitle").remove();
            //$('input[type=text]').unbind("focus");

            //$(event.target).css("background-color","");
            $("#rightMenu").remove();
        } else if (event.type == 'contextmenu') {
            var e = e || window.event;
            e.preventDefault();
            $("#rightMenu").remove();
            var el = event.target;
            //$(event.target).css("background-color","rgba(0, 157, 255, 0.71)");
            $('body').append("<div id='rightMenu' tabindex='0' hidefocus='true' class='rightMenuContent'>" +
                "    <div class='content-div'>" +
                "        <div id='onclickElement' handle='click'><span>单击元素(P)</span><span style='float: right'>Alt+1</span></div>" +
                "        <div id='getTextElement' handle='get_text'>获取文字(T)</div>" +
                "        <div id='getImgElement'  handle='get_pic'>获取图片(M)</div>" +
                "        <hr style='border-color: rgb(226, 226, 226);'>" +
                "        <div id='selectFatherElement'><span>父元素选择</span><span id='father' style='float: right'></span></div>" +
                "        <div id='selectBrotherElement'><span>兄弟元素选择</span><span id='brother' style='float: right'></span></div>" +
                "        <div id='selectChildElement'><span>子元素选择</span></div>" +
                "        <div id='selectSimilarElement'>同类元素选择</div>" +
                "        <div id='selectCancelElement'><span>取消选择</span></div>" +
                "    </div>" +
                "</div>");
            $('#rightMenu').css({
                'left': (event.pageX - 10 + 'px'),
                'top': (event.pageY + 20 + 'px')
            }).show();
            var els = [];
            $("#rightMenu").mouseenter(function () {
                $(this).focus();
                $(el).css("box-shadow", "1px 1px 20px rgb(10,10,10)");
                $(el).attr("select", "1");
            }).blur(function () {
                $(el).css("box-shadow", "");
                $(el).removeAttr("select");
            })
            $("#selectFatherElement").click(function () {
                $(el).parent().css("box-shadow", "1px 1px 20px rgb(10,10,10)");
                $(el).attr("select", "1");
                el = $(el).parent().get(0);
                $("#father").text(el.localName);
                els.length = 0;
                els.push(el);
            });
            $("#selectBrotherElement").click(function () {
                $(el).siblings().css("box-shadow", "1px 1px 20px rgb(10,10,10)");
                $(el).attr("select", "1");
                els.length = 0;
                els.push(el);
                el = $(el).siblings();
                for (var i = 0; i < el.length; i++)
                    els.push(el[i]);
            });
            $("#selectChildElement").click(function () {
                $(el).children().css("box-shadow", "1px 1px 20px rgb(10,10,10)");
                $(el).attr("select", "1");
                els.length = 0;
                els.push(el);
                el = $(el).children();
                for (var i = 0; i < el.length; i++)
                    els.push(el[i]);
            });
            $("#selectSimilarElement").click(function () {
                var element = [];
                var schema = el.localName;
                var className = $(el).attr("class");
                if (className != undefined) {
                    element = $(schema + getClassName(el))
                    //     .filter(function (index, valueEl, array) {
                    //     console.info(valueEl)
                    //     var reClassName = valueEl.className;
                    //     if(reClassName != undefined){
                    //         reClassName = reClassName.trim();
                    //         el.className.split(" ").map(function (value, index, array) {
                    //             reClassName = reClassName.replace(value, "").trim();
                    //             console.info(reClassName)
                    //         })
                    //         return false//reClassName.length != 0;
                    //     }else{
                    //         return true;
                    //     }
                    // });
                } else {
                    element = $(schema);
                }
                $(element).css("box-shadow", "1px 1px 20px rgb(10,10,10)");
                $(element).attr("select", "1");
                els.length = 0;
                els.push(el);
                el = element;
                for (var i = 0; i < element.length; i++)
                    els.push(element[i]);
            });
            $("#selectCancelElement").click(function () {
                $("[select]").css("box-shadow", "");
                $("[select]").removeAttr("select");
                els.length = 0;
                $("#rightMenu").remove();
            })
            $("#onclickElement,#getTextElement,#getImgElement").click(function () {
                $("#rightMenu").remove();
                //console.info(els);
                if (els.length == 0) {
                    els.push(el);
                }
                els.map((value, index, array) => {
                    var bingCode = $(value).attr("bingCode");
                    if (bingCode != 1) {
                        var selector = getElementSign(value);
                        sendPostBackMessage(selector, value, $(this).attr("handle"));
                    }
                })
            });
        } else {
            $(event.target).css("box-shadow", "");
            $("#inputTitle").remove();
        }
    });
}

function selectElement(element) {
    $(element).css("box-shadow", "1px 1px 20px rgb(10,10,10)");
    var height = $(element).css("height").replace("px", "");
    var width = $(element).css("width").replace("px", "");
    var className = $(element).attr("class");
    var id = $(element).attr("id");
    if (className == undefined) {
        className = "";
    } else {
        className = "." + className;
    }
    if (id == undefined) {
        id = "";
    } else {
        id = "#" + id;
    }
    var bingMsg = "右击选择绑定方式";
    var bingCode = $(element).attr("bingCode");
    if (bingCode == "1") {
        bingMsg = "<b style='color: green'>该输入框已绑定</b>"
    } else if (bingCode == "2") {
        var bingMsg = "<b style='color: red'>该输入框无法绑定</b>"
    }
    var localName = element.localName;
    $('body').append("" +
        "<div id='inputTitle' class='input-title'>" +
        "<span style='color: rgb(222,114,216)'>" + localName + "</span>" +
        "<span style='color: rgb(225, 154, 96)'>" + id + "</span>" +
        "<span style='color: rgb(131, 192, 228)'>" + className + "</span>" +
        "<span class='input-line'>|</span>" +
        "<span style='color: rgb(214, 215, 216);font-size: 12px;'>" + width + "<span class='input-x'>x</span>" + height + "</span>" +
        "<div id='bingMsg' style='color: rgb(214, 215, 216);font-size: 12px;'>" + bingMsg + "</div>" +
        "<div class='input-title-shape'></div>" +
        "</div>")
}


// 接受来自后端的信息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // 启动选择器
    console.info("contentScripet")
    if (request.cmd == "popup_start_select_message") {
        if (request.requestDto.code == response_success) {
            this.addFocus();
            sendResponse(response_dto);
        }
    } else if (request.cmd == "service_bind_input_element_success") {
        if (request.requestDto.code == response_success) {
            console.info(request);
            $(document.querySelector(request.requestDto.element)).attr("bingCode", "1");
            $(document.querySelector(request.requestDto.element)).css("background-color", "#16ebff");
            $("#bingMsg").html("<b style='color: green'>该输入框已绑定</b>");
        }
    } else if (request.cmd == "background_input_value_msg") {
        if (request.requestDto.code == response_success) {
            document.querySelector(request.requestDto.element).value = request.requestDto.value;
            document.querySelector(request.requestDto.element).dispatchEvent(new Event('input'))
            //$(request.requestDto.element).val(request.requestDto.value)
        }
    } else if (request.cmd == "service_execute_program_settings") {
        //console.info("点击" + request.requestDto.element);
        $(request.requestDto.element)[0].click();
    }
});

// 发送消息到background
function sendPostBackMessage(sign, element, option) {
    dto.element = sign;
    dto.code = response_success;
    dto.url = window.location.href;
    dto.option = option;
    if (option == "click") {
        dto.content = "";
    } else if (option == "get_text") {
        dto.content = getAllText(element)
    } else if (option == "get_pic") {
        dto.content = getAllText(element)
    }
    dto.type = element.localName
    //console.info(dto);
    chrome.runtime.sendMessage({cmd: "send_element_background", "dataDto": dto});
}

/**
 * 获取元素文本,子文本之间添加间隔符#&#
 * @param element
 * @returns {*}
 */
function getAllText(element) {
    if ($(element).children().length > 1) {
        var text = "";
        $(element).children().map((index, value, array) => {
            if ($(element).children().length == (index + 1)) {
                text += $(value).text()
            } else {
                text += $(value).text() + "#&#"
            }
        })
        return text;
    } else {
        return $(element).text();
    }
}

/**
 * @deprecated 方法弃用推荐使用getElementSign().
 */
function getInputSign2(input) {
    debugger;
    var id = $(input).attr("id");
    var inputElement = "";
    if (id != undefined) {
        inputElement += "#" + id;
        return inputElement;
    }
    var className = $(input).attr("class");
    if (className != undefined) {
        var classNames = className.split(" ");
        if (classNames.length > 1) {
            className = "";
            for (var i = 0; i < classNames.length; i++) {
                if (i == 0) {
                    className = classNames[i];
                } else {
                    className += "." + classNames[i];
                }
            }
        }
        if ($("." + className).length == 1) {
            inputElement += "." + className;
            return inputElement;
        }
    }
    var path = input.nodeName.toLocaleLowerCase();
    var parent = input.parentNode;
    //判断当前父元素 包含几个input
    var inputCount = $(parent).children(path);
    if (inputCount.length > 1) {
        var index = Array.prototype.indexOf.call(input.parentNode.children, input) + 1;
        if (index != 1) {
            path += ":nth-child(" + index + ")"
        }
    }
    while (parent) {
        var id = $(parent).attr("id");
        if (id != undefined) {
            path = "#" + id + ' > ' + path;
            break;
        }
        var nth = "";
        var index = Array.prototype.indexOf.call(parent.parentNode.children, parent) + 1;
        if (index != 1) {
            nth = ":nth-child(" + index + ")"
        }
        path = parent.nodeName.toLocaleLowerCase() + nth + ' > ' + path;
        parent = parent.parentNode;
    }
    return path;
}

function getElementSign(input) {
    var id = $(input).attr("id");
    var inputElement = "";
    if (id != undefined) {
        inputElement += "#" + id;
        return inputElement;
    }
    var className = elementClassName(input);
    if (className != undefined) {
        return className;
    }
    var i = 0;
    var element = undefined;
    do {
        if (i == 0) {
            element = input;
            inputElement = element.nodeName.toLocaleLowerCase();
        }
        var id = $(element).attr("id");
        if (id != undefined) {
            inputElement = "#" + id + ' > ' + inputElement;
            break;
        }
        var className = elementClassName(element);
        if (className != undefined) {
            inputElement = element.nodeName.toLocaleLowerCase() + className + ' > ' + inputElement;
            break;
        }
        var count = $(inputElement).length;
        if (count == 1) {
            break;
        }
        var nth = "";
        var index = Array.prototype.indexOf.call(element.parentNode.children, element) + 1;
        if (element.parentNode.children.length != 1) {
            nth = ":nth-child(" + index + ")"
        }
        if (nth != "" && i == 0) {
            inputElement += nth;
        } else if (i != 0) {
            inputElement = element.nodeName.toLocaleLowerCase() + nth + ' > ' + inputElement;
        }
        element = element.parentNode;
        i++;
    } while (element)
    return inputElement;
}

function elementClassName(input) {
    var className = $(input).attr("class");
    if (className != undefined) {
        className = className.trim()
        var classNameArray = className.split(" ");
        if (classNameArray.length > 1) {
            className = "";
            for (var i = 0; i < classNameArray.length; i++) {
                if (i == 0) {
                    className = classNameArray[i];
                } else {
                    className += "." + classNameArray[i];
                }
            }
        }
        if ($("." + className).length == 1) {
            return "." + className;
        }
    }
    return undefined;
}

function getClassName(element) {
    var className = $(element).attr("class").trim();
    var classNameArray = className.split(" ");
    if (classNameArray.length > 1) {
        className = "";
        for (var i = 0; i < classNameArray.length; i++) {
            if (i == 0) {
                className = classNameArray[i];
            } else {
                className += "." + classNameArray[i];
            }
        }
    }
    return "." + className;
}