#include <algorithm>
#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    int climbStairs(int n) {
        if (n == 1 || n == 0) {
            return 1;
        }
        int anterior = 1;
        int atual = 1;
        int temp;
        for(int i = 2; i <= n; i++) {
            temp = atual;
            atual = anterior + atual;
            anterior = temp;   
        }
        return atual;
    }
};
