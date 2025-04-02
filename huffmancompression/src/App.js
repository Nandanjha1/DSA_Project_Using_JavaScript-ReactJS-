import React, { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
const Card = ({ children }) => <div className="border p-4 rounded-lg shadow">{children}</div>;
const CardContent = ({ children }) => <div>{children}</div>;
const Button = ({ children, onClick }) => (
  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onClick}>
    {children}
  </button>
);
const Input = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    className="border p-2 w-full rounded"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);


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

  let heap = Object.entries(frequency).map(
    ([char, freq]) => new HuffmanNode(char, freq)
  );
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

const HuffmanCompression = () => {
  const [inputText, setInputText] = useState("");
  const [encodedText, setEncodedText] = useState("");
  const [huffmanCodes, setHuffmanCodes] = useState({});

  const handleCompress = () => {
    if (!inputText) return;
    const root = buildHuffmanTree(inputText);
    const codes = generateHuffmanCodes(root);
    const encoded = inputText.split("").map((char) => codes[char]).join("");
    setHuffmanCodes(codes);
    setEncodedText(encoded);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-xl font-bold">Huffman Compression Tool</h1>
      <Card className="p-4 w-96">
        <CardContent>
          <Input
            placeholder="Enter text to compress"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <Button className="mt-4 w-full" onClick={handleCompress}>
            Compress
          </Button>
        </CardContent>
      </Card>
      {encodedText && (
        <Card className="p-4 w-96">
          <CardContent>
            <p><strong>Encoded Text:</strong> {encodedText}</p>
            <h2 className="mt-2 font-semibold">Huffman Codes:</h2>
            <ul>
              {Object.entries(huffmanCodes).map(([char, code]) => (
                <li key={char}>{char}: {code}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HuffmanCompression;
