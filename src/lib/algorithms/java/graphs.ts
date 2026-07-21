import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const graphsJava: Record<string, CodeImplementation> = {
  bfs: annotated(`List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> queue = new LinkedList<>();  //@3
    List<Integer> result = new ArrayList<>();

    queue.add(start);
    visited.add(start);

    while (!queue.isEmpty()) {  //@8
        int node = queue.poll();
        result.add(node);

        for (int neighbor : graph.get(node)) {
            if (!visited.contains(neighbor)) {  //@13
                visited.add(neighbor);
                queue.add(neighbor);
            }
        }
    }

    return result;  //@19
}`),

  dfs: annotated(`List<Integer> dfs(Map<Integer, List<Integer>> graph, int start) {
    Set<Integer> visited = new HashSet<>();
    List<Integer> result = new ArrayList<>();

    explore(graph, start, visited, result);  //@16
    return result;  //@17
}

void explore(Map<Integer, List<Integer>> graph, int node,
             Set<Integer> visited, List<Integer> result) {
    visited.add(node);  //@6
    result.add(node);

    for (int neighbor : graph.get(node)) {  //@9
        if (!visited.contains(neighbor)) {
            explore(graph, neighbor, visited, result);  //@12
        }
    }
}`),

  dijkstra: annotated(`int[] dijkstra(List<List<int[]>> graph, int start) {  //@1
    int n = graph.size();
    int[] dist = new int[n];
    boolean[] visited = new boolean[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
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
        for (int[] edge : graph.get(u)) {
            int v = edge[0], w = edge[1];
            if (!visited[v] && dist[u] + w < dist[v]) {  //@20
                dist[v] = dist[u] + w;
            }
        }
    }

    return dist;  //@26
}`),

  prim: annotated(`int[] prim(List<List<int[]>> graph, int start) {  //@1
    int n = graph.size();
    int[] key = new int[n];
    boolean[] inMst = new boolean[n];
    int[] parent = new int[n];
    Arrays.fill(key, Integer.MAX_VALUE);
    Arrays.fill(parent, -1);
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
        for (int[] edge : graph.get(u)) {
            int v = edge[0], w = edge[1];
            if (!inMst[v] && w < key[v]) {  //@21
                key[v] = w;
                parent[v] = u;
            }
        }
    }

    return parent;  //@28
}`),

  'topological-sort':
    annotated(`List<Integer> topologicalSort(List<List<Integer>> graph, int numNodes) {  //@1
    int[] inDegree = new int[numNodes];

    // Compute in-degrees
    for (int u = 0; u < numNodes; u++) {
        for (int v : graph.get(u)) {
            inDegree[v]++;
        }
    }

    // Start with nodes of in-degree 0
    Queue<Integer> queue = new LinkedList<>();  //@12
    for (int i = 0; i < numNodes; i++) {
        if (inDegree[i] == 0) {
            queue.add(i);
        }
    }

    List<Integer> order = new ArrayList<>();
    while (!queue.isEmpty()) {  //@18
        int node = queue.poll();
        order.add(node);

        for (int neighbor : graph.get(node)) {  //@22
            inDegree[neighbor]--;
            if (inDegree[neighbor] == 0) {
                queue.add(neighbor);
            }
        }
    }

    return order;  //@30
}`),
}
