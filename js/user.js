// 文件导入
function jsReadFiles(files) {
    if (files.length) {
        var file = files[0];
        var reader = new FileReader(); // new一个 FileReader 实例
        if (/text+/.test(file.type)) { // 判断文件类型，是不是 text 类型
            reader.onload = function () {
                $("#cmd_int").val(this.result); // 将获取到的指令显示到指令输入框
            }
            reader.readAsText(file);
        } else {
            alert("该文件内容未按照指定格式输入，请重新导入文件！");
            reload();
        }
    }
}
// 文本处理
function textHandle() {
    // 获取文本内容
    var str1 = $("#cmd_int").val();
    // 定义我们要存放数据的一维数组，实际上是二维数组，后面会转变，只不过js无法直接定义二维数组。
    str1 = str1.split("P");
    dissnull(str1);
    var str2 = new Array(str1.length);
    for (var i = 0; i < str1.length; i++) {
        // 去掉字符串开头的数字
        str1[i] = str1[i].replace(/[1-9]\d*/, "");
        // 遍历一维数组，并将一维数组的值通过临时数组转移到二维数组里面
        var temp = new Array(2); // 定义临时数组
        temp = str1[i].split("\n"); // 将一维数组再次拆分
        // 定义将要存放数据的一维数组的每一个元素都为一个数组(实际上就是定义二维数组了)
        str2[i] = new Array(temp.length);
        // 遍历临时数组将其值存入二维数组
        for (var j = 0; j < temp.length; j++) {
            str2[i][j] = temp[j]; //完成字符串转换为二维数组
        }
        // 去除二维数组每个一维元素里的空串
        dissnull(str2[i]);
    }
    return str2;
}
// 去掉字符串当中的空串
function dissnull(parkingList) {
    for (var i = 0; i < parkingList.length; i++) {
        if (parkingList[i] == '' || parkingList[i] == null || typeof (parkingList[i]) == undefined) {
            parkingList.splice(i, 1);
            i = i - 1;
        }
    }
}
// 将每组指令分开成[命令，执行时间]的形式
function cmd_time(str) {
    strCmd = str.charAt(0);
    strTime = parseInt(str.slice(1));
    var s = new Array();;
    s.push(strCmd);
    s.push(strTime);
    return s;
}
// 构建进程原型对象
function PCB(pname, cmds, curcmd) {
    this.pname = pname; // 进程名称
    this.cmds = cmds; // 进程中的指令列表
    this.curcmd = curcmd; // 当前运行的指令
}
PCB.prototype.showPName = function () {
    alert(this.pname);
}
PCB.prototype.showCmds = function () {
    alert(this.cmds);
}
PCB.prototype.showCurcmd = function () {
    alert(this.curcmd);
}
// 构建队列原型对象
function Que(pid, cid) {
    this.pid = pid; // 进程号
    this.cid = cid; // 指令号
}
Que.prototype.showPid = function () {
    alert(this.pid);
}
Que.prototype.showCid = function () {
    alert(this.cid);
}
// 定义时间片、定义存储进程对象的数组、定义存储队列的数组
var times; // 时间片的值
var curTimes = 0; // 当前时间片
var allQueIsEnpty = 0; // 用来判断是否所有队列都为空，如果是，那么所有的进程和指令都已经调度完毕
var p = new Array(); // 进程队列
var ReadyQue = new Array(); // 就绪队列（id="C_Q"）
var BackupReadyQue = new Array(); // 后备就绪队列（id="BC_Q"）
var InputQue = new Array(); // 输入队列（id="I_Q"）
var OutputQue = new Array(); // 输出队列（id="O_Q"）
var WaitQue = new Array(); // 等待队列（id="W_Q"）
// 进程实例化
function creatPCB() { // 进程对象实例化
    var str = textHandle(); // 字符串处理
    for (var i = 0; i < str.length; i++) { // 将生成的对象以数组形式存储
        p.push(new PCB(i, str[i], 0));
        for (var j = 0; j < str[i].length; j++) {
            p[i].cmds[j] = cmd_time(p[i].cmds[j]);
            p[i].curcmd = 0;
            // console.log("p[" + i + "].cmds[" + j + "]" + p[i].cmds[j]);
        }
    }
    createQue(); // 队列初始化函数
}
// 节点可视化——结点入队列
function addNode(pid, cid, cname, ctime) {
    switch (cname) {
        case 'C':
            var nodes = document.getElementById('C_Q'); // 根节点对象
            var node = document.createElement('li'); // 创建子节点
            node.setAttribute("class", "list-group-item text-center");
            node.setAttribute("id", "CQ" + pid); // 进程号
            node.setAttribute("cid", cid); // 指令号
            node.setAttribute("cname", cname); // 指令
            node.setAttribute("ctime", ctime); // 时间
            node.innerText = 'P' + pid + ' [ ' + cname + ' , ' + ctime + ' ]'; // 显示的文本内容
            nodes.appendChild(node); // 添加为根节点的子节点
            break;
        case 'I':
            var nodes = document.getElementById('I_Q'); // 根节点对象
            var node = document.createElement('li'); // 创建子节点
            node.setAttribute("class", "list-group-item text-center");
            node.setAttribute("id", "IQ" + pid); // 进程号
            node.setAttribute("cid", cid); // 指令号
            node.setAttribute("cname", cname); // 指令
            node.setAttribute("ctime", ctime); // 时间
            node.innerText = 'P' + pid + ' [ ' + cname + ' , ' + ctime + ' ]'; // 显示的文本内容
            nodes.appendChild(node); // 添加为根节点的子节点
            break;
        case 'O':
            var nodes = document.getElementById('O_Q'); // 根节点对象
            var node = document.createElement('li'); // 创建子节点
            node.setAttribute("class", "list-group-item text-center");
            node.setAttribute("id", "OQ" + pid); // 进程号
            node.setAttribute("cid", cid); // 指令号
            node.setAttribute("cname", cname); // 指令
            node.setAttribute("ctime", ctime); // 时间
            node.innerText = 'P' + pid + ' [ ' + cname + ' , ' + ctime + ' ]'; // 显示的文本内容
            nodes.appendChild(node); // 添加为根节点的子节点
            break;
        case 'W':
            var nodes = document.getElementById('W_Q'); // 根节点对象
            var node = document.createElement('li'); // 创建子节点
            node.setAttribute("class", "list-group-item text-center");
            node.setAttribute("id", "WQ" + pid); // 进程号
            node.setAttribute("cid", cid); // 指令号
            node.setAttribute("cname", cname); // 指令
            node.setAttribute("ctime", ctime); // 时间
            node.innerText = 'P' + pid + ' [ ' + cname + ' , ' + ctime + ' ]'; // 显示的文本内容
            nodes.appendChild(node); // 添加为根节点的子节点
            break;
    }
}
// 节点可视化——结点出队列
function deleteNode(qName, nodeId) {
    switch (qName) {
        case 'C':
            // 删除当前已经执行完毕的结点
            $('#CQ' + nodeId).remove();
            break;
        case 'I':
            // 删除当前已经执行完毕的结点
            $('#IQ' + nodeId).remove();
            break;
        case 'O':
            // 删除当前已经执行完毕的结点
            $('#OQ' + nodeId).remove();
            break;
        case 'W':
            // 删除当前已经执行完毕的结点
            $('#WQ' + nodeId).remove();
            break;
    }
}
// 队列初始化，按先来先服务的规则提取每个进程当前正在执行的指令进对应的队列
function createQue() { // 队列生成
    for (var i = 0; i < p.length; i++) { // 遍历每一个进程，提取当前执行进程
        curcmd = p[i].curcmd; // 获取当前正在执行的指令
        if (p[i].cmds[curcmd][0] != 'H' || p[i].cmds[curcmd][1] > 0) {
            switch (p[i].cmds[curcmd][0]) {
                case 'C':
                    ReadyQue.push(new Que(i, curcmd)); // 添加进队列
                    // 队列可视化——创建队列的同时，将队列里的每个结点可视化
                    addNode(i, curcmd, p[i].cmds[curcmd][0], p[i].cmds[curcmd][1]);
                    break;
                case 'I':
                    InputQue.push(new Que(i, curcmd));
                    // 队列可视化——创建队列的同时，将队列里的每个结点可视化
                    addNode(i, curcmd, p[i].cmds[curcmd][0], p[i].cmds[curcmd][1]);
                    break;
                case 'O':
                    OutputQue.push(new Que(i, curcmd));
                    // 队列可视化——创建队列的同时，将队列里的每个结点可视化
                    addNode(i, curcmd, p[i].cmds[curcmd][0], p[i].cmds[curcmd][1]);
                    break;
                case 'W':
                    WaitQue.push(new Que(i, curcmd));
                    // 队列可视化——创建队列的同时，将队列里的每个结点可视化
                    addNode(i, curcmd, p[i].cmds[curcmd][0], p[i].cmds[curcmd][1]);
                    break;
            }
        }
    }
}
// 队列的动态添加：执行过程中指令执行完毕，检查当前进程的下一条指令内容并添加到相应的队列
function addToQue(pid, curcmd) { // [当前进程,当前指令]
    switch (p[pid].cmds[curcmd][0]) {
        case 'C':
            ReadyQue.push(new Que(pid, curcmd)); // 添加进队列
            // 队列可视化——创建队列的同时，将队列里的每个结点可视化
            addNode(pid, curcmd, p[pid].cmds[curcmd][0], p[pid].cmds[curcmd][1]);
            break;
        case 'I':
            InputQue.push(new Que(pid, curcmd));
            // 队列可视化——创建队列的同时，将队列里的每个结点可视化
            addNode(pid, curcmd, p[pid].cmds[curcmd][0], p[pid].cmds[curcmd][1]);
            break;
        case 'O':
            OutputQue.push(new Que(pid, curcmd));
            // 队列可视化——创建队列的同时，将队列里的每个结点可视化
            addNode(pid, curcmd, p[pid].cmds[curcmd][0], p[pid].cmds[curcmd][1]);
            break;
        case 'W':
            WaitQue.push(new Que(pid, curcmd));
            // 队列可视化——创建队列的同时，将队列里的每个结点可视化
            addNode(pid, curcmd, p[pid].cmds[curcmd][0], p[pid].cmds[curcmd][1]);
            break;
    }
}
// 单条指令单个时间片执行
function cmdExec(Ques) {
    if (Ques.length > 0) { // 判断队列是否为空
        var pid = Ques[0].pid;
        var cid = Ques[0].cid;
        if (p[pid].cmds[cid][1] > 1) { // 判断队首指向的进程的当前指令是否大于 1
            // 当前进程当前指令剩余时间减一
            --p[pid].cmds[cid][1];
            // 队列可视化
            deleteNode(p[pid].cmds[cid][0], pid);
            addNode(pid, cid, p[pid].cmds[cid][0], p[pid].cmds[cid][1]);
            // 控制台日志输出
            console.log("时间片" + curTimes + ":P" + pid + ":" + p[pid].cmds[cid]);
            // 进程从队首移动到队尾
            var a = new Que(); // 定义临时存放队列元素的对象
            a = Ques.shift(); // 将队首元素存放到临时对象中
            Ques.push(a); // 将临时对象中的元素放到队尾
        } else if (p[pid].cmds[cid][1] = 1) { // 判断队首指向的进程的当前指令的剩余时间是否 =1
            // 该进程的当前执行指令加一(p.curcmd)，当前进程当前指令剩余时间减一，指令剩余执行时间=0
            ++p[pid].curcmd;
            --p[pid].cmds[cid][1];
            // 队列可视化
            deleteNode(p[pid].cmds[cid][0], pid);
            // 控制台日志输出
            console.log("时间片" + curTimes + ":P" + pid + ":" + p[pid].cmds[cid]);
            // 检查下一条可执行指令是否可执行，并添加到队列
            addToQue(pid, p[pid].curcmd);
            // 进程从队列移除
            Ques.shift();
        }
        allQueIsEnpty = allQueIsEnpty + 1; // 非空队列个数+1
    } else {
        allQueIsEnpty = allQueIsEnpty + 0; // 空队列个数+1
    }
}
// 程序暂停执行函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// 当按钮为开始执行状态，开始调度
async function QuesExec() {
    var i = document.getElementById("startExec"); // $("#startExec").val();
    if (i.value == 1) {
        allQueIsEnpty = 0; // 每个队列执行前，空队列计数置零
        curTimes++; // 当前时间片加 1
        cmdExec(ReadyQue); // 执行就绪队列中的队首元素
        cmdExec(InputQue); // 执行输入队列中的队首元素
        cmdExec(OutputQue); // 执行输出队列中的队首元素
        cmdExec(WaitQue); // 执行等待队列中的队首元素
        if (allQueIsEnpty == 0) {
            $("#startExec").val(0);
            $("#startExec").text("开始调度");
            $("#startExec").attr("class", "btn btn-primary");
        }
    }
    var t = document.getElementById("setTimes").value;
    await sleep(t);
    QuesExec();
}
// 开始调度
function startExec() {
    var i = $("#startExec").val();
    if (i == 0) { // 触发开始执行事件
        $("#startExec").val(1);
        $("#startExec").text("暂停调度");
        $("#startExec").attr("class", "btn btn-warning");
        QuesExec(); // 调用开始调度函数
    } else if (i == 1) { // 触发暂停执行事件
        $("#startExec").val(0);
        $("#startExec").text("开始调度");
        $("#startExec").attr("class", "btn btn-primary");
    } else { // 其他情况
        $("#startExec").val(0);
        $("#startExec").text("开始调度");
        $("#startExec").attr("class", "btn btn-primary");
    }
}