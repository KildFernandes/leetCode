#include <iostream>

using namespace std;

class Solution {
public:
    string largestGoodInteger(string num) {
        char n = 0;

        for(int i = 2; i < num.size(); i++){
            if(num[i-2] == num[i-1] && num[i-1] == num[i]){
                n = max(n, num[i]);
            }
        }
        if(n == 0) return "";
        return string(3,n);
    }
};
