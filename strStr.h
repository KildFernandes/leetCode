#include <iostream>

using namespace std;

class Solution {
public:
    int strStr(string haystack, string needle) {
        int h = haystack.size();
        int n = needle.size();
        int rtr = -1;

        for (int i = 0; i < h; i++) {
            if(haystack[i] == needle[0]){
                rtr = i;
                for(int j = 0; j < n; j++){
                    cout << "i = " << haystack[i] << " ";
                    cout << "j = " << needle[j] << endl;
                    if(haystack[i+j] != needle[j]){
                        rtr = -1;
                        break;
                    }
                }
                if (rtr != -1) {
                    return rtr;
                }

            }
            if(rtr != -1) return rtr;
        }
        return -1;
    }
};
