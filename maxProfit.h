#include <climits>
#include <vector>

using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
       int min_val = INT_MAX;
       int max_val= 0;
       int lucro = 0;

       for(int i = 0; i < prices.size(); i++){
            if(prices[i] < min_val){
                min_val = prices[i];
                max_val = -1;
            } else {
                max_val = max(max_val, prices[i]);
            }
            lucro = max(lucro, max_val-min_val);
       }
       if(lucro < 0) return 0;
       return lucro;

    }
};
