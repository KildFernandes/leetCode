#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> intersect(vector<int>& nums1, vector<int>& nums2) {
       vector<int> table(1001, 0);

       for(int i : nums1){
           table[i]++;
       }
       vector<int> result;
       for(int i : nums2){
           if(table[i] != 0){
               result.push_back(i);
               table[i]--;
           }
       }
       return result;
    }
};
