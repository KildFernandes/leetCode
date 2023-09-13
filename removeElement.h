#include <vector>

using namespace std;

class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
       vector<int> rst;
       int count = 0;
       for (int n : nums) {
           if(n != val) {
               rst.push_back(n);
               count++;
           }
       }
       nums = rst;
       return count;
    }
};
