#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int size = nums.size(), sum = size, vect = 0;
        for(int i = 0; i < size; i++){
            sum += i;
            vect += nums[i];
        }
        return sum - vect;
    }
};
