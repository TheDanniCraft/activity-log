#!/bin/bash
echo "Running mock automated tests..."
if [ $((RANDOM % 2)) -eq 0 ]
  echo "❌ Test failed"
  exit 1
else
  echo "✅ All tests passed"
  exit 0
fi

