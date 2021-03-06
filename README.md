# Round Robin Scheduler Algorithm

Course design for Computer Operating System Theory based on JavaScript implement round robin scheduler algorithm visualization.

# 时间片轮转调度算法（基于 JavaScript 实现）

计算机操作系统原理课程设计基于 JavaScript 实现时间片轮转调度算法可视化。

## 具体任务

- 根据需要，合理设计 PCB 结构，以适用于时间片轮转调度算法。
- 设计模拟指令格式，并以文件形式存储，程序能够读取文件并自动生成指令序列。
- 根据文件内容，建立模拟进程队列，并能采用时间片轮转调度算法对模拟进程进行调度。

## 任务要求：

- 进程的个数，进程的内容（即进程的功能序列）来源于一个进程序列描述文件。
- 需将调度过程输出到一个运行日志文件。
- 开发平台及语言不限。
- 要求设计一个 Windows 可视化应用程序

## 总体设计

本次课程设计将通过从文本文档中导入指令到程序生成模拟进程和模拟指令，然后对模拟进程和模拟指令进行时间片轮转调度，并进行可视化设计。

模拟指令的格式：操作命令+操作时间
- C ： 表示在 CPU 上计算
- I ： 表示输入
- O： 表示输出
- W ： 表示等待
- H ： 表示进程结束

操作时间代表该操作命令要执行多长时间。这里假设 I/O 设备的数量没有限制，I 和 O 设备都只有一类。

每个进程中的指令是上下关联的，即每个进程中的指令只能按顺序执行，必须完成了该进程中的上一条指令，才能执行下一条指令。

I，O，W 三条指令实际上是不占用 CPU 的，执行这三条指令就应该将进程放入对应的等待队列，例如：输入等待队列，输出等待队列 ，其他等待队列等……

例如，有一虚拟程序文件prc.txt描述如下：

```
P1
C10
I20
C40
I30
C20
O30
H00
P2
I10
C50
O20
H00
P3
C10
I20
W20
C40
O10
H00
```

## 效果演示

![演示图](https://github.com/hovenjay/RoundRobinSchedulerAlgorithm/blob/master/images/demonstration.gif)
