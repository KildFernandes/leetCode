#include <vector>

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
    vector<int> preorderTraversal(TreeNode* root) {

     vector<int> vec;
     inorder(root, vec);
     return vec;
    }
    void inorder(TreeNode* root, vector<int> &vec) {
        if(!root) return;

        vec.push_back(root->val);
        inorder(root->left, vec);
        inorder(root->right, vec);
    }
};
