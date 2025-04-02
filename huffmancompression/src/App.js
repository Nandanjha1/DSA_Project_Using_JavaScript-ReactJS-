import React, { useState } from "react";
import "./App.css";

const Card = ({ children }) => <div className="card">{children}</div>;
const Button = ({ children, onClick }) => <button className="button" onClick={onClick}>{children}</button>;
const Input = ({ value, onChange, placeholder }) => (
  <input className="input" type="text" value={value} onChange={onChange} placeholder={placeholder} />
);

// Huffman Compression
class HuffmanNode {
  constructor(char, freq) {
    this.char = char;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

const buildHuffmanTree = (text) => {
  const frequency = {};
  for (let char of text) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  let heap = Object.entries(frequency).map(([char, freq]) => new HuffmanNode(char, freq));
  heap.sort((a, b) => a.freq - b.freq);

  while (heap.length > 1) {
    let left = heap.shift();
    let right = heap.shift();
    let merged = new HuffmanNode(null, left.freq + right.freq);
    merged.left = left;
    merged.right = right;
    heap.push(merged);
    heap.sort((a, b) => a.freq - b.freq);
  }

  return heap[0];
};

const generateHuffmanCodes = (node, prefix = "", codeMap = {}) => {
  if (node) {
    if (node.char !== null) {
      codeMap[node.char] = prefix;
    }
    generateHuffmanCodes(node.left, prefix + "0", codeMap);
    generateHuffmanCodes(node.right, prefix + "1", codeMap);
  }
  return codeMap;
};

// Quick Sort
const quickSort = (arr) => {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = arr.filter((el) => el < pivot);
  const right = arr.filter((el) => el > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
};

// Single Source Shortest Path (Dijkstra)
const dijkstra = (graph, source) => {
  const dist = {};
  const visited = {};
  Object.keys(graph).forEach(node => dist[node] = Infinity);
  dist[source] = 0;

  for (let i = 0; i < Object.keys(graph).length; i++) {
    let minNode = null;
    Object.keys(dist).forEach(node => {
      if (!visited[node] && (minNode === null || dist[node] < dist[minNode])) {
        minNode = node;
      }
    });

    if (minNode === null) break;
    visited[minNode] = true;

    Object.keys(graph[minNode]).forEach(neighbor => {
      const newDist = dist[minNode] + graph[minNode][neighbor];
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
      }
    });
  }
  return dist;
};

// Minimum Spanning Tree (Prim's Algorithm)
const primMST = (graph) => {
  const nodes = Object.keys(graph);
  const visited = {};
  const mst = [];
  let edges = [];

  nodes.forEach(node => visited[node] = false);
  visited[nodes[0]] = true;

  while (mst.length < nodes.length - 1) {
    edges = [];
    Object.keys(visited).forEach(node => {
      if (visited[node]) {
        Object.keys(graph[node]).forEach(neighbor => {
          if (!visited[neighbor]) {
            edges.push({ from: node, to: neighbor, weight: graph[node][neighbor] });
          }
        });
      }
    });

    edges.sort((a, b) => a.weight - b.weight);
    const minEdge = edges.shift();
    if (!visited[minEdge.to]) {
      visited[minEdge.to] = true;
      mst.push(minEdge);
    }
  }
  return mst;
};

// Main Component
const AlgorithmTool = () => {
  const [inputText, setInputText] = useState("");
  const [encodedText, setEncodedText] = useState("");
  const [huffmanCodes, setHuffmanCodes] = useState({});

  const [quickSortInput, setQuickSortInput] = useState("");
  const [sortedArray, setSortedArray] = useState([]);

  const [graphInput, setGraphInput] = useState("{}");
  const [sourceNode, setSourceNode] = useState("");
  const [shortestPaths, setShortestPaths] = useState(null);

  const [mstGraphInput, setMstGraphInput] = useState("{}");
  const [mstResult, setMstResult] = useState([]);

  return (
    <div className="container">
      <h1>Algorithm Tool</h1>

      {/* Huffman Compression */}
      <Card>
        <h2>Huffman Compression</h2>
        <Input placeholder="Enter text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
        <Button onClick={() => {
          const root = buildHuffmanTree(inputText);
          const codes = generateHuffmanCodes(root);
          const encoded = inputText.split("").map((char) => codes[char]).join("");
          setHuffmanCodes(codes);
          setEncodedText(encoded);
        }}>Compress</Button>
        {encodedText && (
          <>
            <p><strong>Encoded Text:</strong> {encodedText}</p>

            {Object.keys(huffmanCodes).length > 0 && (
              <>
                <h3 className="mt-2 font-semibold">Huffman Codes:</h3>
                <ul>
                  {Object.entries(huffmanCodes).map(([char, code]) => (
                    <li key={char}><strong>{char}</strong>: {code}</li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </Card>


      {/* Quick Sort */}
      <Card>
        <h2>Quick Sort</h2>
        <Input placeholder="Enter numbers (space-separated)" value={quickSortInput} onChange={(e) => setQuickSortInput(e.target.value)} />
        <Button onClick={() => setSortedArray(quickSort(quickSortInput.split(" ").map(Number)))}>Sort</Button>
        {sortedArray.length > 0 && <p><strong>Sorted:</strong> {sortedArray.join(", ")}</p>}
      </Card>

      {/* Single Source Shortest Path */}
      <Card>
        <h2>Single Source Shortest Path</h2>
        <Input placeholder='Enter graph as JSON {"A":{"B":2,"C":5}, "B":{"A":2,"C":1}}' value={graphInput} onChange={(e) => setGraphInput(e.target.value)} />
        <Input placeholder="Enter source node" value={sourceNode} onChange={(e) => setSourceNode(e.target.value)} />
        <Button onClick={() => setShortestPaths(dijkstra(JSON.parse(graphInput), sourceNode))}>Find Path</Button>
        {shortestPaths && <p><strong>Paths:</strong> {JSON.stringify(shortestPaths)}</p>}
      </Card>

      {/* Minimum Spanning Tree */}
      <Card>
        <h2>Minimum Spanning Tree</h2>
        <Input placeholder='Enter graph as JSON {"A":{"B":2,"C":5}, "B":{"A":2,"C":1}}' value={mstGraphInput} onChange={(e) => setMstGraphInput(e.target.value)} />
        <Button onClick={() => setMstResult(primMST(JSON.parse(mstGraphInput)))}>Find MST</Button>
        {mstResult.length > 0 && <p><strong>MST:</strong> {JSON.stringify(mstResult)}</p>}
      </Card>
    </div>
  );
};

export default AlgorithmTool;
