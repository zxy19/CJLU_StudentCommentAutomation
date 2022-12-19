
var connection = ["课堂", "同时", "能", "也能", "此外，课堂还"];
function feedbackGen(content, connection, lenreq = 20) {
    this.content = content;
    this.connection = connection;
    this.lenreq = lenreq;
    return this;
}
feedbackGen.prototype.randos = function () {
    var zs = 0, s = {}, res = [];
    while (1) {
        for (
            var i = parseInt(Math.random() * this.content.length);
            s[this.content[i]];
            i = parseInt(Math.random() * this.content.length)
        );
        zs += this.content[i].length;
        res.push(this.content[i]);
        if (zs > this.lenreq && res.length > 2) break;
    }
    var text = "";
    for (let i = 0; i < res.length; i++) {
        if (i) text += "，";
        text += this.connection[i] + res[i];
    }
    text += "。";
    return text;
}
var teacherGen = new feedbackGen(["达到了很好的教学效果", "能结合多种教学手段", "使学生对知识的掌握更深刻", "教学内容重点突出", "教学目的十分明确", "具有极高的专业技能", "授课方式新颖别致", "激起同学们的兴趣", "很注重互动", "课堂学习氛围轻松愉快", "真正达到了教学的目的要求", "内容深且广", "涵盖面广", "增加了素养", "教学效果显著", "加强自身修养", "使学生在轻松活跃的学习氛围中", "增长了知识", "可以使同学在领略知识魅力的同时提高自己实际技能", "教课内容广大博深", "高质量,高效率", "教课内容新颖", "独特，有个性", "表现出来的激情和精神可以深深吸引并打动学生"], ["课堂", "同时", "", "并且", "此外，课堂还"], 20);
var textbookGen = new feedbackGen(["适合学生自学", "难度适中", "便于学生自学", "对知识点讲解细致", "章节安排合理", "内容丰富，讲解到位"], ["教材", "而且", "同时", "此外，教材"], 10);

function emitChangeEvent(elem, val) {
    elem.dispatchEvent(new InputEvent('change', { autoInnerEvent: true }));
    elem.dispatchEvent(new InputEvent('input', { autoInnerEvent: true }));
}

function makeForm() {
    var allPanel = $(".panel.panel-default.panel-pjdx");
    var classInfo = $("#jsxm").parent().parent().find(".col-sm-8").text();
    var teacher = $("#jsxm").text();
    console.log(`教师：${teacher},课程：${classInfo}`);
    for (let i = 0; i < allPanel.length; i++) {
        var panel = $(allPanel[i]);
        var panelTitle = panel.find(".panel-heading .panel-title").text();
        var inputs = panel.find(".form-control.input-sm.input-pjf")
        var scores;
        if (panelTitle.indexOf("（教材）") != -1) {
            scores = costomScoringFunction_textbook(teacher, classInfo);
            if (!scores.feedback) scores.feedback = textbookGen.randos();
        } else if (panelTitle.indexOf("（教师）") != -1) {
            scores = costomScoringFunction_teacher(teacher, classInfo);
            if (!scores.feedback) scores.feedback = teacherGen.randos();
        }
        for (let j = 0; j < inputs.length; j++) {
            if (!scores.score[j]) scores.score[j] = scores.defaultScore;
            $(inputs[j]).val(scores.score[j]);
            emitChangeEvent(inputs[j]);
        }
        panel.find("textarea").text(scores.feedback);
        emitChangeEvent(panel.find("textarea")[0]);
    }
}
async function delay(ms) {
    return new Promise(function (s) {
        setTimeout(s, ms);
    })
}
async function fillForm() {
    makeForm();
    await delay(100);
    console.log("三秒后提交表单...");
    await delay(3000);
    $("#btn_xspj_tj").data("enter", 1);
    $("#btn_xspj_tj").click();
}
async function autoSubmit() {
    $("#first_pager").click();
    console.log(`[等待3s]翻页`);
    await delay(3000);
    while (1) {
        var unSubmittedElement = $("td[title='未评']")[0];
        if (!unSubmittedElement) {
            if ($(".ui-pg-input").val() != $("#sp_1_pager").text()) {
                console.log(`[等待3s]翻页`);
                $("#next_pager").click()
                await delay(3000);
                continue;
            } else
                break;
        }
        unSubmittedElement = $(unSubmittedElement);
        unSubmittedElement.parent().click();
        console.log(`[等待5s]选择：${unSubmittedElement.next().text()} - ${unSubmittedElement.next().next().next().text()}`)
        await delay(5000);

        await fillForm();

        while (1) {
            console.log(`等待提交完成`);
            if ($("#btn_ok")[0]) break;
        }
        $("#btn_ok").click();
        console.log(`5s后开始下一次循环`);
        await delay(5000);
    }
    alert("全部评价已完成！");
}


if (document.title != '学生评价') {
    alert("您不在学生评价页面！");
} else {
    if (confirm(`
！！！您刚刚执行了自动评价插件！！！
如果是无意之举，请点击取消或在5秒内刷新页面，点击确定5秒后，脚本将会自动开始填写表单。
填写过程中，您可以随时通过刷新来中断运行。
`))
        setTimeout(autoSubmit, 5000);
}

function costomScoringFunction_textbook(teacherName, classInfo) {

    return { defaultScore: 99, score: [], feedback: "" };
}
function costomScoringFunction_teacher(teacherName, classInfo) {
    return { defaultScore: 99, score: [], feedback: "" };
}