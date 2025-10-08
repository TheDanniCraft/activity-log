#!/bin/bash
echo "Running mock automated tests..."
if [ $((RANDOM % 2)) -eq 0 ]; then
  echo "✅ All tests passed"
  exit 0
else
  echo "❌ Test failed"
  exit 1
fi
