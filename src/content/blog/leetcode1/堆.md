---
title: 堆-LeetCode刷题笔记
publishDate: 2026-2-6 11:47
description: 把原先的超长笔记重构为多篇
tags:
  - leetcode
language: 中文
heroImage: '{"src":"./image.png","color":"#B4C6DA"}'
---
# Go标准库的堆实现

container/heap
Go标准库的（完全二叉）堆写的非常简洁易懂，可以作为范本学习

要想使用堆要给自定义类型实现五个方法
而包内部会完成up（上滤），down（下滤）等实现

Package heap provides heap operations for any type that implements heap.Interface. 
A heap is a tree with the property that each node is the minimum-valued node in its subtree.
 
The minimum element in the tree is the root, at index 0.

A heap is a common way to implement a priority queue. To build a priority queue, implement the Heap interface with the (negative) priority as the ordering for the Less method, so Push adds items while Pop removes the highest-priority item from the queue. The Examples include such an implementation; the file example_pq_test.go has the complete source.

```go
//Example IntHeap 官方样例IntHeap实现
// An IntHeap is a min-heap of ints.
type IntHeap []int

func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *IntHeap) Push(x any) {
	// Push and Pop use pointer receivers because they modify the slice's length,
	// not just its contents.
	*h = append(*h, x.(int))
}

func (h *IntHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

```

# 题目

## 347.前k个高频元素

哈希表记录数目，然后用堆得到前k大

得到前k大我们只需要一个k个节点的小顶堆就行了

```go
//入堆规则
for key, value := range hash{
	if h.Len() < k {
	heap.Push(&h, [2]int{key, value})
}else {
	if value > h[0][1] {
		heap.Pop(&h)
		heap.Push(&h, [2]int{key, value})
	}
	}
}
```
##  295.数据流的中位数

这一题是数据流，需要快速增添元素，快速找到中位数

> 中位数能将数组按大小等分

维护一个对顶堆：包含一个大根堆一个小根堆***技巧：这里的大根堆可以通过取相反数实现***
保证大根堆的堆顶小于小根堆的堆顶，且两者数量相等(规定奇数个数时，大顶堆多一个)

```go
//AddNum 插入元素时的具体实现
func (mf *MedianFinder) AddNum(num int) {
    if mf.left.Len() == mf.right.Len() {
	    //如果num大于堆顶，入右堆，Pop
	    //如果num小于堆顶，入左堆
	    //两种情况可以结合
        heap.Push(&mf.right, num)
        heap.Push(&mf.left, -heap.Pop(&mf.right).(int))
    } else {
	    //左边多一个的情况
	    //入左边，维持左边比右边多一的规定
        heap.Push(&mf.left, -num)
        heap.Push(&mf.right, -heap.Pop(&mf.left).(int))
    }
}
```
