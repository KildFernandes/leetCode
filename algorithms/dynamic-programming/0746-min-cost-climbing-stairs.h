#include <vector>

using namespace std;

class Solution {
public:
    int minCostClimbingStairs(vector<int>& cost) {

        int n=cost.size();
        for(int i=2;i<n;i++)
        {
            // min escolhe menor custo acumulado entre dois degraus anteriores.
            cost[i]+=min(cost[i-1],cost[i-2]);
        }
        // Topo pode ser alcançado pelo último ou penúltimo degrau.
        return min(cost[n-1],cost[n-2]);
        
    }
};
