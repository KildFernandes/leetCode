import type{PrismaClient}from'@prisma/client';import type{RoadmapDefinition}from'../domain/roadmap.js';
const names:Record<number,string>={3:'Longest Substring Without Repeating Characters',39:'Combination Sum',46:'Permutations',50:'Pow(x, n)',55:'Jump Game',56:'Merge Intervals',57:'Insert Interval',78:'Subsets',98:'Validate Binary Search Tree',125:'Valid Palindrome',133:'Clone Graph',134:'Gas Station',155:'Min Stack',190:'Reverse Bits',191:'Number of 1 Bits',200:'Number of Islands',209:'Minimum Size Subarray Sum',215:'Kth Largest Element in an Array',232:'Implement Queue using Stacks',278:'First Bad Version',338:'Counting Bits',424:'Longest Repeating Character Replacement',435:'Non-overlapping Intervals',622:'Design Circular Queue',695:'Max Area of Island',703:'Kth Largest Element in a Stream',704:'Binary Search',739:'Daily Temperatures',743:'Network Delay Time',763:'Partition Labels',779:'K-th Symbol in Grammar',787:'Cheapest Flights Within K Stops',933:'Number of Recent Calls',1046:'Last Stone Weight',1631:'Path With Minimum Effort'};
export async function seedPlannedProblems(prisma:PrismaClient,definition:RoadmapDefinition){
  for(const topic of definition.topics)for(const id of topic.problems){
    const existing=await prisma.problem.findUnique({where:{id}});
    if(!existing)await prisma.problem.create({data:{id,name:names[id]??`LeetCode ${id}`,origin:'PLANNED',leetcodeUrl:`https://leetcode.com/problemset/?search=${id}`,status:'UNVERIFIED'}});
    await prisma.problemCompetency.upsert({where:{problemId_competencyId:{problemId:id,competencyId:topic.id}},update:{},create:{problemId:id,competencyId:topic.id,weight:1}});
  }
}
