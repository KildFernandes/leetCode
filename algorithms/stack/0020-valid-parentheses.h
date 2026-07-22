#include <iostream>
#include <unordered_map>
#include <stack>

using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> stk;
        char top;
        for ( char c : s){
           // push insere no topo; pilha guarda aberturas ainda não fechadas.
           if ( c == '(' || c == '{' || c == '[') stk.push(c); 
           else {
               // empty evita top/pop em pilha vazia; top consulta sem remover.
               if(stk.empty()) return false;
               top = stk.top();
               switch (c) {
                   // pop remove topo após fechamento compatível.
                   case ')': if (top == '(') stk.pop(); else return false; break;
                   
                   case '}': if (top == '{') stk.pop(); else return false; break;
                   
                   case ']': if (top == '[') stk.pop(); else return false; break;
                    
                   default: return false;
               }
           }
        }
        return stk.empty();
    }
};
