#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        int size = digits.size() - 1;
        for (size; size >= 0; size--) {
            if(digits[size] == 9) {
                digits[size] = 0;
            } else {
                digits[size]++;
                return digits;
            }
        
        } 
        digits[0] = 1; digits.push_back(0);
        return digits;
    }
};
