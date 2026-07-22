#include <algorithm>
#include <vector>

using namespace std;

class Solution {
public:
    int removeDuplicates(vector<int>& nums) {

        // sort ordena em O(n log n), deixando valores iguais consecutivos.
        sort(nums.begin(), nums.end());
        // unique move únicos ao início e devolve novo fim lógico; erase remove sobra física.
        nums.erase(unique(nums.begin(), nums.end()), nums.end());

        return nums.size();
        
    }
};
