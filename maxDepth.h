#include <iostream>
#include <climits>

using namespace std;

struct TreeNode {
     int val;
     TreeNode *left;
     TreeNode *right;
     TreeNode() : val(0), left(nullptr), right(nullptr) {}
     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 };

class Solution {
public:
    int maxDepth(TreeNode* root) {
        if(!root) return 0;

        if(root->left == nullptr && root->right == nullptr) return 1;

        int l,r;
        l = r = INT_MIN;

        if(root->left) l = maxDepth(root->left);
        if(root->right) r = maxDepth(root->right);

        return max(l,r) + 1;

        
    }
};
