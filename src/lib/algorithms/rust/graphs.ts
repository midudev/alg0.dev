import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const graphsRust: Record<string, CodeImplementation> = {
  bfs: annotated(`fn bfs(graph: &HashMap<i32, Vec<i32>>, start: i32) -> Vec<i32> {
    let mut visited: HashSet<i32> = HashSet::new();
    let mut queue: VecDeque<i32> = VecDeque::new();  //@3
    let mut result: Vec<i32> = Vec::new();

    queue.push_back(start);
    visited.insert(start);

    while let Some(node) = queue.pop_front() {  //@8
        result.push(node);

        for &neighbor in &graph[&node] {
            if !visited.contains(&neighbor) {  //@13
                visited.insert(neighbor);
                queue.push_back(neighbor);
            }
        }
    }

    result  //@19
}`),

  dfs: annotated(`fn dfs(graph: &HashMap<i32, Vec<i32>>, start: i32) -> Vec<i32> {
    let mut visited: HashSet<i32> = HashSet::new();
    let mut result: Vec<i32> = Vec::new();

    explore(graph, start, &mut visited, &mut result);  //@16
    result  //@17
}

fn explore(graph: &HashMap<i32, Vec<i32>>, node: i32,
           visited: &mut HashSet<i32>, result: &mut Vec<i32>) {
    visited.insert(node);  //@6
    result.push(node);

    for &neighbor in &graph[&node] {  //@9
        if !visited.contains(&neighbor) {
            explore(graph, neighbor, visited, result);  //@12
        }
    }
}`),

  dijkstra: annotated(`fn dijkstra(graph: &[Vec<(usize, i32)>], start: usize) -> Vec<i32> {  //@1
    let n = graph.len();
    let mut dist = vec![i32::MAX; n];
    let mut visited = vec![false; n];
    dist[start] = 0;

    for _ in 0..n {
        // Pick unvisited node with minimum distance
        let mut u: Option<usize> = None;  //@8
        for v in 0..n {
            if !visited[v] && (u.is_none() || dist[v] < dist[u.unwrap()]) {
                u = Some(v);
            }
        }

        // Nothing left to reach
        let u = match u {
            Some(node) => node,
            None => break,
        };

        visited[u] = true;

        // Relax neighbors
        for &(v, w) in &graph[u] {
            if !visited[v] && dist[u] + w < dist[v] {  //@20
                dist[v] = dist[u] + w;
            }
        }
    }

    dist  //@26
}`),

  prim: annotated(`fn prim(graph: &[Vec<(usize, i32)>], start: usize) -> Vec<Option<usize>> {  //@1
    let n = graph.len();
    let mut key = vec![i32::MAX; n];
    let mut in_mst = vec![false; n];
    let mut parent: Vec<Option<usize>> = vec![None; n];
    key[start] = 0;

    for _ in 0..n {  //@8
        // Pick node with minimum key not in MST
        let mut u: Option<usize> = None;
        for v in 0..n {
            if !in_mst[v] && (u.is_none() || key[v] < key[u.unwrap()]) {
                u = Some(v);
            }
        }

        // Nothing left to attach to the tree
        let u = match u {
            Some(node) => node,
            None => break,
        };

        in_mst[u] = true;

        // Update neighbor keys
        for &(v, w) in &graph[u] {
            if !in_mst[v] && w < key[v] {  //@21
                key[v] = w;
                parent[v] = Some(u);
            }
        }
    }

    parent  //@28
}`),

  'topological-sort':
    annotated(`fn topological_sort(graph: &[Vec<usize>], num_nodes: usize) -> Vec<usize> {  //@1
    let mut in_degree = vec![0usize; num_nodes];

    // Compute in-degrees
    for u in 0..num_nodes {
        for &v in &graph[u] {
            in_degree[v] += 1;
        }
    }

    // Start with nodes of in-degree 0
    let mut queue: VecDeque<usize> = VecDeque::new();  //@12
    for i in 0..num_nodes {
        if in_degree[i] == 0 {
            queue.push_back(i);
        }
    }

    let mut order: Vec<usize> = Vec::new();
    while let Some(node) = queue.pop_front() {  //@18
        order.push(node);

        for &neighbor in &graph[node] {  //@22
            in_degree[neighbor] -= 1;
            if in_degree[neighbor] == 0 {
                queue.push_back(neighbor);
            }
        }
    }

    order  //@30
}`),
}
