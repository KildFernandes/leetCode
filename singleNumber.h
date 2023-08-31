#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

class Solution {
public:
int singleNumber(vector<int> &nums) {
        unordered_map<int, int> mymap;

        for(int i = 0; i < nums.size(); i++){
            mymap[nums[i]]++;
            cout << nums[i] << " : " << mymap[nums[i]] << endl;
        }

        int ans = 0;
        for(auto x : mymap){
            if(x.second == 1) { ans = x.first; break; }
        }
        return ans;
    }
};
