
var response_success = "success";
var response_fail = "fail";
var requst_source = "popup";
var dto = { code:"" ,msg:"" ,source: requst_source};
var response_dto = {code: response_success ,source: requst_source}
var bgFunction = chrome.extension.getBackgroundPage();

$(function(){
	// 调用后台js开启服务
	bgFunction.getStorageKey();
})

$("#input-button").click(function () {
    dto.code = response_success;
    bgFunction.sendMessageToContentScript({cmd:"popup_start_select_message",requestDto:dto},function (response) {
        try {
            console.info("dddddddddddddddd")
            if(response.code == response_success){
                $("#titleMsg").text("加载完成！");
                $("#input-button").hide();
            }
        }catch (e) {
            console.info(e);
            $("#titleMsg").text("当前页面无法加载，请稍后再试或选择其他页面。");
            $("#input-button").hide();
        }
    });
});

// 接受来自后端的信息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.cmd == "service_conn_error"){
		var inputVal = $("#inputSign").text();
		if(inputVal != "无法连接到服务,请重试"){
			$("#inputSign").text(request.dataDto.msg);
		}
		$("#input-button").prop("disabled",true);
	}else if(request.cmd == "service_conn_success_connKey"){
		$("#inputSign").text(request.dataDto.msg);
        $("#inputSign").css("color","green");
		$("#input-button").prop("disabled",false);
	}
    //console.info(request);
});


