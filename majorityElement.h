#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;

class Solution {
public:
    int majorityElement(vector<int>& nums) {
        unordered_map<int, int> m;
        int s = nums.size(), n = s / 2;
        for(int i = 0; i < s; i++){
            m[nums[i]]++;
            if (m[nums[i]] > n) {
                return nums[i];
            }
        }
        return 0;
    }
};
