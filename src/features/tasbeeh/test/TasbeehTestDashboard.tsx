import React, { useState, useEffect } from "react";
import { TasbeehRing } from "../components/TasbeehRing";
import { Squircle } from "@/shared/design-system/ui/Squircle";

export const TasbeehTestDashboard = () => {
  const [testCount, setTestCount] = useState(0);
  const [testTarget, setTestTarget] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addLog = (msg: string) =>
    setTestResults((prev) => [msg, ...prev].slice(0, 5));

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = setInterval(() => {
        setTestCount((c) => {
          if (c >= testTarget) {
            setIsRunning(false);
            addLog(`✅ Test Complete: Reached ${testTarget}`);
            return c;
          }
          return c + Math.ceil(testTarget / 50); // Jump forward in 50 steps
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRunning, testTarget]);

  const runTest = (target: number) => {
    addLog(`🚀 Starting test for Target: ${target}`);
    setTestTarget(target);
    setTestCount(0);
    setIsRunning(true);
  };

  return (
    <div className="p-6 bg-base-200 min-h-screen space-y-8">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-black">Tasbeeh Engine Tester</h1>
        <p className="text-sm opacity-60">
          Status: {isRunning ? "Running..." : "Idle"}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => runTest(-1)}
            className="btn btn-sm btn-outline"
          >
            Test -1
          </button>
          <button
            onClick={() => runTest(33)}
            className="btn btn-sm btn-outline"
          >
            Test 33
          </button>
          <button
            onClick={() => runTest(99)}
            className="btn btn-sm btn-outline"
          >
            Test 99
          </button>
          <button
            onClick={() => runTest(1000)}
            className="btn btn-sm btn-outline"
          >
            Test 1,000
          </button>
          <button
            onClick={() => runTest(10000)}
            className="btn btn-sm btn-outline"
          >
            Test 10,000
          </button>
          <button
            onClick={() => runTest(100000)}
            className="btn btn-sm btn-outline"
          >
            Test 100k
          </button>
          <button
            onClick={() => setTestCount(testTarget - 1)}
            className="btn btn-sm btn-warning"
          >
            Near Completion
          </button>
        </div>

        <Squircle cornerRadius={24} className="bg-base-100 p-8 shadow-xl">
          <TasbeehRing
            count={testCount}
            target={testTarget}
            arabic="سُبْحَانَ ٱللَّٰهِ"
            onTap={() => {
              setTestCount((c) => c + 1);
              addLog(`Tap: ${testCount + 1}/${testTarget}`);
            }}
            isCompleted={testCount >= testTarget}
          />
        </Squircle>

        <div className="bg-base-300 p-4 rounded-xl font-mono text-xs space-y-1">
          {testResults.map((r, i) => (
            <div key={i}>{r}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
