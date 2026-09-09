---
title: "What Edge Deployment Changed About My ML Work"
date: "2024-12-10"
category: "Career"
status: "cooking"
---

At Prediction3d, a model that produced acceptable outputs could still fail the deployment target because it used too much memory or took too long on edge hardware. That changed the order of my work. Data checks and resource measurements came before another round of hyperparameter tuning.

## Production data required cleaning before training

In school, you are typically handed a clean dataset (like MNIST or Titanic) and told to build a model. In the real world, the data is messy, incomplete, and sometimes explicitly wrong.

### Cleaning and normalization took more time than tuning

I spent far more time writing Pandas and Numpy scripts to clean and normalize data pipelines than I did actually tuning hyperparameters in PyTorch or TensorFlow.

## The deployment target constrained the model

We had models that performed well contextually but were too slow or resource-heavy for production edge deployment. I learned several optimization techniques:

1. **Quantization:** Convert FP32 weights to INT8, then remeasure model size, latency, and accuracy.
2. **Pruning:** Remove near-zero weights, then verify that the smaller network still meets the task requirement.
3. **ONNX export:** Move inference out of native PyTorch and test the exported graph on the target runtime.

The selected model had to fit the target memory budget and meet its latency requirement. Accuracy alone could not choose it.

```mermaid
graph LR
  A[Raw data] --> B[Cleaning + QA]
  B --> C[Feature engineering]
  C --> D[Model training]
  D --> E[Latency + memory profiling]
  E --> F[Quantize and prune]
  F --> G[Edge deployment]
```

## The useful skill was diagnosing the next bottleneck

The most useful skill was deciding which layer to inspect next: the input data, the training dynamics, the exported graph, memory use, or runtime latency. A framework API can execute an optimization. It cannot tell you which constraint is preventing deployment.
