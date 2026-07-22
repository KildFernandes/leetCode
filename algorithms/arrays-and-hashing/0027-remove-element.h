#include <vector>

using namespace std;

class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
       vector<int> rst;
       int count = 0;
       for (int n : nums) {
           if(n != val) {
               // push_back acrescenta valor ao fim do vetor resultado.
               rst.push_back(n);
               count++;
           }
       }
       nums = rst;
       return count;
    }
};
