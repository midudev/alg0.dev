import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const graphsCpp: Record<string, CodeImplementation> = {
  bfs: annotated(`vector<int> bfs(map<int, vector<int>>& graph, int start) {
    set<int> visited;
    queue<int> q;  //@3
    vector<int> result;

    q.push(start);
    visited.insert(start);

    while (!q.empty()) {  //@8
        int node = q.front();
        q.pop();
        result.push_back(node);

        for (int neighbor : graph[node]) {
            if (!visited.count(neighbor)) {  //@13
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }

    return result;  //@19
}`),

  dfs: annotated(`vector<int> dfs(map<int, vector<int>>& graph, int start) {
    set<int> visited;
    vector<int> result;

    explore(graph, start, visited, result);  //@16
    return result;  //@17
}

void explore(map<int, vector<int>>& graph, int node,
             set<int>& visited, vector<int>& result) {
    visited.insert(node);  //@6
    result.push_back(node);

    for (int neighbor : graph[node]) {  //@9
        if (!visited.count(neighbor)) {
            explore(graph, neighbor, visited, result);  //@12
        }
    }
}`),

  dijkstra:
    annotated(`vector<int> dijkstra(vector<vector<pair<int, int>>>& graph, int start) {  //@1
    int n = graph.size();
    vector<int> dist(n, INT_MAX);
    vector<bool> visited(n, false);
    dist[start] = 0;

    for (int i = 0; i < n; i++) {
        // Pick unvisited node with minimum distance
        int u = -1;  //@8
        for (int v = 0; v < n; v++) {
            if (!visited[v] && (u == -1 || dist[v] < dist[u])) {
                u = v;
            }
        }

        visited[u] = true;

        // Relax neighbors
        for (auto [v, w] : graph[u]) {
            if (!visited[v] && dist[u] + w < dist[v]) {  //@20
                dist[v] = dist[u] + w;
            }
        }
    }

    return dist;  //@26
}`),

  prim: annotated(`vector<int> prim(vector<vector<pair<int, int>>>& graph, int start) {  //@1
    int n = graph.size();
    vector<int> key(n, INT_MAX);
    vector<bool> inMst(n, false);
    vector<int> parent(n, -1);
    key[start] = 0;

    for (int i = 0; i < n; i++) {  //@8
        // Pick node with minimum key not in MST
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!inMst[v] && (u == -1 || key[v] < key[u])) {
                u = v;
            }
        }

        inMst[u] = true;

        // Update neighbor keys
        for (auto [v, w] : graph[u]) {
            if (!inMst[v] && w < key[v]) {  //@21
                key[v] = w;
                parent[v] = u;
            }
        }
    }

    return parent;  //@28
}`),

  'topological-sort':
    annotated(`vector<int> topologicalSort(vector<vector<int>>& graph, int numNodes) {  //@1
    vector<int> inDegree(numNodes, 0);

    // Compute in-degrees
    for (int u = 0; u < numNodes; u++) {
        for (int v : graph[u]) {
            inDegree[v]++;
        }
    }

    // Start with nodes of in-degree 0
    queue<int> q;  //@12
    for (int i = 0; i < numNodes; i++) {
        if (inDegree[i] == 0) {
            q.push(i);
        }
    }

    vector<int> order;
    while (!q.empty()) {  //@18
        int node = q.front();
        q.pop();
        order.push_back(node);

        for (int neighbor : graph[node]) {  //@22
            inDegree[neighbor]--;
            if (inDegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }

    return order;  //@30
}`),
}
