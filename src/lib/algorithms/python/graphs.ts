import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const graphsPython: Record<string, CodeImplementation> = {
  bfs: annotated(`def bfs(graph, start):
    visited = set()
    queue = [start]  #@3
    result = []

    visited.add(start)

    while queue:  #@8
        node = queue.pop(0)
        result.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:  #@13
                visited.add(neighbor)
                queue.append(neighbor)

    return result  #@19`),

  dfs: annotated(`def dfs(graph, start):
    visited = set()
    result = []

    def explore(node):
        visited.add(node)  #@6
        result.append(node)

        for neighbor in graph[node]:  #@9
            if neighbor not in visited:
                explore(neighbor)  #@12

    explore(start)  #@16
    return result  #@17`),

  dijkstra: annotated(`def dijkstra(graph, start):  #@1
    n = len(graph)
    dist = [float('inf')] * n
    visited = [False] * n
    dist[start] = 0

    for i in range(n):
        # Pick unvisited node with minimum distance
        u = -1  #@8
        for v in range(n):
            if not visited[v] and (u == -1 or dist[v] < dist[u]):
                u = v

        visited[u] = True

        # Relax neighbors
        for v, w in graph[u]:
            if not visited[v] and dist[u] + w < dist[v]:  #@20
                dist[v] = dist[u] + w

    return dist  #@26`),

  prim: annotated(`def prim(graph, start):  #@1
    n = len(graph)
    key = [float('inf')] * n
    in_mst = [False] * n
    parent = [-1] * n
    key[start] = 0

    for i in range(n):  #@8
        # Pick node with minimum key not in MST
        u = -1
        for v in range(n):
            if not in_mst[v] and (u == -1 or key[v] < key[u]):
                u = v

        in_mst[u] = True

        # Update neighbor keys
        for v, w in graph[u]:
            if not in_mst[v] and w < key[v]:  #@21
                key[v] = w
                parent[v] = u

    return parent  #@28`),

  'topological-sort': annotated(`def topological_sort(graph, num_nodes):  #@1
    in_degree = [0] * num_nodes

    # Compute in-degrees
    for u in range(num_nodes):
        for v in graph[u]:
            in_degree[v] += 1

    # Start with nodes of in-degree 0
    queue = []  #@12
    for i in range(num_nodes):
        if in_degree[i] == 0:
            queue.append(i)

    order = []
    while queue:  #@18
        node = queue.pop(0)
        order.append(node)

        for neighbor in graph[node]:  #@22
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return order  #@30`),
}
