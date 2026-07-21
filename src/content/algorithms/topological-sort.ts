import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Topological Sort (Kahn's Algorithm)

Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u → v, vertex u comes before v in the ordering.

How it works (Kahn's Algorithm - BFS-based):
1. Compute the in-degree of each vertex
2. Add all vertices with in-degree 0 to a queue
3. While the queue is not empty:
   a. Dequeue a vertex, add it to the result
   b. For each outgoing edge, decrement the neighbor's in-degree
   c. If a neighbor's in-degree becomes 0, enqueue it
4. If all vertices are processed, the result is a valid topological order

Time Complexity: O(V + E)
Space Complexity: O(V)

Applications:
  - Task scheduling with dependencies
  - Build systems (Make, Gradle)
  - Course prerequisite planning
  - Package dependency resolution

Topological Sort is only possible for DAGs (Directed Acyclic Graphs). If the graph has a cycle, no valid ordering exists.`,
  es: `Ordenamiento Topológico (Algoritmo de Kahn)

El Ordenamiento Topológico produce un ordenamiento lineal de vértices en un Grafo Acíclico Dirigido (DAG) tal que para cada arista dirigida u → v, el vértice u aparece antes que v en el ordenamiento.

Cómo funciona (Algoritmo de Kahn - basado en BFS):
1. Calcular el grado de entrada de cada vértice
2. Agregar todos los vértices con grado de entrada 0 a una cola
3. Mientras la cola no esté vacía:
   a. Desencolar un vértice, agregarlo al resultado
   b. Para cada arista saliente, decrementar el grado de entrada del vecino
   c. Si el grado de entrada de un vecino llega a 0, encolarlo
4. Si todos los vértices fueron procesados, el resultado es un orden topológico válido

Complejidad Temporal: O(V + E)
Complejidad Espacial: O(V)

Aplicaciones:
  - Planificación de tareas con dependencias
  - Sistemas de compilación (Make, Gradle)
  - Planificación de prerrequisitos de cursos
  - Resolución de dependencias de paquetes

El Ordenamiento Topológico solo es posible para DAGs (Grafos Acíclicos Dirigidos). Si el grafo tiene un ciclo, no existe un ordenamiento válido.`,
}

export default descriptions
